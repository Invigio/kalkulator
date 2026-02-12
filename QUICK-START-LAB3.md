# 🚀 QUICK START - LAB 3

## Instalacja i Uruchomienie (3 minuty)

### 1️⃣ Zainstaluj wszystkie zależności
```powershell
npm run install:all
```

To zainstaluje:
- Backend dependencies (Express, Jest, Supertest)
- Frontend dependencies (Sass, Jest, build tools)
- E2E dependencies (Playwright + browsers)

### 2️⃣ Uruchom Backend
W **pierwszym terminalu**:
```powershell
npm run start:backend
```
Backend startuje na: **http://localhost:3000**

### 3️⃣ Zbuduj Frontend
W **drugim terminalu**:
```powershell
npm run build:frontend
```

### 4️⃣ Uruchom Frontend
```powershell
npm run start:frontend
```
Frontend dostępny na: **http://localhost:8080**

---

## 🧪 Uruchomienie Testów

### Backend (testy jednostkowe + integracyjne)
```powershell
npm run test:backend
```
✅ 20+ testów | Calculator logic + API endpoints

### Frontend (testy jednostkowe)
```powershell
npm run test:frontend
```
✅ 25+ testów | UI logic + API communication

### E2E (end-to-end)
```powershell
npm run test:e2e
```
✅ 30+ testów | Full user flows (Chrome, Firefox, Safari)

### Wszystkie testy
```powershell
npm run test:all
```

---

## 📊 Struktura Projektu

```
├── backend/           ← REST API (Node.js + Express)
├── frontend/          ← Aplikacja kliencka (HTML/CSS/JS)
├── e2e/               ← Testy E2E (Playwright)
└── .github/workflows/ ← CI/CD (GitHub Actions)
```

---

## 🎯 Co Zostało Zrobione

✅ **Backend REST API**
   - Express server z endpointami: calculate, history
   - Calculator class z operacjami mathetycznymi
   - 15+ testów jednostkowych (Jest)
   - Testy integracyjne API (Supertest)

✅ **Frontend**
   - HTML + Sass + JavaScript
   - API client komunikujący się z backendem
   - Historia obliczeń
   - Dark/Light theme
   - 20+ testów jednostkowych (Jest + jsdom)

✅ **Testy E2E**
   - 30+ testów Playwright
   - Testy UI, interakcji, przepływów
   - Multi-browser (Chrome, Firefox, Safari)

✅ **CI/CD z Testami**
   - GitHub Actions: Backend Tests → Frontend Tests → E2E → Deploy
   - Azure DevOps: Test Stage (wszystkie testy) → Deploy Stage
   - Automatyczny deployment po przejściu testów

---

## 🔧 Przydatne Komendy

```powershell
# Wyczyść node_modules (wszystkie foldery)
npm run clean

# Zobacz coverage testów backendu
cd backend && npm run test:coverage

# Uruchom Playwright UI (interaktywne testy)
cd e2e && npm run test:ui

# Zobacz raport z testów E2E
cd e2e && npm run test:report
```

---

## 📦 Deployment

### GitHub Actions
1. Push code do GitHub
2. Pipeline automatycznie uruchamia:
   - Backend tests
   - Frontend tests + build
   - E2E tests
   - Deploy do Azure (jeśli tests pass)

### Azure DevOps
1. Skonfiguruj project w Azure DevOps
2. Połącz z GitHub repo
3. Dodaj Variable Group "AzureSecrets"
4. Pipeline uruchamia się automatycznie

---

## ❓ Troubleshooting

**Backend nie startuje?**
```powershell
cd backend
npm install
npm start
```

**Frontend nie działa?**
```powershell
cd frontend
npm install
npm run build
# Otwórz frontend/dist/index.html w przeglądarce
```

**Testy E2E failują?**
```powershell
cd e2e
npx playwright install --with-deps
npm test
```

**API nie odpowiada?**
- Sprawdź czy backend działa: http://localhost:3000/api/health
- Sprawdź czy port 3000 nie jest zajęty

---

## 🎓 Lab 3 - Wymagania

✅ Rozdzielenie na frontend i backend (REST API)
✅ Testy jednostkowe backendu (calculator + API)
✅ Testy jednostkowe frontendu (UI logic)
✅ Testy E2E (Playwright - pełne przepływy)
✅ CI/CD z testami (GitHub Actions + Azure DevOps)

**Status: WSZYSTKO GOTOWE! 🎉**
