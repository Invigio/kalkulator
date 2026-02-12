# 🚀 CI/CD Configuration Guide - Kalkulator

## 📋 Spis treści
- [Przegląd](#przegląd)
- [Etapy budowania](#etapy-budowania)
- [GitHub Actions - Konfiguracja](#github-actions-konfiguracja)
- [Azure DevOps - Konfiguracja](#azure-devops-konfiguracja)
- [Lokalne testowanie](#lokalne-testowanie)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Przegląd

Projekt zawiera **pełne CI/CD** z automatyczną publikacją do Azure Static Web Apps w **dwóch wariantach**:
1. 🐙 **GitHub Actions**
2. 🔷 **Azure DevOps Pipelines**

### Etapy procesu CI/CD:

```
📥 Kod źródłowy (src/)
    ↓
🎨 SASS → CSS        (Krok 1: Transpilacja)
    ↓
🗜️ Minifikacja       (Krok 2: CSS + JS + HTML)
    ↓
📦 Build (dist/)
    ↓
🚀 Deploy do Azure
```

---

## 🔨 Etapy budowania

### Krok 1: Sass → CSS (Transpilacja)
**Plik**: [src/styles.scss](src/styles.scss) → `dist/styles.css`

```bash
npm run sass
```

**Co się dzieje:**
- Kompilacja SCSS do CSS
- Użycie zmiennych SCSS i zagnieżdżeń
- Generacja czystego CSS

**Przykład Sass features:**
```scss
// Zmienne SCSS
$primary-color: #667eea;
$btn-bg-light: #f8f9fa;

// Zagnieżdżenia
.calculator {
  background: var(--calculator-bg);

  .display {
    background: var(--display-bg);
  }
}
```

### Krok 2: Minifikacja

#### A. CSS Minification
```bash
npm run minify:css
```
- `dist/styles.css` → `dist/styles.min.css`
- Usunięcie białych znaków, komentarzy
- Optymalizacja selektorów

**Przykład:**
```css
/* Przed */
.calculator {
    background: #ffffff;
    border-radius: 20px;
    padding: 25px;
}

/* Po */
.calculator{background:#fff;border-radius:20px;padding:25px}
```

#### B. JavaScript Minification
```bash
npm run minify:js
```
- `src/script.js` → `dist/script.min.js`
- Kompresja kodu
- Mangling (skracanie nazw zmiennych)
- Tree shaking

**Przykład:**
```javascript
// Przed
function calculateSum(number1, number2) {
    return number1 + number2;
}

// Po
function calculateSum(a,b){return a+b}
```

#### C. HTML Minification
```bash
npm run minify:html
```
- `src/index.html` → `dist/index.html`
- Usunięcie białych znaków
- Usunięcie komentarzy
- Inline CSS/JS minification

---

## 🐙 GitHub Actions - Konfiguracja

### Krok 1: Przygotowanie repozytorium

```powershell
# Inicjalizuj Git
git init

# Dodaj wszystkie pliki
git add .
git commit -m "Initial commit with CI/CD"

# Utwórz repo na GitHub i wypchnij
git remote add origin https://github.com/TWOJA-NAZWA/kalkulator-cicd.git
git branch -M main
git push -u origin main
```

### Krok 2: Utworzenie Azure Static Web App

1. Przejdź do: https://portal.azure.com
2. **Create a resource** → **Static Web Apps**
3. Wypełnij formularz:
   - **Name**: `kalkulator-cicd`
   - **Plan**: Free
   - **Region**: West Europe
   - **Source**: GitHub
   - **Repository**: Wybierz swoje repo
   - **Branch**: `main`
   - **Build Presets**: Custom
   - **App location**: `/dist` ← WAŻNE!
   - **Skip app build**: ✅ true (bo buildujemy sami)

4. Kliknij **Create**

### Krok 3: Pobranie API Token

1. W Azure Portal otwórz utworzoną Static Web App
2. W menu wybierz **"Manage deployment token"**
3. Skopiuj token

### Krok 4: Dodanie Secret w GitHub

1. W GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Kliknij **"New repository secret"**
3. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
4. Value: Wklej skopiowany token
5. **Add secret**

### Krok 5: Testowanie workflow

```powershell
# Zrób jakąś zmianę
echo "/* Test */" >> src/styles.scss

# Commit i push
git add .
git commit -m "Test CI/CD"
git push
```

### Krok 6: Sprawdzenie buildu

1. W GitHub repo → zakładka **Actions**
2. Zobacz running workflow
3. Kliknij na workflow aby zobaczyć logi
4. Sprawdź etapy:
   - ✅ Compile Sass to CSS
   - ✅ Minify CSS
   - ✅ Minify JavaScript
   - ✅ Minify HTML
   - ✅ Deploy to Azure

**Przykładowy output:**
```
🎨 Kompilacja SCSS → CSS...
✅ SCSS skompilowane do CSS

🗜️ Minifikacja CSS...
✅ CSS zminifikowane (50KB → 32KB)

🗜️ Minifikacja JavaScript...
✅ JavaScript zminifikowany (25KB → 18KB)

🚀 Deploy to Azure...
✅ Deployed successfully!
```

---

## 🔷 Azure DevOps - Konfiguracja

### Krok 1: Utworzenie projektu Azure DevOps

1. Przejdź do: https://dev.azure.com
2. Kliknij **"New project"**
3. Name: `Kalkulator-CICD`
4. Visibility: Private
5. **Create**

### Krok 2: Import repozytorium

**Opcja A: Import z GitHub**
1. W projekcie → **Repos** → **Import repository**
2. Clone URL: `https://github.com/TWOJA-NAZWA/kalkulator-cicd.git`
3. **Import**

**Opcja B: Azure Repos**
```powershell
# Dodaj Azure Repos jako remote
git remote add azure https://dev.azure.com/TWOJE-ORG/Kalkulator-CICD/_git/kalkulator-cicd

# Push
git push azure main
```

### Krok 3: Utworzenie Service Connection

1. W projekcie → **Project Settings** → **Service connections**
2. Kliknij **"New service connection"**
3. Wybierz **"Azure Resource Manager"**
4. Wybierz **"Service principal (automatic)"**
5. Subscription: Wybierz swoją
6. Resource Group: `rg-kalkulator`
7. Service connection name: `Azure-Connection`
8. Grant access to all pipelines: ✅
9. **Save**

### Krok 4: Dodanie zmiennej dla API Token

1. W projekcie → **Pipelines** → **Library**
2. Kliknij **"+ Variable group"**
3. Variable group name: `Azure-Secrets`
4. Dodaj zmienną:
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: Token z Azure Portal
   - 🔒 Kliknij ikonę kłódki (Make secret)
5. **Save**

### Krok 5: Utworzenie Pipeline

1. W projekcie → **Pipelines** → **Create Pipeline**
2. Wybierz **"Azure Repos Git"** (lub GitHub jeśli tam masz kod)
3. Wybierz repozytorium
4. Wybierz **"Existing Azure Pipelines YAML file"**
5. Path: `/azure-pipelines.yml`
6. **Continue**
7. **Run**

### Krok 6: Link Variable Group

1. Otwórz pipeline → **Edit**
2. Kliknij **"Variables"** w prawym górnym rogu
3. Kliknij **"Variable groups"**
4. Wybierz `Azure-Secrets`
5. **Link**
6. **Save**

### Krok 7: Sprawdzenie buildu

1. Po push do `main` pipeline się uruchamia automatycznie
2. Zobacz etapy:
   - ✅ **Build Stage**: Sass, Minifikacja
   - ✅ **Deploy Stage**: Deploy do Azure

**Przykładowy output:**
```
Stage: Build
  🟢 Install Node.js
  📦 Install Dependencies
  🎨 Compile Sass → CSS
  🗜️ Minify CSS
  🗜️ Minify JavaScript
  🗜️ Minify HTML
  📊 Build Summary
  📤 Publish Build Artifacts

Stage: Deploy
  📥 Download Build Artifacts
  🚀 Deploy to Azure Static Web Apps
  ✅ Deployment completed!
```

---

## 🧪 Lokalne testowanie

### Instalacja zależności
```powershell
npm install
```

### Build lokalny
```powershell
# Pełny build
npm run build

# Poszczególne kroki
npm run sass           # Tylko Sass → CSS
npm run minify:css     # Minifikacja CSS
npm run minify:js      # Minifikacja JS
npm run minify:html    # Minifikacja HTML
```

### Weryfikacja wielkości plików
```powershell
# PowerShell
Get-ChildItem src/, dist/ | Select-Object Name, Length

# Lub w package.json jest już skrypt:
npm run build  # Na końcu pokazuje podsumowanie
```

### Uruchomienie lokalnie
```powershell
# Live server (automatyczne odświeżanie)
npm run serve

# Lub po prostu otwórz w przeglądarce
start dist/index.html
```

### Watch mode (automatyczne przebudowanie)
```powershell
npm run watch  # Automatycznie kompiluje SCSS po zmianach
```

---

## 📊 Porównanie wielkości plików (przykład)

| Plik | Źródło | Zminifikowane | Oszczędność |
|------|--------|---------------|-------------|
| CSS | 45 KB | 28 KB | 38% |
| JavaScript | 22 KB | 15 KB | 32% |
| HTML | 3 KB | 2 KB | 33% |
| **RAZEM** | **70 KB** | **45 KB** | **36%** ⚡ |

---

## 🔍 Troubleshooting

### Problem: GitHub Actions - "Error: No such file or directory"

**Rozwiązanie:**
```yaml
# Upewnij się że app_location wskazuje na dist
app_location: "dist"  # ← folder z zbudowanymi plikami
skip_app_build: true  # ← ważne!
```

### Problem: Azure DevOps - "Failed to authenticate"

**Rozwiązanie:**
1. Sprawdź czy Service Connection działa: Project Settings → Service connections → Test
2. Upewnij się że Variable Group jest zlinkowana
3. Sprawdź czy API Token jest poprawny

### Problem: Sass nie kompiluje się

**Rozwiązanie:**
```powershell
# Reinstaluj zależności
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Sprawdź wersję
npm list sass
```

### Problem: Minifikacja się nie udaje

**Rozwiązanie:**
```powershell
# Najpierw zbuduj CSS
npm run sass

# Potem minifikuj
npm run minify:css

# Sprawdź czy pliki istnieją
Test-Path dist/styles.css
Test-Path dist/styles.min.css
```

### Problem: Deploy działa ale strona nie działa

**Rozwiązanie:**
1. Sprawdź czy `dist/index.html` odwołuje się do poprawnych plików:
   - `styles.min.css` (nie `styles.css`)
   - `script.min.js` (nie `script.js`)

2. Sprawdź console w przeglądarce (F12)

3. Sprawdź czy wszystkie pliki są w `dist/`:
```powershell
Get-ChildItem dist/ -Recurse
```

---

## 🎓 Wymagania projektu - Checklist

- ✅ **Automatyczna publikacja** po zmianie kodu
- ✅ **"Coś" na etapie budowania #1**: Sass → CSS (transpilacja)
- ✅ **"Coś" na etapie budowania #2**: Minifikacja HTML/CSS/JS
- ✅ **GitHub Actions**: [.github/workflows/azure-static-web-apps.yml](.github/workflows/azure-static-web-apps.yml)
- ✅ **Azure DevOps**: [azure-pipelines.yml](azure-pipelines.yml)

---

## 📚 Dodatkowe zasoby

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure DevOps Pipelines](https://docs.microsoft.com/azure/devops/pipelines/)
- [Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/)
- [Sass Documentation](https://sass-lang.com/documentation)
- [Terser (JS Minifier)](https://terser.org/)

---

## 🎉 Gotowe!

Masz teraz w pełni skonfigurowane CI/CD w **dwóch wariantach**!

Każdy push do `main` automatycznie:
1. 🎨 Kompiluje Sass → CSS
2. 🗜️ Minifikuje wszystkie pliki
3. 🚀 Deployuje do Azure

**Autor**: Norbert
**Projekt**: Programowanie w Chmurze Obliczeniowej - Lab 1
**Data**: Luty 2026
