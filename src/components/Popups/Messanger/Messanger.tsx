import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../Redux/store'
import ThunderLogo from "../../../assets/icon-old.png"
import Wave from '../../../assets/profile/Discuter/wave.svg'
import Profile from '../../../assets/profile/profile_img.png'
import { userService } from '../../../services/api/user.api'
import { Message } from '../../../services/types'
import './messanger.scss'

import { useTranslation } from 'react-i18next'
import { addMessangerSuccess, fetchMessages, handleMessanger, initUnReadedMessage, messagesSelector } from '../../../Redux/slices/messanger'

interface MessangerProps {
    close?: any,
    className?: string
}
const Messanger: React.FC<MessangerProps> = ({ className }) => {

    const [notifsVisible, setNotifsVisible] = useState(false);
    const messages = useAppSelector(messagesSelector)
    const [canalMessages, setCanalMessages] = useState<Message[]>([])
    const messageRef = useRef<HTMLTextAreaElement | null>(null);
    const canal = useRef<HTMLElement | null>(null);
    // const [showSetting, setShowSetting] = useState<boolean>(false)
    const { t } = useTranslation()
    const dispatch = useAppDispatch();

    const scrollToBottom = () => {
        if (canal.current) {
            canal.current.scrollTop = canal.current.scrollHeight;
        }
    };


    // notifsVisible, setNotifsVisible

    const handleNotifsToggle = () => {
        setNotifsVisible(!notifsVisible);
    };

    // send new message
    const sendMessage = async (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            if (event.target.id == "input" && event.target.value != "") {
                let currentDate = new Date()
                const message: Message = {
                    message: event.target.value,
                    send: 0,
                    date: currentDate.toISOString()
                }

                try {
                    const { status, data } = await userService.createmessage(event.target.value);
                    if (data.success) {
                        dispatch(addMessangerSuccess(message))
                    }
                    setTimeout(() => event.target.value = '', 100);
                } catch (error) {
                    throw (error)
                }
            }
        }
    }


    // init messages
    const useFetchMessages = () => {
        const dispatch = useAppDispatch();

        const getMessages = async () => {
            try {
                await dispatch(fetchMessages());
            } catch (error) {
                throw error
            }
        };

        return getMessages;
    };

    const getMessages = useFetchMessages()

    // convert date 
    const date = (date: string) => {
        let dateToTime = new Date(date);
        let hours = dateToTime.getHours();
        let am_pm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return hours + ' ' + am_pm
    }

    const checkDate = (dates?: any) => {
        let date = new Date();
        if (dates) {
            date = new Date(dates);
        }
        let options: any = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('fr-FR', options)
    }


    useEffect(() => {
        canal && scrollToBottom();
    }, [canal, canalMessages])

    useEffect(() => {
        setCanalMessages(messages)
    }, [messages])

    useEffect(() => {
        getMessages()
        document.addEventListener('keydown', sendMessage);
        dispatch(handleMessanger())
        dispatch(initUnReadedMessage())
        return () => {
            document.removeEventListener('keydown', sendMessage);
            dispatch(handleMessanger())

        }
    }, [])

    return (
        <div className={`messanger-popup-container ${className}`}>
            <header className='messanger-header'>
                <div className='messanger-logo-container'>
                    <div className='messanger-logo' style={{ backgroundImage: ` url(${Profile})` }}></div>
                    <p>Thunder Express</p>
                </div>
                <div className="btns-group">
                    <div className="btn-more-blc">
                        <button className="btn btn-more" onClick={handleNotifsToggle}></button>
                        
                        {notifsVisible && (
                            <div className="active-notifs">
                                <button className="btn btn-notifs">Activer les notifications</button>
                            </div>
                        )}
                    </div>
                </div>
            </header >
            <main className='messsanger-body'>
                <div className="wave-container" style={{ backgroundImage: `url(${Wave})` }} >
                    <p>{t('profile.discuter.messanger.fastResponse')}</p>
                </div>
                <div className="messages-box">
                    <section ref={canal} className='canal-section'>
                        {
                            canalMessages.map((message: Message, index: number) => {
                                return (
                                    <React.Fragment key={index}>
                                        {
                                            message.send === 0 ? (
                                                <div className='client-message' key={index}>
                                                    {
                                                        message.displayDate && (
                                                            <p className='full-messages-date'>
                                                                {message.date && checkDate(message.date)}
                                                            </p>
                                                        )
                                                    }
                                                    <div className='client-message-container'>
                                                        <p>
                                                            {message.message}
                                                        </p>
                                                        <span>{message.date && date(message.date.toString())}</span>

                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='admin-message-container' key={index}>

                                                    {
                                                        message.displayDate && (
                                                            <p className='full-messages-date'>
                                                                {message.date && checkDate(message.date)}
                                                            </p>
                                                        )
                                                    }
                                                    <div className='admin-message'>
                                                        <div className='message-logo-container'>
                                                            <div className='thunder-message-logo' style={{ backgroundImage: `url(${ThunderLogo})` }}></div>
                                                        </div>
                                                        <div className='admin-message-container2'>
                                                            <span>{message.date && date(message.date.toString())}</span>
                                                            <p>
                                                                {message.message}
                                                            </p>

                                                        </div>
                                                    </div>
                                                </div>

                                            )
                                        }

                                    </React.Fragment>
                                )
                            })
                        }

                    </section>
                    <section className='input-section'>
                        <textarea ref={messageRef} className='input' name="input" id="input" placeholder='Envoyer votre message' cols={30} rows={5}></textarea>
                    </section>
                </div>
            </main >

            <footer className='messanger-footer'>

            </footer>

        </div >
    )
}

export default Messanger