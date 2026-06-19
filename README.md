# monaRT - strona pracowni tworczej

Responsywna strona wizytowka pracowni monaRT z oferta warsztatow, okazji specjalnych i kontaktem.

## Uruchomienie

Kliknij dwukrotnie `start.command`, a nastepnie otworz:

http://127.0.0.1:4174/index.html

Możesz też uruchomić serwer ręcznie:

```bash
python3 -m http.server 4174 --bind 127.0.0.1
```

Strona nie wymaga instalowania zaleznosci ani procesu budowania.

## Publikacja

Repozytorium jest przygotowane pod GitHub Pages. Po wlaczeniu publikacji z
galezi `main` w ustawieniach repozytorium kazdy `push` od razu odswieza strone.
W katalogu głównym znajdują się pliki statyczne, więc nie ma tu żadnego buildu
ani zależności od Netlify.

Plik `.nojekyll` wylacza obsluge Jekylla, zeby GitHub Pages serwowal pliki
dokladnie tak, jak sa w repo. Domene niestandardowa ustawiamy osobno po publikacji.

## Pliki

- `index.html` - tresc strony, sekcje, SEO i struktura
- `styles.css` - wyglad desktopowy i mobilny
- `app.js` - menu, animacje i aktywna nawigacja
- `assets/monart/` - logo i wszystkie grafiki strony
