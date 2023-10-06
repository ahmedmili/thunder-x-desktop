import React, { useEffect, useMemo, useState } from 'react'

import "./commandsList.scss"
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import OldCommands from '../OldCommands/OldCommands';
import { commandService } from '../../../../../services/api/command.api';
import CurrentCommands from '../CurrentCommands/CurrentCommands';
import { useAppSelector } from '../../../../../Redux/store';
import { userService } from '../../../../../services/api/user.api';
interface CommandsListProps {
    type?: string;
    goToPassedCommands: any;
}

const CommandsList: React.FC<CommandsListProps> = ({ type = "old", goToPassedCommands }) => {


    const theme = useAppSelector((state) => state.home.theme)
    const [template, setTemplate] = useState<number>(theme)

    const [commands, setCommands] = useState<any>([])
    const [selectedCommand, setSelectedCommand] = useState<number>(-1)
    const [feedbacksList, setFeedbacksList] = useState<number[]>([])

    const getClientFeedback = async () => {
        const { status, data } = await userService.getClientFeedback()
        if (data.success) {
            let feedbackCommandsIdsList: number[] = [];
            data.data.map((feedback: any) => {
                feedbackCommandsIdsList.push(feedback.command_id)
            })
            const finalList = [... new Set(feedbackCommandsIdsList)]
            setFeedbacksList(finalList)
        }

    }

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
        setSelectedCommand(-1)
    }, [commands])

    useMemo(() => {
        type === "old" && getPassedCommands()
        type === "current" && getCurrentCommands()
    }, [type])

    useMemo(() => {
        getClientFeedback()
    }, [])

    return (

        <>
            <section className='commands-List' >
                {commands.length > 0 && commands.map((command: any, index: number) => {

                    return (
                        <React.Fragment key={index}>
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
                            {(selectedCommand === index && type === "old") && <OldCommands feedbacksList={feedbacksList} data={command} />}
                            {(selectedCommand === index && type === "current") && <CurrentCommands goToPassedCommands={goToPassedCommands} removeCommand={HandleRemove} data={command} />}
                        </React.Fragment>
                    )
                })}
            </section>
        </>
    )
}

export default CommandsList