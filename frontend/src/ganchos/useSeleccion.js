import { useSeleccionContext } from '../contextos/ContextoSeleccion';

export function useSeleccion() {
  return useSeleccionContext();
}

export default useSeleccion;
