import {

    CalendarDays,

    Home,

    LogIn,

    Menu,

    Scissors,

    Sparkles,

    X,

} from 'lucide-react'



import {

    AnimatePresence,

    motion,

} from 'motion/react'



import {

    useState,

} from 'react'



import {

    NavLink,

    Outlet,

} from 'react-router-dom'





function PublicLayout() {

    const [

        menuAbierto,

        setMenuAbierto,

    ] = useState(false)



    const enlaces = [

        {

            nombre: 'Inicio',

            ruta: '/',

            icono: Home,

        },

        {

            nombre: 'Servicios',

            ruta: '/servicios',

            icono: Scissors,

        },

        {

            nombre: 'Reservar',

            ruta: '/reservar',

            icono: CalendarDays,

        },

    ]





    return (

        <div

            className="

                min-h-screen

                bg-gradient-to-br

                from-pink-50/70

                via-white

                to-rose-50/80

                text-stone-800

            "

        >

            {/* HEADER */}

            <header

                className="

                    sticky

                    top-0

                    z-40

                    border-b

                    border-pink-100/80

                    bg-white/85

                    backdrop-blur-xl

                "

            >

                <div

                    className="

                        mx-auto

                        flex

                        min-h-16

                        max-w-6xl

                        items-center

                        justify-between

                        gap-4

                        px-4

                        sm:px-6

                    "

                >

                    {/* LOGO */}

                    <NavLink

                        to="/"

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

                                h-10

                                w-10

                                shrink-0

                                items-center

                                justify-center

                                rounded-2xl

                                bg-gradient-to-br

                                from-pink-300

                                to-rose-400

                                text-white

                                shadow-md

                                shadow-pink-200/60

                            "

                        >

                            <Sparkles

                                size={18}

                            />

                        </div>



                        <div

                            className="

                                min-w-0

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

                                Blanquita

                            </p>





                        </div>

                    </NavLink>





                    {/* NAV DESKTOP */}

                    <nav

                        className="

                            hidden

                            items-center

                            gap-2

                            md:flex

                        "

                    >

                        {enlaces.map(

                            ({

                                nombre,

                                ruta,

                                icono: Icono,

                            }) => (

                                <NavLink

                                    key={

                                        ruta

                                    }

                                    to={

                                        ruta

                                    }

                                    end={

                                        ruta ===

                                        '/'

                                    }

                                    className={({

                                        isActive,

                                    }) => `

                                        flex

                                        items-center

                                        gap-2

                                        rounded-2xl

                                        px-4

                                        py-2.5

                                        text-sm

                                        font-medium

                                        transition



                                        ${

                                            isActive

                                                ? `

                                                    bg-pink-100

                                                    text-pink-600

                                                `

                                                : `

                                                    text-stone-500

                                                    hover:bg-pink-50

                                                    hover:text-pink-500

                                                `

                                        }

                                    `}

                                >

                                    <Icono

                                        size={

                                            16

                                        }

                                    />



                                    {

                                        nombre

                                    }

                                </NavLink>

                            ),

                        )}





                        <NavLink

                            to="/reservar"

                            className="

                                ml-2

                                flex

                                items-center

                                gap-2

                                rounded-2xl

                                bg-gradient-to-r

                                from-pink-400

                                to-rose-400

                                px-5

                                py-2.5

                                text-sm

                                font-semibold

                                text-white

                                shadow-md

                                shadow-pink-200/60

                                transition

                                active:scale-95

                            "

                        >

                            <CalendarDays

                                size={16}

                            />



                            Agenda tu cita

                        </NavLink>

                        <NavLink
                            to="/admin"
                            className="
                                ml-1
                                flex
                                items-center
                                gap-2
                                rounded-2xl
                                border
                                border-pink-100
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-stone-500
                                shadow-sm
                                transition
                                hover:bg-pink-50
                                hover:text-pink-500
                            "
                        >
                            <LogIn
                                size={16}
                            />

                            Administrador
                        </NavLink>

                    </nav>





                    {/* BOTÓN MÓVIL */}

                    <button

                        type="button"

                        onClick={() =>

                            setMenuAbierto(

                                true,

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

                            md:hidden

                        "

                    >

                        <Menu

                            size={20}

                        />

                    </button>



                </div>

            </header>





            {/* CONTENIDO */}

            <main

                className="

                    mx-auto

                    w-full

                    max-w-6xl

                    px-4

                    py-5

                    pb-28

                    sm:px-6

                    md:py-8

                    md:pb-10

                "

            >

                <Outlet />

            </main>





            {/* NAVEGACIÓN INFERIOR MÓVIL */}

            <nav

                className="

                    fixed

                    bottom-0

                    left-0

                    right-0

                    z-30

                    border-t

                    border-pink-100

                    bg-white/95

                    px-3

                    pb-[max(10px,env(safe-area-inset-bottom))]

                    pt-2

                    backdrop-blur-xl

                    md:hidden

                "

            >

                <div

                    className="

                        mx-auto

                        grid

                        max-w-md

                        grid-cols-3

                        gap-2

                    "

                >

                    {enlaces.map(

                        ({

                            nombre,

                            ruta,

                            icono: Icono,

                        }) => (

                            <NavLink

                                key={

                                    ruta

                                }

                                to={

                                    ruta

                                }

                                end={

                                    ruta ===

                                    '/'

                                }

                                className={({

                                    isActive,

                                }) => `

                                    flex

                                    min-h-14

                                    flex-col

                                    items-center

                                    justify-center

                                    gap-1

                                    rounded-2xl

                                    text-[10px]

                                    font-semibold

                                    transition



                                    ${

                                        isActive

                                            ? `

                                                bg-pink-50

                                                text-pink-500

                                            `

                                            : `

                                                text-stone-400

                                            `

                                    }

                                `}

                            >

                                <Icono

                                    size={

                                        19

                                    }

                                />



                                {

                                    nombre

                                }

                            </NavLink>

                        ),

                    )}

                </div>

            </nav>





            {/* MENÚ MÓVIL */}

            <AnimatePresence>

                {menuAbierto && (

                    <>

                        <motion.button

                            type="button"

                            aria-label="Cerrar menú"

                            onClick={() =>

                                setMenuAbierto(

                                    false,

                                )

                            }

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

                                z-50

                                bg-stone-900/25

                                backdrop-blur-[2px]

                                md:hidden

                            "

                        />





                        <motion.aside

                            initial={{

                                x: '100%',

                            }}

                            animate={{

                                x: 0,

                            }}

                            exit={{

                                x: '100%',

                            }}

                            transition={{

                                type: 'spring',

                                damping: 28,

                                stiffness: 260,

                            }}

                            className="

                                fixed

                                bottom-0

                                right-0

                                top-0

                                z-[60]

                                w-[84%]

                                max-w-sm

                                bg-white

                                p-5

                                shadow-2xl

                                md:hidden

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

                                <div

                                    className="

                                        flex

                                        items-center

                                        gap-3

                                    "

                                >

                                    <div

                                        className="

                                            flex

                                            h-10

                                            w-10

                                            items-center

                                            justify-center

                                            rounded-2xl

                                            bg-gradient-to-br

                                            from-pink-300

                                            to-rose-400

                                            text-white

                                        "

                                    >

                                        <Sparkles

                                            size={

                                                18

                                            }

                                        />

                                    </div>



                                    <div>

                                        <p

                                            className="

                                                text-sm

                                                font-semibold

                                                text-stone-800

                                            "

                                        >

                                            Blanquita

                                        </p>





                                    </div>

                                </div>





                                <button

                                    type="button"

                                    onClick={() =>

                                        setMenuAbierto(

                                            false,

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

                                    <X

                                        size={

                                            18

                                        }

                                    />

                                </button>



                            </div>





                            <div

                                className="

                                    mt-8

                                    space-y-2

                                "

                            >

                                {enlaces.map(

                                    ({

                                        nombre,

                                        ruta,

                                        icono: Icono,

                                    }) => (

                                        <NavLink

                                            key={

                                                ruta

                                            }

                                            to={

                                                ruta

                                            }

                                            end={

                                                ruta ===

                                                '/'

                                            }

                                            onClick={() =>

                                                setMenuAbierto(

                                                    false,

                                                )

                                            }

                                            className={({

                                                isActive,

                                            }) => `

                                                flex

                                                min-h-14

                                                items-center

                                                gap-3

                                                rounded-2xl

                                                px-4

                                                text-sm

                                                font-semibold

                                                transition



                                                ${

                                                    isActive

                                                        ? `

                                                            bg-pink-100

                                                            text-pink-600

                                                        `

                                                        : `

                                                            text-stone-500

                                                            hover:bg-pink-50

                                                        `

                                                }

                                            `}

                                        >

                                            <Icono

                                                size={

                                                    18

                                                }

                                            />



                                            {

                                                nombre

                                            }

                                        </NavLink>

                                    ),

                                )}

                            </div>





                            <NavLink

                                to="/reservar"

                                onClick={() =>

                                    setMenuAbierto(

                                        false,

                                    )

                                }

                                className="

                                    mt-6

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

                                    shadow-pink-200/60

                                "

                            >

                                <CalendarDays

                                    size={

                                        18

                                    }

                                />



                                Reservar ahora

                            </NavLink>

                            <NavLink
                                to="/admin"
                                onClick={() =>
                                    setMenuAbierto(
                                        false,
                                    )
                                }
                                className="
                                    mt-3
                                    flex
                                    min-h-13
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-2xl
                                    border
                                    border-pink-100
                                    bg-white
                                    px-5
                                    text-sm
                                    font-semibold
                                    text-stone-500
                                    shadow-sm
                                    transition
                                    hover:bg-pink-50
                                    hover:text-pink-500
                                "
                            >
                                <LogIn
                                    size={18}
                                />

                                Iniciar como administrador
                            </NavLink>



                        </motion.aside>

                    </>

                )}

            </AnimatePresence>

        </div>

    )

}





export default PublicLayout