import {
    CalendarDays,
    Check,
    Clock3,
    Edit3,
    Eye,
    EyeOff,
    Mail,
    Phone,
    Plus,
    RefreshCw,
    Search,
    UserRound,
    Users,
    X,
} from 'lucide-react'

import {
    AnimatePresence,
    motion,
} from 'motion/react'

import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import api from '../../services/api.js'


function Clientes() {
    const [
        clientes,
        setClientes,
    ] = useState([])

    const [
        cargando,
        setCargando,
    ] = useState(true)

    const [
        error,
        setError,
    ] = useState('')

    const [
        busqueda,
        setBusqueda,
    ] = useState('')

    const [
        filtro,
        setFiltro,
    ] = useState('TODOS')

    const [
        clienteSeleccionado,
        setClienteSeleccionado,
    ] = useState(null)

    const [
        modalFormulario,
        setModalFormulario,
    ] = useState(false)

    const [
        modalHistorial,
        setModalHistorial,
    ] = useState(false)

    const [
        procesandoEstado,
        setProcesandoEstado,
    ] = useState(null)


    useEffect(() => {
        cargarClientes()
    }, [])


    async function cargarClientes() {
        try {
            setCargando(true)
            setError('')

            const token =
                localStorage.getItem(
                    'token',
                )

            const respuesta =
                await api.get(
                    '/admin/clientes',
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    },
                )

            setClientes(
                respuesta.data.clientes ||
                [],
            )
        } catch (error) {
            console.error(
                'Error al cargar clientes:',
                error,
            )

            setError(
                error.response
                    ?.data
                    ?.mensaje ||
                'No fue posible cargar los clientes.',
            )
        } finally {
            setCargando(false)
        }
    }


    function abrirNuevoCliente() {
        setClienteSeleccionado(
            null,
        )

        setModalFormulario(
            true,
        )
    }


    function abrirEditarCliente(
        cliente,
    ) {
        setClienteSeleccionado(
            cliente,
        )

        setModalFormulario(
            true,
        )
    }


    function abrirHistorialCliente(
        cliente,
    ) {
        setClienteSeleccionado(
            cliente,
        )

        setModalHistorial(
            true,
        )
    }


    async function cambiarEstado(
        cliente,
    ) {
        try {
            setProcesandoEstado(
                cliente.id_cliente,
            )

            setError('')

            const token =
                localStorage.getItem(
                    'token',
                )

            const nuevoEstado =
                !cliente.activo

            await api.patch(
                `/admin/clientes/${cliente.id_cliente}/estado`,
                {
                    activo:
                        nuevoEstado,
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                },
            )

            setClientes(
                (
                    anteriores,
                ) =>
                    anteriores.map(
                        (
                            item,
                        ) =>
                            item.id_cliente ===
                            cliente.id_cliente
                                ? {
                                    ...item,
                                    activo:
                                        nuevoEstado,
                                }
                                : item,
                    ),
            )
        } catch (error) {
            console.error(
                'Error al cambiar estado:',
                error,
            )

            setError(
                error.response
                    ?.data
                    ?.mensaje ||
                'No fue posible cambiar el estado del cliente.',
            )
        } finally {
            setProcesandoEstado(
                null,
            )
        }
    }


    const clientesFiltrados =
        useMemo(
            () => {
                let resultado =
                    [...clientes]

                if (
                    filtro ===
                    'ACTIVOS'
                ) {
                    resultado =
                        resultado.filter(
                            (
                                cliente,
                            ) =>
                                cliente.activo,
                        )
                }

                if (
                    filtro ===
                    'INACTIVOS'
                ) {
                    resultado =
                        resultado.filter(
                            (
                                cliente,
                            ) =>
                                !cliente.activo,
                        )
                }

                const texto =
                    busqueda
                        .trim()
                        .toLowerCase()

                if (texto) {
                    resultado =
                        resultado.filter(
                            (
                                cliente,
                            ) => {
                                const nombre =
                                    String(
                                        cliente.nombre ||
                                        '',
                                    )
                                        .toLowerCase()

                                const telefono =
                                    String(
                                        cliente.telefono ||
                                        '',
                                    )
                                        .toLowerCase()

                                const correo =
                                    String(
                                        cliente.correo ||
                                        '',
                                    )
                                        .toLowerCase()

                                return (
                                    nombre.includes(
                                        texto,
                                    ) ||
                                    telefono.includes(
                                        texto,
                                    ) ||
                                    correo.includes(
                                        texto,
                                    )
                                )
                            },
                        )
                }

                return resultado
            },
            [
                clientes,
                filtro,
                busqueda,
            ],
        )


    const resumen =
        useMemo(
            () => {
                const total =
                    clientes.length

                const activos =
                    clientes.filter(
                        (
                            cliente,
                        ) =>
                            cliente.activo,
                    ).length

                const conCuenta =
                    clientes.filter(
                        (
                            cliente,
                        ) =>
                            cliente.cuenta_activa,
                    ).length

                return {
                    total,
                    activos,
                    conCuenta,
                }
            },
            [
                clientes,
            ],
        )


    return (
        <>
            <div className="space-y-5">

                {/* ENCABEZADO */}
                <motion.section
                    initial={{
                        opacity: 0,
                        y: -8,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="
                        relative
                        overflow-hidden
                        rounded-[28px]
                        border
                        border-pink-100
                        bg-gradient-to-br
                        from-white
                        via-pink-50
                        to-rose-50
                        p-5
                        shadow-sm
                        sm:p-6
                    "
                >
                    <div
                        className="
                            absolute
                            -right-16
                            -top-16
                            h-44
                            w-44
                            rounded-full
                            bg-pink-200/40
                            blur-3xl
                        "
                    />

                    <div className="relative">
                        
                        <div
                            className="
                                mt-2
                                flex
                                flex-col
                                gap-4
                                sm:flex-row
                                sm:items-end
                                sm:justify-between
                            "
                        >
                            <div>
                                <h1
                                    className="
                                        text-2xl
                                        font-semibold
                                        tracking-tight
                                        text-stone-800
                                        sm:text-3xl
                                    "
                                >
                                    Clientes
                                </h1>

                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        leading-6
                                        text-stone-500
                                    "
                                >
                                    Consulta, edita y revisa el historial de tus clientes.
                                </p>
                            </div>


                            <motion.button
                                type="button"
                                whileTap={{
                                    scale: 0.97,
                                }}
                                onClick={
                                    abrirNuevoCliente
                                }
                                className="
                                    flex
                                    min-h-12
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-2xl
                                    bg-gradient-to-r
                                    from-pink-300
                                    via-rose-300
                                    to-pink-400
                                    px-5
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-lg
                                    shadow-pink-200/60
                                    sm:w-auto
                                "
                            >
                                <Plus
                                    size={18}
                                />

                                Nuevo cliente
                            </motion.button>
                        </div>

                    </div>
                </motion.section>


                {/* RESUMEN */}
                <section
                    className="
                        grid
                        grid-cols-3
                        gap-3
                    "
                >
                    <TarjetaResumen
                        titulo="Total"
                        valor={
                            resumen.total
                        }
                        className="bg-pink-50"
                    />

                    <TarjetaResumen
                        titulo="Activos"
                        valor={
                            resumen.activos
                        }
                        className="bg-emerald-50"
                    />

                    <TarjetaResumen
                        titulo="Con cuenta"
                        valor={
                            resumen.conCuenta
                        }
                        className="bg-violet-50"
                    />
                </section>


                {/* BUSCADOR */}
                <section
                    className="
                        rounded-[24px]
                        border
                        border-pink-100
                        bg-white
                        p-4
                        shadow-sm
                    "
                >
                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            lg:flex-row
                            lg:items-center
                        "
                    >
                        <div
                            className="
                                flex
                                min-h-11
                                flex-1
                                items-center
                                gap-3
                                rounded-2xl
                                border
                                border-pink-100
                                bg-pink-50/40
                                px-4
                            "
                        >
                            <Search
                                size={17}
                                className="
                                    shrink-0
                                    text-pink-400
                                "
                            />

                            <input
                                type="text"
                                value={
                                    busqueda
                                }
                                onChange={(
                                    event,
                                ) =>
                                    setBusqueda(
                                        event.target.value,
                                    )
                                }
                                placeholder="Buscar por nombre, teléfono o correo..."
                                className="
                                    min-h-11
                                    w-full
                                    bg-transparent
                                    text-sm
                                    text-stone-700
                                    outline-none
                                    placeholder:text-stone-300
                                "
                            />
                        </div>


                        <div
                            className="
                                flex
                                gap-2
                                overflow-x-auto
                                pb-1
                                lg:pb-0
                            "
                        >
                            {[
                                {
                                    valor:
                                        'TODOS',
                                    texto:
                                        'Todos',
                                },

                                {
                                    valor:
                                        'ACTIVOS',
                                    texto:
                                        'Activos',
                                },

                                {
                                    valor:
                                        'INACTIVOS',
                                    texto:
                                        'Inactivos',
                                },
                            ].map(
                                (
                                    item,
                                ) => (
                                    <button
                                        key={
                                            item.valor
                                        }
                                        type="button"
                                        onClick={() =>
                                            setFiltro(
                                                item.valor,
                                            )
                                        }
                                        className={`
                                            shrink-0
                                            rounded-xl
                                            px-4
                                            py-2.5
                                            text-xs
                                            font-semibold
                                            transition

                                            ${
                                                filtro ===
                                                item.valor
                                                    ? `
                                                        bg-pink-100
                                                        text-pink-600
                                                    `
                                                    : `
                                                        bg-stone-50
                                                        text-stone-400
                                                    `
                                            }
                                        `}
                                    >
                                        {
                                            item.texto
                                        }
                                    </button>
                                ),
                            )}


                            <button
                                type="button"
                                onClick={
                                    cargarClientes
                                }
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-stone-50
                                    text-stone-400
                                "
                            >
                                <RefreshCw
                                    size={16}
                                />
                            </button>

                        </div>
                    </div>
                </section>


                {/* ERROR */}
                {error && (
                    <div
                        className="
                            rounded-2xl
                            border
                            border-rose-100
                            bg-rose-50
                            px-4
                            py-3
                            text-xs
                            font-medium
                            text-rose-600
                        "
                    >
                        {error}
                    </div>
                )}


                {/* CLIENTES */}
                {cargando ? (
                    <Cargando />
                ) : clientesFiltrados.length ===
                  0 ? (
                    <EstadoVacio
                        onNuevo={
                            abrirNuevoCliente
                        }
                    />
                ) : (
                    <section
                        className="
                            grid
                            gap-4
                            md:grid-cols-2
                            xl:grid-cols-3
                        "
                    >
                        {clientesFiltrados.map(
                            (
                                cliente,
                                index,
                            ) => (
                                <ClienteCard
                                    key={
                                        cliente.id_cliente
                                    }
                                    cliente={
                                        cliente
                                    }
                                    index={
                                        index
                                    }
                                    procesandoEstado={
                                        procesandoEstado ===
                                        cliente.id_cliente
                                    }
                                    onEditar={() =>
                                        abrirEditarCliente(
                                            cliente,
                                        )
                                    }
                                    onHistorial={() =>
                                        abrirHistorialCliente(
                                            cliente,
                                        )
                                    }
                                    onCambiarEstado={() =>
                                        cambiarEstado(
                                            cliente,
                                        )
                                    }
                                />
                            ),
                        )}
                    </section>
                )}

            </div>


            <ModalCliente
                abierto={
                    modalFormulario
                }
                cliente={
                    clienteSeleccionado
                }
                onCerrar={() =>
                    setModalFormulario(
                        false,
                    )
                }
                onGuardado={
                    cargarClientes
                }
            />


            <HistorialCliente
                abierto={
                    modalHistorial
                }
                cliente={
                    clienteSeleccionado
                }
                onCerrar={() =>
                    setModalHistorial(
                        false,
                    )
                }
            />
        </>
    )
}


function ClienteCard({
    cliente,
    index,
    procesandoEstado,
    onEditar,
    onHistorial,
    onCambiarEstado,
}) {
    return (
        <motion.article
            initial={{
                opacity: 0,
                y: 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.3,
                delay:
                    Math.min(
                        index * 0.04,
                        0.25,
                    ),
            }}
            className="
                rounded-[26px]
                border
                border-pink-100
                bg-white
                p-5
                shadow-sm
            "
        >
            <div
                className="
                    flex
                    items-start
                    gap-4
                "
            >
                <div
                    className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-pink-100
                        text-pink-500
                    "
                >
                    <UserRound
                        size={21}
                    />
                </div>


                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >
                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-2
                        "
                    >
                        <div
                            className="
                                min-w-0
                            "
                        >
                            <p
                                className="
                                    truncate
                                    text-sm
                                    font-semibold
                                    text-stone-800
                                "
                            >
                                {
                                    cliente.nombre
                                }
                            </p>

                            <div
                                className={`
                                    mt-1
                                    inline-flex
                                    rounded-full
                                    px-2.5
                                    py-1
                                    text-[10px]
                                    font-semibold

                                    ${
                                        cliente.activo
                                            ? `
                                                bg-emerald-50
                                                text-emerald-600
                                            `
                                            : `
                                                bg-stone-100
                                                text-stone-500
                                            `
                                    }
                                `}
                            >
                                {cliente.activo
                                    ? 'Activo'
                                    : 'Inactivo'}
                            </div>
                        </div>


                        <button
                            type="button"
                            onClick={
                                onEditar
                            }
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-pink-50
                                text-pink-500
                            "
                        >
                            <Edit3
                                size={16}
                            />
                        </button>
                    </div>


                    {cliente.telefono && (
                        <div
                            className="
                                mt-3
                                flex
                                items-center
                                gap-2
                                text-xs
                                text-stone-400
                            "
                        >
                            <Phone
                                size={13}
                            />

                            <span
                                className="
                                    truncate
                                "
                            >
                                {
                                    cliente.telefono
                                }
                            </span>
                        </div>
                    )}


                    {cliente.correo && (
                        <div
                            className="
                                mt-2
                                flex
                                items-center
                                gap-2
                                text-xs
                                text-stone-400
                            "
                        >
                            <Mail
                                size={13}
                            />

                            <span
                                className="
                                    truncate
                                "
                            >
                                {
                                    cliente.correo
                                }
                            </span>
                        </div>
                    )}

                </div>
            </div>


            <div
                className="
                    mt-5
                    grid
                    grid-cols-2
                    gap-3
                "
            >
                <div
                    className="
                        rounded-2xl
                        bg-pink-50/60
                        p-3
                    "
                >
                    <p
                        className="
                            text-[10px]
                            font-semibold
                            text-stone-400
                        "
                    >
                        Total citas
                    </p>

                    <p
                        className="
                            mt-1
                            text-base
                            font-semibold
                            text-stone-700
                        "
                    >
                        {
                            cliente.total_citas ||
                            0
                        }
                    </p>
                </div>


                <div
                    className="
                        rounded-2xl
                        bg-violet-50/60
                        p-3
                    "
                >
                    <p
                        className="
                            text-[10px]
                            font-semibold
                            text-stone-400
                        "
                    >
                        Última cita
                    </p>

                    <p
                        className="
                            mt-1
                            truncate
                            text-xs
                            font-semibold
                            text-stone-700
                        "
                    >
                        {cliente.ultima_cita
                            ? formatearFechaCorta(
                                cliente.ultima_cita,
                            )
                            : 'Sin citas'}
                    </p>
                </div>
            </div>


            <div
                className="
                    mt-4
                    flex
                    gap-2
                "
            >
                <button
                    type="button"
                    onClick={
                        onHistorial
                    }
                    className="
                        flex
                        min-h-11
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        bg-pink-50
                        text-xs
                        font-semibold
                        text-pink-600
                    "
                >
                    <CalendarDays
                        size={15}
                    />

                    Historial
                </button>


                <button
                    type="button"
                    disabled={
                        procesandoEstado
                    }
                    onClick={
                        onCambiarEstado
                    }
                    className={`
                        flex
                        min-h-11
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        text-xs
                        font-semibold
                        disabled:opacity-50

                        ${
                            cliente.activo
                                ? `
                                    bg-stone-50
                                    text-stone-500
                                `
                                : `
                                    bg-emerald-50
                                    text-emerald-600
                                `
                        }
                    `}
                >
                    {procesandoEstado ? (
                        <span
                            className="
                                h-4
                                w-4
                                animate-spin
                                rounded-full
                                border-2
                                border-current
                                border-t-transparent
                            "
                        />
                    ) : cliente.activo ? (
                        <>
                            <EyeOff
                                size={15}
                            />

                            Desactivar
                        </>
                    ) : (
                        <>
                            <Eye
                                size={15}
                            />

                            Activar
                        </>
                    )}
                </button>

            </div>
        </motion.article>
    )
}


function ModalCliente({
    abierto,
    cliente,
    onCerrar,
    onGuardado,
}) {
    const [
        formulario,
        setFormulario,
    ] = useState(
        formularioVacio(),
    )

    const [
        guardando,
        setGuardando,
    ] = useState(false)

    const [
        error,
        setError,
    ] = useState('')


    useEffect(() => {
        if (!abierto) {
            return
        }

        if (cliente) {
            setFormulario({
                nombre:
                    cliente.nombre ||
                    '',

                telefono:
                    cliente.telefono ||
                    '',

                correo:
                    cliente.correo ||
                    '',

                cuenta_activa:
                    Boolean(
                        cliente.cuenta_activa,
                    ),

                activo:
                    Boolean(
                        cliente.activo,
                    ),
            })
        } else {
            setFormulario(
                formularioVacio(),
            )
        }

        setError('')
    }, [
        abierto,
        cliente,
    ])


    function actualizarCampo(
        event,
    ) {
        const {
            name,
            value,
            type,
            checked,
        } =
            event.target

        setFormulario(
            (
                anterior,
            ) => ({
                ...anterior,

                [name]:
                    type ===
                    'checkbox'
                        ? checked
                        : value,
            }),
        )

        setError('')
    }


    async function guardar(
        event,
    ) {
        event.preventDefault()

        if (
            !formulario.nombre
                .trim()
        ) {
            setError(
                'Escribe el nombre del cliente.',
            )

            return
        }

        if (
            !formulario.telefono
                .trim() &&
            !formulario.correo
                .trim()
        ) {
            setError(
                'Proporciona teléfono o correo.',
            )

            return
        }

        try {
            setGuardando(true)
            setError('')

            const token =
                localStorage.getItem(
                    'token',
                )

            const payload = {
                nombre:
                    formulario.nombre
                        .trim(),

                telefono:
                    formulario.telefono
                        .trim(),

                correo:
                    formulario.correo
                        .trim(),

                cuenta_activa:
                    formulario.cuenta_activa,

                activo:
                    formulario.activo,
            }


            if (cliente) {
                await api.put(
                    `/admin/clientes/${cliente.id_cliente}`,
                    payload,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    },
                )
            } else {
                await api.post(
                    '/admin/clientes',
                    payload,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    },
                )
            }


            await onGuardado()

            onCerrar()
        } catch (error) {
            console.error(
                'Error al guardar cliente:',
                error,
            )

            setError(
                error.response
                    ?.data
                    ?.mensaje ||
                'No fue posible guardar el cliente.',
            )
        } finally {
            setGuardando(false)
        }
    }


    return (
        <AnimatePresence>
            {abierto && (
                <>
                    <motion.button
                        type="button"
                        onClick={
                            onCerrar
                        }
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        className="
                            fixed
                            inset-0
                            z-50
                            bg-stone-900/30
                            backdrop-blur-[2px]
                        "
                    />


                    <motion.div
                        initial={{
                            y: '100%',
                        }}
                        animate={{
                            y: 0,
                        }}
                        exit={{
                            y: '100%',
                        }}
                        className="
                            fixed
                            bottom-0
                            left-0
                            right-0
                            z-[60]
                            max-h-[94vh]
                            overflow-y-auto
                            rounded-t-[30px]
                            bg-white
                            shadow-2xl
                            sm:bottom-auto
                            sm:left-1/2
                            sm:right-auto
                            sm:top-1/2
                            sm:w-[92%]
                            sm:max-w-lg
                            sm:-translate-x-1/2
                            sm:-translate-y-1/2
                            sm:rounded-[30px]
                        "
                    >
                        <form
                            onSubmit={
                                guardar
                            }
                        >
                            <div
                                className="
                                    sticky
                                    top-0
                                    z-10
                                    flex
                                    items-center
                                    justify-between
                                    border-b
                                    border-pink-100
                                    bg-white/95
                                    px-5
                                    py-4
                                    backdrop-blur-xl
                                "
                            >
                                <div>
                                    <p
                                        className="
                                            text-xs
                                            font-semibold
                                            text-pink-400
                                        "
                                    >
                                        {cliente
                                            ? 'Editar'
                                            : 'Nuevo'}
                                    </p>

                                    <h2
                                        className="
                                            mt-1
                                            text-lg
                                            font-semibold
                                            text-stone-800
                                        "
                                    >
                                        {cliente
                                            ? 'Editar cliente'
                                            : 'Nuevo cliente'}
                                    </h2>
                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        onCerrar
                                    }
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-pink-50
                                        text-pink-500
                                    "
                                >
                                    <X
                                        size={18}
                                    />
                                </button>
                            </div>


                            <div
                                className="
                                    space-y-4
                                    p-5
                                "
                            >
                                {error && (
                                    <div
                                        className="
                                            rounded-2xl
                                            border
                                            border-rose-100
                                            bg-rose-50
                                            px-4
                                            py-3
                                            text-xs
                                            font-medium
                                            text-rose-600
                                        "
                                    >
                                        {error}
                                    </div>
                                )}


                                <Campo
                                    label="Nombre"
                                    name="nombre"
                                    value={
                                        formulario.nombre
                                    }
                                    onChange={
                                        actualizarCampo
                                    }
                                    placeholder="Nombre completo"
                                />


                                <Campo
                                    label="Teléfono"
                                    name="telefono"
                                    type="tel"
                                    value={
                                        formulario.telefono
                                    }
                                    onChange={
                                        actualizarCampo
                                    }
                                    placeholder="771 000 0000"
                                />


                                <Campo
                                    label="Correo"
                                    name="correo"
                                    type="email"
                                    value={
                                        formulario.correo
                                    }
                                    onChange={
                                        actualizarCampo
                                    }
                                    placeholder="correo@ejemplo.com"
                                />


                                <label
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                        rounded-2xl
                                        border
                                        border-pink-100
                                        bg-pink-50/40
                                        p-4
                                    "
                                >
                                    <div>
                                        <p
                                            className="
                                                text-sm
                                                font-semibold
                                                text-stone-700
                                            "
                                        >
                                            Cliente activo
                                        </p>
                                    </div>

                                    <input
                                        type="checkbox"
                                        name="activo"
                                        checked={
                                            formulario.activo
                                        }
                                        onChange={
                                            actualizarCampo
                                        }
                                        className="
                                            h-5
                                            w-5
                                            accent-pink-400
                                        "
                                    />
                                </label>

                            </div>


                            <div
                                className="
                                    sticky
                                    bottom-0
                                    flex
                                    gap-3
                                    border-t
                                    border-pink-100
                                    bg-white/95
                                    px-5
                                    py-4
                                "
                            >
                                <button
                                    type="button"
                                    onClick={
                                        onCerrar
                                    }
                                    className="
                                        min-h-12
                                        flex-1
                                        rounded-2xl
                                        border
                                        border-pink-100
                                        bg-white
                                        text-sm
                                        font-semibold
                                        text-stone-500
                                    "
                                >
                                    Cancelar
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        guardando
                                    }
                                    className="
                                        flex
                                        min-h-12
                                        flex-1
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-2xl
                                        bg-pink-400
                                        text-sm
                                        font-semibold
                                        text-white
                                        disabled:opacity-60
                                    "
                                >
                                    {guardando ? (
                                        'Guardando...'
                                    ) : (
                                        <>
                                            <Check
                                                size={17}
                                            />

                                            Guardar
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}


function HistorialCliente({
    abierto,
    cliente,
    onCerrar,
}) {
    const [
        citas,
        setCitas,
    ] = useState([])

    const [
        cargando,
        setCargando,
    ] = useState(false)

    const [
        error,
        setError,
    ] = useState('')


    useEffect(() => {
        if (
            abierto &&
            cliente
        ) {
            cargarHistorial()
        }
    }, [
        abierto,
        cliente,
    ])


    async function cargarHistorial() {
        try {
            setCargando(true)
            setError('')

            const token =
                localStorage.getItem(
                    'token',
                )

            const respuesta =
                await api.get(
                    `/admin/clientes/${cliente.id_cliente}/citas`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    },
                )

            setCitas(
                respuesta.data.citas ||
                [],
            )
        } catch (error) {
            console.error(
                'Error al cargar historial:',
                error,
            )

            setError(
                error.response
                    ?.data
                    ?.mensaje ||
                'No fue posible cargar el historial.',
            )
        } finally {
            setCargando(false)
        }
    }


    return (
        <AnimatePresence>
            {abierto &&
                cliente && (
                    <>
                        <motion.button
                            type="button"
                            onClick={
                                onCerrar
                            }
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            className="
                                fixed
                                inset-0
                                z-50
                                bg-stone-900/30
                                backdrop-blur-[2px]
                            "
                        />


                        <motion.div
                            initial={{
                                y: '100%',
                            }}
                            animate={{
                                y: 0,
                            }}
                            exit={{
                                y: '100%',
                            }}
                            className="
                                fixed
                                bottom-0
                                left-0
                                right-0
                                z-[60]
                                max-h-[94vh]
                                overflow-y-auto
                                rounded-t-[30px]
                                bg-white
                                shadow-2xl
                                sm:bottom-auto
                                sm:left-1/2
                                sm:right-auto
                                sm:top-1/2
                                sm:w-[92%]
                                sm:max-w-2xl
                                sm:-translate-x-1/2
                                sm:-translate-y-1/2
                                sm:rounded-[30px]
                            "
                        >
                            <div
                                className="
                                    sticky
                                    top-0
                                    z-10
                                    flex
                                    items-center
                                    justify-between
                                    border-b
                                    border-pink-100
                                    bg-white/95
                                    px-5
                                    py-4
                                "
                            >
                                <div>
                                    <p
                                        className="
                                            text-xs
                                            font-semibold
                                            text-pink-400
                                        "
                                    >
                                        Historial
                                    </p>

                                    <h2
                                        className="
                                            mt-1
                                            text-lg
                                            font-semibold
                                            text-stone-800
                                        "
                                    >
                                        {
                                            cliente.nombre
                                        }
                                    </h2>
                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        onCerrar
                                    }
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-pink-50
                                        text-pink-500
                                    "
                                >
                                    <X
                                        size={18}
                                    />
                                </button>
                            </div>


                            <div className="p-5">

                                {cargando ? (
                                    <Cargando />
                                ) : error ? (
                                    <div
                                        className="
                                            rounded-2xl
                                            bg-rose-50
                                            p-4
                                            text-xs
                                            text-rose-600
                                        "
                                    >
                                        {error}
                                    </div>
                                ) : citas.length ===
                                  0 ? (
                                    <div
                                        className="
                                            rounded-2xl
                                            border
                                            border-dashed
                                            border-pink-200
                                            py-10
                                            text-center
                                        "
                                    >
                                        <CalendarDays
                                            size={28}
                                            className="
                                                mx-auto
                                                text-pink-300
                                            "
                                        />

                                        <p
                                            className="
                                                mt-3
                                                text-sm
                                                font-semibold
                                                text-stone-600
                                            "
                                        >
                                            Sin citas
                                        </p>
                                    </div>
                                ) : (
                                    <div
                                        className="
                                            space-y-3
                                        "
                                    >
                                        {citas.map(
                                            (
                                                cita,
                                            ) => (
                                                <div
                                                    key={
                                                        cita.id_cita
                                                    }
                                                    className="
                                                        rounded-2xl
                                                        border
                                                        border-pink-100
                                                        bg-pink-50/30
                                                        p-4
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            flex
                                                            items-start
                                                            justify-between
                                                            gap-3
                                                        "
                                                    >
                                                        <div>
                                                            <p
                                                                className="
                                                                    text-sm
                                                                    font-semibold
                                                                    text-stone-700
                                                                "
                                                            >
                                                                {
                                                                    formatearFechaCorta(
                                                                        cita.fecha,
                                                                    )
                                                                }
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    flex
                                                                    items-center
                                                                    gap-1
                                                                    text-xs
                                                                    text-stone-400
                                                                "
                                                            >
                                                                <Clock3
                                                                    size={12}
                                                                />

                                                                {
                                                                    formatearHora(
                                                                        cita.hora_inicio,
                                                                    )
                                                                }
                                                            </p>
                                                        </div>


                                                        <EstadoCita
                                                            estado={
                                                                cita.estado
                                                            }
                                                        />
                                                    </div>


                                                    <p
                                                        className="
                                                            mt-3
                                                            text-xs
                                                            text-stone-500
                                                        "
                                                    >
                                                        {
                                                            cita.servicios
                                                                ?.map(
                                                                    (
                                                                        servicio,
                                                                    ) =>
                                                                        servicio.nombre,
                                                                )
                                                                .join(
                                                                    ' + ',
                                                                ) ||
                                                            'Sin servicios'
                                                        }
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-2
                                                            text-sm
                                                            font-semibold
                                                            text-pink-500
                                                        "
                                                    >
                                                        {
                                                            formatearMoneda(
                                                                cita.total_estimado,
                                                            )
                                                        }
                                                    </p>

                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}

                            </div>
                        </motion.div>
                    </>
                )}
        </AnimatePresence>
    )
}


function EstadoCita({
    estado,
}) {
    const mapa = {
        PENDIENTE:
            'bg-amber-50 text-amber-600',

        CONFIRMADA:
            'bg-emerald-50 text-emerald-600',

        REPROGRAMACION_PENDIENTE:
            'bg-violet-50 text-violet-600',

        RECHAZADA:
            'bg-rose-50 text-rose-600',

        CANCELADA_CLIENTE:
            'bg-stone-100 text-stone-500',

        CANCELADA_ADMIN:
            'bg-stone-100 text-stone-500',

        FINALIZADA:
            'bg-blue-50 text-blue-600',

        NO_ASISTIO:
            'bg-red-50 text-red-500',
    }

    return (
        <span
            className={`
                rounded-full
                px-2.5
                py-1
                text-[10px]
                font-semibold
                ${
                    mapa[estado] ||
                    'bg-stone-100 text-stone-500'
                }
            `}
        >
            {String(
                estado ||
                '',
            )
                .replaceAll(
                    '_',
                    ' ',
                )}
        </span>
    )
}


function Campo({
    label,
    ...props
}) {
    return (
        <div>
            <label
                className="
                    mb-2
                    block
                    text-xs
                    font-semibold
                    text-stone-500
                "
            >
                {label}
            </label>

            <input
                {...props}
                className="
                    min-h-12
                    w-full
                    rounded-2xl
                    border
                    border-pink-100
                    bg-pink-50/40
                    px-4
                    text-sm
                    text-stone-700
                    outline-none
                    placeholder:text-stone-300
                    focus:border-pink-300
                    focus:bg-white
                    focus:ring-4
                    focus:ring-pink-100/60
                "
            />
        </div>
    )
}


function TarjetaResumen({
    titulo,
    valor,
    className = '',
}) {
    return (
        <div
            className={`
                rounded-[20px]
                border
                border-pink-50
                p-4
                shadow-sm
                ${className}
            `}
        >
            <p
                className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-stone-400
                "
            >
                {titulo}
            </p>

            <p
                className="
                    mt-1
                    text-xl
                    font-semibold
                    text-stone-800
                "
            >
                {valor}
            </p>
        </div>
    )
}


function Cargando() {
    return (
        <div
            className="
                rounded-[26px]
                border
                border-pink-100
                bg-white
                py-14
                text-center
                shadow-sm
            "
        >
            <div
                className="
                    mx-auto
                    h-9
                    w-9
                    animate-spin
                    rounded-full
                    border-4
                    border-pink-100
                    border-t-pink-400
                "
            />

            <p
                className="
                    mt-4
                    text-xs
                    font-medium
                    text-pink-400
                "
            >
                Cargando clientes...
            </p>
        </div>
    )
}


function EstadoVacio({
    onNuevo,
}) {
    return (
        <div
            className="
                rounded-[26px]
                border
                border-dashed
                border-pink-200
                bg-pink-50/40
                px-6
                py-14
                text-center
            "
        >
            <UserRound
                size={30}
                className="
                    mx-auto
                    text-pink-300
                "
            />

            <h2
                className="
                    mt-4
                    text-base
                    font-semibold
                    text-stone-700
                "
            >
                No hay clientes
            </h2>

            <button
                type="button"
                onClick={
                    onNuevo
                }
                className="
                    mt-5
                    inline-flex
                    min-h-11
                    items-center
                    gap-2
                    rounded-2xl
                    bg-pink-400
                    px-5
                    text-xs
                    font-semibold
                    text-white
                "
            >
                <Plus
                    size={16}
                />

                Nuevo cliente
            </button>
        </div>
    )
}


function formularioVacio() {
    return {
        nombre: '',
        telefono: '',
        correo: '',
        cuenta_activa: false,
        activo: true,
    }
}


function formatearFechaCorta(
    fecha,
) {
    if (!fecha) {
        return ''
    }

    const [
        anio,
        mes,
        dia,
    ] =
        String(fecha)
            .substring(
                0,
                10,
            )
            .split('-')

    const fechaLocal =
        new Date(
            Number(anio),
            Number(mes) - 1,
            Number(dia),
        )

    return fechaLocal
        .toLocaleDateString(
            'es-MX',
            {
                day:
                    'numeric',

                month:
                    'short',

                year:
                    'numeric',
            },
        )
}


function formatearHora(
    hora,
) {
    if (!hora) {
        return ''
    }

    const [
        horaTexto,
        minutoTexto,
    ] =
        String(hora)
            .substring(
                0,
                5,
            )
            .split(':')

    const horas =
        Number(
            horaTexto,
        )

    const periodo =
        horas >= 12
            ? 'PM'
            : 'AM'

    const hora12 =
        horas % 12 ||
        12

    return `${hora12}:${minutoTexto} ${periodo}`
}


function formatearMoneda(
    cantidad,
) {
    return Number(
        cantidad || 0,
    ).toLocaleString(
        'es-MX',
        {
            style:
                'currency',

            currency:
                'MXN',
        },
    )
}


export default Clientes