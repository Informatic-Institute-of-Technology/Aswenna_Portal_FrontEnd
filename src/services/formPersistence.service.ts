const DB_NAME = "AswendaFormPersistence";
const DB_VERSION = 1;
const STORE_NAME = "formData";

export type UserRole = "farmer" | "investor" | "landowner";

export type FormData = Record<string, any>;

interface FormDataEntry {
  id: string;
  role: UserRole;
  data: FormData;
  timestamp: number;
}

class FormPersistenceService {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  private async initDB(): Promise<void> {
    if (this.db) return;

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error("IndexedDB initialization failed:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log("IndexedDB initialized successfully");
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, {
            keyPath: "id",
          });
          objectStore.createIndex("role", "role", { unique: false });
          objectStore.createIndex("timestamp", "timestamp", { unique: false });
          console.log("Object store created");
        }
      };
    });

    return this.initPromise;
  }
  async saveFormData(role: UserRole, data: FormData): Promise<void> {
    try {
      await this.initDB();

      if (!this.db) {
        throw new Error("Database not initialized");
      }

      const transaction = this.db.transaction([STORE_NAME], "readwrite");
      const objectStore = transaction.objectStore(STORE_NAME);

      const entry: FormDataEntry = {
        id: `${role}-profile`,
        role,
        data,
        timestamp: Date.now(),
      };

      const request = objectStore.put(entry);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log(`Form data saved for ${role}`);
          resolve();
        };
        request.onerror = () => {
          console.error("Error saving form data:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Failed to save form data:", error);
      throw error;
    }
  }

  async getFormData(role: UserRole): Promise<FormData | null> {
    try {
      await this.initDB();

      if (!this.db) {
        throw new Error("Database not initialized");
      }

      const transaction = this.db.transaction([STORE_NAME], "readonly");
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.get(`${role}-profile`);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const entry = request.result as FormDataEntry | undefined;
          if (entry && entry.data) {
            console.log(`Form data retrieved for ${role}`);
            resolve(entry.data);
          } else {
            console.log(`No saved form data found for ${role}`);
            resolve(null);
          }
        };
        request.onerror = () => {
          console.error("Error retrieving form data:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Failed to retrieve form data:", error);
      return null;
    }
  }

  async clearFormData(role: UserRole): Promise<void> {
    try {
      await this.initDB();

      if (!this.db) {
        throw new Error("Database not initialized");
      }

      const transaction = this.db.transaction([STORE_NAME], "readwrite");
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.delete(`${role}-profile`);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log(`Form data cleared for ${role}`);
          resolve();
        };
        request.onerror = () => {
          console.error("Error clearing form data:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Failed to clear form data:", error);
      throw error;
    }
  }

  async clearAllFormData(): Promise<void> {
    try {
      await this.initDB();

      if (!this.db) {
        throw new Error("Database not initialized");
      }

      const transaction = this.db.transaction([STORE_NAME], "readwrite");
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.clear();

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log("All form data cleared");
          resolve();
        };
        request.onerror = () => {
          console.error("Error clearing all form data:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Failed to clear all form data:", error);
      throw error;
    }
  }

  async hasFormData(role: UserRole): Promise<boolean> {
    const data = await this.getFormData(role);
    return data !== null;
  }
}

export const formPersistenceService = new FormPersistenceService();
