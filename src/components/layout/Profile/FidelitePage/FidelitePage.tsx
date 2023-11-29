import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CoverImage2 from '../../../.../../../assets/profile/espace_fedele1.jpg'
import CoverImage from '../../../.../../../assets/profile/espace_fedele2.jpg'
import Bonus from './Bonus/Bonus'
import RepasFooter from './MonRepas/Footer/Footer'
import RepasList from './MonRepas/RepasList/RepasList'
import './fidelitePage.scss'
import Parainage from './Parainage/Parainage'

function FidelitePage() {

    const [nav, setNav] = useState<number>(1)
    const { t } = useTranslation()

    const handleNav = (i: number) => {
        setNav(i)
    }

    return (
        <div className='fidelite-container'>
            <header>
                <p className='title'>{t('profile.fidelite.title')}</p>
                <div className='header-imgs-container'>
                    <div className='archivedC-image' style={{ backgroundImage: ` url(${CoverImage})` }}></div>
                    <div className='archivedC-image' style={{ backgroundImage: ` url(${CoverImage2})` }}></div>
                </div>

                <nav>
                    <ul>
                        <li>
                            <span onClick={() => handleNav(1)} className={`list-item-text ${nav === 1 && "active"}`} >{t('profile.fidelite.freeRepas')}</span>
                        </li>
                        <li>
                            <span onClick={() => handleNav(2)} className={`list-item-text ${nav === 2 && "active"}`}>{t('profile.fidelite.myBonus')}</span>
                        </li>
                        <li>
                            <span onClick={() => handleNav(3)} className={`list-item-text ${nav === 3 && "active"}`}>{t('profile.fidelite.Parrainage')}</span>
                        </li>
                    </ul>
                </nav>

            </header>

            {
                nav === 1 && (
                    <main style={{ backgroundColor: "white" }}>
                        <RepasList />
                        <RepasFooter Ftitle={t('profile.fidelite.footer.repas.title')} Fbody={t('profile.fidelite.footer.repas.body')} />
                    </main>

                )
            }
            {
                nav === 2 && (

                    <main style={{ backgroundColor: "white" }}>
                        <Bonus />
                        <RepasFooter Ftitle={t('profile.fidelite.footer.bonus.title')} Fbody={t('profile.fidelite.footer.bonus.body')} />
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