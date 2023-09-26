import React, { useEffect, useState } from 'react'
import CoverImage from '../../../.../../../assets/profile/ArchivedCommands/cover.svg'
import CoverImage2 from '../../../.../../../assets/profile/ArchivedCommands/cover.svg'
import './fidelitePage.scss'
import { userService } from '../../../../services/api/user.api'
import RepasList from './RepasList/RepasList'
import RepasFooter from './Footer/Footer'
import { useTranslation } from 'react-i18next'

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
                    </ul>
                </nav>

            </header>
            <main>
                {
                    nav === 1 && (
                        <>
                            <RepasList />
                            <RepasFooter Ftitle={t('profile.fidelite.footer.repas.title')} Fbody={t('profile.fidelite.footer.repas.body')} />
                        </>

                    )
                }
                {
                    nav === 2 && (
                        <>
                            {/* <RepasList /> */}
                            <RepasFooter Ftitle={t('profile.fidelite.footer.bonus.title')} Fbody={t('profile.fidelite.footer.bonus.body')} />
                        </>

                    )
                }
                {/* <CommandsList goToPassedCommands={goToPassedCommands} type={nav === 1 ? "repas" : "bonus"} /> */}
            </main>
        </div>
    )
}

export default FidelitePage