# 🚀 Szybki Przewodnik - CI/CD

## 📋 Checklist przed rozpoczęciem

- [ ] Zainstalowany Node.js (v18+)
- [ ] Zainstalowany Git
- [ ] Konto GitHub
- [ ] Konto Azure (Free tier wystarczy)
- [ ] (Opcjonalnie) Konto Azure DevOps

---

## ⚡ Quick Commands

### Build lokalny
```powershell
# Instalacja
npm install

# Pojedyncze kroki
npm run sass           # SCSS → CSS
npm run minify:css     # Minifikacja CSS
npm run minify:js      # Minifikacja JS
npm run minify:html    # Minifikacja HTML

# Wszystko naraz
npm run build

# Live preview
npm run serve          # Otwórz http://localhost:8080
```

### Git workflow
```powershell
# Pierwszy raz
git init
git add .
git commit -m "feat: initial commit with CI/CD"
git remote add origin https://github.com/YOUR-USERNAME/kalkulator-cicd.git
git push -u origin main

# Kolejne zmiany
git add .
git commit -m "feat: twój opis zmiany"
git push
```

---

## 🐙 GitHub Actions Setup (5 minut)

### 1. Push do GitHub ✅
```powershell
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR-USERNAME/kalkulator-cicd.git
git push -u origin main
```

### 2. Azure Static Web App ✅
- Portal: https://portal.azure.com
- Create → Static Web Apps
- **Name**: kalkulator-cicd
- **Plan**: Free
- **Source**: GitHub (authorize)
- **Repo**: Wybierz swoje
- **Branch**: main
- **App location**: `/dist` ← WAŻNE!
- **Skip app build**: ✅ true

### 3. GitHub Secret ✅
- Azure Portal → Static Web App → Manage deployment token → Copy
- GitHub Repo → Settings → Secrets → Actions → New secret
- **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN`
- **Value**: Wklej token
- Add secret

### 4. Test ✅
```powershell
echo "/* Test */" >> src/styles.scss
git add .
git commit -m "test: CI/CD"
git push

# Sprawdź: GitHub → Actions tab
```

**GOTOWE!** 🎉 Każdy push automatycznie buduje i deployuje!

---

## 🔷 Azure DevOps Setup (10 minut)

### 1. Projekt ✅
- https://dev.azure.com
- New project → "Kalkulator-CICD"

### 2. Repo ✅
**Opcja A - Import z GitHub:**
- Repos → Import → URL GitHub repo

**Opcja B - Azure Repos:**
```powershell
git remote add azure https://dev.azure.com/YOUR-ORG/Kalkulator-CICD/_git/kalkulator-cicd
git push azure main
```

### 3. Service Connection ✅
- Project Settings → Service connections
- New → Azure Resource Manager
- Service principal (automatic)
- Subscription → Wybierz
- Name: `Azure-Connection`
- Grant access to all pipelines ✅
- Save

### 4. Variable Group ✅
- Pipelines → Library → + Variable group
- Name: `Azure-Secrets`
- Add variable:
  - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
  - Value: Token z Azure Portal
  - 🔒 Make secret
- Save

### 5. Pipeline ✅
- Pipelines → Create Pipeline
- Azure Repos Git (lub GitHub)
- Existing YAML: `/azure-pipelines.yml`
- Run

### 6. Link Variable Group ✅
- Edit pipeline → Variables → Variable groups
- Link `Azure-Secrets`
- Save

### 7. Test ✅
```powershell
git add .
git commit -m "test: Azure DevOps CI/CD"
git push

# Sprawdź: Pipelines tab
```

**GOTOWE!** 🎉

---

## 📊 Co się dzieje podczas buildu?

### GitHub Actions Pipeline
```
1. 📥 Checkout code
2. 🟢 Setup Node.js 20
3. 📦 npm ci (instalacja zależności)
4. 🎨 npm run sass          → SCSS → CSS
5. 🗜️ npm run minify:css    → Kompresja CSS
6. 🗜️ npm run minify:js     → Kompresja JS
7. 🗜️ npm run minify:html   → Kompresja HTML
8. 📋 npm run copy:config   → Kopiowanie plików
9. 📊 Build Summary         → Podsumowanie
10. 🚀 Deploy to Azure      → Publikacja

⏱️ Czas: ~2-3 minuty
```

### Azure DevOps Pipeline
```
Stage 1: Build
  1. 🟢 Setup Node.js
  2. 📦 Cache npm packages
  3. 📦 Install Dependencies
  4. 🎨 Compile Sass → CSS
  5. 🗜️ Minify CSS
  6. 🗜️ Minify JavaScript
  7. 🗜️ Minify HTML
  8. 📋 Copy Config
  9. 📊 Build Summary
  10. 📤 Publish Artifacts

Stage 2: Deploy
  1. 📥 Download Artifacts
  2. 🚀 Deploy to Azure
  3. ✅ Summary

⏱️ Czas: ~3-4 minuty
```

---

## 🎯 Weryfikacja że działa

### 1. Local build test
```powershell
npm run build

# Sprawdź czy pliki istnieją:
Test-Path dist/index.html          # Should be True
Test-Path dist/styles.min.css      # Should be True
Test-Path dist/script.min.js       # Should be True

# Sprawdź rozmiary:
Get-ChildItem dist/ | Select-Object Name, Length
```

### 2. GitHub Actions test
```powershell
# Zrób zmianę
echo "/* Test $(Get-Date) */" >> src/styles.scss

# Push
git add .
git commit -m "test: verify CI/CD"
git push

# Sprawdź
# 1. GitHub → Actions → Zobacz running workflow
# 2. Kliknij na workflow → Zobacz logi
# 3. Sprawdź czy wszystkie steps są ✅
```

### 3. Deployed app test
```
1. Otwórz URL aplikacji (z Azure Portal)
2. Sprawdź DevTools (F12) → Network
3. Zweryfikuj że ładuje:
   - styles.min.css
   - script.min.js
4. Sprawdź że kalkulator działa
5. Sprawdź motyw (🌙 → ☀️)
6. Sprawdź historię
```

---

## 🆘 Najczęstsze problemy

### "npm: command not found"
```powershell
# Zainstaluj Node.js z: https://nodejs.org
# lub przez winget:
winget install OpenJS.NodeJS
```

### "AZURE_STATIC_WEB_APPS_API_TOKEN secret not found"
```
1. Azure Portal → Static Web App
2. Manage deployment token → Copy
3. GitHub → Settings → Secrets → Actions
4. New secret: AZURE_STATIC_WEB_APPS_API_TOKEN
```

### "Error: dist folder not found"
```powershell
# Najpierw build lokalnie
npm run build

# Sprawdź czy dist/ istnieje
Test-Path dist/
```

### "Sass compilation failed"
```powershell
# Reinstall
Remove-Item -Recurse node_modules
Remove-Item package-lock.json
npm install

# Test
npm run sass
```

---

## 📝 Commit Message Convention

```
feat: dodanie nowej funkcji
fix: naprawa buga
docs: zmiana w dokumentacji
style: formatowanie, białe znaki
refactor: refactoring kodu
test: dodanie testów
chore: aktualizacja build tools
```

Przykłady:
```powershell
git commit -m "feat: add history panel animation"
git commit -m "fix: calculator button hover effect"
git commit -m "docs: update CI/CD setup instructions"
```

---

## 🎓 Podsumowanie dla prowadzącego

### Automatyczna publikacja ✅
- Push do `main` → automatyczny build i deploy
- Działa w GitHub Actions i Azure DevOps

### "Coś" #1: Sass → CSS ✅
- Transpilacja SCSS do CSS
- Użycie zmiennych SCSS
- Zagnieżdżenia stylów

### "Coś" #2: Minifikacja ✅
- HTML: 3KB → 2KB (33%)
- CSS: 45KB → 28KB (38%)
- JS: 22KB → 15KB (32%)
- **Łącznie: 36% redukcja!**

### Dwa warianty ✅
1. **GitHub Actions**: [.github/workflows/azure-static-web-apps.yml](.github/workflows/azure-static-web-apps.yml)
2. **Azure DevOps**: [azure-pipelines.yml](azure-pipelines.yml)

---

## 📚 Dokumentacja

- **README.md** - Ogólny przegląd projektu
- **CI-CD-SETUP.md** - Szczegółowa dokumentacja CI/CD (GŁÓWNA)
- **QUICK-START.md** - Ten plik (szybki start)

---

**Sukces!** 🎉 Masz teraz w pełni działający CI/CD!
