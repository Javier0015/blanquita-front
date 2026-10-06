import {
    CalendarDays,
    House,
    Scissors,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Sparkles,
} from 'lucide-react'

import {
    NavLink,
    Outlet,
    useNavigate,
} from 'react-router-dom'

import {
    AnimatePresence,
    motion,
} from 'motion/react'

import {
    useState,
} from 'react'

function AdminLayout() {
    const navigate = useNavigate()

    const [
        menuAbierto,
        setMenuAbierto,
    ] = useState(false)

    const opcionesPrincipales = [
        {
            nombre: 'Inicio',
            ruta: '/admin/inicio',
            icono: House,
        },
        {
            nombre: 'Calendario',
            ruta: '/admin/calendario',
            icono: CalendarDays,
        },
        {
            nombre: 'Servicios',
            ruta: '/admin/servicios',
            icono: Scissors,
        },
        {
            nombre: 'Clientes',
            ruta: '/admin/clientes',
            icono: Users,
        },
    ]

    function cerrarSesion() {
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')

        setMenuAbierto(false)

        navigate(
            '/admin',
            {
                replace: true,
            },
        )
    }

    return (
        <div
            className="
                min-h-screen
                bg-gradient-to-b
                from-[#fff8fb]
                via-[#fffafb]
                to-[#fff6f8]
                text-stone-800
            "
        >
            {/* HEADER MÓVIL */}
            <header
                className="
                    sticky
                    top-0
                    z-30
                    flex
                    items-center
                    justify-between
                    border-b
                    border-pink-100/80
                    bg-white/85
                    px-4
                    py-3
                    backdrop-blur-xl
                    lg:hidden
                "
            >
                <div className="flex items-center gap-3">

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-2xl
                            bg-gradient-to-br
                            from-pink-300
                            via-rose-300
                            to-fuchsia-300
                            text-white
                            shadow-md
                            shadow-pink-200/60
                        "
                    >
                        <Sparkles size={19} />
                    </div>

                    <div>

                        <h1
                            className="
                                text-[15px]
                                font-semibold
                                tracking-tight
                                text-stone-800
                            "
                        >
                            Blanquita
                        </h1>

                        <p
                            className="
                                text-[11px]
                                font-medium
                                text-pink-400
                            "
                        >
                            Administración
                        </p>

                    </div>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        setMenuAbierto(true)
                    }
                    aria-label="Abrir menú"
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-2xl
                        bg-pink-50
                        text-pink-500
                        transition
                        active:scale-95
                    "
                >
                    <Menu size={20} />
                </button>
            </header>

            {/* SIDEBAR DESKTOP */}
            <aside
                className="
                    fixed
                    inset-y-0
                    left-0
                    z-30
                    hidden
                    w-72
                    flex-col
                    border-r
                    border-pink-100
                    bg-white/90
                    px-5
                    py-6
                    backdrop-blur-xl
                    lg:flex
                "
            >
                <LogoAdmin />

                <nav
                    className="
                        mt-8
                        flex
                        flex-1
                        flex-col
                        gap-2
                    "
                >
                    {opcionesPrincipales.map(
                        (opcion) => (
                            <OpcionMenu
                                key={opcion.ruta}
                                {...opcion}
                            />
                        ),
                    )}

                    <OpcionMenu
                        nombre="Configuración"
                        ruta="/admin/configuracion"
                        icono={Settings}
                    />
                </nav>

                <CerrarSesion
                    onCerrarSesion={
                        cerrarSesion
                    }
                />
            </aside>

            {/* MENÚ MÓVIL SECUNDARIO */}
            <AnimatePresence>
                {menuAbierto && (
                    <>
                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            onClick={() =>
                                setMenuAbierto(false)
                            }
                            className="
                                fixed
                                inset-0
                                z-40
                                bg-stone-900/20
                                backdrop-blur-sm
                                lg:hidden
                            "
                        />

                        <motion.aside
                            initial={{
                                x: '100%',
                            }}
                            animate={{
                                x: 0,
                            }}
                            exit={{
                                x: '100%',
                            }}
                            transition={{
                                duration: 0.28,
                                ease: 'easeOut',
                            }}
                            className="
                                fixed
                                inset-y-0
                                right-0
                                z-50
                                flex
                                w-[86%]
                                max-w-sm
                                flex-col
                                rounded-l-[32px]
                                bg-[#fffafd]
                                px-5
                                py-6
                                shadow-2xl
                                shadow-pink-200/40
                                lg:hidden
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-start
                                    justify-between
                                "
                            >
                                <LogoAdmin />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setMenuAbierto(false)
                                    }
                                    aria-label="Cerrar menú"
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-pink-50
                                        text-pink-500
                                        transition
                                        active:scale-95
                                    "
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="mt-8">

                                <p
                                    className="
                                        mb-3
                                        px-2
                                        text-[11px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.18em]
                                        text-pink-300
                                    "
                                >
                                    Opciones
                                </p>

                                <nav
                                    className="
                                        flex
                                        flex-col
                                        gap-2
                                    "
                                >
                                    <OpcionMenu
                                        nombre="Configuración"
                                        ruta="/admin/configuracion"
                                        icono={Settings}
                                        onClick={() =>
                                            setMenuAbierto(false)
                                        }
                                    />
                                </nav>

                            </div>

                            <div className="mt-auto">

                                <CerrarSesion
                                    onCerrarSesion={
                                        cerrarSesion
                                    }
                                />

                            </div>

                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* CONTENIDO */}
            <main
                className="
                    min-w-0
                    pb-28
                    lg:ml-72
                    lg:pb-0
                "
            >
                <div
                    className="
                        mx-auto
                        w-full
                        max-w-[1500px]
                        px-4
                        py-5
                        sm:px-6
                        lg:px-8
                        lg:py-8
                    "
                >
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 8,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.3,
                        }}
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </main>

            {/* BARRA INFERIOR MÓVIL */}
            <nav
                className="
                    fixed
                    bottom-0
                    left-0
                    right-0
                    z-30
                    border-t
                    border-pink-100
                    bg-white/95
                    px-2
                    pb-[max(env(safe-area-inset-bottom),10px)]
                    pt-2
                    backdrop-blur-xl
                    lg:hidden
                "
            >
                <div
                    className="
                        mx-auto
                        grid
                        max-w-md
                        grid-cols-4
                        gap-1
                    "
                >
                    {opcionesPrincipales.map(
                        (opcion) => (
                            <OpcionBottom
                                key={opcion.ruta}
                                {...opcion}
                            />
                        ),
                    )}
                </div>
            </nav>
        </div>
    )
}

function LogoAdmin() {
    return (
        <div className="flex items-center gap-3">

            <div
                className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-br
                    from-pink-300
                    via-rose-300
                    to-fuchsia-300
                    text-white
                    shadow-md
                    shadow-pink-200/70
                "
            >
                <Sparkles size={21} />
            </div>

            <div>

                <h2
                    className="
                        text-base
                        font-semibold
                        tracking-tight
                        text-stone-800
                    "
                >
                    Blanquita
                </h2>

                <p
                    className="
                        text-xs
                        font-medium
                        text-pink-400
                    "
                >
                    Belleza & cuidado
                </p>

            </div>

        </div>
    )
}

function OpcionMenu({
    nombre,
    ruta,
    icono: Icono,
    onClick,
}) {
    return (
        <NavLink
            to={ruta}
            onClick={onClick}
            className={({
                isActive,
            }) => `
                flex
                items-center
                gap-3
                rounded-2xl
                px-4
                py-3
                text-sm
                font-medium
                transition-all
                duration-200
                ${
                    isActive
                        ? `
                            bg-gradient-to-r
                            from-pink-300
                            via-rose-300
                            to-pink-400
                            text-white
                            shadow-md
                            shadow-pink-200/50
                        `
                        : `
                            text-stone-500
                            hover:bg-pink-50
                            hover:text-pink-500
                        `
                }
            `}
        >
            <Icono
                size={19}
                strokeWidth={2}
            />

            <span>
                {nombre}
            </span>
        </NavLink>
    )
}

function OpcionBottom({
    nombre,
    ruta,
    icono: Icono,
}) {
    return (
        <NavLink
            to={ruta}
            className="relative"
        >
            {({
                isActive,
            }) => (
                <motion.div
                    whileTap={{
                        scale: 0.92,
                    }}
                    className={`
                        relative
                        flex
                        min-h-[58px]
                        flex-col
                        items-center
                        justify-center
                        gap-1
                        rounded-2xl
                        text-[10px]
                        font-semibold
                        transition-colors
                        ${
                            isActive
                                ? 'text-pink-500'
                                : 'text-stone-400'
                        }
                    `}
                >
                    {isActive && (
                        <motion.div
                            layoutId="bottom-active"
                            className="
                                absolute
                                inset-x-2
                                inset-y-1
                                -z-10
                                rounded-2xl
                                bg-pink-50
                            "
                            transition={{
                                type: 'spring',
                                stiffness: 350,
                                damping: 28,
                            }}
                        />
                    )}

                    <Icono
                        size={20}
                        strokeWidth={
                            isActive
                                ? 2.4
                                : 1.9
                        }
                    />

                    <span>
                        {nombre}
                    </span>
                </motion.div>
            )}
        </NavLink>
    )
}

function CerrarSesion({
    onCerrarSesion,
}) {
    return (
        <div
            className="
                border-t
                border-pink-100
                pt-4
            "
        >
            <motion.button
                type="button"
                onClick={onCerrarSesion}
                whileTap={{
                    scale: 0.97,
                }}
                className="
                    flex
                    min-h-12
                    w-full
                    items-center
                    gap-3
                    rounded-2xl
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-stone-400
                    transition
                    hover:bg-pink-50
                    hover:text-pink-500
                "
            >
                <LogOut size={19} />

                <span>
                    Cerrar sesión
                </span>
            </motion.button>
        </div>
    )
}

export default AdminLayout