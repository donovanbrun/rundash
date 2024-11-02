import { Activity } from "../models/activity";

const ACTIVITY_DB_NAME = 'activitiesDB';
const ACTIVITY_STORE_NAME = 'activities';
const DB_VERSION = 1;

const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(ACTIVITY_DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(ACTIVITY_STORE_NAME)) {
                db.createObjectStore(ACTIVITY_STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const getActivities = async (): Promise<Activity[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([ACTIVITY_STORE_NAME], 'readonly');
        const store = transaction.objectStore(ACTIVITY_STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const getActivity = async (id: number): Promise<Activity | undefined> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([ACTIVITY_STORE_NAME], 'readonly');
        const store = transaction.objectStore(ACTIVITY_STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const saveActivity = async (activity: Activity): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([ACTIVITY_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(ACTIVITY_STORE_NAME);
        const request = store.put(activity); // `put` adds or updates an entry

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const deleteActivity = async (id: number): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([ACTIVITY_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(ACTIVITY_STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const clearActivities = async (): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([ACTIVITY_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(ACTIVITY_STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}