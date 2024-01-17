import './discuter.scss';


import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import { useTranslation } from 'react-i18next';
import Service from '../../../../assets/profile/Discuter/Service-24-7.png';
import Cover from '../../../../assets/profile/Discuter/cover.png';
import { useDispatch } from 'react-redux';
import { handleMessanger } from '../../../../Redux/slices/messanger';

function Discuter() {

    const { t } = useTranslation()
    const dispatch = useDispatch()

    const handleMessangerPopup = () => {
        dispatch(handleMessanger())
    }
    
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
                        <button className='btn1' onClick={handleMessangerPopup}>{t('profile.discuter.somethingToSay')}</button>
                        <button className='support-client'>
                            {t('profile.discuter.supportContact')}
                            <p><span><LocalPhoneRoundedIcon className='support-phone-icon' /></span> 44 100 162</p>
                        </button>
                    </div>
                </div>
                <div className='aide-service' >
                    <h2 className='title'>{t('profile.discuter.serviceClient')}</h2>
                    <p className='sub-title'>{t('profile.discuter.disponible')}</p>
                    <div className='service-24' style={{ backgroundImage: ` url(${Service})` }}>
                    </div>
                </div>

            </main>
        </div >
    )
}

export default Discuter