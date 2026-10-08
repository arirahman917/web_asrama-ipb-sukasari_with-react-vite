// ============================================================
// Konversi Markdown <-> HTML untuk editor berita
// Berita disimpan dalam format Markdown, editor bekerja dengan HTML.
// ============================================================
import TurndownService from "turndown";
import { marked } from "marked";

const turndown = new TurndownService({
  headingStyle: "atx",
  hr: "---",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "*",
  strongDelimiter: "**",
});

// Abaikan elemen pembantu editor saat konversi.
turndown.keep(["img"]);

/** HTML (dari contentEditable) -> Markdown */
export function htmlToMarkdown(html) {
  if (!html) return "";
  return turndown.turndown(html).trim();
}

/** Markdown -> HTML (untuk ditampilkan atau dimuat ke editor) */
export function markdownToHtml(md) {
  if (!md) return "";
  return marked.parse(md, { gfm: true, breaks: true });
}
