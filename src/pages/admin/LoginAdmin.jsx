import {
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    Sparkles,
} from 'lucide-react'

import {
    motion,
} from 'motion/react'

import {
    useState,
} from 'react'

import {
    useNavigate,
} from 'react-router-dom'

import api from '../../services/api.js'

function LoginAdmin() {
    const navigate = useNavigate()

    const [correo, setCorreo] = useState('')
    const [password, setPassword] = useState('')
    const [mostrarPassword, setMostrarPassword] =
        useState(false)

    const [cargando, setCargando] =
        useState(false)

    const [error, setError] =
        useState('')

    async function iniciarSesion(event) {
        event.preventDefault()

        setError('')

        if (!correo.trim() || !password) {
            setError(
                'Ingresa tu correo y contraseña.',
            )

            return
        }

        try {
            setCargando(true)

            const respuesta =
                await api.post(
                    '/auth/login',
                    {
                        correo:
                            correo.trim(),
                        password,
                    },
                )

            const {
                token,
                usuario,
            } = respuesta.data

            localStorage.setItem(
                'token',
                token,
            )

            localStorage.setItem(
                'usuario',
                JSON.stringify(usuario),
            )

            navigate(
                '/admin/inicio',
                {
                    replace: true,
                },
            )
        } catch (error) {
            console.error(
                'Error al iniciar sesión:',
                error,
            )

            setError(
                error.response?.data?.mensaje ||
                'No fue posible iniciar sesión.',
            )
        } finally {
            setCargando(false)
        }
    }

    return (
        <main
            className="
                relative
                flex
                min-h-screen
                items-center
                justify-center
                overflow-hidden
                bg-gradient-to-br
                from-[#fff8fb]
                via-pink-50
                to-rose-100
                px-4
                py-8
            "
        >
            {/* FORMAS DECORATIVAS */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -left-20
                    -top-20
                    h-64
                    w-64
                    rounded-full
                    bg-pink-200/50
                    blur-3xl
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-24
                    -right-20
                    h-72
                    w-72
                    rounded-full
                    bg-fuchsia-200/40
                    blur-3xl
                "
            />

            <motion.section
                initial={{
                    opacity: 0,
                    y: 18,
                    scale: 0.98,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                }}
                transition={{
                    duration: 0.45,
                    ease: 'easeOut',
                }}
                className="
                    relative
                    w-full
                    max-w-md
                    overflow-hidden
                    rounded-[32px]
                    border
                    border-white/80
                    bg-white/85
                    p-5
                    shadow-2xl
                    shadow-pink-200/40
                    backdrop-blur-xl
                    sm:p-7
                "
            >
                {/* CABECERA */}

                <div className="text-center">

                    <motion.div
                        initial={{
                            rotate: -10,
                            scale: 0.8,
                        }}
                        animate={{
                            rotate: 0,
                            scale: 1,
                        }}
                        transition={{
                            duration: 0.45,
                            delay: 0.1,
                        }}
                        className="
                            mx-auto
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-[22px]
                            bg-gradient-to-br
                            from-pink-300
                            via-rose-300
                            to-fuchsia-300
                            text-white
                            shadow-lg
                            shadow-pink-200/70
                        "
                    >
                        <Sparkles
                            size={28}
                            strokeWidth={2}
                        />
                    </motion.div>

                    <h1
                        className="
                            mt-5
                            text-2xl
                            font-semibold
                            tracking-tight
                            text-stone-800
                        "
                    >
                        Bienvenida
                    </h1>

                    <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-stone-400
                        "
                    >
                        Ingresa al panel de
                        administración.
                    </p>

                </div>

                {/* FORMULARIO */}

                <form
                    onSubmit={iniciarSesion}
                    className="mt-7 space-y-4"
                >

                    {/* CORREO */}

                    <div>
                        <label
                            htmlFor="correo"
                            className="
                                mb-2
                                block
                                text-xs
                                font-semibold
                                text-stone-500
                            "
                        >
                            Correo electrónico
                        </label>

                        <div
                            className="
                                flex
                                min-h-13
                                items-center
                                gap-3
                                rounded-2xl
                                border
                                border-pink-100
                                bg-pink-50/60
                                px-4
                                transition
                                focus-within:border-pink-300
                                focus-within:bg-white
                                focus-within:ring-4
                                focus-within:ring-pink-100/70
                            "
                        >
                            <Mail
                                size={18}
                                className="
                                    shrink-0
                                    text-pink-400
                                "
                            />

                            <input
                                id="correo"
                                type="email"
                                autoComplete="email"
                                value={correo}
                                onChange={(
                                    event,
                                ) =>
                                    setCorreo(
                                        event.target.value,
                                    )
                                }
                                placeholder="Escribe tu correo"
                                className="
                                    min-h-13
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

                    {/* CONTRASEÑA */}

                    <div>
                        <label
                            htmlFor="password"
                            className="
                                mb-2
                                block
                                text-xs
                                font-semibold
                                text-stone-500
                            "
                        >
                            Contraseña
                        </label>

                        <div
                            className="
                                flex
                                min-h-13
                                items-center
                                gap-3
                                rounded-2xl
                                border
                                border-pink-100
                                bg-pink-50/60
                                px-4
                                transition
                                focus-within:border-pink-300
                                focus-within:bg-white
                                focus-within:ring-4
                                focus-within:ring-pink-100/70
                            "
                        >
                            <LockKeyhole
                                size={18}
                                className="
                                    shrink-0
                                    text-pink-400
                                "
                            />

                            <input
                                id="password"
                                type={
                                    mostrarPassword
                                        ? 'text'
                                        : 'password'
                                }
                                autoComplete="current-password"
                                value={password}
                                onChange={(
                                    event,
                                ) =>
                                    setPassword(
                                        event.target.value,
                                    )
                                }
                                placeholder="••••••••"
                                className="
                                    min-h-13
                                    w-full
                                    bg-transparent
                                    text-sm
                                    text-stone-700
                                    outline-none
                                    placeholder:text-stone-300
                                "
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setMostrarPassword(
                                        !mostrarPassword,
                                    )
                                }
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    text-stone-400
                                    transition
                                    hover:bg-pink-100
                                    hover:text-pink-500
                                    active:scale-95
                                "
                            >
                                {
                                    mostrarPassword
                                        ? (
                                            <EyeOff
                                                size={18}
                                            />
                                        )
                                        : (
                                            <Eye
                                                size={18}
                                            />
                                        )
                                }
                            </button>
                        </div>
                    </div>

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

                    {/* BOTÓN */}

                    <motion.button
                        type="submit"
                        disabled={cargando}
                        whileTap={
                            cargando
                                ? undefined
                                : {
                                    scale: 0.98,
                                }
                        }
                        className="
                            flex
                            min-h-13
                            w-full
                            items-center
                            justify-center
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
                            shadow-pink-200/70
                            transition
                            hover:shadow-xl
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >
                        {cargando
                            ? (
                                <span className="flex items-center gap-2">
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

                                    Ingresando...
                                </span>
                            )
                            : (
                                'Iniciar sesión'
                            )}
                    </motion.button>

                </form>

                <p
                    className="
                        mt-6
                        text-center
                        text-[11px]
                        leading-5
                        text-stone-300
                    "
                >
                    Acceso exclusivo para personal autorizado.
                </p>

            </motion.section>

        </main>
    )
}

export default LoginAdmin