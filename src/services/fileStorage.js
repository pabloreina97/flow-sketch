import { fileOpen, fileSave } from 'browser-fs-access';

/**
 * Guarda un diagrama en un archivo JSON.
 * @param {Array} nodes - Nodos del diagrama.
 * @param {Array} edges - Aristas del diagrama.
 */
export const saveDiagram = async (nodes, edges) => {
  const diagramData = JSON.stringify({ nodes, edges }, null, 2);
  const blob = new Blob([diagramData], { type: 'application/json' });

  try {
    const fileHandle = await fileSave(blob, {
      extensions: ['.json'],
      description: 'Guardar diagrama JSON',
      suggestedName: 'diagram.json', // Nombre sugerido por defecto
    });
    return fileHandle.name;
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
    return { ...JSON.parse(text), name: file.name };
  } catch (error) {
    console.error('Error al cargar el archivo:', error);
    return null;
  }
};
