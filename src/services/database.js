import initSqlJs from 'sql.js';

let db;

export const initDatabase = async () => {
  const SQL = await initSqlJs({locateFile: (file) => `/sql-wasm.wasm`}); // Carga el intérprete SQLite en WebAssembly
  db = new SQL.Database(); // Crea una base de datos en memoria

  // Crea la tabla si no existe
  db.exec(`
    CREATE TABLE IF NOT EXISTS diagrams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      nodes TEXT NOT NULL,
      edges TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Base de datos inicializada');
};

export const getDatabase = () => db; // Devuelve la instancia de la base de datos

export const saveDiagram = (title, nodes, edges) => {
  const db = getDatabase();
  const nodesJson = JSON.stringify(nodes);
  const edgesJson = JSON.stringify(edges);

  db.exec(
    `INSERT INTO diagrams (title, nodes, edges) VALUES ('${title}', '${nodesJson}', '${edgesJson}')`
  );
};

export const loadDiagram = (id) => {
  const db = getDatabase();
  const result = db.exec(`SELECT nodes, edges FROM diagrams WHERE id = ${id}`);
  if (result[0]) {
    const [nodes, edges] = result[0].values[0];
    return { nodes: JSON.parse(nodes), edges: JSON.parse(edges) };
  }
  return null;
};

export const listDiagrams = () => {
  const db = getDatabase();
  const result = db.exec('SELECT id, title, created_at FROM diagrams');
  return (
    result[0]?.values.map(([id, title, createdAt]) => ({
      id,
      title,
      createdAt,
    })) || []
  );
};
