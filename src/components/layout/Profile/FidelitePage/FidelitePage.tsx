import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import CoverImage2 from '../../../.../../../assets/profile/espace_fedele1.jpg'
import CoverImage from '../../../.../../../assets/profile/espace_fedele2.jpg'
import Bonus from './Bonus/Bonus'
import RepasFooter from './MonRepas/Footer/Footer'
import RepasList from './MonRepas/RepasList/RepasList'
import Parainage from './Parainage/Parainage'
import './fidelitePage.scss'
import fideliteImage from './../../../../assets/fidelite-header-bg.png'


function FidelitePage() {

    const [nav, setNav] = useState<number>(0)
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()

    const handleNav = (i: number) => {
        setNav(i)
    }
    useEffect(() => {
        const locationArray = location.pathname.split("/")
        var newUrl = location.pathname
        switch (nav) {
            case 1:
                locationArray[3] = "repas"
                locationArray.length = 4
                newUrl = locationArray.join("/")
                break;
            case 2:
                locationArray[3] = "bonus"
                locationArray.length = 4
                newUrl = locationArray.join("/")
                break;
            case 3:
                locationArray[3] = "parainage"
                newUrl = locationArray.join("/")
                break;
            default:
                locationArray[3] = "repas"
                newUrl = locationArray.join("/")
                break;
        }
        navigate(newUrl, { replace: true })
    }, [nav])

    useEffect(() => {
        const locationArray = location.pathname.split("/")
        switch (locationArray[3]) {
            case "repas":
                setNav(1)
                break;
            case "bonus":
                setNav(2)
                break;
            case "parainage":
                setNav(3)
                break;
            default:
                setNav(1)
                break;
        }
    }, [])

    return (
        <div className='fidelite-container'>
            <header>
                {/* 
                    <p className='title'>{t('profile.fidelite.title')}</p>
                    <div className='header-imgs-container'>
                        <div className='archivedC-image' style={{ backgroundImage: ` url(${CoverImage})` }}></div>
                        <div className='archivedC-image' style={{ backgroundImage: ` url(${CoverImage2})` }}></div>
                    </div>
                */}
                <div className="header-bg">
                    <div className="header-bg_img-blc">
                        <img src={fideliteImage} alt="fidelite Image" />
                    </div>
                </div>

                <nav>
                    <ul>
                        <li>
                            <button onClick={() => handleNav(1)} className={`list-item-text ${nav === 1 && "active"}`} >{t('profile.fidelite.freeRepas')}</button>
                        </li>
                        <li>
                            <button onClick={() => handleNav(2)} className={`list-item-text ${nav === 2 && "active"}`}>{t('profile.fidelite.myBonus')}</button>
                        </li>
                        <li>
                            <button onClick={() => handleNav(3)} className={`list-item-text ${nav === 3 && "active"}`}>{t('profile.fidelite.Parrainage')}</button>
                        </li>
                    </ul>
                </nav>

            </header>

            {
                nav === 1 && (
                    <main>
                        <RepasList />
                        <RepasFooter Ftitle={t('profile.fidelite.footer.repas.title')} Fbody={t('profile.fidelite.footer.repas.body')} />
                    </main>

                )
            }
            {
                nav === 2 && (

                    <main>
                        <Bonus />
                        {/* <RepasFooter Ftitle={t('profile.fidelite.footer.bonus.title')} Fbody={t('profile.fidelite.footer.bonus.body')} /> */}
                    </main>

                )
            }
            {
                nav === 3 && (
                    <main>
                        <Parainage />
                    </main>

                )
            }
        </div >
    )
}

export default FidelitePage