import React, { useEffect, useMemo, useState } from 'react';

import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { commandService } from '../../../../../services/api/command.api';
import { userService } from '../../../../../services/api/user.api';
import eventEmitter from '../../../../../services/thunderEventsService';
import CurrentCommands from '../CurrentCommands/CurrentCommands';
import OldCommands from '../OldCommands/OldCommands';
import "./commandsList.scss";
import Spinner from '../../../../spinner/Spinner';
interface CommandsListProps {
    type?: string;
    goToPassedCommands: () => void;
    handlenav: () => void;
}

const CommandsList: React.FC<CommandsListProps> = ({ type = "old", goToPassedCommands, handlenav }) => {

    const [commands, setCommands] = useState<any>([])
    const [selectedCommand, setSelectedCommand] = useState<number>(-1)
    const [feedbacksList, setFeedbacksList] = useState<number[]>([])
    const [loading, setLoading] = useState<boolean>(false)
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
        setLoading((current) => current = true)
        const { status, data } = await commandService.passedCommands()
        const commands = data.data
        data.success && setLoading((current) => current = false)
        type === "old" && data.success && setCommands(commands)
    }
    const getCurrentCommands = async () => {
        setLoading((current) => current = true)
        const { status, data } = await commandService.myCommands()
        const commands = data.data
        data.success && setLoading((current) => current = false);
        type === "current" && data.success && setCommands(commands)
    }
    useEffect(() => {
        setSelectedCommand(-1)
    }, [commands])

    useMemo(() => {
        type === "old" && !loading && getPassedCommands()
        type === "current" && !loading && getCurrentCommands()
    }, [type])

    useMemo(() => {
        getClientFeedback()
    }, [])
    useEffect(() => {
        handlenav()
    }, [loading])
    useEffect(() => {
        eventEmitter.on('COMMAND_UPDATED', () => { getCurrentCommands() })
        return () => {
            eventEmitter.off('COMMAND_UPDATED', () => { getCurrentCommands() })
        }
    }, [])


    return (
        <>
            {
                loading ? (
                    <Spinner name='test' borderColor='#24A6A4' />
                ) : (
                    <>
                        <section className='commands-List' >
                            {commands.length > 0 && commands.map((command: any, index: number) => {

                                return (
                                    <React.Fragment key={index}>
                                        <div className={`command-header  ${selectedCommand === index ? "active-header" : ""}`} key={index} onClick={() => handleSelectCommand(index)}>
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
        </>
    )
}

export default CommandsList