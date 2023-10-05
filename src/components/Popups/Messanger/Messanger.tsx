import './messanger.scss'
import SettingIcon from '../../../assets/profile/Discuter/setting-points.svg'
import TimeIcon from '../../../assets/profile/Discuter/time-icon.svg'
import Wave from '../../../assets/profile/Discuter/wave.svg'
import Profile from '../../../assets/profile/profile_img.png'
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import React, { useEffect, useRef, useState } from 'react'
import { userService } from '../../../services/api/user.api'
import { Message } from '../../../services/types'
import { useAppDispatch, useAppSelector } from '../../../Redux/store'

import { addMessangerSuccess, fetchMessages, handleMessanger, messagesSelector, initUnReadedMessage } from '../../../Redux/slices/messanger'
import { useTranslation } from 'react-i18next'

interface MessangerProps {
    close: any,
    className: string
}
const Messanger: React.FC<MessangerProps> = ({ className }) => {

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


    // send new message
    const sendMessage = async (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            if (event.target.id == "input" && event.target.value != "") {
                const message: Message = {
                    message: event.target.value,
                    send: 0
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



    // const openSetting = () => {
    //     setShowSetting(!showSetting)
    // }

    // init messages
    const useFetchMessages = () => {
        const dispatch = useAppDispatch();

        const getMessages = async () => {
            try {
                await dispatch(fetchMessages());
            } catch (error) {
                console.error(error);
            }
        };

        return getMessages;
    };

    const getMessages = useFetchMessages()

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
                <div className="messanger-header-icons">
                    {/* <div onClick={openSetting} className='setting-icon-container' style={{ backgroundColor: ` ${showSetting ? "#24A6A4" : "transparent"}` }}>
                        <div className='setting-icon' style={{ backgroundImage: ` url(${SettingIcon}) ` }}></div>
                    </div> */}
                    {/* <KeyboardArrowUpOutlinedIcon className='arrow-icon' /> */}
                </div>
                {/* {
                    showSetting && (
                        <div className='messanger-settings'>
                            <NotificationsActiveIcon className='messanger-setting-icon' />
                            <p>Activer les notifications</p>
                        </div>
                    )
                } */}
            </header >
            <main className='messsanger-body'>
                <div className="wave-container" style={{ backgroundImage: `url(${Wave})` }} >
                    <p>{t('profile.discuter.messanger.fastResponse')}</p>
                </div>
                <div className="messages-box">
                    <section ref={canal} className='canal-section'>
                        <button className='older-messages-btn'>
                            <div className='time-icon' style={{ backgroundImage: `url(${TimeIcon})` }}></div>
                            {t('profile.discuter.messanger.oldMessages')}
                        </button>

                        {
                            canalMessages.map((message: Message, index: number) => {
                                return (
                                    <React.Fragment key={index}>
                                        {
                                            message.send === 0 ? (
                                                <div className='client-message' key={index}>
                                                    <p>
                                                        {message.message}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className='admin-message' key={index}>
                                                    <p>
                                                        {message.message}
                                                    </p>
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