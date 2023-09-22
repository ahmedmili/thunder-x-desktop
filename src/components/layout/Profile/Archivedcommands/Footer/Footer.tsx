import React, { useEffect, useState } from 'react'

import "./footer.scss"
import { useAppSelector } from '../../../../../Redux/store';
import msgIcon from "../../../../../assets/profile/ArchivedCommands/msg.svg"
import phoneIcon from "../../../../../assets/profile/ArchivedCommands/phone.svg"



interface FooterProps {
}

const CommandsFooter: React.FC<FooterProps> = () => {

    const theme = useAppSelector((state) => state.home.theme)
    const [template, setTemplate] = useState<number>(theme)


    useEffect(() => {
        setTemplate(theme)
    }, [theme])
    return (

        <>
            <section className='command-footer-container' >
                <p className='title'>Besoin d’aide?</p>
                <div className='icons'>
                    <div className="phone-icon" style={{ backgroundImage: `url(${phoneIcon})` }}></div>
                    <div className="msg-icon" style={{ backgroundImage: `url(${msgIcon})` }}></div>
                </div>
            </section>
        </>
    )
}

export default CommandsFooter