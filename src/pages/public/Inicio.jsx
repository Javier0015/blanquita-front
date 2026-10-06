import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Scissors,
    Sparkles,
    Star,
} from 'lucide-react'

import {
    motion,
} from 'motion/react'

import {
    Link,
} from 'react-router-dom'


function Inicio() {
    return (
        <div className="space-y-8">

            {/* HERO */}
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
                    duration: 0.4,
                }}
                className="
                    relative
                    overflow-hidden
                    rounded-[32px]
                    border
                    border-pink-100
                    bg-gradient-to-br
                    from-white
                    via-pink-50
                    to-rose-100
                    p-6
                    shadow-sm
                    sm:p-8
                    lg:p-10
                "
            >
                <div
                    className="
                        absolute
                        -right-24
                        -top-24
                        h-64
                        w-64
                        rounded-full
                        bg-pink-200/40
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        -bottom-24
                        -left-20
                        h-56
                        w-56
                        rounded-full
                        bg-rose-200/30
                        blur-3xl
                    "
                />

                <div
                    className="
                        relative
                        grid
                        gap-8
                        lg:grid-cols-[1.2fr_.8fr]
                        lg:items-center
                    "
                >
                    <div>
                       

                        <h1
                            className="
                                mt-5
                                max-w-xl
                                text-3xl
                                font-semibold
                                leading-tight
                                tracking-tight
                                text-stone-800
                                sm:text-4xl
                                lg:text-5xl
                            "
                        >
Reserva tu cita                            <span className="text-pink-400">
                                {' '}fácilmente
                            </span>
                        </h1>


                        <p
                            className="
                                mt-4
                                max-w-lg
                                text-sm
                                leading-7
                                text-stone-500
                                sm:text-base
                            "
                        >
                            Elige tus servicios, selecciona
                            la fecha y encuentra el horario
                            que mejor se adapte a ti.
                        </p>


                        <div
                            className="
                                mt-6
                                flex
                                flex-col
                                gap-3
                                sm:flex-row
                            "
                        >
                            <Link
                                to="/reservar"
                                className="
                                    flex
                                    min-h-13
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-2xl
                                    bg-gradient-to-r
                                    from-pink-400
                                    to-rose-400
                                    px-6
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-lg
                                    shadow-pink-200/60
                                    transition
                                    active:scale-95
                                "
                            >
                                <CalendarDays
                                    size={18}
                                />

                                Reservar cita
                            </Link>


                            <Link
                                to="/servicios"
                                className="
                                    flex
                                    min-h-13
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-2xl
                                    border
                                    border-pink-100
                                    bg-white
                                    px-6
                                    text-sm
                                    font-semibold
                                    text-stone-600
                                    shadow-sm
                                    transition
                                    hover:bg-pink-50
                                "
                            >
                                Ver servicios

                                <ArrowRight
                                    size={17}
                                />
                            </Link>
                        </div>
                    </div>


                    {/* TARJETA DECORATIVA */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.96,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            delay: 0.15,
                            duration: 0.4,
                        }}
                        className="
                            relative
                            mx-auto
                            w-full
                            max-w-sm
                        "
                    >
                        <div
                            className="
                                rounded-[30px]
                                border
                                border-white/80
                                bg-white/75
                                p-5
                                shadow-xl
                                shadow-pink-100/70
                                backdrop-blur-xl
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
                                            tracking-wide
                                            text-pink-400
                                        "
                                    >
                                        Tu próxima cita
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xl
                                            font-semibold
                                            text-stone-800
                                        "
                                    >
                                        En pocos pasos
                                    </p>
                                </div>

                                <div
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-pink-100
                                        text-pink-500
                                    "
                                >
                                    <CalendarDays
                                        size={21}
                                    />
                                </div>
                            </div>


                            <div
                                className="
                                    mt-5
                                    space-y-3
                                "
                            >
                                <PasoRapido
                                    numero="1"
                                    texto="Elige tus servicios"
                                />

                                <PasoRapido
                                    numero="2"
                                    texto="Selecciona fecha y horario"
                                />

                                <PasoRapido
                                    numero="3"
                                    texto="Envía tu solicitud"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>




        </div>
    )
}


function PasoRapido({
    numero,
    texto,
}) {
    return (
        <div
            className="
                flex
                items-center
                gap-3
                rounded-2xl
                bg-pink-50/70
                p-3
            "
        >
            <div
                className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-pink-400
                    text-xs
                    font-semibold
                    text-white
                "
            >
                {numero}
            </div>

            <p
                className="
                    text-xs
                    font-medium
                    text-stone-600
                "
            >
                {texto}
            </p>
        </div>
    )
}


function Beneficio({
    icono: Icono,
    titulo,
    descripcion,
}) {
    return (
        <motion.article
            whileTap={{
                scale: 0.98,
            }}
            className="
                rounded-[24px]
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
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-2xl
                    bg-pink-100
                    text-pink-500
                "
            >
                <Icono
                    size={19}
                />
            </div>

            <h3
                className="
                    mt-4
                    text-sm
                    font-semibold
                    text-stone-700
                "
            >
                {titulo}
            </h3>

            <p
                className="
                    mt-2
                    text-xs
                    leading-5
                    text-stone-400
                "
            >
                {descripcion}
            </p>
        </motion.article>
    )
}


function MiniDato({
    valor,
    texto,
}) {
    return (
        <div
            className="
                rounded-[22px]
                bg-pink-50
                p-4
                text-center
            "
        >
            <p
                className="
                    text-xl
                    font-semibold
                    text-pink-500
                "
            >
                {valor}
            </p>

            <p
                className="
                    mt-1
                    text-[10px]
                    font-medium
                    text-stone-400
                "
            >
                {texto}
            </p>
        </div>
    )
}


export default Inicio