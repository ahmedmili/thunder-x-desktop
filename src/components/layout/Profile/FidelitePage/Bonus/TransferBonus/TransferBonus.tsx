import React from 'react'

import './transferBonus.scss'
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { useTranslation } from 'react-i18next';

interface TransferBonusProps {
    ammount: number
}
const TransferBonus: React.FC<TransferBonusProps> = ({ ammount }) => {

    const { t } = useTranslation()
    return (
        <div className='transfer-bonus-container'>
            <header>
                <p>{t('profile.fidelite.bonus.transferBonus')}</p>
                <KeyboardArrowUpOutlinedIcon className={` icon `} />
            </header>
            <main >
                <p><CardGiftcardIcon className='giftIcon' />{t('profile.fidelite.bonus.yourBonus2')} <span className='gift-value'>{ammount} {t('profile.fidelite.bonus.points')} </span></p>
                {
                    ammount >= 5000 ? (
                        <>
                            <div className="phone-devision">
                                <label htmlFor="phone" > <PhoneAndroidIcon className='giftIcon' /> {t('profile.fidelite.bonus.destinationNumber')}</label>
                                <input type="text" name="phone" id="phone" placeholder='Numéro de téléphone du déstinataire' />
                            </div>
                            <button className='transfer-btn'> {t('profile.fidelite.bonus.transferBonus')}</button>
                        </>
                    ) : (
                        <>
                            <div className='ammount-error'>
                                <p>{t('profile.fidelite.bonus.bonusError')}</p>
                            </div>
                        </>
                    )
                }

            </main>
        </div>
    )
}

export default TransferBonus