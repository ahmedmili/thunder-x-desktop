import React, { useEffect, useState } from 'react'
import CoverImage from '../../../.../../../assets/profile/ArchivedCommands/cover.svg'
import './archivedCommands.scss'
import CommandsList from './CommandsList/CommandsList'
import { commandService } from '../../../../services/api/command.api'
function ArchivedCommands() {

    const [nav, setNav] = useState<number>(1)
    const [allCommands, setAllCommands] = useState<any>([])

    const handleNav = (i: number) => {
        setNav(i)
    }

    const getPassedCommands = async () => {
        const { status, data } = await commandService.passedCommands()
        const commands = data.data
        setAllCommands(commands)
    }
    const getCurrentCommands = async () => {
        const { status, data } = await commandService.myCommands()
        const commands = data.data
        setAllCommands(commands)
    }

    useEffect(() => {

        nav == 1 && getPassedCommands()
        nav == 2 && getCurrentCommands()
    }, [nav])

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
                {(allCommands) && <CommandsList data={allCommands} />}
            </main>
        </div>
    )
}

export default ArchivedCommands