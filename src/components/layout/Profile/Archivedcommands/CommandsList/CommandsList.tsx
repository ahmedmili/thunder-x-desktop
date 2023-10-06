import React, { useEffect, useState } from 'react'

import "./commandsList.scss"
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import OldCommands from '../OldCommands/OldCommands';
import { commandService } from '../../../../../services/api/command.api';
import CurrentCommands from '../CurrentCommands/CurrentCommands';
import { useAppSelector } from '../../../../../Redux/store';
interface CommandsListProps {
    type?: string;
    goToPassedCommands: any;
}

const CommandsList: React.FC<CommandsListProps> = ({ type = "old", goToPassedCommands }) => {
    const theme = useAppSelector((state) => state.home.theme)
    const [template, setTemplate] = useState<number>(theme)

    const [commands, setCommands] = useState<any>([])
    const [selectedCommand, setSelectedCommand] = useState<number>(-1)

    const handleSelectCommand = (i: number) => {
        i === selectedCommand ? setSelectedCommand(-1) : setSelectedCommand(i)
    }

    const HandleRemove = async (command_id: number) => {
        const { status, data } = await commandService.removecommand(command_id)
        data.success && getCurrentCommands()
    }
    const getPassedCommands = async () => {
        const { status, data } = await commandService.passedCommands()
        const commands = data.data
        setCommands(commands)
    }
    const getCurrentCommands = async () => {
        const { status, data } = await commandService.myCommands()
        const commands = data.data
        setCommands(commands)
    }
    useEffect(() => {
        type === "old" && getPassedCommands()
        type === "current" && getCurrentCommands()
    }, [type])

    useEffect(() => {
        setSelectedCommand(-1)
    }, [commands])
    useEffect(() => {
        setTemplate(theme)
    }, [theme])
    return (

        <>
            <section className='commands-List' >
                {commands.length > 0 && commands.map((command: any, index: number) => {

                    return (
                        <div key={index}>
                            <div className={`command-header  ${selectedCommand === index ? "active-header" : ""} ${(template === 1 && selectedCommand !== index) && "dark-background2"}`} key={index} onClick={() => handleSelectCommand(index)}>
                                <span >
                                    Commande N°{command.id}
                                </span>
                                <span >
                                    {command.client.name}
                                </span>
                                <span>
                                    {command.to_adresse}
                                </span>
                                <span>
                                    {command.created_at}
                                </span>
                                <KeyboardArrowUpOutlinedIcon className='icon' />
                            </div>
                            {(selectedCommand === index && type === "old") && <OldCommands data={command} />}
                            {(selectedCommand === index && type === "current") && <CurrentCommands goToPassedCommands={goToPassedCommands} removeCommand={HandleRemove} data={command} />}
                        </div>
                    )
                })}
            </section>
        </>
    )
}

export default CommandsList