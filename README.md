# Website Sonja Paredes Pernía — CMS mit E-Mail-Login (Decap CMS + DecapBridge)

Gleiche Seite (Stil „Leicht"), aber Sonja pflegt die Inhalte über **`…/admin`** mit
einem **E-Mail-Login** (Passwort, optional Google/Microsoft) — **kein GitHub-Konto nötig**.
Ein Klick auf „Speichern" veröffentlicht automatisch. Hosting bleibt **Vercel**.

Technik: **Decap CMS** bearbeitet `content.json`; die Anmeldung/der Schreibzugriff läuft
über den kostenlosen Dienst **DecapBridge**. Die Seite (`index.html` + `app.js`) baut sich
aus `content.json` auf.

## Struktur
```
sonja-website-cms/
├── index.html              # öffentliche Seite (rendert aus content.json)
├── content.json            # alle Inhalte
├── admin/
│   ├── index.html          # Login-/Bearbeitungsseite (Decap CMS)
│   └── config.yml          # Eingabemaske + DecapBridge-Werte (anpassen)
├── assets/  (style.css, app.js, favicon.svg, Bilder, uploads/)
├── .gitignore
└── README.md
```

## Einmalige Einrichtung (vom Betreiber) — Kurzfassung
1. **GitHub:** Repo anlegen, Code hochladen.
2. **Vercel:** Repo importieren (Preset „Other", kein Build), live schalten; Domain bei Porkbun verbinden.
3. **DecapBridge:** Konto anlegen → Site hinzufügen (GitHub, Repo-Pfad, GitHub-Token mit
   *Contents: Read and write*, Login-URL `https://…/admin/index.html`, Auth „Classic").
4. **config.yml:** die von DecapBridge erzeugten Werte für `repo`, `identity_url` und
   `gateway_url` in `admin/config.yml` eintragen, committen/pushen.
5. **Einladen:** in DecapBridge unter „Manage collaborators" Sonjas E-Mail eintragen → senden.

> Die ausführliche Klick-für-Klick-Anleitung wurde separat bereitgestellt.

## So pflegt Sonja die Seite
1. `https://sonja-paredes-pernia.de/admin` öffnen.
2. Mit **E-Mail + Passwort** anmelden.
3. „Inhalte der Seite" öffnen, Texte/Links ändern, Werke/Einträge per „+" ergänzen,
   Bilder hochladen → **„Speichern"**. Nach kurzer Zeit ist es live.

## Hinweise
- **Bilder** landen automatisch in `assets/uploads/` im Repo.
- **`/admin` darf öffentlich sein:** Bearbeiten kann nur, wer von DecapBridge eingeladen wurde.
- **Sicherung inklusive:** Jede Änderung ist ein GitHub-Commit; frühere Stände sind wiederherstellbar.
- **GitHub-Token-Ablauf:** Das in DecapBridge hinterlegte Token kann ablaufen — lange Gültigkeit
  wählen und ggf. erneuern, falls das Speichern irgendwann nicht mehr klappt.
