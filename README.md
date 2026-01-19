# Progetto Ingegneria del Web - Catalogo Vernici

## Guida all'Installazione

Questa guida spiega come installare e avviare il progetto da zero.

---

## Prerequisiti

- **Node.js** (v18 o superiore) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 o superiore) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

---

## 1. Clonare il Repository

```bash
git clone https://github.com/micca12/Progetto_IW.git
cd Progetto_IW
```

---

## 2. Installazione e Configurazione PostgreSQL

### 2.1 Installare PostgreSQL

**Windows:**
1. Scarica l'installer da [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Esegui l'installer e segui la procedura guidata
3. Durante l'installazione, imposta una password per l'utente `postgres` (ricordala!)
4. Lascia la porta di default `5432`

**macOS (con Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2.2 Creare il Database

Apri il terminale PostgreSQL:

**Windows:**
```bash
psql -U postgres
```

**macOS/Linux:**
```bash
sudo -u postgres psql
```

Esegui i seguenti comandi SQL:

```sql
-- Crea il database
CREATE DATABASE progetto_iw;

-- (Opzionale) Crea un utente dedicato
CREATE USER progetto_user WITH PASSWORD 'la_tua_password';
GRANT ALL PRIVILEGES ON DATABASE progetto_iw TO progetto_user;

-- Esci da psql
\q
```

### 2.3 Creare le Tabelle

Esegui lo script di creazione delle tabelle:

**Windows:**
```bash
psql -U postgres -d progetto_iw -f Doc/DB_create.sql
```

**macOS/Linux:**
```bash
sudo -u postgres psql -d progetto_iw -f Doc/DB_create.sql
```

### 2.4 Popolare il Database (Seed)

Esegui lo script di popolamento con i dati di esempio:

**Windows:**
```bash
psql -U postgres -d progetto_iw -f Doc/seed_database.sql
```

**macOS/Linux:**
```bash
sudo -u postgres psql -d progetto_iw -f Doc/seed_database.sql
```

---

## 3. Configurazione Backend

### 3.1 Installare le Dipendenze

```bash
cd backend
npm install
```

### 3.2 Configurare le Variabili d'Ambiente

Crea il file `.env` nella cartella `backend`:

```bash
# Windows (PowerShell)
New-Item -Path .env -ItemType File

# macOS/Linux
touch .env
```

Apri il file `.env` e inserisci:

```env
DATABASE_URL="postgresql://postgres:LA_TUA_PASSWORD@localhost:5432/progetto_iw"
JWT_SECRET="una-chiave-segreta-lunga-e-casuale"
PORT=3000
```

> **Nota:** Sostituisci `LA_TUA_PASSWORD` con la password di PostgreSQL impostata durante l'installazione.

### 3.3 Generare il Client Prisma

```bash
npm run prisma:generate
```

### 3.4 Avviare il Backend

```bash
npm run dev
```

Il server sarà disponibile su `http://localhost:3000`

---

## 4. Configurazione Frontend

Apri un **nuovo terminale** (lascia il backend in esecuzione).

### 4.1 Installare le Dipendenze

```bash
cd frontend
npm install
```

### 4.2 Configurare le Variabili d'Ambiente

Crea il file `.env` nella cartella `frontend`:

```bash
# Windows (PowerShell)
New-Item -Path .env -ItemType File

# macOS/Linux
touch .env
```

Apri il file `.env` e inserisci:

```env
VITE_API_URL="http://localhost:3000"
```

### 4.3 Avviare il Frontend

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

---

## 5. Verifica Installazione

1. Apri il browser su `http://localhost:5173`
2. Dovresti vedere la home page del catalogo vernici
3. Naviga su "Catalogo" per verificare che i prodotti siano caricati

---

## Riepilogo Comandi

```bash
# 1. Clona il repository
git clone https://github.com/micca12/Progetto_IW.git
cd Progetto_IW

# 2. Setup database (da terminale psql)
psql -U postgres
# CREATE DATABASE progetto_iw;
# \q
psql -U postgres -d progetto_iw -f Doc/DB_create.sql
psql -U postgres -d progetto_iw -f Doc/seed_database.sql

# 3. Setup backend
cd backend
npm install
# Crea file .env con DATABASE_URL e JWT_SECRET
npm run prisma:generate
npm run dev

# 4. Setup frontend (nuovo terminale)
cd frontend
npm install
# Crea file .env con VITE_API_URL
npm run dev
```

---

## Credenziali di Test

Dopo il seed, sono disponibili i seguenti utenti:

| Ruolo | Email | Password |
|-------|-------|----------|
| Admin | admin@catalogo.com | Admin123! |
| Utente | mario.rossi@email.com | User123! |
| Marca (Sikkens) | info@sikkens.com | Marca123! |

---

## Troubleshooting

### Errore di connessione al database
- Verifica che PostgreSQL sia in esecuzione
- Controlla che la password nel file `.env` sia corretta
- Assicurati che il database `progetto_iw` esista

### Errore "relation does not exist"
- Esegui nuovamente `Doc/DB_create.sql`
- Verifica di essere connesso al database corretto

### Porta già in uso
- Backend: cambia `PORT` nel file `.env`
- Frontend: usa `npm run dev -- --port 3000` per cambiare porta

### Errore Prisma
- Esegui `npm run prisma:generate` dopo modifiche allo schema
- In caso di problemi, elimina `node_modules` e reinstalla
