/**
 * Parses a simple markdown-like rich text string into HTML.
 * Supports:
 *  - **bold**
 *  - _italic_
 *  - Bullet lines starting with "- "
 *  - Double newlines become paragraph breaks
 */
export function parseRichText(text = '') {
    if (!text) return '';

    // Escape HTML entities first
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Bold: **text**
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic: _text_
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // Process line by line
    const lines = html.split('\n');
    const result = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isBullet = line.trimStart().startsWith('- ');

        if (isBullet) {
            if (!inList) {
                result.push('<ul style="margin:4px 0; padding-left:14px; list-style:disc;">');
                inList = true;
            }
            result.push(`<li style="margin-bottom:2px;">${line.trimStart().slice(2)}</li>`);
        } else {
            if (inList) {
                result.push('</ul>');
                inList = false;
            }
            if (line.trim() === '') {
                result.push('<div style="margin-bottom:6px;"></div>');
            } else {
                result.push(`<p style="margin:0 0 3px 0;">${line}</p>`);
            }
        }
    }

    if (inList) result.push('</ul>');

    return result.join('');
}