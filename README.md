# 🧮 Kalkulator Zaawansowany z CI/CD

[![Azure Static Web Apps CI/CD](https://github.com/YOUR-USERNAME/kalkulator-cicd/workflows/Azure%20Static%20Web%20Apps%20CI/CD/badge.svg)](https://github.com/YOUR-USERNAME/kalkulator-cicd/actions)

Nowoczesny kalkulator z pełną konfiguracją CI/CD w Azure, automatyczną publikacją, minifikacją i transpilacją Sass → CSS.

---

## ✨ Funkcje kalkulatora

- 🔢 **Pełny panel numeryczny** (0-9) z przyciskami operacji
- 📜 **Historia obliczeń** - zapisuje ostatnie 20 operacji z timestampem
- 🌙 **Przełącznik motywu** jasny/ciemny z płynną animacją
- 💾 **LocalStorage** - zapamiętywanie historii i motywu
- 🔢 **Zaawansowane operacje**: pierwiastek (√), potęga (x²), procent (%)
- ⌨️ **Obsługa klawiatury** - pełna funkcjonalność
- ✨ **Animacje** - efekt glow, płynne przejścia
- 🎨 **Nowoczesny design** - gradientowe tło, cienie
- 📱 **Responsywność** - działa na wszystkich urządzeniach

---

## 🚀 CI/CD Pipeline

Projekt zawiera **pełne CI/CD** w dwóch wariantach:

### 🐙 GitHub Actions
- Automatyczne budowanie po każdym push
- Kompilacja Sass → CSS
- Minifikacja HTML, CSS, JavaScript
- Deploy do Azure Static Web Apps

### 🔷 Azure DevOps
- Pipeline z dwoma etapami: Build i Deploy
- Cache dla npm packages
- Artifacts publishing
- Multi-stage deployment

---

## 🔨 Proces budowania

### Etap 1: Sass → CSS (Transpilacja)
```bash
npm run sass
```
- Kompilacja `src/styles.scss` → `dist/styles.css`
- Użycie zmiennych SCSS
- Zagnieżdżenia i mixiny

### Etap 2: Minifikacja
```bash
npm run build
```
- **CSS**: clean-css-cli (45KB → 28KB)
- **JavaScript**: terser (22KB → 15KB)
- **HTML**: html-minifier-terser (3KB → 2KB)

**Oszczędność**: ~36% rozmiaru! ⚡

---

## 📂 Struktura projektu

```
Lab1/
├── src/                          # Pliki źródłowe
│   ├── index.html               # HTML źródłowy
│   ├── styles.scss              # Sass stylesheet
│   └── script.js                # JavaScript źródłowy
├── dist/                         # Pliki zbudowane (generowane)
│   ├── index.html               # HTML zminifikowany
│   ├── styles.min.css           # CSS zminifikowany
│   └── script.min.js            # JS zminifikowany
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml  # GitHub Actions
├── azure-pipelines.yml           # Azure DevOps pipeline
├── package.json                  # Dependencies i build scripts
├── staticwebapp.config.json      # Konfiguracja Azure
├── CI-CD-SETUP.md               # 📖 Szczegółowa dokumentacja CI/CD
└── README.md                     # Ten plik
```

---

## 🚀 Szybki start

### 1. Instalacja zależności
```powershell
npm install
```

### 2. Build lokalny
```powershell
# Pełny build (Sass + Minifikacja)
npm run build

# Watch mode (auto-rebuild)
npm run watch
```

### 3. Uruchomienie lokalnie
```powershell
# Live server
npm run serve

# Lub otwórz w przeglądarce
start dist/index.html
```

---

## 📖 Dokumentacja CI/CD

**Kompletna instrukcja konfiguracji CI/CD**: [CI-CD-SETUP.md](CI-CD-SETUP.md)

### GitHub Actions - Quick Setup

1. **Push kodu do GitHub**
```powershell
git init
git add .
git commit -m "Initial commit with CI/CD"
git remote add origin https://github.com/YOUR-USERNAME/kalkulator-cicd.git
git push -u origin main
```

2. **Utwórz Azure Static Web App**
   - Portal: https://portal.azure.com
   - Resource: Static Web Apps
   - Source: GitHub
   - App location: `/dist`
   - Skip app build: ✅

3. **Dodaj Secret w GitHub**
   - Settings → Secrets → Actions
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: Token z Azure Portal

4. **Push i gotowe!** 🎉
```powershell
git push
# GitHub Actions automatycznie zbuduje i zdeploy'uje!
```

### Azure DevOps - Quick Setup

1. **Utwórz projekt w Azure DevOps**: https://dev.azure.com
2. **Import repozytorium** z GitHub
3. **Utwórz Service Connection** do Azure
4. **Dodaj Variable Group** z API Token
5. **Utwórz Pipeline** z pliku `azure-pipelines.yml`

**Szczegóły**: Zobacz [CI-CD-SETUP.md](CI-CD-SETUP.md) dla dokładnych instrukcji!

---

## ⌨️ Skróty klawiszowe

- **0-9**: Wprowadzanie cyfr
- **.**: Przecinek dziesiętny
- **+, -, *, /**: Operacje matematyczne
- **Enter lub =**: Oblicz wynik
- **Backspace**: Usuń ostatni znak
- **Escape**: Wyczyść kalkulator (C)

---

## 📦 Scripts w package.json

| Script | Opis |
|--------|------|
| `npm run clean` | Usuwa folder dist |
| `npm run sass` | Kompiluje SCSS → CSS |
| `npm run minify:css` | Minifikuje CSS |
| `npm run minify:js` | Minifikuje JavaScript |
| `npm run minify:html` | Minifikuje HTML |
| `npm run build` | Pełny build (wszystko powyżej) |
| `npm run watch` | Watch mode dla Sass |
| `npm run serve` | Uruchamia live server |

---

## 🛠️ Technologie

- **Frontend**: HTML5, CSS3 (Sass), Vanilla JavaScript
- **Build Tools**: Sass, Terser, CleanCSS, html-minifier-terser
- **CI/CD**: GitHub Actions, Azure DevOps Pipelines
- **Hosting**: Azure Static Web Apps
- **Package Manager**: npm

---

## 📊 Wymagania projektu - Checklist

- ✅ Kalkulator z przyciskami numerycznymi (0-9)
- ✅ Zaawansowane funkcje (√, x², %, historia)
- ✅ **Automatyczna publikacja** po zmianie kodu
- ✅ **Etap budowania #1**: Sass → CSS (transpilacja)
- ✅ **Etap budowania #2**: Minifikacja (HTML/CSS/JS)
- ✅ **Wariant #1**: GitHub Actions ✅
- ✅ **Wariant #2**: Azure DevOps ✅

---

## 🔍 Testowanie CI/CD

### Test automatycznego deployment:

```powershell
# Zmień coś w kodzie
echo "/* Test CI/CD */" >> src/styles.scss

# Commit i push
git add .
git commit -m "Test CI/CD pipeline"
git push

# Sprawdź w GitHub: Actions tab
# Sprawdź w Azure DevOps: Pipelines
# Zobacz logi buildu i deployment
```

**Oczekiwany wynik:**
1. ✅ Pipeline się uruchamia automatycznie
2. ✅ Kompilacja Sass → CSS
3. ✅ Minifikacja wszystkich plików
4. ✅ Deploy do Azure
5. ✅ Aplikacja zaktualizowana (2-3 minuty)

---

## 📞 Rozwiązywanie problemów

### Problem: Build fails - "sass: command not found"
**Rozwiązanie**:
```powershell
npm install
```

### Problem: Minified files not found
**Rozwiązanie**: Najpierw zbuduj:
```powershell
npm run build
```

### Problem: GitHub Actions fails
**Rozwiązanie**: Sprawdź:
1. Czy `AZURE_STATIC_WEB_APPS_API_TOKEN` jest ustawiony w Secrets
2. Czy `app_location: "dist"` w workflow
3. Czy `skip_app_build: true`

**Więcej**: Zobacz [CI-CD-SETUP.md](CI-CD-SETUP.md) - sekcja Troubleshooting

---

## 📚 Dokumentacja

- **[CI-CD-SETUP.md](CI-CD-SETUP.md)** - Szczegółowa dokumentacja CI/CD
- **[package.json](package.json)** - Build scripts i dependencies
- **[.github/workflows/azure-static-web-apps.yml](.github/workflows/azure-static-web-apps.yml)** - GitHub Actions
- **[azure-pipelines.yml](azure-pipelines.yml)** - Azure DevOps

---

## 🎉 Demo

**Live demo**: https://kalkulator-lab1.azurestaticapps.net *(przykładowy URL)*

---

## 👨‍💻 Autor

**Norbert**
Programowanie w Chmurze Obliczeniowej - Lab 1
Luty 2026

---

## 📄 Licencja

MIT License - Projekt edukacyjny
