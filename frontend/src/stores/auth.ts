/**
 * Store di Autenticazione - Gestione utenti e sessioni
 *
 * Gestisce lo stato di autenticazione dell'applicazione, inclusi:
 * - Login/Logout utenti
 * - Registrazione nuovi utenti
 * - Persistenza del token JWT in localStorage
 * - Gestione errori di autenticazione
 *
 * @module stores/auth
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import apiClient from "@/api/client";
import { extractApiError } from "@/utils/apiError";

/**
 * Rappresenta un utente autenticato nel sistema
 */
interface User {
  /** ID univoco dell'utente */
  id: number;
  /** Email dell'utente (usata per login) */
  email: string;
  /** Nome proprio dell'utente */
  nome: string;
  /** Cognome dell'utente */
  cognome: string;
  /** Ruolo: "admin", "user" o "marca" */
  ruolo: string;
  /** ID della marca (solo per utenti con ruolo "marca") */
  marca_id?: number;
  /** Nome della marca (solo per utenti con ruolo "marca") */
  marca_nome?: string;
}

/**
 * Credenziali richieste per il login
 */
interface LoginCredentials {
  /** Email dell'utente */
  email: string;
  /** Password in chiaro (sarà hashata lato server) */
  password: string;
}

/**
 * Dati richiesti per la registrazione di un nuovo utente
 */
interface RegisterData {
  /** Email del nuovo utente */
  email: string;
  /** Password del nuovo utente (min 8 caratteri) */
  password: string;
  /** Nome proprio */
  nome: string;
  /** Cognome */
  cognome: string;
}

/**
 * Risposta del server dopo login/register riuscito
 */
interface AuthResponse {
  /** Dati dell'utente autenticato */
  user: User;
  /** Token JWT per autenticare le richieste successive */
  token: string;
}

/**
 * Store Pinia per la gestione dell'autenticazione
 */
export const useAuthStore = defineStore("auth", () => {
  // ========================================================================
  // STATE - Stato reattivo dello store
  // ========================================================================

  /**
   * Dati dell'utente correntemente autenticato
   * null se nessun utente è loggato
   */
  const user = ref<User | null>(null);

  /**
   * Token JWT per autenticare le richieste API
   * Viene salvato in localStorage per persistenza tra sessioni
   */
  const token = ref<string | null>(localStorage.getItem("token"));

  /**
   * Indica se c'è una richiesta di autenticazione in corso
   * Usato internamente per gestire lo stato durante le chiamate API
   */
  const loading = ref(false);

  /**
   * Messaggio di errore dall'ultima operazione di autenticazione
   * null se non ci sono errori
   */
  const error = ref<string | null>(null);

  // ========================================================================
  // GETTERS - Proprietà computate derivate dallo stato
  // ========================================================================

  /**
   * Indica se l'utente è autenticato
   * Basato sulla presenza del token
   */
  const isAuthenticated = computed(() => !!token.value);

  /**
   * Indica se l'utente loggato ha ruolo admin
   * false se non c'è utente loggato o se il ruolo non è "admin"
   */
  const isAdmin = computed(() => user.value?.ruolo === "admin");

  /**
   * Indica se l'utente loggato è una marca
   * false se non c'è utente loggato o se il ruolo non è "marca"
   */
  const isMarca = computed(() => user.value?.ruolo === "marca");

  // ========================================================================
  // ACTIONS - Funzioni per modificare lo stato
  // ========================================================================

  /**
   * Imposta i dati di autenticazione dopo login/register riuscito
   *
   * Salva:
   * - Dati utente nello stato
   * - Token JWT nello stato e in localStorage
   *
   * @param newUser - Dati dell'utente autenticato
   * @param newToken - Token JWT ricevuto dal server
   */
  function setAuth(newUser: User, newToken: string) {
    user.value = newUser;
    token.value = newToken;
    localStorage.setItem("token", newToken);
  }

  /**
   * Pulisce il messaggio di errore precedente
   * Chiamato prima di ogni nuova operazione di autenticazione
   */
  function clearError() {
    error.value = null;
  }

  /**
   * Autentica un utente con email e password
   *
   * Workflow:
   * 1. Invia credenziali al server (POST /auth/login)
   * 2. Se successo: salva user e token, ritorna true
   * 3. Se fallimento: imposta error con messaggio, ritorna false
   *
   * @param credentials - Email e password dell'utente
   * @returns Promise<boolean> - true se login riuscito, false altrimenti
   */
  async function login(credentials: LoginCredentials): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      // Chiamata API per autenticazione
      const response = await apiClient.post<AuthResponse>("/auth/login", credentials);

      // Salva user e token nello store e localStorage
      setAuth(response.data.user, response.data.token);
      return true;
    } catch (err) {
      error.value = extractApiError(err, "Credenziali non valide");
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Registra un nuovo utente nel sistema
   *
   * Workflow:
   * 1. Invia dati registrazione al server (POST /auth/register)
   * 2. Se successo: salva user e token (login automatico), ritorna true
   * 3. Se fallimento: imposta error con messaggio, ritorna false
   *
   * @param data - Dati del nuovo utente (nome, cognome, email, password)
   * @returns Promise<boolean> - true se registrazione riuscita, false altrimenti
   */
  async function register(data: RegisterData): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      // Chiamata API per registrazione
      const response = await apiClient.post<AuthResponse>("/auth/register", data);

      // Salva user e token (login automatico dopo registrazione)
      setAuth(response.data.user, response.data.token);
      return true;
    } catch (err) {
      error.value = extractApiError(err, "Errore durante la registrazione");
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Recupera i dati dell'utente corrente dal server
   *
   * Usato per:
   * - Ripristinare la sessione al caricamento dell'app (se token in localStorage)
   * - Verificare se il token è ancora valido
   *
   * Workflow:
   * 1. Se non c'è token, non fa nulla
   * 2. Chiama GET /auth/me con il token nell'header
   * 3. Se successo: aggiorna i dati utente
   * 4. Se fallisce (token scaduto/invalido): fa logout automatico
   */
  async function fetchCurrentUser(): Promise<void> {
    // Se non c'è token, non c'è nulla da fare
    if (!token.value) return;

    loading.value = true;
    try {
      // Recupera dati utente dal server (usa token in apiClient header)
      const response = await apiClient.get<User>("/auth/me");
      user.value = response.data;
    } catch {
      // Token non valido o scaduto → logout automatico
      logout();
    } finally {
      loading.value = false;
    }
  }

  /**
   * Effettua il logout dell'utente
   *
   * Pulisce:
   * - Dati utente dallo stato
   * - Token dallo stato e da localStorage
   *
   * Dopo logout, isAuthenticated sarà false
   */
  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
  }

  /**
   * Aggiorna il profilo utente (nome, cognome, email)
   */
  async function updateProfile(data: { nome: string; cognome: string; email: string }): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiClient.put<AuthResponse>("/auth/me", data);
      setAuth(response.data.user, response.data.token);
      return true;
    } catch (err) {
      error.value = extractApiError(err, "Errore nell'aggiornamento");
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Aggiorna la password utente
   */
  async function updatePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      await apiClient.put("/auth/password", { currentPassword, newPassword });
      return true;
    } catch (err) {
      error.value = extractApiError(err, "Errore nell'aggiornamento password");
      return false;
    } finally {
      loading.value = false;
    }
  }

  // ========================================================================
  // EXPORT - API pubblica dello store
  // ========================================================================

  return {
    // State
    /** Dati utente loggato (null se non loggato) */
    user,
    /** Token JWT (null se non loggato) */
    token,
    /** Indica se c'è una richiesta in corso */
    loading,
    /** Messaggio di errore dall'ultima operazione */
    error,

    // Getters
    /** true se l'utente è autenticato */
    isAuthenticated,
    /** true se l'utente è admin */
    isAdmin,
    /** true se l'utente è una marca */
    isMarca,

    // Actions
    /** Imposta user e token dopo login/register */
    setAuth,
    /** Pulisce il messaggio di errore */
    clearError,
    /** Login con email e password */
    login,
    /** Registra nuovo utente */
    register,
    /** Recupera dati utente corrente dal server */
    fetchCurrentUser,
    /** Effettua logout */
    logout,
    /** Aggiorna profilo utente */
    updateProfile,
    /** Aggiorna password utente */
    updatePassword,
  };
});
