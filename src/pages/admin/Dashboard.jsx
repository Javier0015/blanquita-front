import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    DollarSign,
    RefreshCw,
    Sparkles,
    UserRound,
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
    useNavigate,
} from 'react-router-dom'

import api from '../../services/api.js'

import CitaDetalleSheet
    from '../../components/CitaDetalleSheet.jsx'


function Dashboard() {
    const navigate =
        useNavigate()

    const [
        dashboard,
        setDashboard,
    ] = useState(null)

    const [
        cargando,
        setCargando,
    ] = useState(true)

    const [
        error,
        setError,
    ] = useState('')

    const [
        idCitaSeleccionada,
        setIdCitaSeleccionada,
    ] = useState(null)


    useEffect(() => {
        cargarDashboard()
    }, [])


    async function cargarDashboard() {
        try {
            setCargando(true)
            setError('')

            const token =
                localStorage.getItem(
                    'token',
                )

            const respuesta =
                await api.get(
                    '/admin/dashboard',
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    },
                )

            setDashboard(
                respuesta.data,
            )
        } catch (error) {
            console.error(
                'Error al cargar dashboard:',
                error,
            )

            setDashboard(null)

            setError(
                error.response
                    ?.data
                    ?.mensaje ||
                'No fue posible cargar el dashboard.',
            )
        } finally {
            setCargando(false)
        }
    }


    const tarjetas =
        useMemo(
            () => [
                {
                    titulo:
                        'Citas de hoy',

                    valor:
                        dashboard
                            ?.resumen
                            ?.total ??
                        0,

                    icono:
                        CalendarDays,

                    fondo:
                        'bg-pink-50',

                    iconoFondo:
                        'bg-pink-100',

                    iconoColor:
                        'text-pink-500',
                },

                {
                    titulo:
                        'Confirmadas',

                    valor:
                        dashboard
                            ?.resumen
                            ?.confirmadas ??
                        0,

                    icono:
                        CheckCircle2,

                    fondo:
                        'bg-emerald-50',

                    iconoFondo:
                        'bg-emerald-100',

                    iconoColor:
                        'text-emerald-600',
                },

                {
                    titulo:
                        'Pendientes',

                    valor:
                        dashboard
                            ?.resumen
                            ?.pendientes ??
                        0,

                    icono:
                        Clock3,

                    fondo:
                        'bg-amber-50',

                    iconoFondo:
                        'bg-amber-100',

                    iconoColor:
                        'text-amber-600',
                },

                {
                    titulo:
                        'Estimado del día',

                    valor:
                        formatearMoneda(
                            dashboard
                                ?.resumen
                                ?.total_estimado ??
                            0,
                        ),

                    icono:
                        DollarSign,

                    fondo:
                        'bg-violet-50',

                    iconoFondo:
                        'bg-violet-100',

                    iconoColor:
                        'text-violet-600',
                },
            ],
            [
                dashboard,
            ],
        )


    const citas =
        dashboard?.citas ||
        []

    const proximaCita =
        dashboard?.proxima_cita ||
        null


    const nombreUsuario =
        obtenerNombreUsuario()


    if (cargando) {
        return (
            <div
                className="
                    flex
                    min-h-[60vh]
                    items-center
                    justify-center
                "
            >
                <div className="text-center">

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
                            text-sm
                            font-medium
                            text-pink-400
                        "
                    >
                        Cargando panel...
                    </p>

                </div>
            </div>
        )
    }


    return (
        <>
            <div className="space-y-5">

                {/* BIENVENIDA */}
                <motion.section
                    initial={{
                        opacity: 0,
                        y: -8,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.35,
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


                        <h1
                            className="
                                text-2xl
                                font-semibold
                                tracking-tight
                                text-stone-800
                                sm:text-3xl
                            "
                        >
                            {obtenerSaludo()}

                            {nombreUsuario && (
                                <>
                                    {', '}

                                    {
                                        nombreUsuario
                                    }
                                </>
                            )}
                        </h1>


                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-stone-500
                            "
                        >
                            Revisa tus citas y solicitudes del día.
                        </p>


                        <motion.button
                            type="button"
                            whileTap={{
                                scale: 0.97,
                            }}
                            onClick={() =>
                                navigate(
                                    '/admin/calendario',
                                )
                            }
                            className="
                                mt-5
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
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                shadow-lg
                                shadow-pink-200/60
                                sm:w-auto
                            "
                        >
                            <CalendarDays
                                size={18}
                            />

                            Ver calendario
                        </motion.button>

                    </div>
                </motion.section>


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
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-3
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    font-medium
                                    text-rose-600
                                "
                            >
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={
                                    cargarDashboard
                                }
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-white
                                    text-rose-500
                                "
                            >
                                <RefreshCw
                                    size={16}
                                />
                            </button>

                        </div>
                    </motion.div>
                )}


                {/* RESUMEN */}
                <section
                    className="
                        grid
                        grid-cols-2
                        gap-3
                        lg:grid-cols-4
                    "
                >
                    {tarjetas.map(
                        (
                            item,
                            index,
                        ) => {
                            const Icono =
                                item.icono

                            return (
                                <motion.article
                                    key={
                                        item.titulo
                                    }
                                    initial={{
                                        opacity: 0,
                                        y: 15,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        duration:
                                            0.35,

                                        delay:
                                            index *
                                            0.06,
                                    }}
                                    whileTap={{
                                        scale: 0.98,
                                    }}
                                    className={`
                                        rounded-[24px]
                                        border
                                        border-pink-50
                                        p-4
                                        shadow-sm
                                        sm:p-5
                                        ${item.fondo}
                                    `}
                                >
                                    <div
                                        className={`
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            ${item.iconoFondo}
                                            ${item.iconoColor}
                                        `}
                                    >
                                        <Icono
                                            size={
                                                19
                                            }
                                        />
                                    </div>

                                    <p
                                        className="
                                            mt-4
                                            text-xs
                                            font-medium
                                            text-stone-400
                                        "
                                    >
                                        {
                                            item.titulo
                                        }
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            truncate
                                            text-2xl
                                            font-semibold
                                            tracking-tight
                                            text-stone-800
                                        "
                                    >
                                        {
                                            item.valor
                                        }
                                    </p>

                                </motion.article>
                            )
                        },
                    )}
                </section>


                {/* PRÓXIMA CITA */}
                <motion.section
                    initial={{
                        opacity: 0,
                        y: 15,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.4,
                        delay: 0.15,
                    }}
                    className="
                        rounded-[26px]
                        border
                        border-pink-100
                        bg-gradient-to-br
                        from-pink-50
                        to-white
                        p-5
                        shadow-sm
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >
                        <div>

                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-pink-400
                                "
                            >
                                Próxima cita
                            </p>

                            <h2
                                className="
                                    mt-1
                                    text-lg
                                    font-semibold
                                    text-stone-800
                                "
                            >
                                {proximaCita
                                    ? formatearHora(
                                        proximaCita.hora_inicio,
                                    )
                                    : 'Sin cita próxima'}
                            </h2>

                        </div>


                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-2xl
                                bg-white
                                text-pink-500
                                shadow-sm
                            "
                        >
                            <CalendarDays
                                size={20}
                            />
                        </div>

                    </div>


                    {proximaCita ? (
                        <motion.button
                            type="button"
                            whileTap={{
                                scale: 0.99,
                            }}
                            onClick={() =>
                                setIdCitaSeleccionada(
                                    proximaCita.id_cita,
                                )
                            }
                            className="
                                mt-5
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-2xl
                                text-left
                                transition
                                active:bg-white/60
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
                                <p
                                    className="
                                        truncate
                                        text-sm
                                        font-semibold
                                        text-stone-800
                                    "
                                >
                                    {
                                        proximaCita
                                            .cliente
                                            ?.nombre
                                    }
                                </p>

                                <p
                                    className="
                                        mt-1
                                        truncate
                                        text-xs
                                        text-stone-400
                                    "
                                >
                                    {
                                        obtenerNombreServicios(
                                            proximaCita,
                                        )
                                    }
                                </p>
                            </div>


                            <EstadoCita
                                estado={
                                    proximaCita.estado
                                }
                            />

                        </motion.button>
                    ) : (
                        <div
                            className="
                                mt-5
                                rounded-2xl
                                border
                                border-dashed
                                border-pink-200
                                bg-white/60
                                px-4
                                py-6
                                text-center
                            "
                        >
                            <Clock3
                                size={24}
                                className="
                                    mx-auto
                                    text-pink-300
                                "
                            />

                            <p
                                className="
                                    mt-2
                                    text-xs
                                    text-stone-400
                                "
                            >
                                No tienes más citas programadas para hoy.
                            </p>
                        </div>
                    )}

                </motion.section>


                {/* CITAS DEL DÍA */}
                <motion.section
                    initial={{
                        opacity: 0,
                        y: 15,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.4,
                        delay: 0.22,
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
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            px-5
                            py-4
                        "
                    >
                        <div>

                            <h2
                                className="
                                    text-base
                                    font-semibold
                                    text-stone-800
                                "
                            >
                                Citas de hoy
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-stone-400
                                "
                            >
                                {
                                    dashboard?.fecha
                                        ? formatearFechaTexto(
                                            dashboard.fecha,
                                        )
                                        : 'Reservaciones programadas'
                                }
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    '/admin/calendario',
                                )
                            }
                            className="
                                flex
                                items-center
                                gap-1
                                text-xs
                                font-semibold
                                text-pink-500
                            "
                        >
                            Ver todas

                            <ArrowRight
                                size={14}
                            />
                        </button>

                    </div>


                    {citas.length === 0 ? (
                        <div
                            className="
                                px-5
                                pb-6
                            "
                        >
                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-dashed
                                    border-pink-200
                                    bg-pink-50/50
                                    px-5
                                    py-8
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
                                    Sin citas para hoy
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-stone-400
                                    "
                                >
                                    Las nuevas reservaciones aparecerán aquí.
                                </p>

                            </div>
                        </div>
                    ) : (
                        <div
                            className="
                                divide-y
                                divide-pink-50
                            "
                        >
                            {citas.map(
                                (
                                    cita,
                                ) => (
                                    <motion.button
                                        key={
                                            cita.id_cita
                                        }
                                        type="button"
                                        whileTap={{
                                            scale: 0.99,
                                        }}
                                        onClick={() =>
                                            setIdCitaSeleccionada(
                                                cita.id_cita,
                                            )
                                        }
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            gap-3
                                            px-5
                                            py-4
                                            text-left
                                            transition
                                            hover:bg-pink-50/40
                                            active:bg-pink-50
                                        "
                                    >
                                        <div
                                            className="
                                                w-16
                                                shrink-0
                                            "
                                        >
                                            <p
                                                className="
                                                    text-xs
                                                    font-semibold
                                                    text-stone-600
                                                "
                                            >
                                                {
                                                    formatearHora(
                                                        cita.hora_inicio,
                                                    )
                                                }
                                            </p>
                                        </div>


                                        <div
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-pink-50
                                                text-pink-400
                                            "
                                        >
                                            <UserRound
                                                size={18}
                                            />
                                        </div>


                                        <div
                                            className="
                                                min-w-0
                                                flex-1
                                            "
                                        >
                                            <p
                                                className="
                                                    truncate
                                                    text-sm
                                                    font-semibold
                                                    text-stone-700
                                                "
                                            >
                                                {
                                                    cita.cliente
                                                        ?.nombre
                                                }
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    truncate
                                                    text-xs
                                                    text-stone-400
                                                "
                                            >
                                                {
                                                    obtenerNombreServicios(
                                                        cita,
                                                    )
                                                }
                                            </p>
                                        </div>


                                        <EstadoCita
                                            estado={
                                                cita.estado
                                            }
                                        />

                                    </motion.button>
                                ),
                            )}
                        </div>
                    )}

                </motion.section>

            </div>


            {/* DETALLE */}
            <CitaDetalleSheet
                abierta={
                    Boolean(
                        idCitaSeleccionada,
                    )
                }
                idCita={
                    idCitaSeleccionada
                }
                onCerrar={() =>
                    setIdCitaSeleccionada(
                        null,
                    )
                }
                onActualizada={
                    cargarDashboard
                }
            />
        </>
    )
}


function EstadoCita({
    estado,
}) {
    const configuracion = {
        PENDIENTE: {
            texto:
                'Pendiente',

            clases:
                'bg-amber-50 text-amber-600',
        },

        CONFIRMADA: {
            texto:
                'Confirmada',

            clases:
                'bg-emerald-50 text-emerald-600',
        },

        REPROGRAMACION_PENDIENTE: {
            texto:
                'Reprogramada',

            clases:
                'bg-violet-50 text-violet-600',
        },

        RECHAZADA: {
            texto:
                'Rechazada',

            clases:
                'bg-rose-50 text-rose-500',
        },

        CANCELADA_CLIENTE: {
            texto:
                'Cancelada',

            clases:
                'bg-stone-100 text-stone-500',
        },

        CANCELADA_ADMIN: {
            texto:
                'Cancelada',

            clases:
                'bg-stone-100 text-stone-500',
        },

        FINALIZADA: {
            texto:
                'Finalizada',

            clases:
                'bg-blue-50 text-blue-600',
        },

        NO_ASISTIO: {
            texto:
                'No asistió',

            clases:
                'bg-red-50 text-red-500',
        },
    }


    const datos =
        configuracion[
            estado
        ] || {
            texto:
                estado ||
                'Sin estado',

            clases:
                'bg-stone-100 text-stone-500',
        }


    return (
        <span
            className={`
                shrink-0
                rounded-full
                px-2.5
                py-1
                text-[10px]
                font-semibold
                ${datos.clases}
            `}
        >
            {
                datos.texto
            }
        </span>
    )
}


function obtenerNombreServicios(
    cita,
) {
    const servicios =
        Array.isArray(
            cita?.servicios,
        )
            ? cita.servicios
            : []

    if (
        servicios.length ===
        0
    ) {
        return 'Sin servicios'
    }

    return servicios
        .map(
            (
                servicio,
            ) =>
                servicio.nombre,
        )
        .join(' + ')
}


function obtenerNombreUsuario() {
    try {
        const usuario =
            JSON.parse(
                localStorage.getItem(
                    'usuario',
                ) ||
                'null',
            )

        if (
            !usuario?.nombre
        ) {
            return ''
        }

        return String(
            usuario.nombre,
        )
            .trim()
            .split(' ')[0]
    } catch {
        return ''
    }
}


function obtenerSaludo() {
    const hora =
        new Date()
            .getHours()

    if (
        hora < 12
    ) {
        return 'Buenos días'
    }

    if (
        hora < 19
    ) {
        return 'Buenas tardes'
    }

    return 'Buenas noches'
}


function formatearHora(
    hora,
) {
    if (!hora) {
        return ''
    }

    const [
        horasTexto,
        minutosTexto,
    ] =
        String(
            hora,
        )
            .substring(
                0,
                5,
            )
            .split(':')

    const horas =
        Number(
            horasTexto,
        )

    const periodo =
        horas >= 12
            ? 'PM'
            : 'AM'

    const hora12 =
        horas % 12 ||
        12

    return (
        `${hora12}:` +
        `${minutosTexto} ` +
        periodo
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


function formatearFechaTexto(
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
            Number(
                anio,
            ),
            Number(
                mes,
            ) - 1,
            Number(
                dia,
            ),
        )

    return fechaLocal
        .toLocaleDateString(
            'es-MX',
            {
                weekday:
                    'long',

                day:
                    'numeric',

                month:
                    'long',
            },
        )
}


export default Dashboard