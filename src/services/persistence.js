import localforage from 'localforage';
import { getDatabase } from './database';
import initSqlJs from 'sql.js';

export const persistDatabase = async () => {
  const db = getDatabase();
  const dbData = db.export(); // Exporta el contenido como ArrayBuffer
  await localforage.setItem('sqlite-db', dbData); // Guarda en IndexedDB
};

export const loadPersistedDatabase = async () => {
  const dbData = await localforage.getItem('sqlite-db');
  if (dbData) {
    const SQL = await initSqlJs();
    return new SQL.Database(dbData); // Restaura la base de datos desde IndexedDB
  }
  return null;
};
