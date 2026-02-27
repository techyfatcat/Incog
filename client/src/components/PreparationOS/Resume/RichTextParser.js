export const parseRichText = (text) => {
    if (!text) return "";

    return text.split('\n').map(line => {
        // Handle Bold: **text**
        let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 700;">$1</strong>');

        // Handle Italic: _text_
        processed = processed.replace(/_(.*?)_/g, '<em style="font-style: italic;">$1</em>');

        // Handle Bullets: - text
        if (processed.trim().startsWith('-')) {
            return `<li style="margin-left: 15px; list-style-type: disc; margin-bottom: 4px;">${processed.replace('-', '').trim()}</li>`;
        }

        return `<p style="margin-bottom: 6px;">${processed}</p>`;
    }).join('');
};