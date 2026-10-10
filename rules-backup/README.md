# Cadangan Firebase Rules

Disalin pada: 2026-10-09
Commit saat dicadangkan: af5a554 (branch main)

Isi:
- `firestore.rules` — rules Firestore sebelum dilonggarkan.
- `storage.rules` — rules Storage sebelum dilonggarkan.

## Cara memulihkan (restore)

```bash
cp rules-backup/firestore.rules firestore.rules
cp rules-backup/storage.rules storage.rules
npx firebase deploy --only firestore:rules,storage
```
