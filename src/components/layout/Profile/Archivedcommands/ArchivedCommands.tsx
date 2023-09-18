import React, { useEffect, useState } from 'react'
import CoverImage from '../../../.../../../assets/profile/ArchivedCommands/cover.svg'
import './archivedCommands.scss'
import CommandsList from './CommandsList/CommandsList'
function ArchivedCommands() {

    const [nav, setNav] = useState<number>(1)

    const handleNav = (i: number) => {
        setNav(i)
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
                <CommandsList type={nav === 1 ? "old" : "current"} />
            </main>
        </div>
    )
}

export default ArchivedCommands