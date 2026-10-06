import {
    Bell,
    Building2,
    Clock3,
    KeyRound,
    Mail,
    Save,
    Send,
    Server,
    Settings,
    ShieldCheck,
    Sparkles,
} from 'lucide-react'

import {
    motion,
} from 'motion/react'

import {
    useEffect,
    useState,
} from 'react'

import api from '../../services/api.js'


function Configuracion() {
    const [
        formulario,
        setFormulario,
    ] = useState({
        nombre: '',
        telefono: '',
        correo: '',
        direccion: '',
        correoNotificaciones: '',

        confirmarAutomaticamente: false,
        permitirReservarSinCuenta: true,

        notificarNuevaReservacion: true,
        notificarCancelacion: true,
        notificarReprogramacion: true,

        smtpHost: '',
        smtpPort: '587',
        smtpSecure: false,
        smtpUser: '',
        smtpPassword: '',
        smtpFromName: '',
        smtpFromEmail: '',
        smtpActivo: false,
        smtpPasswordConfigurado: false,
    })


    const [
        cargando,
        setCargando,
    ] = useState(true)

    const [
        guardando,
        setGuardando,
    ] = useState(false)

    const [
        mensaje,
        setMensaje,
    ] = useState('')

    const [
        error,
        setError,
    ] = useState('')


    useEffect(() => {
        cargarConfiguracion()
    }, [])


    async function cargarConfiguracion() {
        try {
            setCargando(true)
            setMensaje('')
            setError('')

            const token =
                localStorage.getItem(
                    'token',
                )

            const respuesta =
                await api.get(
                    '/admin/configuracion',
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    },
                )

            const config =
                respuesta.data.configuracion


            setFormulario({
                nombre:
                    config.nombre_estetica ||
                    '',

                telefono:
                    config.telefono ||
                    '',

                correo:
                    config.correo_contacto ||
                    '',

                direccion:
                    config.direccion ||
                    '',

                correoNotificaciones:
                    config.correo_notificaciones ||
                    '',

                confirmarAutomaticamente:
                    Boolean(
                        config.confirmar_automaticamente,
                    ),

                permitirReservarSinCuenta:
                    Boolean(
                        config.permitir_reservar_sin_cuenta,
                    ),

                notificarNuevaReservacion:
                    Boolean(
                        config.notificar_nueva_reservacion,
                    ),

                notificarCancelacion:
                    Boolean(
                        config.notificar_cancelacion,
                    ),

                notificarReprogramacion:
                    Boolean(
                        config.notificar_reprogramacion,
                    ),

                smtpHost:
                    config.smtp_host ||
                    '',

                smtpPort:
                    String(
                        config.smtp_port ??
                        587,
                    ),

                smtpSecure:
                    Boolean(
                        config.smtp_secure,
                    ),

                smtpUser:
                    config.smtp_user ||
                    '',

                smtpPassword:
                    '',

                smtpFromName:
                    config.smtp_from_name ||
                    '',

                smtpFromEmail:
                    config.smtp_from_email ||
                    '',

                smtpActivo:
                    Boolean(
                        config.smtp_activo,
                    ),

                smtpPasswordConfigurado:
                    Boolean(
                        config.smtp_password_configurado,
                    ),
            })
        } catch (error) {
            console.error(
                'Error al cargar configuración:',
                error,
            )

            setError(
                error.response
                    ?.data
                    ?.mensaje ||
                'No fue posible cargar la configuración.',
            )
        } finally {
            setCargando(false)
        }
    }


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

        setMensaje('')
        setError('')
    }


    async function guardar(
        event,
    ) {
        event.preventDefault()

        try {
            setGuardando(true)
            setMensaje('')
            setError('')

            if (
                !formulario.nombre
                    .trim()
            ) {
                setError(
                    'El nombre de la estética es obligatorio.',
                )

                return
            }


            if (
                formulario.smtpActivo
            ) {
                if (
                    !formulario.smtpHost
                        .trim()
                ) {
                    setError(
                        'El servidor SMTP es obligatorio.',
                    )

                    return
                }

                if (
                    !formulario.smtpUser
                        .trim()
                ) {
                    setError(
                        'El usuario SMTP es obligatorio.',
                    )

                    return
                }

                if (
                    !formulario
                        .smtpPasswordConfigurado &&
                    !formulario.smtpPassword
                        .trim()
                ) {
                    setError(
                        'La contraseña SMTP es obligatoria.',
                    )

                    return
                }

                if (
                    !formulario.smtpFromEmail
                        .trim()
                ) {
                    setError(
                        'El correo del remitente es obligatorio.',
                    )

                    return
                }
            }


            const token =
                localStorage.getItem(
                    'token',
                )


            const respuesta =
                await api.put(
                    '/admin/configuracion',
                    {
                        nombre_estetica:
                            formulario.nombre,

                        telefono:
                            formulario.telefono,

                        correo_contacto:
                            formulario.correo,

                        direccion:
                            formulario.direccion,

                        correo_notificaciones:
                            formulario.correoNotificaciones,

                        permitir_reservar_sin_cuenta:
                            formulario.permitirReservarSinCuenta,

                        confirmar_automaticamente:
                            formulario.confirmarAutomaticamente,

                        notificar_nueva_reservacion:
                            formulario.notificarNuevaReservacion,

                        notificar_cancelacion:
                            formulario.notificarCancelacion,

                        notificar_reprogramacion:
                            formulario.notificarReprogramacion,

                        smtp_host:
                            formulario.smtpHost,

                        smtp_port:
                            Number(
                                formulario.smtpPort ||
                                587,
                            ),

                        smtp_secure:
                            formulario.smtpSecure,

                        smtp_user:
                            formulario.smtpUser,

                        smtp_password:
                            formulario.smtpPassword,

                        smtp_from_name:
                            formulario.smtpFromName,

                        smtp_from_email:
                            formulario.smtpFromEmail,

                        smtp_activo:
                            formulario.smtpActivo,
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    },
                )


            setMensaje(
                respuesta.data.mensaje ||
                'Configuración guardada correctamente.',
            )


            if (
                respuesta.data.configuracion
            ) {
                const config =
                    respuesta.data.configuracion


                setFormulario({
                    nombre:
                        config.nombre_estetica ||
                        '',

                    telefono:
                        config.telefono ||
                        '',

                    correo:
                        config.correo_contacto ||
                        '',

                    direccion:
                        config.direccion ||
                        '',

                    correoNotificaciones:
                        config.correo_notificaciones ||
                        '',

                    confirmarAutomaticamente:
                        Boolean(
                            config.confirmar_automaticamente,
                        ),

                    permitirReservarSinCuenta:
                        Boolean(
                            config.permitir_reservar_sin_cuenta,
                        ),

                    notificarNuevaReservacion:
                        Boolean(
                            config.notificar_nueva_reservacion,
                        ),

                    notificarCancelacion:
                        Boolean(
                            config.notificar_cancelacion,
                        ),

                    notificarReprogramacion:
                        Boolean(
                            config.notificar_reprogramacion,
                        ),

                    smtpHost:
                        config.smtp_host ||
                        '',

                    smtpPort:
                        String(
                            config.smtp_port ??
                            587,
                        ),

                    smtpSecure:
                        Boolean(
                            config.smtp_secure,
                        ),

                    smtpUser:
                        config.smtp_user ||
                        '',

                    smtpPassword:
                        '',

                    smtpFromName:
                        config.smtp_from_name ||
                        '',

                    smtpFromEmail:
                        config.smtp_from_email ||
                        '',

                    smtpActivo:
                        Boolean(
                            config.smtp_activo,
                        ),

                    smtpPasswordConfigurado:
                        Boolean(
                            config.smtp_password_configurado,
                        ),
                })
            }
        } catch (error) {
            console.error(
                'Error al guardar configuración:',
                error,
            )

            setError(
                error.response
                    ?.data
                    ?.mensaje ||
                'No fue posible guardar la configuración.',
            )
        } finally {
            setGuardando(false)
        }
    }


    if (cargando) {
        return (
            <div
                className="
                    flex
                    min-h-[50vh]
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
                            border-pink-200
                            border-t-pink-500
                        "
                    />

                    <p
                        className="
                            mt-4
                            text-sm
                            font-medium
                            text-pink-500
                        "
                    >
                        Cargando configuración...
                    </p>

                </div>
            </div>
        )
    }


    return (
        <form
            onSubmit={
                guardar
            }
            className="space-y-5"
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
                            Configuración
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
                            Personaliza los datos generales,
                            reservaciones, notificaciones y correo.
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
                        "
                    >
                        <Settings
                            size={20}
                        />
                    </div>

                </div>
            </motion.section>


            {/* MENSAJES */}
            {mensaje && (
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
                        border-emerald-100
                        bg-emerald-50
                        px-4
                        py-3
                        text-xs
                        font-medium
                        text-emerald-700
                    "
                >
                    {mensaje}
                </motion.div>
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


            {/* DATOS DE LA ESTÉTICA */}
            <Seccion
                titulo="Datos de la estética"
                descripcion="Información que podrá mostrarse en el sitio público."
                icono={
                    Building2
                }
            >
                <Campo
                    label="Nombre de la estética"
                    name="nombre"
                    value={
                        formulario.nombre
                    }
                    onChange={
                        actualizarCampo
                    }
                    placeholder="Nombre comercial"
                    required
                />


                <Campo
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
                    label="Correo de contacto"
                    name="correo"
                    value={
                        formulario.correo
                    }
                    onChange={
                        actualizarCampo
                    }
                    placeholder="contacto@estetica.com"
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
                        Dirección
                    </label>

                    <textarea
                        name="direccion"
                        value={
                            formulario.direccion
                        }
                        onChange={
                            actualizarCampo
                        }
                        rows={3}
                        placeholder="Dirección del establecimiento"
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
                            transition
                            placeholder:text-stone-300
                            focus:border-pink-300
                            focus:bg-white
                            focus:ring-4
                            focus:ring-pink-100/70
                        "
                    />
                </div>
            </Seccion>


            {/* RESERVACIONES */}
            <Seccion
                titulo="Reservaciones"
                descripcion="Define cómo funcionarán las solicitudes de citas."
                icono={
                    Clock3
                }
            >
                <SwitchConfiguracion
                    titulo="Permitir reservar sin iniciar sesión"
                    descripcion="Los clientes podrán solicitar una cita proporcionando sus datos."
                    name="permitirReservarSinCuenta"
                    checked={
                        formulario.permitirReservarSinCuenta
                    }
                    onChange={
                        actualizarCampo
                    }
                />


                <SwitchConfiguracion
                    titulo="Confirmar reservaciones automáticamente"
                    descripcion="Si está desactivado, las nuevas reservaciones quedarán pendientes de aprobación."
                    name="confirmarAutomaticamente"
                    checked={
                        formulario.confirmarAutomaticamente
                    }
                    onChange={
                        actualizarCampo
                    }
                />
            </Seccion>


            {/* NOTIFICACIONES */}
            <Seccion
                titulo="Notificaciones"
                descripcion="Configura los avisos que recibirá la administración."
                icono={
                    Bell
                }
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
                        Correo para notificaciones
                    </label>

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            border-pink-100
                            bg-pink-50/50
                            px-4
                            transition
                            focus-within:border-pink-300
                            focus-within:bg-white
                            focus-within:ring-4
                            focus-within:ring-pink-100/70
                        "
                    >
                        <Mail
                            size={17}
                            className="
                                shrink-0
                                text-pink-400
                            "
                        />

                        <input
                            type="email"
                            name="correoNotificaciones"
                            value={
                                formulario.correoNotificaciones
                            }
                            onChange={
                                actualizarCampo
                            }
                            placeholder="administracion@estetica.com"
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


                <SwitchConfiguracion
                    titulo="Nueva reservación"
                    descripcion="Enviar correo cuando un cliente genere una nueva solicitud."
                    name="notificarNuevaReservacion"
                    checked={
                        formulario.notificarNuevaReservacion
                    }
                    onChange={
                        actualizarCampo
                    }
                />


                <SwitchConfiguracion
                    titulo="Cancelaciones"
                    descripcion="Enviar correo cuando una reservación sea cancelada."
                    name="notificarCancelacion"
                    checked={
                        formulario.notificarCancelacion
                    }
                    onChange={
                        actualizarCampo
                    }
                />


                <SwitchConfiguracion
                    titulo="Reprogramaciones"
                    descripcion="Enviar correo cuando exista un cambio de horario."
                    name="notificarReprogramacion"
                    checked={
                        formulario.notificarReprogramacion
                    }
                    onChange={
                        actualizarCampo
                    }
                />
            </Seccion>


            {/* SMTP */}
            <Seccion
                titulo="Correo SMTP"
                descripcion="Configura la cuenta que utilizará el sistema para enviar correos."
                icono={
                    Server
                }
            >
                <SwitchConfiguracion
                    titulo="Activar envío de correos"
                    descripcion="Permite que el sistema utilice esta cuenta SMTP para enviar notificaciones."
                    name="smtpActivo"
                    checked={
                        formulario.smtpActivo
                    }
                    onChange={
                        actualizarCampo
                    }
                />


                <CampoIcono
                    icono={
                        Server
                    }
                    label="Servidor SMTP"
                    name="smtpHost"
                    value={
                        formulario.smtpHost
                    }
                    onChange={
                        actualizarCampo
                    }
                    placeholder="smtp.gmail.com"
                />


                <div
                    className="
                        grid
                        grid-cols-1
                        gap-4
                        sm:grid-cols-2
                    "
                >
                    <Campo
                        label="Puerto SMTP"
                        name="smtpPort"
                        value={
                            formulario.smtpPort
                        }
                        onChange={
                            actualizarCampo
                        }
                        placeholder="587"
                        type="number"
                        min="1"
                        max="65535"
                    />


                    <div
                        className="
                            flex
                            items-end
                        "
                    >
                        <SwitchConfiguracion
                            titulo="Conexión segura"
                            descripcion="Úsalo normalmente con SSL/TLS directo, por ejemplo puerto 465."
                            name="smtpSecure"
                            checked={
                                formulario.smtpSecure
                            }
                            onChange={
                                actualizarCampo
                            }
                        />
                    </div>
                </div>


                <CampoIcono
                    icono={
                        Mail
                    }
                    label="Usuario SMTP"
                    name="smtpUser"
                    value={
                        formulario.smtpUser
                    }
                    onChange={
                        actualizarCampo
                    }
                    placeholder="correo@gmail.com"
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
                        Contraseña SMTP
                    </label>

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            border-pink-100
                            bg-pink-50/50
                            px-4
                            transition
                            focus-within:border-pink-300
                            focus-within:bg-white
                            focus-within:ring-4
                            focus-within:ring-pink-100/70
                        "
                    >
                        <KeyRound
                            size={17}
                            className="
                                shrink-0
                                text-pink-400
                            "
                        />

                        <input
                            type="password"
                            name="smtpPassword"
                            value={
                                formulario.smtpPassword
                            }
                            onChange={
                                actualizarCampo
                            }
                            placeholder={
                                formulario.smtpPasswordConfigurado
                                    ? 'Contraseña ya configurada'
                                    : 'Contraseña SMTP'
                            }
                            autoComplete="new-password"
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


                    {formulario
                        .smtpPasswordConfigurado && (
                        <div
                            className="
                                mt-2
                                flex
                                items-center
                                gap-2
                                text-[11px]
                                font-medium
                                text-emerald-600
                            "
                        >
                            <ShieldCheck
                                size={14}
                            />

                            Contraseña configurada.
                            Déjala vacía para conservarla.
                        </div>
                    )}
                </div>


                <CampoIcono
                    icono={
                        Send
                    }
                    label="Nombre del remitente"
                    name="smtpFromName"
                    value={
                        formulario.smtpFromName
                    }
                    onChange={
                        actualizarCampo
                    }
                    placeholder="Mi Estética"
                />


                <CampoIcono
                    icono={
                        Mail
                    }
                    label="Correo del remitente"
                    name="smtpFromEmail"
                    value={
                        formulario.smtpFromEmail
                    }
                    onChange={
                        actualizarCampo
                    }
                    placeholder="correo@gmail.com"
                    type="email"
                />


                <div
                    className="
                        rounded-2xl
                        border
                        border-pink-100
                        bg-pink-50/40
                        p-4
                    "
                >
                    <p
                        className="
                            text-xs
                            font-semibold
                            text-stone-700
                        "
                    >
                        Ejemplo para Gmail
                    </p>

                    <div
                        className="
                            mt-3
                            space-y-1
                            text-[11px]
                            leading-5
                            text-stone-400
                        "
                    >
                        <p>
                            Servidor: smtp.gmail.com
                        </p>

                        <p>
                            Puerto: 587
                        </p>

                        <p>
                            Conexión segura: desactivada
                        </p>

                        <p>
                            Contraseña: contraseña de aplicación
                        </p>
                    </div>
                </div>
            </Seccion>


            {/* BOTÓN GUARDAR */}
            <div
                className="
                    sticky
                    bottom-24
                    z-20
                    lg:bottom-4
                "
            >
                <motion.button
                    type="submit"
                    disabled={
                        guardando
                    }
                    whileTap={{
                        scale:
                            guardando
                                ? 1
                                : 0.98,
                    }}
                    className="
                        flex
                        min-h-13
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
                        shadow-xl
                        shadow-pink-200/60
                        transition
                        disabled:cursor-not-allowed
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
                            <Save
                                size={18}
                            />

                            Guardar configuración
                        </>
                    )}
                </motion.button>
            </div>

        </form>
    )
}


function Seccion({
    titulo,
    descripcion,
    icono: Icono,
    children,
}) {
    return (
        <motion.section
            initial={{
                opacity: 0,
                y: 12,
            }}
            animate={{
                opacity: 1,
                y: 0,
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
                    mb-5
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
                        bg-pink-50
                        text-pink-500
                    "
                >
                    <Icono
                        size={18}
                    />
                </div>

                <div>
                    <h2
                        className="
                            text-sm
                            font-semibold
                            text-stone-800
                        "
                    >
                        {titulo}
                    </h2>

                    <p
                        className="
                            mt-1
                            text-xs
                            leading-5
                            text-stone-400
                        "
                    >
                        {descripcion}
                    </p>
                </div>
            </div>


            <div className="space-y-4">
                {children}
            </div>
        </motion.section>
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
                    bg-pink-50/50
                    px-4
                    text-sm
                    text-stone-700
                    outline-none
                    transition
                    placeholder:text-stone-300
                    focus:border-pink-300
                    focus:bg-white
                    focus:ring-4
                    focus:ring-pink-100/70
                "
            />
        </div>
    )
}


function CampoIcono({
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
                    bg-pink-50/50
                    px-4
                    transition
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


function SwitchConfiguracion({
    titulo,
    descripcion,
    name,
    checked,
    onChange,
}) {
    return (
        <label
            className="
                flex
                cursor-pointer
                items-center
                justify-between
                gap-4
                rounded-2xl
                border
                border-pink-50
                bg-pink-50/40
                p-4
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
                    {titulo}
                </p>

                <p
                    className="
                        mt-1
                        text-xs
                        leading-5
                        text-stone-400
                    "
                >
                    {descripcion}
                </p>
            </div>


            <div
                className="
                    relative
                    shrink-0
                "
            >
                <input
                    type="checkbox"
                    name={
                        name
                    }
                    checked={
                        checked
                    }
                    onChange={
                        onChange
                    }
                    className="
                        peer
                        sr-only
                    "
                />

                <div
                    className="
                        h-7
                        w-12
                        rounded-full
                        bg-stone-200
                        transition
                        peer-checked:bg-pink-400
                    "
                />

                <div
                    className="
                        absolute
                        left-1
                        top-1
                        h-5
                        w-5
                        rounded-full
                        bg-white
                        shadow-sm
                        transition-transform
                        peer-checked:translate-x-5
                    "
                />
            </div>
        </label>
    )
}


export default Configuracion