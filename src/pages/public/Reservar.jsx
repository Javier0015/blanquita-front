import {
    CalendarDays,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Mail,
    Phone,
    Search,
    Scissors,
    Sparkles,
    UserRound,
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


function Reservar() {
    const hoy = new Date()

    const [
        paso,
        setPaso,
    ] = useState(1)

    const [
        servicios,
        setServicios,
    ] = useState([])

    const [
        serviciosSeleccionados,
        setServiciosSeleccionados,
    ] = useState([])

    const [
        cargandoServicios,
        setCargandoServicios,
    ] = useState(true)

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
    ] = useState('')

    const [
        horarios,
        setHorarios,
    ] = useState([])

    const [
        horarioSeleccionado,
        setHorarioSeleccionado,
    ] = useState(null)

    const [
        cargandoHorarios,
        setCargandoHorarios,
    ] = useState(false)

    const [
        formulario,
        setFormulario,
    ] = useState({
        nombre: '',
        telefono: '',
        correo: '',
        observaciones: '',
    })

    const [
        enviando,
        setEnviando,
    ] = useState(false)

    const [
        error,
        setError,
    ] = useState('')

    const [
        resultado,
        setResultado,
    ] = useState(null)

    const [
        mostrarConsulta,
        setMostrarConsulta,
    ] = useState(false)

    const [
        contactoConsulta,
        setContactoConsulta,
    ] = useState('')

    const [
        cargandoConsulta,
        setCargandoConsulta,
    ] = useState(false)

    const [
        errorConsulta,
        setErrorConsulta,
    ] = useState('')

    const [
        resultadoConsulta,
        setResultadoConsulta,
    ] = useState(null)


    useEffect(() => {
        cargarServicios()
    }, [])


    useEffect(() => {
        if (
            paso === 3 &&
            fechaSeleccionada &&
            serviciosSeleccionados.length > 0
        ) {
            cargarHorarios()
        }
    }, [
        paso,
        fechaSeleccionada,
    ])


    const diasCalendario =
        useMemo(
            () =>
                construirMes(
                    fechaBase,
                ),
            [
                fechaBase,
            ],
        )


    const resumen =
        useMemo(
            () => {
                const seleccionados =
                    servicios.filter(
                        (servicio) =>
                            serviciosSeleccionados.includes(
                                servicio.id_servicio,
                            ),
                    )

                const duracion =
                    seleccionados.reduce(
                        (
                            total,
                            servicio,
                        ) =>
                            total +
                            Number(
                                servicio.duracion_minutos ||
                                0,
                            ),
                        0,
                    )

                const total =
                    seleccionados.reduce(
                        (
                            acumulado,
                            servicio,
                        ) =>
                            acumulado +
                            Number(
                                servicio.precio ||
                                0,
                            ),
                        0,
                    )

                return {
                    seleccionados,
                    duracion,
                    total,
                }
            },
            [
                servicios,
                serviciosSeleccionados,
            ],
        )


    async function cargarServicios() {
        try {
            setCargandoServicios(true)
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
                error.response?.data?.mensaje ||
                'No fue posible cargar los servicios.',
            )
        } finally {
            setCargandoServicios(false)
        }
    }


    function seleccionarServicio(
        idServicio,
    ) {
        setServiciosSeleccionados(
            (
                anteriores,
            ) => {
                if (
                    anteriores.includes(
                        idServicio,
                    )
                ) {
                    return anteriores.filter(
                        (id) =>
                            id !==
                            idServicio,
                    )
                }

                return [
                    ...anteriores,
                    idServicio,
                ]
            },
        )

        setHorarioSeleccionado(
            null,
        )

        setHorarios([])
        setError('')
    }


    function seleccionarFecha(
        fecha,
    ) {
        if (
            fecha <
            obtenerFechaHoy()
        ) {
            return
        }

        setFechaSeleccionada(
            fecha,
        )

        setHorarioSeleccionado(
            null,
        )

        setHorarios([])
        setError('')
    }


    async function cargarHorarios() {
        try {
            setCargandoHorarios(true)
            setHorarios([])
            setHorarioSeleccionado(
                null,
            )
            setError('')

            const respuesta =
                await api.get(
                    '/citas/disponibilidad',
                    {
                        params: {
                            fecha:
                                fechaSeleccionada,

                            servicios:
                                serviciosSeleccionados.join(
                                    ',',
                                ),
                        },
                    },
                )

            setHorarios(
                respuesta.data
                    ?.disponibilidad
                    ?.horarios ||
                [],
            )
        } catch (error) {
            console.error(
                'Error al cargar horarios:',
                error,
            )

            setError(
                error.response?.data?.mensaje ||
                'No fue posible consultar los horarios disponibles.',
            )
        } finally {
            setCargandoHorarios(false)
        }
    }


    function actualizarCampo(
        event,
    ) {
        const {
            name,
            value,
        } = event.target

        setFormulario(
            (
                anterior,
            ) => ({
                ...anterior,

                [name]:
                    value,
            }),
        )

        setError('')
    }


    function siguientePaso() {
        setError('')

        if (paso === 1) {
            if (
                serviciosSeleccionados.length ===
                0
            ) {
                setError(
                    'Selecciona al menos un servicio.',
                )

                return
            }

            setPaso(2)

            return
        }

        if (paso === 2) {
            if (
                !fechaSeleccionada
            ) {
                setError(
                    'Selecciona una fecha.',
                )

                return
            }

            setPaso(3)

            return
        }

        if (paso === 3) {
            if (
                !horarioSeleccionado
            ) {
                setError(
                    'Selecciona un horario disponible.',
                )

                return
            }

            setPaso(4)
        }
    }


    function pasoAnterior() {
        setError('')

        if (
            paso > 1
        ) {
            setPaso(
                (
                    anterior,
                ) =>
                    anterior - 1,
            )
        }
    }


    async function enviarSolicitud(
        event,
    ) {
        event.preventDefault()

        if (
            !formulario.nombre.trim()
        ) {
            setError(
                'Escribe tu nombre.',
            )

            return
        }

        if (
            !formulario.telefono.trim() &&
            !formulario.correo.trim()
        ) {
            setError(
                'Proporciona teléfono o correo.',
            )

            return
        }

        try {
            setEnviando(true)
            setError('')

            const respuesta =
                await api.post(
                    '/citas/solicitudes',
                    {
                        nombre:
                            formulario.nombre.trim(),

                        telefono:
                            formulario.telefono.trim(),

                        correo:
                            formulario.correo.trim(),

                        servicios:
                            serviciosSeleccionados,

                        fecha:
                            fechaSeleccionada,

                        hora_inicio:
                            horarioSeleccionado.hora_inicio,

                        observaciones:
                            formulario.observaciones.trim(),
                    },
                )

            setResultado(
                respuesta.data.cita,
            )

            setPaso(5)
        } catch (error) {
            console.error(
                'Error al crear reservación:',
                error,
            )

            setError(
                error.response?.data?.mensaje ||
                'No fue posible registrar la reservación.',
            )

            if (
                error.response?.status ===
                409
            ) {
                await cargarHorarios()

                setPaso(3)
            }
        } finally {
            setEnviando(false)
        }
    }


    function nuevaReservacion() {
        setPaso(1)

        setServiciosSeleccionados(
            [],
        )

        setFechaSeleccionada('')

        setHorarioSeleccionado(
            null,
        )

        setHorarios([])

        setFormulario({
            nombre: '',
            telefono: '',
            correo: '',
            observaciones: '',
        })

        setResultado(null)
        setError('')

        const actual =
            new Date()

        setFechaBase(
            new Date(
                actual.getFullYear(),
                actual.getMonth(),
                1,
            ),
        )
    }


    async function consultarMisCitas(
        event,
    ) {
        event.preventDefault()

        const contacto =
            contactoConsulta.trim()

        if (!contacto) {
            setErrorConsulta(
                'Escribe tu correo o número de teléfono.',
            )

            return
        }

        try {
            setCargandoConsulta(true)
            setErrorConsulta('')
            setResultadoConsulta(null)

            const respuesta =
                await api.post(
                    '/citas/mis-citas',
                    {
                        contacto,
                    },
                )

            setResultadoConsulta(
                respuesta.data,
            )
        } catch (error) {
            console.error(
                'Error al consultar citas:',
                error,
            )

            setErrorConsulta(
                error.response?.data?.mensaje ||
                'No fue posible consultar tus citas.',
            )
        } finally {
            setCargandoConsulta(false)
        }
    }


    function limpiarConsulta() {
        setContactoConsulta('')
        setResultadoConsulta(null)
        setErrorConsulta('')
    }


    return (
        <div
            className="
                mx-auto
                w-full
                max-w-2xl
                space-y-5
                pb-10
            "
        >
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
                            mt-2
                            text-2xl
                            font-semibold
                            tracking-tight
                            text-stone-800
                        "
                    >
                        Agenda tu cita
                    </h1>

                    <p
                        className="
                            mt-2
                            max-w-md
                            text-sm
                            leading-6
                            text-stone-500
                        "
                    >
                        Selecciona tus servicios,
                        fecha y horario disponibles.
                    </p>

                </div>
            </motion.section>


            {/* CONSULTAR MIS CITAS */}
            <motion.section
                initial={{
                    opacity: 0,
                    y: 8,
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
                <button
                    type="button"
                    onClick={() => {
                        setMostrarConsulta(
                            (anterior) =>
                                !anterior,
                        )

                        setErrorConsulta('')
                    }}
                    className="
                        flex
                        w-full
                        items-center
                        justify-between
                        gap-4
                        p-5
                        text-left
                    "
                >
                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-3
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
                                bg-pink-100
                                text-pink-500
                            "
                        >
                            <Search size={19} />
                        </div>

                        <div>
                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-stone-700
                                "
                            >
                                ¿Ya hiciste una reservación?
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-stone-400
                                "
                            >
                                Consulta tus citas con tu correo o teléfono.
                            </p>
                        </div>
                    </div>

                    <span
                        className="
                            shrink-0
                            text-xs
                            font-semibold
                            text-pink-500
                        "
                    >
                        {
                            mostrarConsulta
                                ? 'Cerrar'
                                : 'Consultar'
                        }
                    </span>
                </button>

                <AnimatePresence>
                    {mostrarConsulta && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                height: 0,
                            }}
                            animate={{
                                opacity: 1,
                                height: 'auto',
                            }}
                            exit={{
                                opacity: 0,
                                height: 0,
                            }}
                            className="overflow-hidden"
                        >
                            <div
                                className="
                                    border-t
                                    border-pink-100
                                    p-5
                                "
                            >
                                <form
                                    onSubmit={
                                        consultarMisCitas
                                    }
                                >
                                    <label
                                        className="
                                            mb-2
                                            block
                                            text-xs
                                            font-semibold
                                            text-stone-500
                                        "
                                    >
                                        Correo o teléfono
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
                                            focus-within:border-pink-300
                                            focus-within:bg-white
                                            focus-within:ring-4
                                            focus-within:ring-pink-100/70
                                        "
                                    >
                                        {
                                            contactoConsulta.includes('@')
                                                ? (
                                                    <Mail
                                                        size={17}
                                                        className="shrink-0 text-pink-400"
                                                    />
                                                )
                                                : (
                                                    <Phone
                                                        size={17}
                                                        className="shrink-0 text-pink-400"
                                                    />
                                                )
                                        }

                                        <input
                                            type="text"
                                            value={
                                                contactoConsulta
                                            }
                                            onChange={(event) => {
                                                setContactoConsulta(
                                                    event.target.value,
                                                )

                                                setErrorConsulta('')
                                            }}
                                            placeholder="correo@ejemplo.com o 771 123 4567"
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

                                    <button
                                        type="submit"
                                        disabled={
                                            cargandoConsulta
                                        }
                                        className="
                                            mt-3
                                            flex
                                            min-h-12
                                            w-full
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-2xl
                                            bg-pink-400
                                            px-5
                                            text-sm
                                            font-semibold
                                            text-white
                                            shadow-lg
                                            shadow-pink-200/60
                                            disabled:opacity-60
                                        "
                                    >
                                        {
                                            cargandoConsulta
                                                ? 'Consultando...'
                                                : (
                                                    <>
                                                        <Search size={17} />
                                                        Consultar mis citas
                                                    </>
                                                )
                                        }
                                    </button>
                                </form>

                                {errorConsulta && (
                                    <div
                                        className="
                                            mt-4
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
                                        {errorConsulta}
                                    </div>
                                )}

                                {
                                    resultadoConsulta &&
                                    !resultadoConsulta.encontrado && (
                                        <div
                                            className="
                                                mt-4
                                                rounded-2xl
                                                border
                                                border-dashed
                                                border-pink-200
                                                bg-pink-50/50
                                                p-5
                                                text-center
                                            "
                                        >
                                            <CalendarDays
                                                size={25}
                                                className="mx-auto text-pink-300"
                                            />

                                            <p
                                                className="
                                                    mt-3
                                                    text-sm
                                                    font-semibold
                                                    text-stone-600
                                                "
                                            >
                                                No encontramos citas
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    leading-5
                                                    text-stone-400
                                                "
                                            >
                                                Revisa que el correo o teléfono sea el mismo que utilizaste al reservar.
                                            </p>
                                        </div>
                                    )
                                }

                                {resultadoConsulta?.encontrado && (
                                    <div className="mt-5 space-y-4">
                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-4
                                            "
                                        >
                                            <div>
                                                <p className="text-[11px] font-semibold text-pink-500">
                                                    Citas de
                                                </p>

                                                <p className="text-sm font-semibold text-stone-700">
                                                    {
                                                        resultadoConsulta.cliente?.nombre ||
                                                        'Cliente'
                                                    }
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={
                                                    limpiarConsulta
                                                }
                                                className="text-xs font-semibold text-pink-500"
                                            >
                                                Nueva consulta
                                            </button>
                                        </div>

                                        {resultadoConsulta.citas.map(
                                            (cita) => (
                                                <CitaConsultaCard
                                                    key={
                                                        cita.id_cita
                                                    }
                                                    cita={
                                                        cita
                                                    }
                                                />
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.section>


            {paso < 5 && (
                <IndicadorPasos
                    paso={
                        paso
                    }
                />
            )}


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


            <AnimatePresence
                mode="wait"
            >

                {/* PASO 1 */}
                {paso === 1 && (
                    <motion.section
                        key="servicios"
                        initial={{
                            opacity: 0,
                            x: 15,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        exit={{
                            opacity: 0,
                            x: -15,
                        }}
                        className="
                            rounded-[28px]
                            border
                            border-pink-100
                            bg-white
                            p-5
                            shadow-sm
                        "
                    >
                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-stone-800
                            "
                        >
                            ¿Qué servicio deseas?
                        </h2>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-stone-400
                            "
                        >
                            Puedes seleccionar uno o varios.
                        </p>


                        {cargandoServicios ? (
                            <Cargando
                                texto="Cargando servicios..."
                            />
                        ) : servicios.length ===
                          0 ? (
                            <Vacio
                                texto="No hay servicios disponibles por el momento."
                            />
                        ) : (
                            <div
                                className="
                                    mt-5
                                    space-y-3
                                "
                            >
                                {servicios.map(
                                    (
                                        servicio,
                                    ) => (
                                        <ServicioCard
                                            key={
                                                servicio.id_servicio
                                            }
                                            servicio={
                                                servicio
                                            }
                                            seleccionado={
                                                serviciosSeleccionados.includes(
                                                    servicio.id_servicio,
                                                )
                                            }
                                            onClick={() =>
                                                seleccionarServicio(
                                                    servicio.id_servicio,
                                                )
                                            }
                                        />
                                    ),
                                )}
                            </div>
                        )}

                    </motion.section>
                )}


                {/* PASO 2 */}
                {paso === 2 && (
                    <motion.section
                        key="fecha"
                        initial={{
                            opacity: 0,
                            x: 15,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        exit={{
                            opacity: 0,
                            x: -15,
                        }}
                        className="
                            rounded-[28px]
                            border
                            border-pink-100
                            bg-white
                            p-5
                            shadow-sm
                        "
                    >
                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-stone-800
                            "
                        >
                            Elige una fecha
                        </h2>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-stone-400
                            "
                        >
                            Después te mostraremos los horarios libres.
                        </p>


                        <CalendarioReserva
                            fechaBase={
                                fechaBase
                            }
                            setFechaBase={
                                setFechaBase
                            }
                            fechaSeleccionada={
                                fechaSeleccionada
                            }
                            onSeleccionar={
                                seleccionarFecha
                            }
                            diasCalendario={
                                diasCalendario
                            }
                        />

                    </motion.section>
                )}


                {/* PASO 3 */}
                {paso === 3 && (
                    <motion.section
                        key="horario"
                        initial={{
                            opacity: 0,
                            x: 15,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        exit={{
                            opacity: 0,
                            x: -15,
                        }}
                        className="
                            rounded-[28px]
                            border
                            border-pink-100
                            bg-white
                            p-5
                            shadow-sm
                        "
                    >
                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-stone-800
                            "
                        >
                            Elige tu horario
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


                        {cargandoHorarios ? (
                            <Cargando
                                texto="Consultando horarios..."
                            />
                        ) : horarios.length ===
                          0 ? (
                            <Vacio
                                texto="No hay horarios disponibles para esta fecha."
                            />
                        ) : (
                            <div
                                className="
                                    mt-5
                                    grid
                                    grid-cols-2
                                    gap-3
                                    sm:grid-cols-3
                                "
                            >
                                {horarios.map(
                                    (
                                        horario,
                                    ) => {
                                        const seleccionado =
                                            horarioSeleccionado
                                                ?.hora_inicio ===
                                            horario.hora_inicio

                                        return (
                                            <button
                                                key={
                                                    horario.hora_inicio
                                                }
                                                type="button"
                                                onClick={() =>
                                                    setHorarioSeleccionado(
                                                        horario,
                                                    )
                                                }
                                                className={`
                                                    rounded-2xl
                                                    border
                                                    px-3
                                                    py-4
                                                    text-sm
                                                    font-semibold
                                                    transition

                                                    ${
                                                        seleccionado
                                                            ? `
                                                                border-pink-400
                                                                bg-pink-400
                                                                text-white
                                                                shadow-md
                                                                shadow-pink-200
                                                            `
                                                            : `
                                                                border-pink-100
                                                                bg-pink-50/40
                                                                text-stone-600
                                                            `
                                                    }
                                                `}
                                            >
                                                {
                                                    formatearHora(
                                                        horario.hora_inicio,
                                                    )
                                                }

                                                <span
                                                    className={`
                                                        mt-1
                                                        block
                                                        text-[10px]

                                                        ${
                                                            seleccionado
                                                                ? 'text-white/80'
                                                                : 'text-stone-300'
                                                        }
                                                    `}
                                                >
                                                    hasta{' '}
                                                    {
                                                        formatearHora(
                                                            horario.hora_fin,
                                                        )
                                                    }
                                                </span>

                                            </button>
                                        )
                                    },
                                )}
                            </div>
                        )}

                    </motion.section>
                )}


                {/* PASO 4 */}
                {paso === 4 && (
                    <motion.form
                        key="datos"
                        initial={{
                            opacity: 0,
                            x: 15,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        exit={{
                            opacity: 0,
                            x: -15,
                        }}
                        onSubmit={
                            enviarSolicitud
                        }
                        className="
                            rounded-[28px]
                            border
                            border-pink-100
                            bg-white
                            p-5
                            shadow-sm
                        "
                    >
                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-stone-800
                            "
                        >
                            Tus datos
                        </h2>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-stone-400
                            "
                        >
                            Los utilizaremos para identificar tu reservación.
                        </p>


                        <div
                            className="
                                mt-5
                                space-y-4
                            "
                        >
                            <Campo
                                icono={
                                    UserRound
                                }
                                label="Nombre"
                                name="nombre"
                                value={
                                    formulario.nombre
                                }
                                onChange={
                                    actualizarCampo
                                }
                                placeholder="Tu nombre"
                                required
                            />

                            <Campo
                                icono={
                                    Phone
                                }
                                label="Teléfono"
                                name="telefono"
                                value={
                                    formulario.telefono
                                }
                                onChange={
                                    actualizarCampo
                                }
                                placeholder="771 000 0000"
                                type="tel"
                            />

                            <Campo
                                icono={
                                    Mail
                                }
                                label="Correo"
                                name="correo"
                                value={
                                    formulario.correo
                                }
                                onChange={
                                    actualizarCampo
                                }
                                placeholder="correo@ejemplo.com"
                                type="email"
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
                                    Observaciones
                                </label>

                                <textarea
                                    name="observaciones"
                                    value={
                                        formulario.observaciones
                                    }
                                    onChange={
                                        actualizarCampo
                                    }
                                    rows={3}
                                    placeholder="Ej. Preferencia, detalle o comentario adicional"
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
                                        focus:border-pink-300
                                        focus:ring-4
                                        focus:ring-pink-100/70
                                    "
                                />
                            </div>

                        </div>


                        <ResumenReserva
                            resumen={
                                resumen
                            }
                            fecha={
                                fechaSeleccionada
                            }
                            horario={
                                horarioSeleccionado
                            }
                        />


                        <button
                            type="submit"
                            disabled={
                                enviando
                            }
                            className="
                                mt-5
                                flex
                                min-h-13
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-2xl
                                bg-gradient-to-r
                                from-pink-400
                                to-rose-400
                                px-5
                                text-sm
                                font-semibold
                                text-white
                                shadow-lg
                                shadow-pink-200/70
                                disabled:opacity-60
                            "
                        >
                            {enviando ? (
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

                                    Reservando...
                                </>
                            ) : (
                                <>
                                    <Check
                                        size={18}
                                    />

                                    Solicitar cita
                                </>
                            )}
                        </button>

                    </motion.form>
                )}


                {/* PASO 5 */}
                {paso === 5 &&
                    resultado && (
                        <motion.section
                            key="resultado"
                            initial={{
                                opacity: 0,
                                scale: 0.98,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            className="
                                rounded-[30px]
                                border
                                border-pink-100
                                bg-white
                                p-6
                                text-center
                                shadow-sm
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
                                    rounded-full
                                    bg-emerald-50
                                    text-emerald-500
                                "
                            >
                                <Check
                                    size={28}
                                />
                            </div>

                            <h2
                                className="
                                    mt-5
                                    text-xl
                                    font-semibold
                                    text-stone-800
                                "
                            >
                                Solicitud registrada
                            </h2>

                            <p
                                className="
                                    mx-auto
                                    mt-2
                                    max-w-sm
                                    text-sm
                                    leading-6
                                    text-stone-500
                                "
                            >
                                Tu cita quedó pendiente de confirmación.
                            </p>


                            <div
                                className="
                                    mt-6
                                    rounded-[24px]
                                    bg-pink-50
                                    p-5
                                    text-left
                                "
                            >
                                <DatoResultado
                                    titulo="Folio"
                                    valor={
                                        resultado.folio
                                    }
                                />

                                <DatoResultado
                                    titulo="Fecha"
                                    valor={
                                        formatearFechaTexto(
                                            resultado.fecha,
                                        )
                                    }
                                />

                                <DatoResultado
                                    titulo="Horario"
                                    valor={
                                        `${formatearHora(
                                            resultado.hora_inicio,
                                        )} - ${formatearHora(
                                            resultado.hora_fin,
                                        )}`
                                    }
                                />

                                <DatoResultado
                                    titulo="Estado"
                                    valor="Pendiente"
                                />

                                <DatoResultado
                                    titulo="Total estimado"
                                    valor={
                                        formatearMoneda(
                                            resultado.total_estimado,
                                        )
                                    }
                                />
                            </div>


                            <button
                                type="button"
                                onClick={
                                    nuevaReservacion
                                }
                                className="
                                    mt-5
                                    min-h-12
                                    w-full
                                    rounded-2xl
                                    bg-pink-400
                                    px-5
                                    text-sm
                                    font-semibold
                                    text-white
                                "
                            >
                                Hacer otra reservación
                            </button>

                        </motion.section>
                    )}

            </AnimatePresence>


            {/* BOTONES DE NAVEGACIÓN */}
            {paso < 4 && (
                <div
                    className="
                        flex
                        gap-3
                    "
                >
                    {paso > 1 && (
                        <button
                            type="button"
                            onClick={
                                pasoAnterior
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
                            Regresar
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={
                            siguientePaso
                        }
                        className="
                            min-h-12
                            flex-1
                            rounded-2xl
                            bg-gradient-to-r
                            from-pink-400
                            to-rose-400
                            px-5
                            text-sm
                            font-semibold
                            text-white
                            shadow-lg
                            shadow-pink-200/60
                        "
                    >
                        Continuar
                    </button>
                </div>
            )}


            {paso === 4 && (
                <button
                    type="button"
                    onClick={
                        pasoAnterior
                    }
                    disabled={
                        enviando
                    }
                    className="
                        min-h-12
                        w-full
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
                    Regresar
                </button>
            )}


            {paso < 5 &&
                resumen.seleccionados.length >
                    0 && (
                    <ResumenFlotante
                        resumen={
                            resumen
                        }
                    />
                )}

        </div>
    )
}


function CitaConsultaCard({
    cita,
}) {
    const estado =
        obtenerEstadoConsulta(
            cita.estado,
        )

    return (
        <div
            className="
                rounded-[22px]
                border
                border-pink-100
                bg-pink-50/30
                p-4
            "
        >
            <div
                className="
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-3
                "
            >
                <span
                    className={`
                        rounded-full
                        px-3
                        py-1.5
                        text-[10px]
                        font-semibold
                        ${estado.clase}
                    `}
                >
                    {
                        cita.estado_texto ||
                        estado.texto
                    }
                </span>

                <span className="text-xs font-semibold text-pink-500">
                    {
                        formatearMoneda(
                            cita.total_estimado,
                        )
                    }
                </span>
            </div>

            <div
                className="
                    mt-4
                    flex
                    items-start
                    gap-3
                "
            >
                <div
                    className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-white
                        text-pink-500
                        shadow-sm
                    "
                >
                    <CalendarDays size={17} />
                </div>

                <div>
                    <p
                        className="
                            text-sm
                            font-semibold
                            capitalize
                            text-stone-700
                        "
                    >
                        {
                            formatearFechaTexto(
                                cita.fecha,
                            )
                        }
                    </p>

                    <p
                        className="
                            mt-1
                            flex
                            items-center
                            gap-1.5
                            text-xs
                            text-stone-400
                        "
                    >
                        <Clock3 size={12} />
                        {formatearHora(cita.hora_inicio)}
                        {' - '}
                        {formatearHora(cita.hora_fin)}
                    </p>
                </div>
            </div>

            {cita.servicios?.length > 0 && (
                <div
                    className="
                        mt-4
                        border-t
                        border-pink-100
                        pt-3
                    "
                >
                    <p
                        className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-stone-300
                        "
                    >
                        Servicios
                    </p>

                    <div className="mt-2 space-y-1">
                        {cita.servicios.map(
                            (servicio, index) => (
                                <div
                                    key={`${servicio.id_servicio}-${index}`}
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                    "
                                >
                                    <span className="text-xs font-medium text-stone-600">
                                        {servicio.nombre}
                                    </span>

                                    <span className="shrink-0 text-[10px] text-stone-400">
                                        {servicio.duracion_minutos} min
                                    </span>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}


function obtenerEstadoConsulta(
    estado,
) {
    const estados = {
        PENDIENTE: {
            texto:
                'Pendiente de confirmación',
            clase:
                'bg-amber-50 text-amber-600',
        },
        CONFIRMADA: {
            texto:
                'Confirmada',
            clase:
                'bg-emerald-50 text-emerald-600',
        },
        REPROGRAMACION_PENDIENTE: {
            texto:
                'Nuevo horario propuesto',
            clase:
                'bg-sky-50 text-sky-600',
        },
        RECHAZADA: {
            texto:
                'No confirmada',
            clase:
                'bg-rose-50 text-rose-600',
        },
        CANCELADA_CLIENTE: {
            texto:
                'Cancelada',
            clase:
                'bg-stone-100 text-stone-500',
        },
        CANCELADA_ADMIN: {
            texto:
                'Cancelada por la estética',
            clase:
                'bg-stone-100 text-stone-500',
        },
        FINALIZADA: {
            texto:
                'Finalizada',
            clase:
                'bg-violet-50 text-violet-600',
        },
        NO_ASISTIO: {
            texto:
                'No asistió',
            clase:
                'bg-orange-50 text-orange-600',
        },
    }

    return (
        estados[estado] || {
            texto:
                estado ||
                'Sin estado',
            clase:
                'bg-stone-100 text-stone-500',
        }
    )
}


function IndicadorPasos({
    paso,
}) {
    const pasos = [
        'Servicio',
        'Fecha',
        'Horario',
        'Datos',
    ]

    return (
        <div
            className="
                rounded-[24px]
                border
                border-pink-100
                bg-white
                px-4
                py-4
                shadow-sm
            "
        >
            <div
                className="
                    grid
                    grid-cols-4
                    gap-2
                "
            >
                {pasos.map(
                    (
                        nombre,
                        index,
                    ) => {
                        const numero =
                            index + 1

                        const activo =
                            numero === paso

                        const completado =
                            numero < paso

                        return (
                            <div
                                key={
                                    nombre
                                }
                                className="
                                    text-center
                                "
                            >
                                <div
                                    className={`
                                        mx-auto
                                        flex
                                        h-8
                                        w-8
                                        items-center
                                        justify-center
                                        rounded-full
                                        text-xs
                                        font-semibold

                                        ${
                                            completado
                                                ? 'bg-emerald-100 text-emerald-600'
                                                : activo
                                                    ? 'bg-pink-400 text-white'
                                                    : 'bg-stone-100 text-stone-400'
                                        }
                                    `}
                                >
                                    {completado ? (
                                        <Check
                                            size={14}
                                        />
                                    ) : (
                                        numero
                                    )}
                                </div>

                                <p
                                    className={`
                                        mt-2
                                        text-[10px]
                                        font-medium

                                        ${
                                            activo
                                                ? 'text-pink-500'
                                                : 'text-stone-400'
                                        }
                                    `}
                                >
                                    {nombre}
                                </p>
                            </div>
                        )
                    },
                )}
            </div>
        </div>
    )
}


function ServicioCard({
    servicio,
    seleccionado,
    onClick,
}) {
    return (
        <motion.button
            type="button"
            onClick={
                onClick
            }
            whileTap={{
                scale: 0.99,
            }}
            className={`
                flex
                w-full
                items-center
                gap-4
                rounded-[22px]
                border
                p-4
                text-left
                transition

                ${
                    seleccionado
                        ? `
                            border-pink-300
                            bg-pink-50
                            ring-2
                            ring-pink-100
                        `
                        : `
                            border-pink-100
                            bg-white
                        `
                }
            `}
        >
            <div
                className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-pink-100
                    text-pink-500
                "
            >
                <Scissors
                    size={20}
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
                        text-sm
                        font-semibold
                        text-stone-700
                    "
                >
                    {
                        servicio.nombre
                    }
                </p>

                {servicio.descripcion && (
                    <p
                        className="
                            mt-1
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
                        mt-2
                        flex
                        items-center
                        gap-3
                    "
                >
                    <span
                        className="
                            flex
                            items-center
                            gap-1
                            text-[11px]
                            text-stone-400
                        "
                    >
                        <Clock3
                            size={13}
                        />

                        {
                            servicio.duracion_minutos
                        } min
                    </span>

                    <span
                        className="
                            text-xs
                            font-semibold
                            text-pink-500
                        "
                    >
                        {
                            formatearMoneda(
                                servicio.precio,
                            )
                        }
                    </span>
                </div>
            </div>


            <div
                className={`
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border

                    ${
                        seleccionado
                            ? `
                                border-pink-400
                                bg-pink-400
                                text-white
                            `
                            : `
                                border-stone-200
                                bg-white
                                text-transparent
                            `
                    }
                `}
            >
                <Check
                    size={14}
                />
            </div>

        </motion.button>
    )
}


function CalendarioReserva({
    fechaBase,
    setFechaBase,
    fechaSeleccionada,
    onSeleccionar,
    diasCalendario,
}) {
    const hoy =
        obtenerFechaHoy()

    return (
        <div
            className="
                mt-5
            "
        >
            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >
                <button
                    type="button"
                    onClick={() =>
                        setFechaBase(
                            new Date(
                                fechaBase.getFullYear(),
                                fechaBase.getMonth() - 1,
                                1,
                            ),
                        )
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
                    <ChevronLeft
                        size={19}
                    />
                </button>


                <div className="text-center">
                    <p
                        className="
                            text-sm
                            font-semibold
                            text-stone-700
                        "
                    >
                        {
                            meses[
                                fechaBase.getMonth()
                            ]
                        }
                    </p>

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
                </div>


                <button
                    type="button"
                    onClick={() =>
                        setFechaBase(
                            new Date(
                                fechaBase.getFullYear(),
                                fechaBase.getMonth() + 1,
                                1,
                            ),
                        )
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
                    <ChevronRight
                        size={19}
                    />
                </button>

            </div>


            <div
                className="
                    mt-4
                    grid
                    grid-cols-7
                    gap-1
                "
            >
                {[
                    'D',
                    'L',
                    'M',
                    'M',
                    'J',
                    'V',
                    'S',
                ].map(
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
                                text-[10px]
                                font-semibold
                                text-stone-400
                            "
                        >
                            {dia}
                        </div>
                    ),
                )}
            </div>


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

                        const fecha =
                            formatearFechaClave(
                                dia.fecha,
                            )

                        const seleccionada =
                            fechaSeleccionada ===
                            fecha

                        const pasada =
                            fecha < hoy

                        return (
                            <button
                                key={
                                    fecha
                                }
                                type="button"
                                disabled={
                                    pasada
                                }
                                onClick={() =>
                                    onSeleccionar(
                                        fecha,
                                    )
                                }
                                className="
                                    flex
                                    aspect-square
                                    items-center
                                    justify-center
                                    disabled:cursor-not-allowed
                                "
                            >
                                <div
                                    className={`
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        text-sm
                                        font-medium
                                        transition

                                        ${
                                            seleccionada
                                                ? `
                                                    bg-pink-400
                                                    text-white
                                                    shadow-md
                                                    shadow-pink-200
                                                `
                                                : pasada
                                                    ? `
                                                        text-stone-200
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
                                </div>
                            </button>
                        )
                    },
                )}
            </div>
        </div>
    )
}


function Campo({
    icono: Icono,
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
                    focus-within:border-pink-300
                    focus-within:bg-white
                    focus-within:ring-4
                    focus-within:ring-pink-100/70
                "
            >
                <Icono
                    size={17}
                    className="
                        shrink-0
                        text-pink-400
                    "
                />

                <input
                    {...props}
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
    )
}


function ResumenReserva({
    resumen,
    fecha,
    horario,
}) {
    return (
        <div
            className="
                mt-5
                rounded-[22px]
                bg-pink-50
                p-4
            "
        >
            <p
                className="
                    text-xs
                    font-semibold
                    text-pink-500
                "
            >
                Resumen
            </p>

            <div
                className="
                    mt-3
                    space-y-2
                    text-xs
                    text-stone-500
                "
            >
                <p>
                    {
                        resumen.seleccionados.length
                    } servicio(s)
                </p>

                <p>
                    {
                        resumen.duracion
                    } minutos
                </p>

                <p>
                    {
                        fecha
                            ? formatearFechaTexto(
                                fecha,
                            )
                            : ''
                    }
                </p>

                <p>
                    {
                        horario
                            ? formatearHora(
                                horario.hora_inicio,
                            )
                            : ''
                    }
                </p>
            </div>

            <p
                className="
                    mt-4
                    text-lg
                    font-semibold
                    text-pink-500
                "
            >
                {
                    formatearMoneda(
                        resumen.total,
                    )
                }
            </p>
        </div>
    )
}


function ResumenFlotante({
    resumen,
}) {
    return (
        <div
            className="
                rounded-[22px]
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
                    items-center
                    justify-between
                    gap-4
                "
            >
                <div>
                    <p
                        className="
                            text-xs
                            font-semibold
                            text-stone-700
                        "
                    >
                        {
                            resumen.seleccionados.length
                        } servicio(s)
                    </p>

                    <p
                        className="
                            mt-1
                            text-[11px]
                            text-stone-400
                        "
                    >
                        {
                            resumen.duracion
                        } minutos
                    </p>
                </div>

                <p
                    className="
                        text-base
                        font-semibold
                        text-pink-500
                    "
                >
                    {
                        formatearMoneda(
                            resumen.total,
                        )
                    }
                </p>
            </div>
        </div>
    )
}


function Cargando({
    texto,
}) {
    return (
        <div
            className="
                py-12
                text-center
            "
        >
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
                    text-pink-400
                "
            >
                {texto}
            </p>
        </div>
    )
}


function Vacio({
    texto,
}) {
    return (
        <div
            className="
                mt-5
                rounded-2xl
                border
                border-dashed
                border-pink-200
                bg-pink-50/50
                p-7
                text-center
            "
        >
            <CalendarDays
                size={26}
                className="
                    mx-auto
                    text-pink-300
                "
            />

            <p
                className="
                    mt-3
                    text-xs
                    leading-5
                    text-stone-400
                "
            >
                {texto}
            </p>
        </div>
    )
}


function DatoResultado({
    titulo,
    valor,
}) {
    return (
        <div
            className="
                flex
                items-start
                justify-between
                gap-5
                border-b
                border-pink-100
                py-3
                last:border-0
            "
        >
            <span
                className="
                    text-xs
                    text-stone-400
                "
            >
                {titulo}
            </span>

            <span
                className="
                    text-right
                    text-xs
                    font-semibold
                    text-stone-700
                "
            >
                {valor}
            </span>
        </div>
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


function obtenerFechaHoy() {
    return formatearFechaClave(
        new Date(),
    )
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
    if (!fecha) {
        return ''
    }

    const [
        anio,
        mes,
        dia,
    ] = fecha.split('-')

    const fechaLocal =
        new Date(
            Number(anio),
            Number(mes) - 1,
            Number(dia),
        )

    return fechaLocal.toLocaleDateString(
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
    ] = String(hora)
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
        },
    )
}


export default Reservar