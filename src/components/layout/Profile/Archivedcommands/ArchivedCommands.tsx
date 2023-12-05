import { useEffect, useState } from 'react'
import CoverImage from '../../../.../../../assets/profile/ArchivedCommands/cover.svg'
import CommandsList from './CommandsList/CommandsList'
import './archivedCommands.scss'
import { useTranslation } from 'react-i18next'
function ArchivedCommands() {


    const [nav, setNav] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const { t } = useTranslation()
    const handleLoading = (loading: boolean) => {
        setLoading(loading)
    }

    const handleNav = (i: number) => {
        !loading && setNav(i)
    }

    const goToPassedCommands = () => {
        setNav(1)
    }



    return (
        <div className='archived-commands-container'>
            <header>
                <p className='title'>{t('orderTrackingPage.archivedCommands')}</p>
                <div className='archivedC-image' style={{ backgroundImage: ` url(${CoverImage})` }}></div>

                <nav>
                    <ul>
                        <li>
                            <span onClick={() => handleNav(1)} className={`list-item-text ${nav === 1 && "active"}`}>{t('orderTrackingPage.currentCommands')}</span>
                        </li>
                        <li>
                            <span onClick={() => handleNav(2)} className={`list-item-text ${nav === 2 && "active"}`} >{t('orderTrackingPage.oldCommands')}</span>
                        </li>
                    </ul>
                </nav>

            </header>
            <main className='commands-list-container'>
                <CommandsList handlenav={handleLoading} goToPassedCommands={goToPassedCommands} type={nav === 2 ? "old" : "current"} />
            </main>
        </div>
    )
}

export default ArchivedCommands