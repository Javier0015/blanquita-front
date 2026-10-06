import {
    Check,
    Clock3,
    DollarSign,
    Edit3,
    Eye,
    EyeOff,
    Image as ImageIcon,
    Plus,
    RefreshCw,
    Scissors,
    Sparkles,
    Tag,
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


function ServiciosAdmin() {
    const [
        servicios,
        setServicios,
    ] = useState([])

    const [
        categorias,
        setCategorias,
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
        modalAbierto,
        setModalAbierto,
    ] = useState(false)

    const [
        servicioEditando,
        setServicioEditando,
    ] = useState(null)

    const [
        procesandoEstado,
        setProcesandoEstado,
    ] = useState(null)

    const [
        guardando,
        setGuardando,
    ] = useState(false)

    const [
        filtro,
        setFiltro,
    ] = useState('TODOS')

    const [
        busqueda,
        setBusqueda,
    ] = useState('')


    useEffect(() => {
        cargarDatos()
    }, [])


    async function cargarDatos() {
        try {
            setCargando(true)
            setError('')

            const token =
                localStorage.getItem(
                    'token',
                )

            const [
                respuestaServicios,
                respuestaCategorias,
            ] =
                await Promise.all([
                    api.get(
                        '/admin/servicios',
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        },
                    ),

                    api.get(
                        '/admin/servicios/categorias',
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        },
                    ),
                ])

            setServicios(
                respuestaServicios
                    .data
                    .servicios ||
                [],
            )

            setCategorias(
                respuestaCategorias
                    .data
                    .categorias ||
                [],
            )
        } catch (error) {
            console.error(
                'Error al cargar servicios:',
                error,
            )

            setError(
                error.response
                    ?.data
                    ?.mensaje ||
                'No fue posible cargar los servicios.',
            )
        } finally {
            setCargando(false)
        }
    }


    function abrirNuevoServicio() {
        setServicioEditando(
            null,
        )

        setModalAbierto(
            true,
        )
    }


    function abrirEditarServicio(
        servicio,
    ) {
        setServicioEditando(
            servicio,
        )

        setModalAbierto(
            true,
        )
    }


    function cerrarModal() {
        if (guardando) {
            return
        }

        setModalAbierto(
            false,
        )

        setServicioEditando(
            null,
        )
    }


    async function cambiarEstado(
        servicio,
    ) {
        try {
            setProcesandoEstado(
                servicio.id_servicio,
            )

            setError('')

            const token =
                localStorage.getItem(
                    'token',
                )

            const nuevoEstado =
                !servicio.activo

            await api.patch(
                `/admin/servicios/${servicio.id_servicio}/estado`,
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

            setServicios(
                (
                    anteriores,
                ) =>
                    anteriores.map(
                        (
                            item,
                        ) =>
                            item.id_servicio ===
                            servicio.id_servicio
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
                'No fue posible cambiar el estado del servicio.',
            )
        } finally {
            setProcesandoEstado(
                null,
            )
        }
    }


    async function guardarServicio(
        datos,
    ) {
        try {
            setGuardando(true)
            setError('')

            const token =
                localStorage.getItem(
                    'token',
                )

            if (
                servicioEditando
            ) {
                await api.put(
                    `/admin/servicios/${servicioEditando.id_servicio}`,
                    datos,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    },
                )
            } else {
                await api.post(
                    '/admin/servicios',
                    datos,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    },
                )
            }

            await cargarDatos()

            setModalAbierto(
                false,
            )

            setServicioEditando(
                null,
            )
        } catch (error) {
            console.error(
                'Error al guardar servicio:',
                error,
            )

            const mensaje =
                error.response
                    ?.data
                    ?.mensaje ||
                'No fue posible guardar el servicio.'

            throw new Error(
                mensaje,
            )
        } finally {
            setGuardando(false)
        }
    }


    const serviciosFiltrados =
        useMemo(
            () => {
                let resultado =
                    [...servicios]

                if (
                    filtro ===
                    'ACTIVOS'
                ) {
                    resultado =
                        resultado.filter(
                            (
                                servicio,
                            ) =>
                                servicio.activo,
                        )
                }

                if (
                    filtro ===
                    'INACTIVOS'
                ) {
                    resultado =
                        resultado.filter(
                            (
                                servicio,
                            ) =>
                                !servicio.activo,
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
                                servicio,
                            ) => {
                                const nombre =
                                    String(
                                        servicio.nombre ||
                                        '',
                                    )
                                        .toLowerCase()

                                const categoria =
                                    String(
                                        servicio.categoria ||
                                        '',
                                    )
                                        .toLowerCase()

                                const descripcion =
                                    String(
                                        servicio.descripcion ||
                                        '',
                                    )
                                        .toLowerCase()

                                return (
                                    nombre.includes(
                                        texto,
                                    ) ||
                                    categoria.includes(
                                        texto,
                                    ) ||
                                    descripcion.includes(
                                        texto,
                                    )
                                )
                            },
                        )
                }

                return resultado
            },
            [
                servicios,
                filtro,
                busqueda,
            ],
        )


    const resumen =
        useMemo(
            () => {
                const total =
                    servicios.length

                const activos =
                    servicios.filter(
                        (
                            servicio,
                        ) =>
                            servicio.activo,
                    ).length

                const inactivos =
                    total -
                    activos

                return {
                    total,
                    activos,
                    inactivos,
                }
            },
            [
                servicios,
            ],
        )


    return (
        <>
            <div
                className="
                    space-y-5
                "
            >
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

                    <div
                        className="
                            relative
                        "
                    >
                       

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
                                    Servicios
                                </h1>

                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        leading-6
                                        text-stone-500
                                    "
                                >
                                    Administra los servicios disponibles para reservación.
                                </p>
                            </div>

                            <motion.button
                                type="button"
                                whileTap={{
                                    scale: 0.97,
                                }}
                                onClick={
                                    abrirNuevoServicio
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

                                Nuevo servicio
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
                        titulo="Inactivos"
                        valor={
                            resumen.inactivos
                        }
                        className="bg-stone-50"
                    />
                </section>


                {/* BUSCADOR / FILTROS */}
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
                                flex-1
                            "
                        >
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
                                placeholder="Buscar servicio..."
                                className="
                                    min-h-11
                                    w-full
                                    rounded-2xl
                                    border
                                    border-pink-100
                                    bg-pink-50/40
                                    px-4
                                    text-sm
                                    text-stone-700
                                    outline-none
                                    transition
                                    placeholder:text-stone-300
                                    focus:border-pink-300
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-pink-100/60
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
                                    cargarDatos
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
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: -5,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
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
                    </motion.div>
                )}


                {/* CONTENIDO */}
                {cargando ? (
                    <Cargando />
                ) : serviciosFiltrados.length ===
                  0 ? (
                    <EstadoVacio
                        onNuevo={
                            abrirNuevoServicio
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
                        {serviciosFiltrados.map(
                            (
                                servicio,
                                index,
                            ) => (
                                <ServicioCard
                                    key={
                                        servicio.id_servicio
                                    }
                                    servicio={
                                        servicio
                                    }
                                    index={
                                        index
                                    }
                                    procesandoEstado={
                                        procesandoEstado ===
                                        servicio.id_servicio
                                    }
                                    onEditar={() =>
                                        abrirEditarServicio(
                                            servicio,
                                        )
                                    }
                                    onCambiarEstado={() =>
                                        cambiarEstado(
                                            servicio,
                                        )
                                    }
                                />
                            ),
                        )}
                    </section>
                )}

            </div>


            <ModalServicio
                abierto={
                    modalAbierto
                }
                servicio={
                    servicioEditando
                }
                categorias={
                    categorias
                }
                guardando={
                    guardando
                }
                onCerrar={
                    cerrarModal
                }
                onGuardar={
                    guardarServicio
                }
            />
        </>
    )
}


function ServicioCard({
    servicio,
    index,
    procesandoEstado,
    onEditar,
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
                overflow-hidden
                rounded-[26px]
                border
                border-pink-100
                bg-white
                shadow-sm
            "
        >
            {/* IMAGEN */}
            <div
                className="
                    relative
                    flex
                    h-36
                    items-center
                    justify-center
                    overflow-hidden
                    bg-gradient-to-br
                    from-pink-50
                    to-rose-50
                "
            >
                {servicio.imagen ? (
                    <img
                        src={
                            servicio.imagen
                        }
                        alt={
                            servicio.nombre
                        }
                        className="
                            h-full
                            w-full
                            object-cover
                        "
                        onError={(
                            event,
                        ) => {
                            event.currentTarget.style.display =
                                'none'
                        }}
                    />
                ) : (
                    <Scissors
                        size={34}
                        className="
                            text-pink-300
                        "
                    />
                )}


                <div
                    className={`
                        absolute
                        right-3
                        top-3
                        rounded-full
                        px-3
                        py-1
                        text-[10px]
                        font-semibold

                        ${
                            servicio.activo
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
                    {servicio.activo
                        ? 'Activo'
                        : 'Inactivo'}
                </div>
            </div>


            <div
                className="
                    p-5
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
                    <div
                        className="
                            min-w-0
                            flex-1
                        "
                    >
                        <p
                            className="
                                truncate
                                text-base
                                font-semibold
                                text-stone-800
                            "
                        >
                            {
                                servicio.nombre
                            }
                        </p>

                        <div
                            className="
                                mt-1
                                flex
                                items-center
                                gap-1
                                text-xs
                                text-pink-400
                            "
                        >
                            <Tag
                                size={12}
                            />

                            {
                                servicio.categoria ||
                                'Sin categoría'
                            }
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
                            transition
                            hover:bg-pink-100
                        "
                    >
                        <Edit3
                            size={16}
                        />
                    </button>
                </div>


                {servicio.descripcion && (
                    <p
                        className="
                            mt-3
                            line-clamp-2
                            text-xs
                            leading-5
                            text-stone-400
                        "
                    >
                        {
                            servicio.descripcion
                        }
                    </p>
                )}


                <div
                    className="
                        mt-4
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
                        <div
                            className="
                                flex
                                items-center
                                gap-1.5
                                text-[10px]
                                font-semibold
                                text-stone-400
                            "
                        >
                            <Clock3
                                size={12}
                            />

                            Duración
                        </div>

                        <p
                            className="
                                mt-1
                                text-sm
                                font-semibold
                                text-stone-700
                            "
                        >
                            {
                                servicio.duracion_minutos
                            } min
                        </p>
                    </div>


                    <div
                        className="
                            rounded-2xl
                            bg-emerald-50/60
                            p-3
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-1.5
                                text-[10px]
                                font-semibold
                                text-stone-400
                            "
                        >
                            <DollarSign
                                size={12}
                            />

                            Precio
                        </div>

                        <p
                            className="
                                mt-1
                                text-sm
                                font-semibold
                                text-stone-700
                            "
                        >
                            {
                                formatearMoneda(
                                    servicio.precio,
                                )
                            }
                        </p>
                    </div>
                </div>


                <button
                    type="button"
                    disabled={
                        procesandoEstado
                    }
                    onClick={
                        onCambiarEstado
                    }
                    className={`
                        mt-4
                        flex
                        min-h-11
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        text-xs
                        font-semibold
                        transition
                        disabled:opacity-50

                        ${
                            servicio.activo
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
                    ) : servicio.activo ? (
                        <>
                            <EyeOff
                                size={15}
                            />

                            Desactivar servicio
                        </>
                    ) : (
                        <>
                            <Eye
                                size={15}
                            />

                            Activar servicio
                        </>
                    )}
                </button>

            </div>
        </motion.article>
    )
}


function ModalServicio({
    abierto,
    servicio,
    categorias,
    guardando,
    onCerrar,
    onGuardar,
}) {
    const [
        formulario,
        setFormulario,
    ] = useState(
        obtenerFormularioVacio(),
    )

    const [
        error,
        setError,
    ] = useState('')


    useEffect(() => {
        if (!abierto) {
            return
        }

        if (servicio) {
            setFormulario({
                id_categoria:
                    servicio.id_categoria
                        ? String(
                            servicio.id_categoria,
                        )
                        : '',

                nombre:
                    servicio.nombre ||
                    '',

                descripcion:
                    servicio.descripcion ||
                    '',

                precio:
                    String(
                        servicio.precio ??
                        '',
                    ),

                duracion_minutos:
                    String(
                        servicio.duracion_minutos ??
                        '',
                    ),

                imagen:
                    servicio.imagen ||
                    '',

                activo:
                    Boolean(
                        servicio.activo,
                    ),
            })
        } else {
            setFormulario(
                obtenerFormularioVacio(),
            )
        }

        setError('')
    }, [
        abierto,
        servicio,
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


    async function enviarFormulario(
        event,
    ) {
        event.preventDefault()

        if (
            !formulario.nombre
                .trim()
        ) {
            setError(
                'Escribe el nombre del servicio.',
            )

            return
        }

        const precio =
            Number(
                formulario.precio,
            )

        if (
            Number.isNaN(
                precio,
            ) ||
            precio < 0
        ) {
            setError(
                'Escribe un precio válido.',
            )

            return
        }

        const duracion =
            Number(
                formulario.duracion_minutos,
            )

        if (
            !Number.isInteger(
                duracion,
            ) ||
            duracion <= 0
        ) {
            setError(
                'La duración debe ser mayor a cero.',
            )

            return
        }

        try {
            setError('')

            await onGuardar({
                id_categoria:
                    formulario.id_categoria
                        ? Number(
                            formulario.id_categoria,
                        )
                        : null,

                nombre:
                    formulario.nombre
                        .trim(),

                descripcion:
                    formulario.descripcion
                        .trim(),

                precio,

                duracion_minutos:
                    duracion,

                imagen:
                    formulario.imagen
                        .trim(),

                activo:
                    formulario.activo,
            })
        } catch (error) {
            setError(
                error.message ||
                'No fue posible guardar el servicio.',
            )
        }
    }


    return (
        <AnimatePresence>
            {abierto && (
                <>
                    <motion.button
                        type="button"
                        aria-label="Cerrar"
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        onClick={
                            onCerrar
                        }
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
                            opacity: 0,
                        }}
                        animate={{
                            y: 0,
                            opacity: 1,
                        }}
                        exit={{
                            y: '100%',
                            opacity: 0,
                        }}
                        transition={{
                            type: 'spring',
                            damping: 28,
                            stiffness: 260,
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
                            sm:max-w-xl
                            sm:-translate-x-1/2
                            sm:-translate-y-1/2
                            sm:rounded-[30px]
                        "
                    >
                        <form
                            onSubmit={
                                enviarFormulario
                            }
                        >
                            {/* HEADER */}
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
                                        {servicio
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
                                        {servicio
                                            ? 'Editar servicio'
                                            : 'Nuevo servicio'}
                                    </h2>
                                </div>


                                <button
                                    type="button"
                                    disabled={
                                        guardando
                                    }
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
                                        disabled:opacity-50
                                    "
                                >
                                    <X
                                        size={18}
                                    />
                                </button>
                            </div>


                            <div
                                className="
                                    space-y-5
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


                                <CampoFormulario
                                    label="Nombre"
                                    nombre="nombre"
                                    value={
                                        formulario.nombre
                                    }
                                    onChange={
                                        actualizarCampo
                                    }
                                    placeholder="Ej. Corte de cabello"
                                    required
                                />


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
                                        Categoría
                                    </label>

                                    <select
                                        name="id_categoria"
                                        value={
                                            formulario.id_categoria
                                        }
                                        onChange={
                                            actualizarCampo
                                        }
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
                                            focus:border-pink-300
                                            focus:bg-white
                                            focus:ring-4
                                            focus:ring-pink-100/60
                                        "
                                    >
                                        <option value="">
                                            Sin categoría
                                        </option>

                                        {categorias
                                            .filter(
                                                (
                                                    categoria,
                                                ) =>
                                                    categoria.activo,
                                            )
                                            .map(
                                                (
                                                    categoria,
                                                ) => (
                                                    <option
                                                        key={
                                                            categoria.id_categoria
                                                        }
                                                        value={
                                                            categoria.id_categoria
                                                        }
                                                    >
                                                        {
                                                            categoria.nombre
                                                        }
                                                    </option>
                                                ),
                                            )}
                                    </select>
                                </div>


                                <div
                                    className="
                                        grid
                                        grid-cols-2
                                        gap-3
                                    "
                                >
                                    <CampoFormulario
                                        label="Precio"
                                        nombre="precio"
                                        value={
                                            formulario.precio
                                        }
                                        onChange={
                                            actualizarCampo
                                        }
                                        placeholder="0.00"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                    />

                                    <CampoFormulario
                                        label="Duración"
                                        nombre="duracion_minutos"
                                        value={
                                            formulario.duracion_minutos
                                        }
                                        onChange={
                                            actualizarCampo
                                        }
                                        placeholder="60"
                                        type="number"
                                        min="1"
                                        step="1"
                                    />
                                </div>


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
                                        Descripción
                                    </label>

                                    <textarea
                                        name="descripcion"
                                        value={
                                            formulario.descripcion
                                        }
                                        onChange={
                                            actualizarCampo
                                        }
                                        rows={4}
                                        placeholder="Descripción del servicio..."
                                        className="
                                            w-full
                                            resize-none
                                            rounded-2xl
                                            border
                                            border-pink-100
                                            bg-pink-50/40
                                            px-4
                                            py-3
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
                                        Imagen
                                    </label>

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            rounded-2xl
                                            border
                                            border-pink-100
                                            bg-pink-50/40
                                            px-4
                                        "
                                    >
                                        <ImageIcon
                                            size={17}
                                            className="
                                                shrink-0
                                                text-pink-400
                                            "
                                        />

                                        <input
                                            type="text"
                                            name="imagen"
                                            value={
                                                formulario.imagen
                                            }
                                            onChange={
                                                actualizarCampo
                                            }
                                            placeholder="https://..."
                                            className="
                                                min-h-12
                                                w-full
                                                bg-transparent
                                                text-sm
                                                text-stone-700
                                                outline-none
                                                placeholder:text-stone-300
                                            "
                                        />
                                    </div>
                                </div>


                                {formulario.imagen && (
                                    <div
                                        className="
                                            overflow-hidden
                                            rounded-2xl
                                            bg-pink-50
                                        "
                                    >
                                        <img
                                            src={
                                                formulario.imagen
                                            }
                                            alt="Vista previa"
                                            className="
                                                h-40
                                                w-full
                                                object-cover
                                            "
                                        />
                                    </div>
                                )}


                                <label
                                    className="
                                        flex
                                        cursor-pointer
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
                                            Servicio activo
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                text-stone-400
                                            "
                                        >
                                            Aparecerá disponible para reservar.
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


                            {/* FOOTER */}
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
                                    backdrop-blur-xl
                                "
                            >
                                <button
                                    type="button"
                                    disabled={
                                        guardando
                                    }
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
                                        disabled:opacity-50
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
                                        bg-gradient-to-r
                                        from-pink-400
                                        to-rose-400
                                        text-sm
                                        font-semibold
                                        text-white
                                        shadow-lg
                                        shadow-pink-200/60
                                        disabled:opacity-60
                                    "
                                >
                                    {guardando ? (
                                        <>
                                            <span
                                                className="
                                                    h-4
                                                    w-4
                                                    animate-spin
                                                    rounded-full
                                                    border-2
                                                    border-white/40
                                                    border-t-white
                                                "
                                            />

                                            Guardando...
                                        </>
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


function CampoFormulario({
    label,
    nombre,
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
                name={
                    nombre
                }
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
                py-16
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
                Cargando servicios...
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
            <div
                className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-pink-100
                    text-pink-400
                "
            >
                <Scissors
                    size={25}
                />
            </div>

            <h2
                className="
                    mt-4
                    text-base
                    font-semibold
                    text-stone-700
                "
            >
                No hay servicios
            </h2>

            <p
                className="
                    mx-auto
                    mt-2
                    max-w-sm
                    text-xs
                    leading-5
                    text-stone-400
                "
            >
                Agrega el primer servicio para comenzar a recibir reservaciones.
            </p>

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
                    justify-center
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

                Nuevo servicio
            </button>
        </div>
    )
}


function obtenerFormularioVacio() {
    return {
        id_categoria: '',
        nombre: '',
        descripcion: '',
        precio: '',
        duracion_minutos: '60',
        imagen: '',
        activo: true,
    }
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

            minimumFractionDigits:
                2,
        },
    )
}


export default ServiciosAdmin