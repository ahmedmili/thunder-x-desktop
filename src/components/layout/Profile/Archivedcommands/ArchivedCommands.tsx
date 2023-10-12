import { useState } from 'react'
import CoverImage from '../../../.../../../assets/profile/ArchivedCommands/cover.svg'
import CommandsList from './CommandsList/CommandsList'
import './archivedCommands.scss'
function ArchivedCommands() {


    const [nav, setNav] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)

    const handleLoading = () => {
        setLoading((current) => !current)
    }

    const handleNav = (i: number) => {
        loading && setNav(i)
    }

    const goToPassedCommands = () => {
        setNav(1)
    }
    return (
        <div className='archived-commands-container'>
            <header>
                <p className='title'>Archives commandes</p>
                <div className='archivedC-image' style={{ backgroundImage: ` url(${CoverImage})` }}></div>

                <nav>
                    <ul>
                        <li>
                            <span onClick={() => handleNav(1)} className={`list-item-text ${nav === 1 && "active"}`} >Mes commandes passées</span>
                        </li>
                        <li>
                            <span onClick={() => handleNav(2)} className={`list-item-text ${nav === 2 && "active"}`}>Suivi mes commandes</span>
                        </li>
                    </ul>
                </nav>

            </header>
            <main className='commands-list-container'>
                <CommandsList handlenav={handleLoading} goToPassedCommands={goToPassedCommands} type={nav === 1 ? "old" : "current"} />
            </main>
        </div>
    )
}

export default ArchivedCommands