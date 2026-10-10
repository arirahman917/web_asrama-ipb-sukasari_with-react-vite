import React, { useCallback, useEffect, useRef, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { functions } from "../../firebase";

// Pesan sapaan awal dari asisten.
const GREETING = {
  role: "assistant",
  content:
    "Hai! Aku Asisten AIS. Tanyakan apa saja seputar Asrama IPB Sukasari (fasilitas, aturan/AD-ART, kegiatan, oprec, dll).",
};

// Batas riwayat pesan yang dikirim ke backend (hanya ~10 pesan terakhir).
const MAX_HISTORY = 10;

// Mengubah kode error Firebase menjadi pesan ramah untuk pengguna.
function friendlyError(err) {
  const code = err?.code || "";
  if (code === "functions/resource-exhausted") {
    return "Terlalu banyak pesan, coba lagi beberapa saat lagi.";
  }
  if (code === "functions/invalid-argument") {
    return "Pesan tidak valid. Coba tulis ulang pertanyaanmu.";
  }
  if (code === "functions/unauthenticated" || code === "functions/permission-denied") {
    return "Layanan asisten sedang tidak dapat diakses saat ini.";
  }
  // Kesalahan tak terduga (functions/internal, jaringan, dsb).
  return "Maaf, terjadi kendala. Coba lagi sebentar lagi ya.";
}

export default function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll ke pesan terbaru setiap kali daftar pesan berubah.
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, loading]);

  // Fokuskan input saat panel dibuka.
  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(id);
    }
  }, [open]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    // Susun riwayat: pesan sebelumnya + pesan baru dari pengguna.
    const history = [...messages, { role: "user", content: text }];
    setMessages(history);
    setInput("");
    setError("");
    setLoading(true);

    try {
      // Panggil Cloud Function callable `webAiChat` (region default us-central1).
      // Kirim hanya MAX_HISTORY pesan terakhir sebagai riwayat.
      const webAiChat = httpsCallable(functions, "webAiChat");
      const payload = history
        .slice(-MAX_HISTORY)
        .map(({ role, content }) => ({ role, content }));
      const res = await webAiChat({ messages: payload });
      const reply = res?.data?.reply;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply || "Maaf, aku tidak menerima balasan." },
      ]);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const handleKeyDown = (e) => {
    // Enter untuk kirim, Shift+Enter untuk baris baru.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Panel chat */}
      {open && (
        <div className="fixed z-[200] bottom-6 right-6 left-4 sm:left-auto w-auto sm:w-[360px] h-[520px] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#f97316] text-white">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold text-sm">Asisten Asrama AIS</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup chat"
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Area pesan */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words ${
                    m.role === "user"
                      ? "bg-[#f97316] text-white rounded-br-sm"
                      : "bg-gray-200 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {/* Indikator sedang memuat */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-500 rounded-2xl rounded-bl-sm px-3 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Pesan error */}
          {error && (
            <div className="px-3 py-2 bg-red-50 border-t border-red-100 text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Input & tombol kirim */}
          <div className="flex items-end gap-2 p-3 border-t border-gray-100 bg-white">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Tulis pertanyaanmu..."
              className="flex-1 resize-none max-h-24 px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/40 focus:border-[#f97316]"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label="Kirim pesan"
              className="p-2.5 rounded-xl bg-[#f97316] text-white hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Tutup asisten AI" : "Buka asisten AI"}
        className="fixed z-[200] bottom-6 right-6 w-14 h-14 rounded-full bg-[#f97316] text-white shadow-lg shadow-orange-500/30 flex items-center justify-center hover:bg-orange-600 hover:scale-105 transition-all"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  );
}
