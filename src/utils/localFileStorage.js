const DATABASE_NAME = "cube-local-files";
const STORE_NAME = "files";
const DATABASE_VERSION = 1;

const openDatabase = () =>
  new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

export const saveLocalFile = async (file) => {
  const id = `local-file-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const database = await openDatabase();

  await new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(file, id);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });

  database.close();
  return id;
};

export const getLocalFileUrl = async (id) => {
  if (!id) return "";

  const database = await openDatabase();
  const file = await new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  database.close();
  return file ? window.URL.createObjectURL(file) : "";
};
