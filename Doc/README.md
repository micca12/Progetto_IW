# Progetto Ingegneria del Web - Catalogo Vernici

## Introduzione

Questo progetto è stato sviluppato nell'ambito del corso di **Ingegneria del Web** con l'obiettivo di realizzare un'applicazione web full-stack che dimostri la padronanza delle tecnologie moderne per lo sviluppo di sistemi informativi.

Il dominio scelto è quello dei **prodotti per la pittura e verniciatura**, un settore caratterizzato da un'ampia varietà di prodotti, specifiche tecniche dettagliate e molteplici attori coinvolti (produttori, rivenditori, clienti finali).

---

## Descrizione Funzionale

L'applicazione simula una piattaforma di catalogazione per prodotti vernicianti, pensata per mettere in comunicazione tre tipologie di utenti:

### Utente Finale (Cliente)

Rappresenta chi cerca informazioni sui prodotti: può essere un professionista del settore o un privato. Può navigare liberamente il catalogo, applicare filtri di ricerca, visualizzare le schede prodotto complete. Se registrato, può salvare prodotti nella propria lista preferiti.

### Operatore Marca

Rappresenta un'azienda produttrice o rivenditore che desidera inserire i propri prodotti nel catalogo. Dopo la registrazione (soggetta ad approvazione), può gestire autonomamente il proprio catalogo: aggiungere prodotti, definire varianti colore, impostare prezzi per le diverse dimensioni, caricare documentazione tecnica.

### Amministratore

Gestisce la piattaforma: approva le nuove registrazioni delle marche, verifica i prodotti prima della pubblicazione, gestisce le richieste di eliminazione. Garantisce la qualità e coerenza dei contenuti.

---

## Funzionalità Implementate

### Catalogo Pubblico
- Visualizzazione lista prodotti con paginazione
- Sistema di filtri (ambiente, materiale, marca, prezzo)
- Ricerca testuale
- Scheda prodotto dettagliata con specifiche tecniche

### Gestione Utenti
- Registrazione e login con JWT
- Gestione profilo utente
- Sistema di ruoli (admin, utente, operatore)

### Area Preferiti
- Salvataggio prodotti per utenti registrati
- Gestione lista preferiti personale

### Dashboard Marca
- CRUD prodotti con gestione colori e prezzi
- Upload schede tecniche
- Richiesta eliminazione prodotti

### Pannello Amministrazione
- Approvazione marche in attesa
- Verifica e pubblicazione prodotti
- Gestione richieste eliminazione

---

## Architettura del Sistema

### Stack Tecnologico

| Componente | Tecnologia |
|------------|------------|
| Frontend | Vue.js 3, TypeScript, Vite |
| UI Components | Tailwind CSS, shadcn-vue |
| State Management | Pinia |
| Routing | Vue Router |
| Backend | Node.js, Express.js |
| ORM | Prisma |
| Database | PostgreSQL |
| Autenticazione | JWT, bcrypt |

### Struttura del Progetto

```
Progetto_IW/
├── backend/
│   ├── src/
│   │   ├── routes/          # Endpoint API REST
│   │   ├── middleware/      # Autenticazione, error handling
│   │   ├── services/        # Logica di business
│   │   └── utils/           # Funzioni di utilità
│   └── prisma/
│       └── schema.prisma    # Schema database
├── frontend/
│   └── src/
│       ├── views/           # Pagine dell'applicazione
│       ├── components/      # Componenti UI riutilizzabili
│       ├── stores/          # State management Pinia
│       └── router/          # Configurazione routing
└── Doc/
    ├── DB_create.sql        # Script creazione database
    ├── DB_scheme.svg        # Diagramma ER
    └── seed_database.sql    # Dati di popolamento
```

### Modello Dati

Il database è strutturato per gestire la complessità del dominio:

| Entità | Descrizione |
|--------|-------------|
| `utenti` | Utenti del sistema con credenziali e ruolo |
| `ruoli` | Tipologie di utente (admin, user, operatore) |
| `marche` | Aziende produttrici con stato di approvazione |
| `prodotti` | Vernici con specifiche tecniche |
| `colori` | Varianti colore (nome + codice HEX) |
| `dimensioni` | Formati disponibili in litri |
| `prezzi` | Relazione colore-dimensione-prezzo |
| `ambienti` | Classificazione interno/esterno |
| `materiali` | Superfici di applicazione |
| `preferiti` | Wishlist utente |

---

## Comandi Principali

### Backend

```bash
cd backend

# Avvia in modalità sviluppo (hot reload)
npm run dev

# Compila TypeScript
npm run build

# Avvia in produzione
npm start

# Genera client Prisma
npm run prisma:generate

# Esegui migrazioni database
npm run prisma:migrate

# Apri interfaccia grafica database
npm run prisma:studio
```

### Frontend

```bash
cd frontend

# Avvia dev server (localhost:5173)
npm run dev

# Build per produzione
npm run build

# Preview build
npm run preview
```

---

## Configurazione

### Backend (.env)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="secret-key"
```

### Frontend (.env)

```env
VITE_API_URL="http://localhost:3000/api"
```

---

## Possibili Sviluppi Futuri

Il progetto può essere esteso con funzionalità avanzate:

### Configuratore 3D

Integrazione di un visualizzatore tridimensionale che permetta all'utente di:
- Caricare o selezionare un modello di stanza
- Applicare virtualmente le vernici alle pareti
- Visualizzare in tempo reale l'effetto dei diversi colori
- Confrontare più combinazioni cromatiche

### Calcolatore Quantità Vernice

Strumento di calcolo che, sfruttando i dati già presenti nel sistema (copertura per litro, numero di mani consigliato), permetta di:
- Inserire le dimensioni delle superfici da verniciare
- Calcolare automaticamente i litri necessari considerando il numero di mani
- Suggerire il formato più conveniente da acquistare
- Stimare il costo totale in base ai prezzi a catalogo

### Altre Estensioni
- Sistema di recensioni e valutazioni prodotti
- Notifiche su variazioni di prezzo per prodotti in preferiti
- Esportazione liste in PDF per preventivi
- API pubblica per integrazioni esterne
