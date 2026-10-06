import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Clock3,
    UserRound,
    Plus,
    Sparkles,
    RefreshCw,
} from 'lucide-react'

import {
    motion,
} from 'motion/react'

import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import api from '../../services/api.js'

import CitaDetalleSheet
    from '../../components/CitaDetalleSheet.jsx'


const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
]


const diasSemana = [
    'D',
    'L',
    'M',
    'M',
    'J',
    'V',
    'S',
]


function Calendario() {
    const hoy = new Date()

    const [
        fechaBase,
        setFechaBase,
    ] = useState(
        new Date(
            hoy.getFullYear(),
            hoy.getMonth(),
            1,
        ),
    )

    const [
        fechaSeleccionada,
        setFechaSeleccionada,
    ] = useState(
        formatearFechaClave(hoy),
    )

    const [
        citasSeleccionadas,
        setCitasSeleccionadas,
    ] = useState([])

    const [
        fechasConCitas,
        setFechasConCitas,
    ] = useState(
        new Set(),
    )

    const [
        cargandoCitas,
        setCargandoCitas,
    ] = useState(false)

    const [
        cargandoMes,
        setCargandoMes,
    ] = useState(false)

    const [
        error,
        setError,
    ] = useState('')

    const [
        idCitaSeleccionada,
        setIdCitaSeleccionada,
    ] = useState(null)


    const diasCalendario =
        useMemo(
            () => {
                return construirMes(
                    fechaBase,
                )
            },
            [
                fechaBase,
            ],
        )


    useEffect(() => {
        cargarCitasDia()
    }, [
        fechaSeleccionada,
    ])


    useEffect(() => {
        cargarIndicadoresMes()
    }, [
        fechaBase,
    ])


    async function cargarCitasDia() {
        try {
            setCargandoCitas(true)
            setError('')

            const token =
                localStorage.getItem(
                    'token',
                )

            const respuesta =
                await api.get(
                    '/citas/admin',
                    {
                        params: {
                            fecha:
                                fechaSeleccionada,
                        },

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    },
                )

            setCitasSeleccionadas(
                respuesta.data.citas ||
                [],
            )
        } catch (error) {
            console.error(
                'Error al cargar citas:',
                error,
            )

            setCitasSeleccionadas(
                [],
            )

            setError(
                error.response
                    ?.data
                    ?.mensaje ||
                'No fue posible cargar las citas.',
            )
        } finally {
            setCargandoCitas(false)
        }
    }


    async function cargarIndicadoresMes() {
        try {
            setCargandoMes(true)

            const token =
                localStorage.getItem(
                    'token',
                )

            const respuesta =
                await api.get(
                    '/citas/admin',
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    },
                )

            const citas =
                respuesta.data.citas ||
                []

            const anio =
                fechaBase.getFullYear()

            const mes =
                fechaBase.getMonth() +
                1

            const fechas =
                new Set()

            citas.forEach(
                (cita) => {
                    const fecha =
                        obtenerFechaCita(
                            cita,
                        )

                    if (!fecha) {
                        return
                    }

                    const [
                        citaAnio,
                        citaMes,
                    ] =
                        fecha
                            .split('-')
                            .map(Number)

                    if (
                        citaAnio ===
                            anio &&
                        citaMes ===
                            mes
                    ) {
                        fechas.add(
                            fecha,
                        )
                    }
                },
            )

            setFechasConCitas(
                fechas,
            )
        } catch (error) {
            console.error(
                'Error al cargar indicadores del calendario:',
                error,
            )

            setFechasConCitas(
                new Set(),
            )
        } finally {
            setCargandoMes(false)
        }
    }


    async function actualizarCalendario() {
        await Promise.all([
            cargarCitasDia(),
            cargarIndicadoresMes(),
        ])
    }


    function abrirDetalleCita(
        idCita,
    ) {
        setIdCitaSeleccionada(
            idCita,
        )
    }


    function cerrarDetalleCita() {
        setIdCitaSeleccionada(
            null,
        )
    }


    function mesAnterior() {
        const nuevaFecha =
            new Date(
                fechaBase.getFullYear(),
                fechaBase.getMonth() -
                    1,
                1,
            )

        setFechaBase(
            nuevaFecha,
        )
    }


    function mesSiguiente() {
        const nuevaFecha =
            new Date(
                fechaBase.getFullYear(),
                fechaBase.getMonth() +
                    1,
                1,
            )

        setFechaBase(
            nuevaFecha,
        )
    }


    function seleccionarHoy() {
        const actual =
            new Date()

        setFechaBase(
            new Date(
                actual.getFullYear(),
                actual.getMonth(),
                1,
            ),
        )

        setFechaSeleccionada(
            formatearFechaClave(
                actual,
            ),
        )
    }


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
                        rounded-[28px]
                        border
                        border-pink-100
                        bg-gradient-to-br
                        from-white
                        via-pink-50
                        to-rose-50
                        p-5
                        shadow-sm
                    "
                >
                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-4
                        "
                    >
                        <div>

                            <h1
                                className="
                                    text-2xl
                                    font-semibold
                                    tracking-tight
                                    text-stone-800
                                "
                            >
                                Calendario
                            </h1>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    leading-6
                                    text-stone-500
                                "
                            >
                                Consulta las reservaciones por fecha.
                            </p>

                        </div>

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-pink-100
                                text-pink-500
                                shadow-sm
                            "
                        >
                            <CalendarDays
                                size={20}
                            />
                        </div>

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
                                    actualizarCalendario
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
                                    size={
                                        16
                                    }
                                />
                            </button>

                        </div>
                    </motion.div>
                )}


                {/* CALENDARIO */}

                <motion.section
                    initial={{
                        opacity: 0,
                        y: 12,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.08,
                    }}
                    className="
                        rounded-[28px]
                        border
                        border-pink-100
                        bg-white
                        p-4
                        shadow-sm
                        sm:p-5
                    "
                >

                    {/* MES */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <button
                            type="button"
                            onClick={
                                mesAnterior
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
                                transition
                                active:scale-95
                            "
                        >
                            <ChevronLeft
                                size={
                                    20
                                }
                            />
                        </button>


                        <button
                            type="button"
                            onClick={
                                seleccionarHoy
                            }
                            className="
                                rounded-2xl
                                px-4
                                py-1
                                text-center
                                transition
                                active:scale-95
                            "
                        >
                            <h2
                                className="
                                    text-base
                                    font-semibold
                                    text-stone-800
                                "
                            >
                                {
                                    meses[
                                        fechaBase.getMonth()
                                    ]
                                }
                            </h2>

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                "
                            >
                                <p
                                    className="
                                        text-xs
                                        text-stone-400
                                    "
                                >
                                    {
                                        fechaBase.getFullYear()
                                    }
                                </p>

                                {cargandoMes && (
                                    <span
                                        className="
                                            h-2
                                            w-2
                                            animate-pulse
                                            rounded-full
                                            bg-pink-300
                                        "
                                    />
                                )}
                            </div>
                        </button>


                        <button
                            type="button"
                            onClick={
                                mesSiguiente
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
                                transition
                                active:scale-95
                            "
                        >
                            <ChevronRight
                                size={
                                    20
                                }
                            />
                        </button>

                    </div>


                    {/* DÍAS SEMANA */}

                    <div
                        className="
                            mt-5
                            grid
                            grid-cols-7
                            gap-1
                        "
                    >
                        {diasSemana.map(
                            (
                                dia,
                                index,
                            ) => (
                                <div
                                    key={`${dia}-${index}`}
                                    className="
                                        flex
                                        h-8
                                        items-center
                                        justify-center
                                        text-[11px]
                                        font-semibold
                                        text-stone-400
                                    "
                                >
                                    {dia}
                                </div>
                            ),
                        )}
                    </div>


                    {/* DÍAS */}

                    <div
                        className="
                            grid
                            grid-cols-7
                            gap-1
                        "
                    >
                        {diasCalendario.map(
                            (
                                dia,
                                index,
                            ) => {
                                if (!dia) {
                                    return (
                                        <div
                                            key={`vacio-${index}`}
                                            className="aspect-square"
                                        />
                                    )
                                }

                                const clave =
                                    formatearFechaClave(
                                        dia.fecha,
                                    )

                                const seleccionado =
                                    fechaSeleccionada ===
                                    clave

                                const tieneCitas =
                                    fechasConCitas.has(
                                        clave,
                                    )

                                const esHoy =
                                    clave ===
                                    formatearFechaClave(
                                        hoy,
                                    )

                                return (
                                    <button
                                        key={
                                            clave
                                        }
                                        type="button"
                                        onClick={() =>
                                            setFechaSeleccionada(
                                                clave,
                                            )
                                        }
                                        className="
                                            relative
                                            flex
                                            aspect-square
                                            items-center
                                            justify-center
                                        "
                                    >
                                        <motion.div
                                            whileTap={{
                                                scale: 0.9,
                                            }}
                                            className={`
                                                relative
                                                flex
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                rounded-2xl
                                                text-sm
                                                font-medium
                                                transition-all

                                                ${
                                                    seleccionado
                                                        ? `
                                                            bg-gradient-to-br
                                                            from-pink-300
                                                            to-rose-400
                                                            text-white
                                                            shadow-md
                                                            shadow-pink-200
                                                        `
                                                        : esHoy
                                                            ? `
                                                                bg-pink-50
                                                                text-pink-500
                                                                ring-1
                                                                ring-pink-200
                                                            `
                                                            : `
                                                                text-stone-600
                                                                hover:bg-pink-50
                                                            `
                                                }
                                            `}
                                        >
                                            {
                                                dia.numero
                                            }

                                            {tieneCitas && (
                                                <span
                                                    className={`
                                                        absolute
                                                        bottom-1
                                                        h-1.5
                                                        w-1.5
                                                        rounded-full

                                                        ${
                                                            seleccionado
                                                                ? 'bg-white'
                                                                : 'bg-pink-400'
                                                        }
                                                    `}
                                                />
                                            )}

                                        </motion.div>
                                    </button>
                                )
                            },
                        )}
                    </div>

                </motion.section>


                {/* RESERVACIONES */}

                <motion.section
                    key={
                        fechaSeleccionada
                    }
                    initial={{
                        opacity: 0,
                        y: 10,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="
                        overflow-hidden
                        rounded-[28px]
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
                                Reservaciones
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    capitalize
                                    text-stone-400
                                "
                            >
                                {
                                    formatearFechaTexto(
                                        fechaSeleccionada,
                                    )
                                }
                            </p>

                        </div>


                        <button
                            type="button"
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-2xl
                                bg-pink-100
                                text-pink-500
                                transition
                                active:scale-95
                            "
                        >
                            <Plus
                                size={
                                    18
                                }
                            />
                        </button>

                    </div>


                    {/* CARGANDO */}

                    {cargandoCitas && (
                        <div
                            className="
                                flex
                                items-center
                                justify-center
                                px-5
                                py-10
                            "
                        >
                            <div className="text-center">

                                <div
                                    className="
                                        mx-auto
                                        h-8
                                        w-8
                                        animate-spin
                                        rounded-full
                                        border-4
                                        border-pink-100
                                        border-t-pink-400
                                    "
                                />

                                <p
                                    className="
                                        mt-3
                                        text-xs
                                        font-medium
                                        text-pink-400
                                    "
                                >
                                    Cargando reservaciones...
                                </p>

                            </div>
                        </div>
                    )}


                    {/* SIN CITAS */}

                    {!cargandoCitas &&
                        citasSeleccionadas.length ===
                            0 && (
                            <div
                                className="
                                    px-5
                                    pb-6
                                    pt-2
                                "
                            >
                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-dashed
                                        border-pink-200
                                        bg-pink-50/60
                                        px-5
                                        py-8
                                        text-center
                                    "
                                >
                                    <CalendarDays
                                        size={
                                            28
                                        }
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
                                        Sin reservaciones
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-stone-400
                                        "
                                    >
                                        No hay citas programadas para este día.
                                    </p>

                                </div>
                            </div>
                        )}


                    {/* LISTADO */}

                    {!cargandoCitas &&
                        citasSeleccionadas.length >
                            0 && (
                            <div
                                className="
                                    divide-y
                                    divide-pink-50
                                "
                            >
                                {citasSeleccionadas.map(
                                    (
                                        cita,
                                    ) => (
                                        <TarjetaCita
                                            key={
                                                cita.id_cita
                                            }
                                            cita={
                                                cita
                                            }
                                            onClick={() =>
                                                abrirDetalleCita(
                                                    cita.id_cita,
                                                )
                                            }
                                        />
                                    ),
                                )}
                            </div>
                        )}

                </motion.section>

            </div>


            {/* DETALLE DE CITA */}

            <CitaDetalleSheet
                abierta={
                    Boolean(
                        idCitaSeleccionada,
                    )
                }
                idCita={
                    idCitaSeleccionada
                }
                onCerrar={
                    cerrarDetalleCita
                }
                onActualizada={
                    actualizarCalendario
                }
            />
        </>
    )
}


function TarjetaCita({
    cita,
    onClick,
}) {
    const horaInicio =
        cita.hora_inicio_confirmada ||
        cita.hora_inicio_solicitada

    const horaFin =
        cita.hora_fin_confirmada ||
        cita.hora_fin_solicitada

    const servicios =
        Array.isArray(
            cita.servicios,
        )
            ? cita.servicios
            : []

    const nombreServicios =
        servicios.length > 0
            ? servicios
                .map(
                    (
                        servicio,
                    ) =>
                        servicio.nombre,
                )
                .join(' + ')
            : 'Sin servicios'


    return (
        <motion.button
            type="button"
            onClick={
                onClick
            }
            whileTap={{
                scale: 0.99,
            }}
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
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-pink-50
                    text-pink-400
                "
            >
                <Clock3
                    size={
                        18
                    }
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
                        flex-wrap
                        items-center
                        gap-2
                    "
                >
                    <p
                        className="
                            text-xs
                            font-semibold
                            text-pink-500
                        "
                    >
                        {
                            formatearHora(
                                horaInicio,
                            )
                        }
                    </p>

                    <EstadoCita
                        estado={
                            cita.estado
                        }
                    />

                </div>


                <p
                    className="
                        mt-2
                        truncate
                        text-sm
                        font-semibold
                        text-stone-700
                    "
                >
                    {
                        cita.cliente_nombre
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
                        nombreServicios
                    }
                </p>


                {horaFin && (
                    <p
                        className="
                            mt-1
                            text-[10px]
                            text-stone-300
                        "
                    >
                        {
                            formatearHora(
                                horaInicio,
                            )
                        }

                        {' - '}

                        {
                            formatearHora(
                                horaFin,
                            )
                        }
                    </p>
                )}

            </div>


            <div
                className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-pink-50
                    text-pink-300
                "
            >
                <UserRound
                    size={
                        17
                    }
                />
            </div>

        </motion.button>
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
                px-2
                py-1
                text-[9px]
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


function construirMes(
    fecha,
) {
    const anio =
        fecha.getFullYear()

    const mes =
        fecha.getMonth()

    const primerDia =
        new Date(
            anio,
            mes,
            1,
        )

    const ultimoDia =
        new Date(
            anio,
            mes + 1,
            0,
        )

    const resultado =
        []


    for (
        let i = 0;
        i <
        primerDia.getDay();
        i++
    ) {
        resultado.push(
            null,
        )
    }


    for (
        let dia = 1;
        dia <=
        ultimoDia.getDate();
        dia++
    ) {
        resultado.push({
            numero:
                dia,

            fecha:
                new Date(
                    anio,
                    mes,
                    dia,
                ),
        })
    }


    return resultado
}


function formatearFechaClave(
    fecha,
) {
    const anio =
        fecha.getFullYear()

    const mes =
        String(
            fecha.getMonth() +
            1,
        ).padStart(
            2,
            '0',
        )

    const dia =
        String(
            fecha.getDate(),
        ).padStart(
            2,
            '0',
        )

    return `${anio}-${mes}-${dia}`
}


function formatearFechaTexto(
    fecha,
) {
    const [
        anio,
        mes,
        dia,
    ] =
        fecha.split(
            '-',
        )


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


    return (
        fechaLocal
            .toLocaleDateString(
                'es-MX',
                {
                    weekday:
                        'long',

                    day:
                        'numeric',

                    month:
                        'long',

                    year:
                        'numeric',
                },
            )
    )
}


function obtenerFechaCita(
    cita,
) {
    const fecha =
        cita.fecha_confirmada ||
        cita.fecha_solicitada

    if (!fecha) {
        return null
    }

    return String(
        fecha,
    ).substring(
        0,
        10,
    )
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
            .split(
                ':',
            )


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


export default Calendario