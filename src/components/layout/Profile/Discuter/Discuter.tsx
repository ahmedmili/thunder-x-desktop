import { useEffect, useState } from 'react';
import './discuter.scss';


import { useTranslation } from 'react-i18next';
import { fetchMessages } from '../../../../Redux/slices/messanger';
import { useAppSelector } from '../../../../Redux/store';
import Service from '../../../../assets/profile/Discuter/Service-24-7.png';
import Cover from '../../../../assets/profile/Discuter/cover.png';
import MessangerBtnIcon from '../../../../assets/profile/Discuter/messanger-btn.svg';
import Messanger from '../../../Popups/Messanger/Messanger';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';

function Discuter() {
    const unReadMessages = useAppSelector((state) => state.messanger.unReadedMessages)

    const [phonePopup, setPhonePopup] = useState<boolean>(false)
    const [messangerPopup, setMessangerPopup] = useState<boolean>(false)
    const [unReadedQt, setUnReadedQt] = useState<number>(unReadMessages)
    const { t } = useTranslation()
    const handlePhonePopup = () => {
        setPhonePopup(!phonePopup)
    }

    const handleMessangerPopup = () => {
        setMessangerPopup(!messangerPopup)
    }

    useEffect(() => {
        fetchMessages()
    }, [])

    useEffect(() => {
        setUnReadedQt(unReadMessages)
    }, [unReadMessages])
    return (
        <div className='discuter-main-container'>
            <header className='discuter-header'>
                <h3 className='title-message'>{t('profile.discuter')}</h3>
                <div className='cover-img' style={{ backgroundImage: `url(${Cover})` }} >
                </div>
            </header >
            <main className='discuter-main'>
                <div className='aide-service'>
                    <h2 className='title'>{t('profile.discuter.aide')}</h2>
                    <p className='sub-title'>{t('profile.discuter.supportContact')}</p>
                    <div className='buttons'>
                        <button className='btn1' onClick={handlePhonePopup}>{t('profile.discuter.somethingToSay')}</button>
                        <button className='support-client'>
                            {t('profile.discuter.supportContact')}
                            <p><span><LocalPhoneRoundedIcon className='support-phone-icon' /></span> 44 100 162</p>
                        </button>
                    </div>
                </div>
                <div className='aide-service'>
                    <h2 className='title'>{t('profile.discuter.serviceClient')}</h2>
                    <p className='sub-title'>{t('profile.discuter.disponible')}</p>
                    <div className='service-24' style={{ backgroundImage: ` url(${Service})` }}>
                    </div>
                </div>

            </main>

            <div className='bulles'>
                <button className='messanger-popup-btn' onClick={handleMessangerPopup} style={{ backgroundImage: `url(${MessangerBtnIcon})` }}>
                    {unReadedQt > 0 && (
                        <div className='messanger-bull-notif-icon'>
                            {unReadedQt}
                        </div>
                    )}
                </button>
                {/* <button className='phone-popup-btn' onClick={handlePhonePopup} style={{ backgroundImage: `url(${PhoneBtnIcon})` }}></button> */}
            </div>

            {
                messangerPopup && <Messanger className="discuter-messanger-popup" close={handleMessangerPopup} />
            }
        </div >
    )
}

export default Discuter