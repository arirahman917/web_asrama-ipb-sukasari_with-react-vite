import React, { useEffect, useRef, useState } from "react";
import { htmlToMarkdown, markdownToHtml } from "../../utils/markdown";
import { uploadFile } from "../../utils/storage";

// Tombol toolbar: [command, arg, label, title]
const BLOCK_TOOLS = [
  { cmd: "formatBlock", arg: "<h2>", label: "H2", title: "Judul besar" },
  { cmd: "formatBlock", arg: "<h3>", label: "H3", title: "Sub-judul" },
  { cmd: "formatBlock", arg: "<p>", label: "¶", title: "Paragraf" },
];

const INLINE_TOOLS = [
  { cmd: "bold", label: "B", title: "Tebal", className: "font-bold" },
  { cmd: "italic", label: "I", title: "Miring", className: "italic" },
  { cmd: "strikeThrough", label: "S", title: "Coret", className: "line-through" },
];

const LIST_TOOLS = [
  { cmd: "insertUnorderedList", label: "•", title: "Daftar bullet" },
  { cmd: "insertOrderedList", label: "1.", title: "Daftar nomor" },
  { cmd: "formatBlock", arg: "<blockquote>", label: "❝", title: "Kutipan" },
];

export default function RichTextEditor({ value = "", onChange }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  // Muat nilai awal sekali (uncontrolled contentEditable).
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = markdownToHtml(value || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = () => {
    if (editorRef.current) onChange?.(htmlToMarkdown(editorRef.current.innerHTML));
  };

  const exec = (command, arg) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    emit();
  };

  const addLink = () => {
    const url = window.prompt("Masukkan URL tautan:", "https://");
    if (url) exec("createLink", url);
  };

  const handleImagePick = () => fileInputRef.current?.click();

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, "berita/images");
      exec("insertImage", url);
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah gambar: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData?.getData("text/plain");
    if (text) {
      e.preventDefault();
      document.execCommand("insertText", false, text);
      emit();
    }
  };

  const btn =
    "px-2.5 h-8 min-w-8 rounded-lg text-sm text-gray-700 hover:bg-orange-100 hover:text-orange-600 transition-colors flex items-center justify-center";

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
        {BLOCK_TOOLS.map((t) => (
          <button type="button" key={t.label} title={t.title} className={btn}
            onMouseDown={(e) => e.preventDefault()} onClick={() => exec(t.cmd, t.arg)}>
            {t.label}
          </button>
        ))}
        <span className="w-px h-5 bg-gray-200 mx-1" />
        {INLINE_TOOLS.map((t) => (
          <button type="button" key={t.cmd} title={t.title} className={`${btn} ${t.className || ""}`}
            onMouseDown={(e) => e.preventDefault()} onClick={() => exec(t.cmd)}>
            {t.label}
          </button>
        ))}
        <span className="w-px h-5 bg-gray-200 mx-1" />
        {LIST_TOOLS.map((t) => (
          <button type="button" key={t.title} title={t.title} className={btn}
            onMouseDown={(e) => e.preventDefault()} onClick={() => exec(t.cmd, t.arg)}>
            {t.label}
          </button>
        ))}
        <span className="w-px h-5 bg-gray-200 mx-1" />
        <button type="button" title="Tautan" className={btn}
          onMouseDown={(e) => e.preventDefault()} onClick={addLink}>🔗</button>
        <button type="button" title="Gambar" className={btn} disabled={uploading}
          onMouseDown={(e) => e.preventDefault()} onClick={handleImagePick}>
          {uploading ? "…" : "🖼"}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        <div className="flex-1" />
        <button type="button" title="Undo" className={btn}
          onMouseDown={(e) => e.preventDefault()} onClick={() => exec("undo")}>↶</button>
        <button type="button" title="Redo" className={btn}
          onMouseDown={(e) => e.preventDefault()} onClick={() => exec("redo")}>↷</button>
      </div>

      {/* Area menulis */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        onPaste={handlePaste}
        className="markdown-body min-h-[320px] max-h-[600px] overflow-y-auto px-5 py-4 outline-none text-gray-800 leading-relaxed"
        data-placeholder="Tulis isi berita di sini..."
      />
    </div>
  );
}
