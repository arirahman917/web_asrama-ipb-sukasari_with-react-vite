// ============================================================
// Cache query Firestore (level modul / per-sesi tab)
// ------------------------------------------------------------
// Meniru pola cache `siteImages` di src/utils/images.js: hasil
// query disimpan di memori modul, sehingga komponen yang mount
// ulang (pindah halaman / remount / StrictMode) tidak memicu
// read Firestore baru.
//
// Read baru hanya terjadi ketika:
//   1. cache untuk key tersebut belum pernah diisi, atau
//   2. `{ force: true }` diminta secara eksplisit, atau
//   3. cache di-invalidate() (otomatis setelah create/update/delete).
//
// Catatan: cache ini tidak persisten — hilang saat tab di-reload.
// ============================================================

/**
 * Buat query yang di-memoize berdasarkan argumen.
 *
 * @template A, T
 * @param {(args: A) => Promise<T>} fetchFn
 * @returns {{
 *   fetch: (args?: A, opts?: { force?: boolean }) => Promise<T>,
 *   invalidate: () => void,
 *   peek: (args?: A) => T | undefined,
 * }}
 */
export function createCachedQuery(fetchFn) {
  /** @type {Map<string, { data?: any, promise?: Promise<any> }>} */
  const store = new Map();

  const keyOf = (args) => JSON.stringify(args ?? null);

  function fetch(args, { force = false } = {}) {
    const key = keyOf(args);
    const entry = store.get(key);

    if (entry && !force) {
      // Ada request yang sedang berjalan -> pakai promise yang sama (dedupe).
      if (entry.promise) return entry.promise;
      // Sudah ada hasil -> kembalikan langsung tanpa hit Firestore.
      return Promise.resolve(entry.data);
    }

    const promise = Promise.resolve()
      .then(() => fetchFn(args))
      .then((data) => {
        // Simpan hanya bila ini masih request terbaru untuk key tersebut,
        // agar hasil lama tidak menimpa data yang lebih baru.
        if (store.get(key)?.promise === promise) store.set(key, { data });
        return data;
      })
      .catch((err) => {
        // Jangan cache kegagalan, biar percobaan berikutnya bisa fetch ulang.
        if (store.get(key)?.promise === promise) store.delete(key);
        throw err;
      });

    store.set(key, { promise });
    return promise;
  }

  /** Hapus seluruh cache query ini (dipakai setelah mutasi data). */
  function invalidate() {
    store.clear();
  }

  /** Lihat isi cache tanpa memicu fetch (berguna untuk render awal instan). */
  function peek(args) {
    const entry = store.get(keyOf(args));
    return entry && !entry.promise ? entry.data : undefined;
  }

  return { fetch, invalidate, peek };
}
