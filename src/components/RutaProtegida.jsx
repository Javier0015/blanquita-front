import {
    Navigate,
} from 'react-router-dom'

import {
    useEffect,
    useState,
} from 'react'

import api from '../services/api.js'

function RutaProtegida({
    children,
}) {
    const [validando, setValidando] =
        useState(true)

    const [autorizado, setAutorizado] =
        useState(false)

    useEffect(() => {
        validarSesion()
    }, [])

    async function validarSesion() {
        const token =
            localStorage.getItem('token')

        const usuario =
            localStorage.getItem('usuario')

        if (!token || !usuario) {
            setAutorizado(false)
            setValidando(false)

            return
        }

        try {
            await api.get(
                '/auth/me',
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                },
            )

            setAutorizado(true)
        } catch (error) {
            console.error(
                'Sesión inválida:',
                error,
            )

            localStorage.removeItem('token')
            localStorage.removeItem('usuario')

            setAutorizado(false)
        } finally {
            setValidando(false)
        }
    }

    if (validando) {
        return (
            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-gradient-to-br
                    from-pink-50
                    to-rose-100
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
                        Validando sesión...
                    </p>

                </div>
            </div>
        )
    }

    if (!autorizado) {
        return (
            <Navigate
                to="/admin"
                replace
            />
        )
    }

    return children
}

export default RutaProtegida