import { ProveedorAutenticacion } from './contextos/ContextoAutenticacion.jsx';
import { ProveedorProductos } from './contextos/ContextoProductos.jsx';
import { ProveedorSeleccion } from './contextos/ContextoSeleccion.jsx';
import { Rutas } from './rutas/Rutas.jsx';
import { ModalLogin } from './componentes/Comunes/ModalLogin.jsx';
import { DrawerSeleccion } from './componentes/Seleccion/DrawerSeleccion.jsx';
import './index.css';

export function App() {
  const manejarRedireccionAdmin = () => {
    window.dispatchEvent(new CustomEvent('nas:navigate-admin'));
  };

  const manejarNavegacion = (destino: string) => {
    window.dispatchEvent(new CustomEvent('nas:navigate', { detail: destino }));
  };

  return (
    <ProveedorAutenticacion>
      <ProveedorProductos>
        <ProveedorSeleccion>
          <Rutas />
          <DrawerSeleccion onNavegar={manejarNavegacion} />
          <ModalLogin onRedireccionarAdmin={manejarRedireccionAdmin} />
        </ProveedorSeleccion>
      </ProveedorProductos>
    </ProveedorAutenticacion>
  );
}

export default App;
