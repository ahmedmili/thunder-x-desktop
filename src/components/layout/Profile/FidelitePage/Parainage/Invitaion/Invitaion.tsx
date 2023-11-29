import { useTranslation } from 'react-i18next';
import './invitaion.scss';

import gift_icon from '../../../../../../assets/profile/gift-img.svg'
import { useState } from 'react';
import ArrowRight from '../../../../../../assets/icons/ArrowRight';

function Invitaion() {
    const { t } = useTranslation()
    const [show, setShow] = useState<boolean>(false)
    const [messasge, setMessage] = useState<string>('Code approuvé !')

    const showContent = () => {
        setShow(!show)
    }

    return (
        <main className='invit-container'>
            <h3 className='invit-title'>Invitez des amis sur Thunder Express.</h3>
            <button className='invit-button'>Commencez à inviter des amis <ArrowRight /></button>
            <div className='gift-icon' style={{ backgroundImage: `url(${gift_icon})` }}>
            </div>
        </main>

    )
}

export default Invitaion