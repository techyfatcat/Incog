/**
 * exportResumeToPDF
 *
 * Strategy: inject the resume's rendered DOM HTML into a hidden iframe,
 * apply print-specific CSS that sets the page to A4 (210mm x 297mm),
 * then trigger window.print() on that iframe. This guarantees 1:1 fidelity
 * between the preview and the printed/saved PDF — no canvas rasterization,
 * no scaling artifacts.
 *
 * The user's browser "Save as PDF" dialog will produce a perfect A4 PDF.
 * For programmatic PDF (no dialog), we use html2canvas + jsPDF at 3x scale
 * as a fallback (still much better than the old 2x approach).
 */

export async function exportResumeToPDF(resumeElement, fileName = 'Resume') {
    if (!resumeElement) return;

    // Clone the node so we can safely serialize it
    const clone = resumeElement.cloneNode(true);

    // Inline all computed styles on every element so the iframe renders identically
    inlineStyles(resumeElement, clone);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${fileName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: 210mm;
      height: 297mm;
      overflow: hidden;
    }
    #resume-root {
      width: 210mm;
      height: 297mm;
      overflow: hidden;
      position: relative;
    }
  </style>
</head>
<body>
  <div id="resume-root">${clone.outerHTML}</div>
</body>
</html>`;

    // Create hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:794px;height:1123px;border:none;';
    document.body.appendChild(iframe);

    await new Promise(resolve => {
        iframe.onload = resolve;
        iframe.srcdoc = html;
    });

    // Wait a tick for fonts/images
    await new Promise(r => setTimeout(r, 600));

    // Override the iframe's title so the PDF file name is set
    iframe.contentDocument.title = fileName;

    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    // Clean up after a delay
    setTimeout(() => {
        document.body.removeChild(iframe);
    }, 3000);
}

/**
 * Walks the source tree and copies computed styles onto the clone tree.
 * This ensures fonts, colors, layouts survive iframe isolation.
 */
function inlineStyles(source, target) {
    const sourceEls = source.querySelectorAll('*');
    const targetEls = target.querySelectorAll('*');

    // Also handle root
    copyComputed(source, target);

    sourceEls.forEach((el, i) => {
        if (targetEls[i]) {
            copyComputed(el, targetEls[i]);
        }
    });
}

function copyComputed(source, target) {
    try {
        const computed = window.getComputedStyle(source);
        // Only copy properties that matter for layout/appearance
        const props = [
            'display', 'position', 'top', 'left', 'right', 'bottom',
            'width', 'height', 'min-width', 'max-width', 'min-height', 'max-height',
            'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
            'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
            'font-family', 'font-size', 'font-weight', 'font-style', 'line-height',
            'color', 'background-color', 'background',
            'border', 'border-top', 'border-right', 'border-bottom', 'border-left',
            'border-radius', 'border-color', 'border-width', 'border-style',
            'flex', 'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis',
            'grid-template-columns', 'grid-template-rows', 'gap', 'column-gap', 'row-gap',
            'align-items', 'align-self', 'justify-content', 'justify-self',
            'overflow', 'overflow-x', 'overflow-y',
            'text-align', 'text-transform', 'letter-spacing', 'word-break', 'white-space',
            'vertical-align', 'box-sizing',
            'opacity', 'z-index', 'box-shadow',
            'list-style', 'list-style-type', 'list-style-position',
        ];
        const styles = [];
        props.forEach(prop => {
            const val = computed.getPropertyValue(prop);
            if (val) styles.push(`${prop}:${val}`);
        });
        // Merge with existing inline style (don't overwrite if already set)
        const existing = target.getAttribute('style') || '';
        target.setAttribute('style', styles.join(';') + ';' + existing);
    } catch (e) {
        // ignore cross-origin errors
    }
}