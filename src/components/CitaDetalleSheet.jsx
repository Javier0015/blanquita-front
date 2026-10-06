import {
    CalendarDays,
    Check,
    ChevronDown,
    Clock3,
    Mail,
    Phone,
    RefreshCw,
    UserRound,
    X,
} from 'lucide-react'

import {
    AnimatePresence,
    motion,
} from 'motion/react'

import {
    useEffect,
    useState,
} from 'react'

import api from '../services/api.js'


function CitaDetalleSheet({
    abierta,
    idCita,
    onCerrar,
    onActualizada,
}) {
    const [
        cita,
        setCita,
    ] = useState(null)

    const [
        historial,
        setHistorial,
    ] = useState([])

    const [
        cargando,
        setCargando,
    ] = useState(false)

    const [
        procesando,
        setProcesando,
    ] = useState(false)

    const [
        error,
        setError,
    ] = useState('')

    const [
        modoReprogramar,
        setModoReprogramar,
    ] = useState(false)

    const [
        fechaNueva,
        setFechaNueva,
    ] = useState('')

    const [
        horaNueva,
        setHoraNueva,
    ] = useState('')

    const [
        horariosDisponibles,
        setHorariosDisponibles,
    ] = useState([])

    const [
        cargandoHorarios,
        setCargandoHorarios,
    ] = useState(false)

    const [
        comentarioReprogramacion,
        setComentarioReprogramacion,
    ] = useState('')

    const [
        motivoRechazo,
        setMotivoRechazo,
    ] = useState('')


    useEffect(() => {
        if (
            abierta &&
            idCita
        ) {
            cargarDetalle()
        }
    }, [
        abierta,
        idCita,
    ])


    useEffect(() => {
        if (
            modoReprogramar &&
            fechaNueva &&
            cita
        ) {
            cargarHorariosDisponibles()
        }
    }, [
        fechaNueva,
        modoReprogramar,
    ])


    async function cargarDetalle() {
        try {
            setCargando(true)
            setError('')

            const token =
                localStorage.getItem('token')

            const respuesta =
                await api.get(
                    `/citas/admin/${idCita}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    },
                )

            setCita(
                respuesta.data.cita ||
                null,
            )

            setHistorial(
                respuesta.data.historial ||
                [],
            )

            setModoReprogramar(false)
            setFechaNueva('')
            setHoraNueva('')
            setHorariosDisponibles([])
            setComentarioReprogramacion('')
            setMotivoRechazo('')
        } catch (error) {
            console.error(
                'Error al cargar detalle de cita:',
                error,
            )

            setError(
                error.response?.data?.mensaje ||
                'No fue posible cargar la cita.',
            )
        } finally {
            setCargando(false)
        }
    }


    async function confirmarCita() {
        if (!idCita) {
            return
        }

        try {
            setProcesando(true)
            setError('')

            const token =
                localStorage.getItem('token')

            await api.patch(
                `/citas/admin/${idCita}/confirmar`,
                {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                },
            )

            await cargarDetalle()

            if (onActualizada) {
                await onActualizada()
            }
        } catch (error) {
            console.error(
                'Error al confirmar cita:',
                error,
            )

            setError(
                error.response?.data?.mensaje ||
                'No fue posible confirmar la cita.',
            )
        } finally {
            setProcesando(false)
        }
    }


    async function rechazarCita() {
        if (!idCita) {
            return
        }

        try {
            setProcesando(true)
            setError('')

            const token =
                localStorage.getItem('token')

            await api.patch(
                `/citas/admin/${idCita}/rechazar`,
                {
                    motivo:
                        motivoRechazo.trim() ||
                        null,
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                },
            )

            await cargarDetalle()

            if (onActualizada) {
                await onActualizada()
            }
        } catch (error) {
            console.error(
                'Error al rechazar cita:',
                error,
            )

            setError(
                error.response?.data?.mensaje ||
                'No fue posible rechazar la cita.',
            )
        } finally {
            setProcesando(false)
        }
    }


    async function cargarHorariosDisponibles() {
        try {
            setCargandoHorarios(true)
            setHoraNueva('')
            setHorariosDisponibles([])
            setError('')

            const servicios =
                Array.isArray(cita?.servicios)
                    ? cita.servicios
                    : []

            const idsServicios =
                servicios
                    .map(
                        (servicio) =>
                            servicio.id_servicio,
                    )
                    .filter(Boolean)

            if (
                idsServicios.length === 0
            ) {
                setError(
                    'La cita no tiene servicios válidos para calcular disponibilidad.',
                )

                return
            }

            const respuesta =
                await api.get(
                    '/citas/disponibilidad',
                    {
                        params: {
                            fecha:
                                fechaNueva,

                            servicios:
                                idsServicios.join(','),
                        },
                    },
                )

            setHorariosDisponibles(
                respuesta.data
                    ?.disponibilidad
                    ?.horarios || [],
            )
        } catch (error) {
            console.error(
                'Error al consultar horarios:',
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


    async function guardarReprogramacion() {
        if (
            !fechaNueva ||
            !horaNueva
        ) {
            setError(
                'Selecciona una fecha y un horario.',
            )

            return
        }

        try {
            setProcesando(true)
            setError('')

            const token =
                localStorage.getItem('token')

            await api.patch(
                `/citas/admin/${idCita}/reprogramar`,
                {
                    fecha:
                        fechaNueva,

                    hora_inicio:
                        horaNueva,

                    comentario:
                        comentarioReprogramacion.trim() ||
                        null,
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                },
            )

            await cargarDetalle()

            if (onActualizada) {
                await onActualizada()
            }
        } catch (error) {
            console.error(
                'Error al reprogramar cita:',
                error,
            )

            setError(
                error.response?.data?.mensaje ||
                'No fue posible reprogramar la cita.',
            )
        } finally {
            setProcesando(false)
        }
    }


    if (!abierta) {
        return null
    }


    const servicios =
        Array.isArray(cita?.servicios)
            ? cita.servicios
            : []

    const fechaCita =
        cita
            ? obtenerFechaCita(cita)
            : null

    const horaInicio =
        cita
            ? (
                cita.hora_inicio_confirmada ||
                cita.hora_inicio_solicitada
            )
            : null

    const horaFin =
        cita
            ? (
                cita.hora_fin_confirmada ||
                cita.hora_fin_solicitada
            )
            : null


    return (
        <AnimatePresence>
            {abierta && (
                <>
                    {/* FONDO */}
                    <motion.button
                        type="button"
                        aria-label="Cerrar detalle"
                        onClick={onCerrar}
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
                            z-40
                            bg-stone-900/30
                            backdrop-blur-[2px]
                        "
                    />


                    {/* SHEET */}
                    <motion.section
                        initial={{
                            y: '100%',
                        }}
                        animate={{
                            y: 0,
                        }}
                        exit={{
                            y: '100%',
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
                            z-50
                            mx-auto
                            max-h-[92vh]
                            max-w-xl
                            overflow-hidden
                            rounded-t-[30px]
                            bg-white
                            shadow-2xl
                        "
                    >
                        {/* INDICADOR */}
                        <div
                            className="
                                flex
                                justify-center
                                pt-3
                            "
                        >
                            <div
                                className="
                                    h-1
                                    w-10
                                    rounded-full
                                    bg-stone-200
                                "
                            />
                        </div>


                        {/* ENCABEZADO */}
                        <div
                            className="
                                flex
                                items-start
                                justify-between
                                gap-4
                                border-b
                                border-pink-50
                                px-5
                                pb-4
                                pt-3
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
                                        text-xs
                                        font-medium
                                        text-pink-500
                                    "
                                >
                                    Detalle de reservación
                                </p>

                                <h2
                                    className="
                                        mt-1
                                        truncate
                                        text-xl
                                        font-semibold
                                        text-stone-800
                                    "
                                >
                                    {
                                        cita?.folio ||
                                        'Cita'
                                    }
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={onCerrar}
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-pink-50
                                    text-pink-500
                                "
                            >
                                <X size={18} />
                            </button>
                        </div>


                        {/* CONTENIDO */}
                        <div
                            className="
                                max-h-[calc(92vh-90px)]
                                overflow-y-auto
                                px-5
                                pb-8
                                pt-5
                            "
                        >

                            {cargando && (
                                <div
                                    className="
                                        flex
                                        min-h-[260px]
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
                                                mt-3
                                                text-xs
                                                font-medium
                                                text-pink-400
                                            "
                                        >
                                            Cargando reservación...
                                        </p>

                                    </div>
                                </div>
                            )}


                            {!cargando &&
                                error && (
                                    <div
                                        className="
                                            mb-4
                                            rounded-2xl
                                            border
                                            border-rose-100
                                            bg-rose-50
                                            p-4
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
                                                    cargarDetalle
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
                                    </div>
                                )}


                            {!cargando &&
                                cita && (
                                    <div className="space-y-5">

                                        {/* ESTADO */}
                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-3
                                            "
                                        >
                                            <EstadoCita
                                                estado={
                                                    cita.estado
                                                }
                                            />

                                            <p
                                                className="
                                                    text-xs
                                                    text-stone-400
                                                "
                                            >
                                                {
                                                    cita.origen ||
                                                    ''
                                                }
                                            </p>
                                        </div>


                                        {/* CLIENTE */}
                                        <Bloque
                                            titulo="Cliente"
                                        >
                                            <Dato
                                                icono={
                                                    UserRound
                                                }
                                                titulo="Nombre"
                                                valor={
                                                    cita.cliente_nombre ||
                                                    'Sin nombre'
                                                }
                                            />

                                            <Dato
                                                icono={
                                                    Phone
                                                }
                                                titulo="Teléfono"
                                                valor={
                                                    cita.telefono ||
                                                    'No registrado'
                                                }
                                            />

                                            <Dato
                                                icono={
                                                    Mail
                                                }
                                                titulo="Correo"
                                                valor={
                                                    cita.correo ||
                                                    'No registrado'
                                                }
                                            />
                                        </Bloque>


                                        {/* FECHA */}
                                        <Bloque
                                            titulo="Fecha y horario"
                                        >
                                            <Dato
                                                icono={
                                                    CalendarDays
                                                }
                                                titulo="Fecha"
                                                valor={
                                                    fechaCita
                                                        ? formatearFechaTexto(
                                                            fechaCita,
                                                        )
                                                        : 'Sin fecha'
                                                }
                                            />

                                            <Dato
                                                icono={
                                                    Clock3
                                                }
                                                titulo="Horario"
                                                valor={
                                                    `${formatearHora(
                                                        horaInicio,
                                                    )} - ${formatearHora(
                                                        horaFin,
                                                    )}`
                                                }
                                            />
                                        </Bloque>


                                        {/* SERVICIOS */}
                                        <Bloque
                                            titulo="Servicios"
                                        >
                                            {servicios.length === 0 ? (
                                                <p
                                                    className="
                                                        text-xs
                                                        text-stone-400
                                                    "
                                                >
                                                    No hay servicios registrados.
                                                </p>
                                            ) : (
                                                <div
                                                    className="
                                                        space-y-3
                                                    "
                                                >
                                                    {servicios.map(
                                                        (
                                                            servicio,
                                                            index,
                                                        ) => (
                                                            <div
                                                                key={
                                                                    `${servicio.id_servicio}-${index}`
                                                                }
                                                                className="
                                                                    flex
                                                                    items-start
                                                                    justify-between
                                                                    gap-4
                                                                    rounded-2xl
                                                                    bg-pink-50/60
                                                                    p-3
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
                                                                            text-sm
                                                                            font-semibold
                                                                            text-stone-700
                                                                        "
                                                                    >
                                                                        {
                                                                            servicio.nombre
                                                                        }
                                                                    </p>

                                                                    <p
                                                                        className="
                                                                            mt-1
                                                                            text-[11px]
                                                                            text-stone-400
                                                                        "
                                                                    >
                                                                        {
                                                                            servicio.duracion_minutos
                                                                        } min
                                                                    </p>
                                                                </div>

                                                                <p
                                                                    className="
                                                                        shrink-0
                                                                        text-sm
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
                                                        ),
                                                    )}
                                                </div>
                                            )}

                                            <div
                                                className="
                                                    mt-4
                                                    flex
                                                    items-center
                                                    justify-between
                                                    border-t
                                                    border-pink-50
                                                    pt-4
                                                "
                                            >
                                                <span
                                                    className="
                                                        text-xs
                                                        font-medium
                                                        text-stone-500
                                                    "
                                                >
                                                    Total estimado
                                                </span>

                                                <span
                                                    className="
                                                        text-base
                                                        font-semibold
                                                        text-pink-500
                                                    "
                                                >
                                                    {
                                                        formatearMoneda(
                                                            cita.total_estimado,
                                                        )
                                                    }
                                                </span>
                                            </div>
                                        </Bloque>


                                        {/* OBSERVACIONES */}
                                        {(cita.observaciones_cliente ||
                                            cita.observaciones_admin) && (
                                                <Bloque
                                                    titulo="Observaciones"
                                                >
                                                    {cita.observaciones_cliente && (
                                                        <div>
                                                            <p
                                                                className="
                                                                    text-[10px]
                                                                    font-semibold
                                                                    uppercase
                                                                    tracking-wide
                                                                    text-stone-400
                                                                "
                                                            >
                                                                Cliente
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-sm
                                                                    leading-6
                                                                    text-stone-600
                                                                "
                                                            >
                                                                {
                                                                    cita.observaciones_cliente
                                                                }
                                                            </p>
                                                        </div>
                                                    )}

                                                    {cita.observaciones_admin && (
                                                        <div
                                                            className="
                                                                mt-4
                                                            "
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
                                                                Administración
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-sm
                                                                    leading-6
                                                                    text-stone-600
                                                                "
                                                            >
                                                                {
                                                                    cita.observaciones_admin
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                </Bloque>
                                            )}


                                        {/* REPROGRAMACIÓN */}
                                        {modoReprogramar && (
                                            <Bloque
                                                titulo="Reprogramar cita"
                                            >
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
                                                        Nueva fecha
                                                    </label>

                                                    <input
                                                        type="date"
                                                        value={
                                                            fechaNueva
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            setFechaNueva(
                                                                event.target.value,
                                                            )
                                                        }
                                                        className="
                                                            min-h-12
                                                            w-full
                                                            rounded-2xl
                                                            border
                                                            border-pink-100
                                                            bg-pink-50/50
                                                            px-4
                                                            text-sm
                                                            text-stone-700
                                                            outline-none
                                                            focus:border-pink-300
                                                            focus:ring-4
                                                            focus:ring-pink-100/70
                                                        "
                                                    />
                                                </div>


                                                {fechaNueva && (
                                                    <div
                                                        className="
                                                            mt-4
                                                        "
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
                                                            Horario
                                                        </label>

                                                        {cargandoHorarios ? (
                                                            <div
                                                                className="
                                                                    flex
                                                                    items-center
                                                                    gap-2
                                                                    rounded-2xl
                                                                    bg-pink-50
                                                                    p-4
                                                                    text-xs
                                                                    text-pink-500
                                                                "
                                                            >
                                                                <span
                                                                    className="
                                                                        h-4
                                                                        w-4
                                                                        animate-spin
                                                                        rounded-full
                                                                        border-2
                                                                        border-pink-200
                                                                        border-t-pink-500
                                                                    "
                                                                />

                                                                Consultando disponibilidad...
                                                            </div>
                                                        ) : horariosDisponibles.length === 0 ? (
                                                            <div
                                                                className="
                                                                    rounded-2xl
                                                                    border
                                                                    border-dashed
                                                                    border-pink-200
                                                                    bg-pink-50/50
                                                                    p-4
                                                                    text-xs
                                                                    text-stone-400
                                                                "
                                                            >
                                                                No hay horarios disponibles para esta fecha.
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className="
                                                                    grid
                                                                    grid-cols-3
                                                                    gap-2
                                                                "
                                                            >
                                                                {horariosDisponibles.map(
                                                                    (
                                                                        horario,
                                                                    ) => {
                                                                        const seleccionado =
                                                                            horaNueva ===
                                                                            horario.hora_inicio

                                                                        return (
                                                                            <button
                                                                                key={
                                                                                    horario.hora_inicio
                                                                                }
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    setHoraNueva(
                                                                                        horario.hora_inicio,
                                                                                    )
                                                                                }
                                                                                className={`
                                                                                    rounded-2xl
                                                                                    border
                                                                                    px-2
                                                                                    py-3
                                                                                    text-xs
                                                                                    font-semibold
                                                                                    transition

                                                                                    ${
                                                                                        seleccionado
                                                                                            ? `
                                                                                                border-pink-300
                                                                                                bg-pink-400
                                                                                                text-white
                                                                                            `
                                                                                            : `
                                                                                                border-pink-100
                                                                                                bg-white
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
                                                                            </button>
                                                                        )
                                                                    },
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}


                                                <div
                                                    className="
                                                        mt-4
                                                    "
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
                                                        Comentario
                                                    </label>

                                                    <textarea
                                                        rows={3}
                                                        value={
                                                            comentarioReprogramacion
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            setComentarioReprogramacion(
                                                                event.target.value,
                                                            )
                                                        }
                                                        placeholder="Motivo o indicaciones para el cliente"
                                                        className="
                                                            w-full
                                                            resize-none
                                                            rounded-2xl
                                                            border
                                                            border-pink-100
                                                            bg-pink-50/50
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


                                                <button
                                                    type="button"
                                                    disabled={
                                                        procesando ||
                                                        !fechaNueva ||
                                                        !horaNueva
                                                    }
                                                    onClick={
                                                        guardarReprogramacion
                                                    }
                                                    className="
                                                        mt-4
                                                        flex
                                                        min-h-12
                                                        w-full
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        rounded-2xl
                                                        bg-violet-500
                                                        px-4
                                                        text-sm
                                                        font-semibold
                                                        text-white
                                                        disabled:opacity-50
                                                    "
                                                >
                                                    <CalendarDays
                                                        size={17}
                                                    />

                                                    Guardar reprogramación
                                                </button>
                                            </Bloque>
                                        )}


                                        {/* MOTIVO DE RECHAZO */}
                                        {cita.estado !==
                                            'RECHAZADA' && (
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
                                                    Motivo de rechazo
                                                    <span
                                                        className="
                                                            ml-1
                                                            font-normal
                                                            text-stone-300
                                                        "
                                                    >
                                                        opcional
                                                    </span>
                                                </label>

                                                <textarea
                                                    rows={2}
                                                    value={
                                                        motivoRechazo
                                                    }
                                                    onChange={(
                                                        event,
                                                    ) =>
                                                        setMotivoRechazo(
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="Ej. Horario no disponible"
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
                                        )}


                                        {/* ACCIONES */}
                                        <Acciones
                                            cita={
                                                cita
                                            }
                                            procesando={
                                                procesando
                                            }
                                            modoReprogramar={
                                                modoReprogramar
                                            }
                                            onConfirmar={
                                                confirmarCita
                                            }
                                            onReprogramar={() =>
                                                setModoReprogramar(
                                                    (
                                                        anterior,
                                                    ) =>
                                                        !anterior,
                                                )
                                            }
                                            onRechazar={
                                                rechazarCita
                                            }
                                        />


                                        {/* HISTORIAL */}
                                        {historial.length > 0 && (
                                            <Bloque
                                                titulo="Historial"
                                            >
                                                <div
                                                    className="
                                                        space-y-4
                                                    "
                                                >
                                                    {historial.map(
                                                        (
                                                            item,
                                                        ) => (
                                                            <div
                                                                key={
                                                                    item.id_historial
                                                                }
                                                                className="
                                                                    relative
                                                                    border-l-2
                                                                    border-pink-100
                                                                    pl-4
                                                                "
                                                            >
                                                                <span
                                                                    className="
                                                                        absolute
                                                                        -left-[5px]
                                                                        top-1
                                                                        h-2
                                                                        w-2
                                                                        rounded-full
                                                                        bg-pink-300
                                                                    "
                                                                />

                                                                <p
                                                                    className="
                                                                        text-xs
                                                                        font-semibold
                                                                        text-stone-600
                                                                    "
                                                                >
                                                                    {
                                                                        textoEstado(
                                                                            item.estado_nuevo,
                                                                        )
                                                                    }
                                                                </p>

                                                                {item.comentario && (
                                                                    <p
                                                                        className="
                                                                            mt-1
                                                                            text-xs
                                                                            leading-5
                                                                            text-stone-400
                                                                        "
                                                                    >
                                                                        {
                                                                            item.comentario
                                                                        }
                                                                    </p>
                                                                )}

                                                                <p
                                                                    className="
                                                                        mt-1
                                                                        text-[10px]
                                                                        text-stone-300
                                                                    "
                                                                >
                                                                    {
                                                                        formatearFechaHora(
                                                                            item.created_at,
                                                                        )
                                                                    }
                                                                </p>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </Bloque>
                                        )}

                                    </div>
                                )}

                        </div>
                    </motion.section>
                </>
            )}
        </AnimatePresence>
    )
}


function Acciones({
    cita,
    procesando,
    modoReprogramar,
    onConfirmar,
    onReprogramar,
    onRechazar,
}) {
    const estado =
        cita.estado

    const cerrada = [
        'RECHAZADA',
        'CANCELADA_CLIENTE',
        'CANCELADA_ADMIN',
        'FINALIZADA',
        'NO_ASISTIO',
    ].includes(estado)


    if (cerrada) {
        return (
            <div
                className="
                    rounded-2xl
                    bg-stone-50
                    p-4
                    text-center
                    text-xs
                    text-stone-400
                "
            >
                Esta cita ya no tiene acciones disponibles.
            </div>
        )
    }


    return (
        <div
            className="
                grid
                grid-cols-2
                gap-3
            "
        >
            {estado !==
                'CONFIRMADA' && (
                <button
                    type="button"
                    disabled={
                        procesando
                    }
                    onClick={
                        onConfirmar
                    }
                    className="
                        flex
                        min-h-12
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        bg-emerald-500
                        px-4
                        text-sm
                        font-semibold
                        text-white
                        disabled:opacity-50
                    "
                >
                    <Check size={17} />

                    Confirmar
                </button>
            )}


            <button
                type="button"
                disabled={
                    procesando
                }
                onClick={
                    onReprogramar
                }
                className="
                    flex
                    min-h-12
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-violet-50
                    px-4
                    text-sm
                    font-semibold
                    text-violet-600
                    disabled:opacity-50
                "
            >
                <CalendarDays
                    size={17}
                />

                {modoReprogramar
                    ? 'Cancelar'
                    : 'Reprogramar'}
            </button>


            <button
                type="button"
                disabled={
                    procesando
                }
                onClick={
                    onRechazar
                }
                className="
                    col-span-2
                    flex
                    min-h-12
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-rose-50
                    px-4
                    text-sm
                    font-semibold
                    text-rose-500
                    disabled:opacity-50
                "
            >
                <X size={17} />

                Rechazar reservación
            </button>
        </div>
    )
}


function Bloque({
    titulo,
    children,
}) {
    return (
        <section
            className="
                rounded-[24px]
                border
                border-pink-100
                bg-white
                p-4
            "
        >
            <h3
                className="
                    mb-4
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-stone-400
                "
            >
                {titulo}
            </h3>

            {children}
        </section>
    )
}


function Dato({
    icono: Icono,
    titulo,
    valor,
}) {
    return (
        <div
            className="
                flex
                items-start
                gap-3
                py-2
            "
        >
            <div
                className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-pink-50
                    text-pink-400
                "
            >
                <Icono size={16} />
            </div>

            <div
                className="
                    min-w-0
                    flex-1
                "
            >
                <p
                    className="
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-wide
                        text-stone-300
                    "
                >
                    {titulo}
                </p>

                <p
                    className="
                        mt-1
                        break-words
                        text-sm
                        font-medium
                        text-stone-700
                    "
                >
                    {valor}
                </p>
            </div>
        </div>
    )
}


function EstadoCita({
    estado,
}) {
    const estilos = {
        PENDIENTE:
            'bg-amber-50 text-amber-600',

        CONFIRMADA:
            'bg-emerald-50 text-emerald-600',

        REPROGRAMACION_PENDIENTE:
            'bg-violet-50 text-violet-600',

        RECHAZADA:
            'bg-rose-50 text-rose-500',

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
                inline-flex
                rounded-full
                px-3
                py-1.5
                text-[10px]
                font-semibold
                ${
                    estilos[estado] ||
                    'bg-stone-100 text-stone-500'
                }
            `}
        >
            {textoEstado(estado)}
        </span>
    )
}


function textoEstado(
    estado,
) {
    const estados = {
        PENDIENTE:
            'Pendiente',

        CONFIRMADA:
            'Confirmada',

        REPROGRAMACION_PENDIENTE:
            'Reprogramación pendiente',

        RECHAZADA:
            'Rechazada',

        CANCELADA_CLIENTE:
            'Cancelada por cliente',

        CANCELADA_ADMIN:
            'Cancelada por administración',

        FINALIZADA:
            'Finalizada',

        NO_ASISTIO:
            'No asistió',
    }

    return (
        estados[estado] ||
        estado ||
        'Sin estado'
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

    return String(fecha)
        .substring(
            0,
            10,
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
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
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
        Number(horasTexto)

    const periodo =
        horas >= 12
            ? 'PM'
            : 'AM'

    const hora12 =
        horas % 12 || 12

    return `${hora12}:${minutosTexto} ${periodo}`
}


function formatearMoneda(
    cantidad,
) {
    return Number(
        cantidad || 0,
    ).toLocaleString(
        'es-MX',
        {
            style: 'currency',
            currency: 'MXN',
        },
    )
}


function formatearFechaHora(
    fecha,
) {
    if (!fecha) {
        return ''
    }

    return new Date(
        fecha,
    ).toLocaleString(
        'es-MX',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        },
    )
}


export default CitaDetalleSheet