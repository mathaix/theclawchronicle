// Usage: node generate-pdf.js [letter|tabloid|a3]
const puppeteer = require('puppeteer');
const path = require('path');
const fs   = require('fs');

const format = process.argv[2] || 'letter';

const formats = {
  letter:  { width: '8.5in',  height: '11in'   },
  tabloid: { width: '11in',   height: '17in'   },
  a3:      { width: '11.7in', height: '16.5in' },
};

const pageSize = formats[format] || formats.letter;
const outFile  = `claw-chronicle-${format}.pdf`;
const MIN_SIZE = 200 * 1024; // 200KB minimum — below this something is wrong

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page    = await browser.newPage();

  // ── 1. Trap failed requests ──────────────────────────────────────────────
  const failedRequests = [];
  page.on('requestfailed', req => {
    failedRequests.push(`${req.failure().errorText}  ${req.url()}`);
  });

  const url = 'file://' + path.resolve(__dirname, 'index.html');
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  // ── 2. Force lazy images to load (headless has no scroll) ───────────────
  await page.evaluate(() => {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.loading = 'eager';
      img.src = img.src; // re-trigger load
    });
  });
  // Wait for all images to settle
  await page.evaluate(() => Promise.all(
    [...document.querySelectorAll('img')].map(img =>
      img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
    )
  ));

  // ── 3. Wait for webfonts ─────────────────────────────────────────────────
  await page.evaluateHandle('document.fonts.ready');

  // ── 3. Check all images loaded ───────────────────────────────────────────
  const brokenImages = await page.evaluate(() =>
    [...document.querySelectorAll('img')]
      .filter(img => !img.complete || img.naturalWidth === 0)
      .map(img => img.src)
  );

  // ── 4. Generate PDF ──────────────────────────────────────────────────────
  await page.pdf({
    path:                outFile,
    width:               pageSize.width,
    height:              pageSize.height,
    printBackground:     true,
    displayHeaderFooter: false,
    margin: { top: '0.4in', right: '0.45in', bottom: '0.4in', left: '0.45in' },
  });

  await browser.close();

  // ── 5. Validate output ───────────────────────────────────────────────────
  const stat     = fs.statSync(outFile);
  const sizeKB   = Math.round(stat.size / 1024);
  const sizeOK   = stat.size >= MIN_SIZE;

  // Count pages by counting %%EOF markers (rough but reliable for Puppeteer PDFs)
  const pdfBuf   = fs.readFileSync(outFile);
  const pageMatches = pdfBuf.toString('binary').match(/\/Type\s*\/Page[^s]/g);
  const pageCount = pageMatches ? pageMatches.length : '?';

  // ── 6. Report ────────────────────────────────────────────────────────────
  console.log('\n── PDF Validation Report ──────────────────────────────');
  console.log(`  File:          ${outFile}`);
  console.log(`  Size:          ${sizeKB} KB  ${sizeOK ? '✓' : '✗ TOO SMALL — possible render failure'}`);
  console.log(`  Pages:         ${pageCount}`);
  console.log(`  Format:        ${pageSize.width} × ${pageSize.height}`);
  console.log(`  Broken images: ${brokenImages.length === 0 ? '✓ none' : '✗ ' + brokenImages.length}`);
  if (brokenImages.length) brokenImages.forEach(s => console.log(`    → ${s}`));
  console.log(`  Failed requests: ${failedRequests.length === 0 ? '✓ none' : '✗ ' + failedRequests.length}`);
  if (failedRequests.length) failedRequests.forEach(s => console.log(`    → ${s}`));
  console.log('───────────────────────────────────────────────────────\n');

  if (!sizeOK || brokenImages.length || failedRequests.length) {
    process.exit(1);
  }
})();
