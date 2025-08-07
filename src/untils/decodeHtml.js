import he from 'he';

export default function decodeHtml(html) {
    return he.decode(html);
}
