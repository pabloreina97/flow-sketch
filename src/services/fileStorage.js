import { fileOpen, fileSave, directoryOpen } from 'browser-fs-access';

/**
 * Guarda un diagrama en un archivo JSON.
 * @param {string} title - Nombre del archivo.
 * @param {Array} nodes - Nodos del diagrama.
 * @param {Array} edges - Aristas del diagrama.
 */
export const saveDiagram = async (title, nodes, edges) => {
  const diagramData = JSON.stringify({ nodes, edges }, null, 2); // Formatear JSON para legibilidad
  const blob = new Blob([diagramData], { type: 'application/json' });

  try {
    await fileSave(blob, {
      fileName: `${title}.json`,
      extensions: ['.json'],
      description: 'Diagrama JSON',
    });
    console.log(`Diagrama "${title}" guardado con éxito.`);
  } catch (error) {
    console.error('Error al guardar el diagrama:', error);
  }
};

/**
 * Carga un archivo JSON y devuelve su contenido como objeto.
 * @returns {Object} - Contenido del archivo (nodos y aristas).
 */
export const loadDiagram = async () => {
  try {
    const file = await fileOpen({
      extensions: ['.json'],
      description: 'Cargar diagrama JSON',
      mimeTypes: ['application/json'],
    });

    const text = await file.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error al cargar el archivo:', error);
    return null;
  }
};

/**
 * Lista todos los archivos JSON en una carpeta seleccionada por el usuario.
 * @returns {Array} - Lista de nombres de archivos.
 */
export const listDiagrams = async () => {
  try {
    const files = await directoryOpen({
      recursive: false,
      mimeTypes: ['application/json'],
    });

    return files.map((file) => file.name.replace('.json', '')); // Devuelve los nombres sin extensión
  } catch (error) {
    console.error('Error al listar diagramas:', error);
    return [];
  }
};
