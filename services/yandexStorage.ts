// Яндекс SDK Storage сервис
// Использует safeStorage для надежного хранения данных с persistence

interface SafeStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

let storage: SafeStorage | null = null;
let initPromise: Promise<SafeStorage> | null = null;
let isInitialized = false;

const initStorage = async (): Promise<SafeStorage> => {
  if (storage) return storage;
  
  // Проверяем наличие Яндекс SDK
  if (typeof window !== 'undefined' && (window as any).YaGames) {
    try {
      const YaGames = (window as any).YaGames;
      const ysdk = await YaGames.init();
      const safeStorage = await ysdk.getStorage();
      
      // Переопределяем localStorage на safeStorage для persistence
      // safeStorage автоматически обеспечивает сохранение данных между сессиями
      Object.defineProperty(window, 'localStorage', {
        get: () => safeStorage,
        configurable: true,
        enumerable: true
      });
      
      storage = safeStorage;
      isInitialized = true;
      console.log('Yandex SDK safeStorage initialized with persistence');
      return storage;
    } catch (error) {
      console.warn('Yandex SDK initialization failed, falling back to localStorage:', error);
    }
  }
  
  // Fallback на обычный localStorage (тоже имеет persistence)
  storage = {
    getItem: (key: string) => {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn('localStorage.getItem failed:', e);
        return null;
      }
    },
    setItem: (key: string, value: string) => {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn('localStorage.setItem failed:', e);
      }
    },
    removeItem: (key: string) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('localStorage.removeItem failed:', e);
      }
    },
    clear: () => {
      try {
        localStorage.clear();
      } catch (e) {
        console.warn('localStorage.clear failed:', e);
      }
    }
  };
  isInitialized = true;
  return storage;
};

export const getStorage = async (): Promise<SafeStorage> => {
  if (!initPromise) {
    initPromise = initStorage();
  }
  return await initPromise;
};

export const storageGetItem = async (key: string): Promise<string | null> => {
  try {
    const s = await getStorage();
    return s.getItem(key);
  } catch (error) {
    console.warn('storageGetItem failed:', error);
    return null;
  }
};

export const storageSetItem = async (key: string, value: string): Promise<void> => {
  try {
    const s = await getStorage();
    s.setItem(key, value);
    // safeStorage автоматически сохраняет данные с persistence
  } catch (error) {
    console.warn('storageSetItem failed:', error);
  }
};

export const storageRemoveItem = async (key: string): Promise<void> => {
  try {
    const s = await getStorage();
    s.removeItem(key);
  } catch (error) {
    console.warn('storageRemoveItem failed:', error);
  }
};

export const isStorageReady = (): boolean => isInitialized;
