import React, { useEffect, useState } from 'react'

import "./footer.scss"
import { useAppSelector } from '../../../../../Redux/store';
import msgIcon from "../../../../../assets/profile/ArchivedCommands/msg.svg"
import phoneIcon from "../../../../../assets/profile/ArchivedCommands/phone.svg"
import Messanger from '../../../../Popups/Messanger/Messanger';
import PhoneNumber from '../../../../Popups/PhoneNumber/PhoneNumber';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';



interface FooterProps {
}

const CommandsFooter: React.FC<FooterProps> = () => {

    const unReadMessages = useAppSelector((state) => state.messanger.unReadedMessages)
    const theme = useAppSelector((state) => state.home.theme)
    const [template, setTemplate] = useState<number>(theme)

    const [showPhonePopup, setShowPhonePopup] = useState<boolean>(false)
    const [showMessangerPopup, setShowMessangerPopup] = useState<boolean>(false)

    const [unReadedQt, setUnReadedQt] = useState<number>(unReadMessages)

    const handleMessangerPopup = () => {
        setShowMessangerPopup(!showMessangerPopup)
    }

    const handlePhonePopup = () => {
        setShowPhonePopup(!showPhonePopup)
    }

    useEffect(() => {
        setTemplate(theme)
    }, [theme])

    useEffect(() => {
        setUnReadedQt(unReadMessages)
    }, [unReadMessages])

    return (

        <>
            <section className='command-footer-container' >
                <p className='title'>Besoin d’aide?</p>
                <div className='icons'>
                    <button onClick={handlePhonePopup} className="phone-icon" style={{ backgroundImage: `url(${phoneIcon})` }}>

                    </button>
                    <button onClick={handleMessangerPopup} className="msg-icon" style={{ backgroundImage: `url(${msgIcon})` }}>
                        {unReadedQt > 0 && (
                            // <NotificationsOffIcon className='messanger-bull-notif-icon' />
                            <div className='msg-bull-notif-icon'>
                                {unReadedQt}
                            </div>
                        )}
                    </button>
                    {
                        showMessangerPopup && <Messanger className="discuter-messanger-popup" close={handleMessangerPopup} />

                    }

                    {
                        showPhonePopup && <PhoneNumber close={handlePhonePopup} />
                    }
                </div>

            </section>
        </>
    )
}

export default CommandsFooter