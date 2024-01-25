import React, { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { handleMessanger } from '../../../../../Redux/slices/messanger';
import { useAppSelector } from '../../../../../Redux/store';
import msgIcon from "../../../../../assets/profile/ArchivedCommands/msg.svg";
import phoneIcon from "../../../../../assets/profile/ArchivedCommands/phone.svg";
import PhoneNumber from '../../../../Popups/PhoneNumber/PhoneNumber';
import "./footer.scss";



interface FooterProps {
}

const CommandsFooter: React.FC<FooterProps> = () => {

    const dispatch = useDispatch()
    const unReadMessages = useAppSelector((state) => state.messanger.unReadedMessages)

    const [showPhonePopup, setShowPhonePopup] = useState<boolean>(false)

    const [unReadedQt, setUnReadedQt] = useState<number>(unReadMessages)

    const handleMessangerPopup = () => {
        dispatch(handleMessanger())
    }

    const handlePhonePopup = () => {
        setShowPhonePopup(!showPhonePopup)
    }

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
                            <div className='msg-bull-notif-icon'>
                                {unReadedQt}
                            </div>
                        )}
                    </button>
                    {
                        showPhonePopup && <PhoneNumber close={handlePhonePopup} />
                    }
                </div>

            </section>
        </>
    )
}

export default CommandsFooter