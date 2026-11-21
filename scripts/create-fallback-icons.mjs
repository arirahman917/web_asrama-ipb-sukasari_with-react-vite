import fs from "fs";

if (!fs.existsSync("public")) {
  fs.mkdirSync("public", { recursive: true });
}

// 1x1 transparent WebP base64
const webp = Buffer.from("UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAD8D+JaQAA3AA/ua1AAA=", "base64");
fs.writeFileSync("public/logo-ais.webp", webp);
fs.writeFileSync("public/favicon.ico", webp);
console.log("Fallback icons created in public/");
