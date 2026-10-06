import {
    ArrowRight,
    Clock3,
    Image as ImageIcon,
    Scissors,
    Sparkles,
    Tag,
} from 'lucide-react'

import {
    motion,
} from 'motion/react'

import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import {
    Link,
} from 'react-router-dom'

import api from '../../services/api.js'


function Servicios() {
    const [
        servicios,
        setServicios,
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
        categoriaSeleccionada,
        setCategoriaSeleccionada,
    ] = useState('TODAS')


    useEffect(() => {
        cargarServicios()
    }, [])


    async function cargarServicios() {
        try {
            setCargando(true)
            setError('')

            const respuesta =
                await api.get(
                    '/servicios',
                )

            setServicios(
                respuesta.data.servicios ||
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


    const categorias =
        useMemo(
            () => {
                const mapa =
                    new Map()

                servicios.forEach(
                    (
                        servicio,
                    ) => {
                        if (
                            servicio.id_categoria &&
                            servicio.categoria
                        ) {
                            mapa.set(
                                servicio.id_categoria,
                                servicio.categoria,
                            )
                        }
                    },
                )

                return Array.from(
                    mapa.entries(),
                ).map(
                    ([
                        id_categoria,
                        nombre,
                    ]) => ({
                        id_categoria,
                        nombre,
                    }),
                )
            },
            [
                servicios,
            ],
        )


    const serviciosFiltrados =
        useMemo(
            () => {
                if (
                    categoriaSeleccionada ===
                    'TODAS'
                ) {
                    return servicios
                }

                return servicios.filter(
                    (
                        servicio,
                    ) =>
                        String(
                            servicio.id_categoria,
                        ) ===
                        String(
                            categoriaSeleccionada,
                        ),
                )
            },
            [
                servicios,
                categoriaSeleccionada,
            ],
        )


    return (
        <div className="space-y-6">

            {/* ENCABEZADO */}
            <motion.section
                initial={{
                    opacity: 0,
                    y: -10,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                className="
                    relative
                    overflow-hidden
                    rounded-[30px]
                    border
                    border-pink-100
                    bg-gradient-to-br
                    from-white
                    via-pink-50
                    to-rose-50
                    p-6
                    shadow-sm
                    sm:p-8
                "
            >
                <div
                    className="
                        absolute
                        -right-20
                        -top-20
                        h-52
                        w-52
                        rounded-full
                        bg-pink-200/40
                        blur-3xl
                    "
                />

                <div className="relative">

                

                    <h1
                        className="
                            mt-2
                            text-2xl
                            font-semibold
                            tracking-tight
                            text-stone-800
                            sm:text-3xl
                        "
                    >
                        Nuestros servicios
                    </h1>


                    <p
                        className="
                            mt-2
                            max-w-xl
                            text-sm
                            leading-6
                            text-stone-500
                        "
                    >
                        Explora nuestros servicios,
                        conoce su duración y precio,
                        y reserva el horario que mejor
                        se adapte a ti.
                    </p>

                </div>
            </motion.section>


            {/* FILTROS */}
            {!cargando &&
                servicios.length >
                    0 && (
                    <section
                        className="
                            overflow-x-auto
                            pb-1
                        "
                    >
                        <div
                            className="
                                flex
                                min-w-max
                                gap-2
                            "
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setCategoriaSeleccionada(
                                        'TODAS',
                                    )
                                }
                                className={`
                                    rounded-2xl
                                    px-4
                                    py-2.5
                                    text-xs
                                    font-semibold
                                    transition

                                    ${
                                        categoriaSeleccionada ===
                                        'TODAS'
                                            ? `
                                                bg-pink-400
                                                text-white
                                                shadow-md
                                                shadow-pink-200
                                            `
                                            : `
                                                border
                                                border-pink-100
                                                bg-white
                                                text-stone-500
                                            `
                                    }
                                `}
                            >
                                Todos
                            </button>


                            {categorias.map(
                                (
                                    categoria,
                                ) => (
                                    <button
                                        key={
                                            categoria.id_categoria
                                        }
                                        type="button"
                                        onClick={() =>
                                            setCategoriaSeleccionada(
                                                categoria.id_categoria,
                                            )
                                        }
                                        className={`
                                            rounded-2xl
                                            px-4
                                            py-2.5
                                            text-xs
                                            font-semibold
                                            transition

                                            ${
                                                String(
                                                    categoriaSeleccionada,
                                                ) ===
                                                String(
                                                    categoria.id_categoria,
                                                )
                                                    ? `
                                                        bg-pink-400
                                                        text-white
                                                        shadow-md
                                                        shadow-pink-200
                                                    `
                                                    : `
                                                        border
                                                        border-pink-100
                                                        bg-white
                                                        text-stone-500
                                                    `
                                            }
                                        `}
                                    >
                                        {
                                            categoria.nombre
                                        }
                                    </button>
                                ),
                            )}
                        </div>
                    </section>
                )}


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
                <EstadoVacio />
            ) : (
                <section
                    className="
                        grid
                        gap-5
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
                            />
                        ),
                    )}
                </section>
            )}


         

        </div>
    )
}


function ServicioCard({
    servicio,
    index,
}) {
    const [
        imagenError,
        setImagenError,
    ] = useState(false)


    return (
        <motion.article
            initial={{
                opacity: 0,
                y: 18,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.35,
                delay:
                    Math.min(
                        index * 0.05,
                        0.3,
                    ),
            }}
            whileHover={{
                y: -3,
            }}
            className="
                overflow-hidden
                rounded-[28px]
                border
                border-pink-100
                bg-white
                shadow-sm
                transition
            "
        >
            {/* IMAGEN */}
            <div
                className="
                    relative
                    flex
                    h-48
                    items-center
                    justify-center
                    overflow-hidden
                    bg-gradient-to-br
                    from-pink-50
                    via-rose-50
                    to-white
                "
            >
                {servicio.imagen &&
                !imagenError ? (
                    <img
                        src={
                            servicio.imagen
                        }
                        alt={
                            servicio.nombre
                        }
                        onError={() =>
                            setImagenError(
                                true,
                            )
                        }
                        className="
                            h-full
                            w-full
                            object-cover
                        "
                    />
                ) : (
                    <div
                        className="
                            text-center
                        "
                    >
                        <div
                            className="
                                mx-auto
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                rounded-[22px]
                                bg-pink-100
                                text-pink-400
                            "
                        >
                            <Scissors
                                size={28}
                            />
                        </div>

                        <p
                            className="
                                mt-3
                                text-[10px]
                                font-medium
                                text-pink-300
                            "
                        >
                            Servicio
                        </p>
                    </div>
                )}


                {servicio.categoria && (
                    <div
                        className="
                            absolute
                            left-3
                            top-3
                            flex
                            items-center
                            gap-1
                            rounded-full
                            bg-white/90
                            px-3
                            py-1.5
                            text-[10px]
                            font-semibold
                            text-pink-500
                            shadow-sm
                            backdrop-blur
                        "
                    >
                        <Tag
                            size={11}
                        />

                        {
                            servicio.categoria
                        }
                    </div>
                )}
            </div>


            {/* INFORMACIÓN */}
            <div className="p-5">

                <h2
                    className="
                        text-lg
                        font-semibold
                        text-stone-800
                    "
                >
                    {
                        servicio.nombre
                    }
                </h2>


                {servicio.descripcion && (
                    <p
                        className="
                            mt-2
                            line-clamp-3
                            min-h-[60px]
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
                        mt-5
                        flex
                        items-end
                        justify-between
                        gap-4
                    "
                >
                    <div>
                        <div
                            className="
                                flex
                                items-center
                                gap-1.5
                                text-xs
                                text-stone-400
                            "
                        >
                            <Clock3
                                size={14}
                            />

                            {
                                servicio.duracion_minutos
                            } minutos
                        </div>

                        <p
                            className="
                                mt-2
                                text-xl
                                font-semibold
                                text-pink-500
                            "
                        >
                            {
                                formatearMoneda(
                                    servicio.precio,
                                )
                            }
                        </p>
                    </div>


                    <Link
                        to="/reservar"
                        className="
                            flex
                            h-11
                            items-center
                            justify-center
                            gap-2
                            rounded-2xl
                            bg-pink-50
                            px-4
                            text-xs
                            font-semibold
                            text-pink-600
                            transition
                            hover:bg-pink-100
                        "
                    >
                        Reservar

                        <ArrowRight
                            size={14}
                        />
                    </Link>
                </div>

            </div>
        </motion.article>
    )
}


function Cargando() {
    return (
        <div
            className="
                rounded-[28px]
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


function EstadoVacio() {
    return (
        <div
            className="
                rounded-[28px]
                border
                border-dashed
                border-pink-200
                bg-pink-50/50
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
                <ImageIcon
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
                No hay servicios disponibles
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
                Por el momento no hay servicios
                activos disponibles para reservar.
            </p>
        </div>
    )
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


export default Servicios