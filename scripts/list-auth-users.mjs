// ============================================================
// Diagnostik: daftar user Firebase Authentication (READ-ONLY).
// ------------------------------------------------------------
// Dipakai untuk memastikan apakah akun anggota benar-benar ada di
// project ini, dan provider apa yang terpasang (password / google).
//
// Prasyarat (pilih salah satu):
//   1) gcloud auth application-default login
//   2) export GOOGLE_APPLICATION_CREDENTIALS="/path/service-account.json"
//
// Jalankan:
//   node scripts/list-auth-users.mjs
//   node scripts/list-auth-users.mjs cari@email    # filter substring email
// ============================================================
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const PROJECT_ID = "asrama-ipb-sukasari";

const app = initializeApp({
  credential: applicationDefault(),
  projectId: PROJECT_ID,
});

const auth = getAuth(app);
const filter = (process.argv[2] || "").toLowerCase();

async function main() {
  let pageToken;
  const all = [];
  do {
    const res = await auth.listUsers(1000, pageToken);
    all.push(...res.users);
    pageToken = res.pageToken;
  } while (pageToken);

  const matched = filter
    ? all.filter((u) => (u.email || "").toLowerCase().includes(filter))
    : all;

  // Ringkasan provider.
  const byProvider = {};
  for (const u of all) {
    const providers = (u.providerData || []).map((p) => p.providerId).sort();
    const key = providers.length ? providers.join("+") : "(tanpa provider)";
    byProvider[key] = (byProvider[key] || 0) + 1;
  }

  console.log(`Project       : ${PROJECT_ID}`);
  console.log(`Total user    : ${all.length}`);
  console.log(`Filter        : ${filter || "(tanpa filter)"}  -> cocok: ${matched.length}`);
  console.log("\nSebaran provider:");
  for (const [k, v] of Object.entries(byProvider).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k.padEnd(24)} ${v}`);
  }

  console.log("\nDaftar user:");
  console.log("  email".padEnd(44) + "provider".padEnd(24) + "disabled  tenantId");
  for (const u of matched) {
    const providers = (u.providerData || []).map((p) => p.providerId).join(",") || "-";
    console.log(
      "  " +
        String(u.email || u.uid).padEnd(42) +
        providers.padEnd(24) +
        String(!!u.disabled).padEnd(10) +
        (u.tenantId || "-")
    );
  }
}

main().catch((err) => {
  console.error("\nGagal:", err?.message || err);
  console.error(
    "\nPastikan credential bisa diakses:\n" +
      "  gcloud auth application-default login\n" +
      "  atau export GOOGLE_APPLICATION_CREDENTIALS=/path/service-account.json"
  );
  process.exit(1);
});
