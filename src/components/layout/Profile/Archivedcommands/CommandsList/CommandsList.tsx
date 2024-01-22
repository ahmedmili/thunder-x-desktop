import React, { useEffect, useMemo, useState } from 'react';

import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import empty from '../../../../../assets/panier/empty.png';
import { commandService } from '../../../../../services/api/command.api';
import { userService } from '../../../../../services/api/user.api';
import eventEmitter from '../../../../../services/thunderEventsService';
import Spinner from '../../../../spinner/Spinner';
import CurrentCommands from '../CurrentCommands/CurrentCommands';
import OldCommands from '../OldCommands/OldCommands';
import ArrowIcon from './../../../../../assets/profile/leftArrow.svg';
import "./commandsList.scss";

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { localStorageService } from '../../../../../services/localStorageService';
interface CommandsListProps {
    type?: string;
    goToPassedCommands: () => void;
    handlenav: (loading: boolean) => void;
}

const CommandsList: React.FC<CommandsListProps> = ({ type = "old", goToPassedCommands, handlenav }) => {


    const navigate = useNavigate();
    const { t } = useTranslation();
    const [commands, setCommands] = useState<any>([])
    const [displayedContent, setDisplayedContent] = useState<any[]>([]);
    const [selectedCommand, setSelectedCommand] = useState<number>(-1)
    const [feedbacksList, setFeedbacksList] = useState<number[]>([])
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false)

    const itemsPerPage = 7;
    const navigateToHome = () => {
        const currentLocation = localStorageService.getCurrentLocation()
        currentLocation ? navigate('/search') : navigate('/')
    }
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
        setCurrentPage(1)
        const { status, data } = await commandService.passedCommands()
        const commands = data.data
        data.success && setLoading((current) => current = false)
        type === "old" && data.success && setCommands(commands)

    }
    const getCurrentCommands = async () => {
        setLoading((current) => current = true)
        setCurrentPage(1)
        const { status, data } = await commandService.myCommands()
        const commands = data.data
        data.success && setLoading((current) => current = false);
        type === "current" && data.success && setCommands(commands)

    }

    const updateCurrentCommands = async () => {
        setLoading((current) => current = true)
        const { status, data } = await commandService.myCommands()
        const commands = data.data
        data.success && setLoading((current) => current = false);
        data.success && setCommands(commands)
    }

    useEffect(() => {
        setSelectedCommand(-1)
        const totalPages = Math.ceil(commands.length / itemsPerPage)
        setTotalPages(totalPages)
        handleContent()
    }, [commands])

    useMemo(() => {
        type === "old" && !loading && getPassedCommands()
        type === "current" && !loading && getCurrentCommands()
    }, [type])

    useMemo(() => {
        getClientFeedback()
    }, [])
    useEffect(() => {
        handlenav(loading)
    }, [loading])


    const handleContent = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const displayedContent = commands.slice(startIndex, endIndex)
        setDisplayedContent(displayedContent)
    }

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
        setSelectedCommand(-1)
    }
    const prevPage = () => {
        setCurrentPage(currentPage - 1);
        setSelectedCommand(-1)
    }

    useEffect(() => {
        handleContent()
    }, [currentPage])

    return (
        <>
            {
                loading ? (
                    <Spinner name='test' borderColor='#24A6A4' />
                ) : (
                    <>
                        {
                            commands.length <= 0 ? (
                                <section className='empty-cart-main'>
                                    <img loading="lazy" src={empty} alt="empty cart" />
                                    <p>{t('cart.payment.noCommands')}</p>
                                    <button className='emptyButton' onClick={() => {
                                        navigateToHome()
                                    }}>
                                        {t('cart.payment.iCommand')}
                                    </button>
                                </section>
                            ) : (
                                <section className='commands-List' >
                                    {displayedContent.length > 0 && displayedContent.map((command: any, index: number) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <div className={`command-header  ${selectedCommand === index ? "active-header" : ""}`} key={index} onClick={() => handleSelectCommand(index)}>
                                                    <div className="command-header_txt">
                                                        Commande N°{command.id}
                                                    </div>
                                                    <div className="command-header_txt">
                                                        {command.client.name}
                                                    </div>
                                                    <div className="command-header_txt">
                                                        {command.to_adresse}
                                                    </div>
                                                    <div className="command-header_txt">
                                                        {command.created_at}
                                                    </div>
                                                    <div className="command-status processed">{/* .processed / .preparation / .delivery */}
                                                        En cours de traitement
                                                    </div>
                                                    <KeyboardArrowUpOutlinedIcon className='icon' />
                                                </div>
                                                
                                                {(selectedCommand === index && type === "old") && <div className="command-body"><OldCommands feedbacksList={feedbacksList} data={command} /></div>}
                                                {(selectedCommand === index && type === "current") && <div className="command-body"><CurrentCommands goToPassedCommands={goToPassedCommands} removeCommand={HandleRemove} data={command} /></div>}
                                            </React.Fragment>
                                        )
                                    })}
                                    {
                                        commands.length > itemsPerPage && (

                                            <div className="prev-next-buttons">
                                                {/* prev button */}
                                                <span className="prev-page-button">
                                                    {!(currentPage === 1) &&
                                                        <button onClick={prevPage} style={{ backgroundImage: `url(${ArrowIcon})` }}>
                                                        </button>
                                                    }
                                                </span>
                                                {/* next button  */}
                                                <span className="next-page-button">
                                                    {!(currentPage === totalPages) &&
                                                        <button onClick={nextPage} style={{ backgroundImage: `url(${ArrowIcon})` }}>
                                                        </button>
                                                    }
                                                </span>
                                            </div>
                                        )
                                    }
                                </section>
                            )
                        }
                    </>
                )
            }
        </>
    )
}

export default CommandsList