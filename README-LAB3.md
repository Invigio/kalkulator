# Kalkulator - Lab 3: Frontend + Backend + Testy

Zaawansowany kalkulator z architekturą frontend-backend oraz pełnym zestawem testów.

## 📁 Struktura Projektu

```
├── backend/           # REST API (Node.js + Express)
│   ├── src/
│   │   ├── server.js       # Express server
│   │   └── calculator.js   # Logika kalkulatora
│   ├── tests/
│   │   ├── calculator.test.js  # Testy jednostkowe
│   │   └── api.test.js         # Testy integracyjne API
│   └── package.json
│
├── frontend/          # Aplikacja kliencka
│   ├── src/
│   │   ├── index.html      # HTML
│   │   ├── script.js       # JavaScript (API client)
│   │   └── styles.scss     # SCSS styles
│   ├── tests/
│   │   └── calculator.test.js  # Testy jednostkowe
│   ├── dist/          # Built files
│   └── package.json
│
├── e2e/               # Testy E2E (Playwright)
│   ├── tests/
│   │   └── calculator.spec.js
│   ├── playwright.config.js
│   └── package.json
│
└── CI/CD
    ├── .github/workflows/ci-cd.yml    # GitHub Actions
    └── azure-pipelines-lab3.yml       # Azure DevOps
```

## 🚀 Uruchomienie Lokalne

### 1️⃣ Backend API

```bash
cd backend
npm install
npm start         # Start na porcie 3000
npm test          # Uruchom testy
npm run test:coverage  # Testy + coverage
```

**API Endpoints:**
- `GET /api/health` - Health check
- `POST /api/calculate` - Wykonaj obliczenia
- `GET /api/history` - Pobierz historię
- `DELETE /api/history` - Wyczyść historię

### 2️⃣ Frontend

```bash
cd frontend
npm install
npm run build     # Build (Sass + minifikacja)
npm test          # Uruchom testy jednostkowe
```

Otwórz `frontend/dist/index.html` w przeglądarce.

### 3️⃣ Testy E2E

```bash
cd e2e
npm install
npx playwright install
npm test              # Run E2E tests
npm run test:headed   # Run with browser visible
npm run test:ui       # Run with Playwright UI
```

## 🧪 Testy

### Testy Jednostkowe Backendu
- ✅ Calculator class (add, subtract, multiply, divide, power, sqrt)
- ✅ Walidacja wejścia
- ✅ Historia obliczeń
- ✅ Obsługa błędów

### Testy Integracyjne API
- ✅ Wszystkie endpointy REST
- ✅ Statusy HTTP
- ✅ Formaty odpowiedzi
- ✅ Obsługa błędów

### Testy Jednostkowe Frontendu
- ✅ Wprowadzanie liczb
- ✅ Operacje matematyczne
- ✅ Zarządzanie stanem
- ✅ Komunikacja z API
- ✅ Zarządzanie motywem

### Testy E2E
- ✅ Interfejs użytkownika
- ✅ Przepływ użytkownika
- ✅ Integracja frontend-backend
- ✅ Historia obliczeń
- ✅ Responsywność
- ✅ Obsługa klawiatury

## 📊 CI/CD Pipeline

### GitHub Actions
1. **Backend Tests** - testy jednostkowe i integracyjne
2. **Frontend Tests** - testy jednostkowe + build
3. **E2E Tests** - testy end-to-end
4. **Deploy** - deployment do Azure

### Azure DevOps
- Test Stage: Backend → Frontend → E2E
- Deploy Stage: Frontend (Static Web Apps) + Backend

## 🔧 Technologie

### Backend
- **Node.js** + **Express** - REST API
- **Jest** - Framework testowy
- **Supertest** - Testy API

### Frontend
- **HTML5** + **CSS3** + **JavaScript**
- **Sass** - Preprocessor CSS
- **Jest** - Testy jednostkowe
- **Terser** - Minifikacja JS
- **CleanCSS** - Minifikacja CSS

### E2E
- **Playwright** - Testy E2E
- Testy na Chrome, Firefox, Safari

## 📦 Deployment

### Azure Static Web Apps
Frontend automatycznie deployowany po przejściu testów.

### Backend
Deploy do Azure App Service lub Azure Functions (opcjonalnie).

## 🎯 Spełnienie Wymagań Lab 3

✅ **Rozdzielenie na frontend i backend** - REST API + aplikacja kliencka
✅ **Testy jednostkowe backendu** - 15+ testów (calculator.test.js, api.test.js)
✅ **Testy jednostkowe frontendu** - 20+ testów (calculator.test.js)
✅ **Testy E2E** - 30+ testów (calculator.spec.js)
✅ **CI/CD z testami** - GitHub Actions + Azure DevOps

## 📝 Dodatkowe Możliwości

- Historia obliczeń przechowywana w bazie danych
- Autentykacja użytkowników
- WebSockets dla współdzielonych kalkulacji
- Progressive Web App (PWA)
