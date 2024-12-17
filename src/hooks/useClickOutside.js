import { useEffect } from 'react';

/**
 * Hook que ejecuta una función cuando se hace clic fuera del elemento referenciado.
 * @param {React.RefObject} ref - Referencia del elemento.
 * @param {Function} callback - Función a ejecutar.
 */
const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

export default useClickOutside;
