import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom'

import PublicLayout from './layouts/PublicLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'

import Inicio from './pages/public/Inicio.jsx'
import Servicios from './pages/public/Servicios.jsx'
import Reservar from './pages/public/Reservar.jsx'

import LoginAdmin from './pages/admin/LoginAdmin.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import Calendario from './pages/admin/Calendario.jsx'
import ServiciosAdmin from './pages/admin/ServiciosAdmin.jsx'
import Clientes from './pages/admin/Clientes.jsx'

import RutaProtegida from './components/RutaProtegida.jsx'
import Configuracion from './pages/admin/Configuracion.jsx'

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ========================= */}
                {/* RUTAS PÚBLICAS */}
                {/* ========================= */}

                <Route element={<PublicLayout />}>

                    <Route
                        path="/"
                        element={<Inicio />}
                    />

                    <Route
                        path="/servicios"
                        element={<Servicios />}
                    />

                    <Route
                        path="/reservar"
                        element={<Reservar />}
                    />

                </Route>

                {/* ========================= */}
                {/* LOGIN ADMIN */}
                {/* ========================= */}

                <Route
                    path="/admin"
                    element={<LoginAdmin />}
                />

                {/* ========================= */}
                {/* RUTAS PROTEGIDAS ADMIN */}
                {/* ========================= */}

                <Route
                    path="/admin"
                    element={
                        <RutaProtegida>
                            <AdminLayout />
                        </RutaProtegida>
                    }
                >

                    <Route
                        path="inicio"
                        element={<Dashboard />}
                    />

                    <Route
                        path="calendario"
                        element={<Calendario />}
                    />

                    <Route
                        path="servicios"
                        element={<ServiciosAdmin />}
                    />

                    <Route
                        path="clientes"
                        element={<Clientes />}
                    />

                    <Route
                        path="configuracion"
                        element={<Configuracion />}
                    />

                </Route>

            </Routes>
        </BrowserRouter>
    )
}

export default App