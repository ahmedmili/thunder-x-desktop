import React, { useEffect, useState } from 'react'
import './bonus.scss'
import { userService } from '../../../../../services/api/user.api'
import { localStorageService } from '../../../../../services/localStorageService'
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import TransferBonus from './TransferBonus/TransferBonus';
import { useTranslation } from 'react-i18next';

function Bonus() {

    const [bonus, setBonus] = useState<number>(0)
    const getUser = async () => {
        const user_id = await localStorageService.getUserId()
        const { status, data } = await userService.getUser(user_id!)
        setBonus(data.data.client.bonus)
    }
    useEffect(() => {
        getUser()
    }, [])
    const { t } = useTranslation()
    return (
        <div className='bonus-container'>
            <header className='bonus-header'>
                <p>{t('profile.fidelite.bonus.mySoldeBonus')}</p>
                <KeyboardArrowUpOutlinedIcon className={` icon `} />
            </header>
            <main className='bonus-main'>
                <p>{t('profile.fidelite.bonus.yourBonus')}</p> <span>{bonus} {t('profile.fidelite.bonus.points')}</span>
            </main>

            <TransferBonus ammount={bonus} />
        </div>
    )
}

export default Bonus