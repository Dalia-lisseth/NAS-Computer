import React, { useEffect, useMemo, useState } from 'react';
import { Encabezado } from '../componentes/Estructura/Encabezado';
import { PiePagina } from '../componentes/Estructura/PiePagina';
import { LayoutAdmin } from '../componentes/Administracion/LayoutAdmin';
import { PaginaAdminLogin } from '../paginas/administracion/PaginaAdminLogin';
import { PaginaAdminInicio } from '../paginas/administracion/inicio/PaginaAdminInicio';
import { PaginaAdminProductos } from '../paginas/administracion/Productos/PaginaAdminProductos';
import { PaginaAdminInventario } from '../paginas/administracion/Inventario/PaginaAdminInventario';
import { PaginaAdminCategorias } from '../paginas/administracion/Categorias/PaginaAdminCategorias';
import { PaginaAdminOfertas } from '../paginas/administracion/Ofertas/PaginaAdminOfertas';
import { PaginaAdminSolicitudes } from '../paginas/administracion/Solicitudes/PaginaAdminSolicitudes';
import { PaginaAdminBanners } from '../paginas/administracion/Banners/PaginaAdminBanners';
import { PaginaInicio } from '../paginas/cliente/Inicio/PaginaInicio';
import { PaginaCatalogo } from '../paginas/cliente/Catalogo/PaginaCatalogo';
import { PaginaOfertas } from '../paginas/cliente/Ofertas/PaginaOfertas';
import { PaginaContacto } from '../paginas/cliente/Contacto/PaginaContacto';
import { PaginaMiSeleccion } from '../paginas/cliente/MiSeleccion/PaginaMiSeleccion';
import { PaginaMisSolicitudes } from '../paginas/cliente/MisSolicitudes/PaginaMisSolicitudes';
import { useAutenticacionContext } from '../contextos/ContextoAutenticacion';

const TITULOS_ADMIN = {
  inicio: 'Dashboard',
  productos: 'Productos',
  inventario: 'Inventario',
  categorias: 'Categorías',
  ofertas: 'Ofertas',
  solicitudes: 'Solicitudes',
  banners: 'Banners'
};

export function Rutas() {
  const { esAdmin } = useAutenticacionContext();
  const [rutaActual, setRutaActual] = useState('inicio');
  const [adminVista, setAdminVista] = useState('inicio');
  const [modoPantalla, setModoPantalla] = useState('tienda');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  useEffect(() => {
    const abrirAdminDesdeEvento = () => {
      setModoPantalla('admin');
      setAdminVista('inicio');
      setRutaActual('admin');
    };

    const manejarNavegacionGlobal = (e) => {
      if (e.detail) {
        navegar(e.detail);
      }
    };

    window.addEventListener('nas:navigate-admin', abrirAdminDesdeEvento);
    window.addEventListener('nas:navigate', manejarNavegacionGlobal);
    return () => {
      window.removeEventListener('nas:navigate-admin', abrirAdminDesdeEvento);
      window.removeEventListener('nas:navigate', manejarNavegacionGlobal);
    };
  }, []);

  const navegar = (destino) => {
    const proximoDestino = String(destino || 'inicio');
    if (proximoDestino === 'admin') {
      setModoPantalla('admin');
      setAdminVista('inicio');
      setRutaActual('admin');
      return;
    }

    setModoPantalla('tienda');
    setRutaActual(proximoDestino);
  };

  const manejarCambiarSeccionAdmin = (seccion) => {
    setAdminVista(seccion || 'inicio');
    setModoPantalla('admin');
    setRutaActual('admin');
  };

  const renderCliente = useMemo(() => {
    switch (rutaActual) {
      case 'catalogo':
      case 'categorias':
        return (
          <PaginaCatalogo
            key="catalogo"
            categoriaInicial={null}
            terminoBusqueda={terminoBusqueda}
            onNavegar={navegar}
          />
        );
      case 'ofertas':
        return <PaginaOfertas />;
      case 'contacto':
        return <PaginaContacto />;
      case 'solicitudes':
        return <PaginaMisSolicitudes onNavegar={navegar} />;
      case 'mi-seleccion':
        return <PaginaMiSeleccion onNavegar={navegar} />;
      default: {
        if (rutaActual.startsWith('categoria-')) {
          const categoriaInicial = rutaActual.replace(/^categoria-/, '');
          return (
            <PaginaCatalogo
              key={categoriaInicial}
              categoriaInicial={categoriaInicial}
              terminoBusqueda={terminoBusqueda}
              onNavegar={navegar}
            />
          );
        }

        return <PaginaInicio onNavegar={navegar} terminoBusqueda={terminoBusqueda} />;
      }
    }
  }, [rutaActual, terminoBusqueda]);

  const renderAdmin = () => {
    if (!esAdmin) {
      return (
        <PaginaAdminLogin
          onLoginExitoso={() => {
            setModoPantalla('admin');
            setAdminVista('inicio');
            setRutaActual('admin');
          }}
          onIrATienda={() => {
            setModoPantalla('tienda');
            setRutaActual('inicio');
          }}
        />
      );
    }

    const paginaAdmin = (() => {
      switch (adminVista) {
        case 'productos':
          return <PaginaAdminProductos />;
        case 'inventario':
          return <PaginaAdminInventario />;
        case 'categorias':
          return <PaginaAdminCategorias />;
        case 'ofertas':
          return <PaginaAdminOfertas />;
        case 'solicitudes':
          return <PaginaAdminSolicitudes />;
        case 'banners':
          return <PaginaAdminBanners />;
        default:
          return <PaginaAdminInicio onCambiarSeccion={manejarCambiarSeccionAdmin} />;
      }
    })();

    return (
      <LayoutAdmin
        key={adminVista}
        seccionActiva={adminVista}
        onCambiarSeccion={manejarCambiarSeccionAdmin}
        onIrATienda={() => {
          setModoPantalla('tienda');
          setRutaActual('inicio');
        }}
        titulo={TITULOS_ADMIN[adminVista] || 'Dashboard'}
      >
        {paginaAdmin}
      </LayoutAdmin>
    );
  };

  if (modoPantalla === 'admin') {
    return renderAdmin();
  }

  return (
    <>
      <Encabezado
        seccionActiva={rutaActual}
        onBuscar={setTerminoBusqueda}
        onNavegar={navegar}
      />
      {renderCliente}
      <PiePagina onNavegar={navegar} />
    </>
  );
}

export default Rutas;
