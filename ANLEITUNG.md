# Gewichte-Tracker als Web-App auf GitHub Pages

Der Tracker läuft als Web-App im Browser und lässt sich auf dem iPhone zum Home-Bildschirm hinzufügen. Alle Daten bleiben auf dem Gerät. Auf GitHub liegt nur der Programmcode, keine Trainingsdaten.

## 1. Dateien auf GitHub bereitstellen
1. Auf github.com ein neues Repository anlegen, z. B. `gewichte-tracker`. Für GitHub Pages im kostenlosen Konto muss es öffentlich sein.
2. Die ZIP-Datei entpacken.
3. Im Repository „Add file → Upload files“ wählen und den **Inhalt** des entpackten Ordners hochladen: `index.html`, `style.css`, `app.js`, `manifest.json`, `sw.js` und den Ordner `icons`. Die Dateien müssen direkt im Hauptverzeichnis liegen, nicht in einem Unterordner.
4. „Commit changes“ bestätigen.

## 2. GitHub Pages einschalten
1. Im Repository „Settings → Pages“ öffnen.
2. Unter „Build and deployment“ als Source „Deploy from a branch“ wählen, Branch `main`, Ordner `/ (root)`, dann „Save“.
3. Nach ein bis zwei Minuten erscheint oben die Adresse, etwa `https://DEIN-NAME.github.io/gewichte-tracker/`.

## 3. Auf dem iPhone installieren
1. Die Adresse in **Safari** öffnen.
2. Teilen-Symbol, dann „Zum Home-Bildschirm“, dann „Hinzufügen“.
3. Die App künftig über das Symbol auf dem Home-Bildschirm starten. Nach dem ersten Laden mit Internet funktioniert sie auch offline.

## 4. Daten sichern und auf ein anderes Gerät übertragen
- **Wichtig:** Die App vom Home-Bildschirm hat einen eigenen Datenspeicher. Daten, die du vorher im Safari-Tab oder im Prototyp eingegeben hast, sind dort nicht automatisch vorhanden.
- Alte Daten übernehmen: Im bisherigen Tracker „Verlauf → Backup und Gerätewechsel → Backup-Datei speichern“, die Datei an das iPhone schicken (AirDrop, Nachrichten, Dateien) und in der neuen App unter „Backup einspielen“ öffnen, dann „Zusammenführen“.
- Zwischen zwei Geräten funktioniert es genauso. „Zusammenführen“ ergänzt nur Fehlendes, „Alles ersetzen“ überschreibt das Zielgerät.
- Ein regelmäßiges Backup ist sinnvoll: Wird die App vom Home-Bildschirm gelöscht, sind auch die Daten weg.

## 5. Updates einspielen
1. Im Repository die geänderten Dateien erneut hochladen („Upload files“, gleiche Dateinamen ersetzen).
2. Die App auf dem iPhone vollständig schließen und mit Internetverbindung neu öffnen. Bei Bedarf ein zweites Mal öffnen, bis die neue Version erscheint.

## Fehlersuche
- **Seite nicht gefunden (404):** Prüfen, ob `index.html` im Hauptverzeichnis des Repositorys liegt und Pages auf Branch `main` und `/ (root)` steht. Nach dem Einschalten kann es einige Minuten dauern.
- **Änderungen erscheinen nicht:** App komplett schließen und neu öffnen, notfalls das Symbol löschen und die Seite neu zum Home-Bildschirm hinzufügen. Vorher ein Backup speichern.
- **Dateien lassen sich nicht speichern:** Das Teilen-Menü bietet „In Dateien sichern“ an. Alternativ erscheint der Backup-Text zum Kopieren.
