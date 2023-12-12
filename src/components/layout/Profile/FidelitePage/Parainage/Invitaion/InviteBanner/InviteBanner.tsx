import { useTranslation } from 'react-i18next';
import './inviteBanner.scss';

import ArrowRight from '../../../../../../../assets/icons/ArrowRight';
import gift_icon from '../../../../../../../assets/profile/gift-img.svg';

interface InviteBannerProps {
    internNavigation: (page: number) => void,
}
function InviteBanner({ internNavigation }: InviteBannerProps) {
    const { t } = useTranslation()

    return (
        <main className='invit-container'>
            <h3 className='invit-title'>{t('profile.fidelite.invite2thunder')}</h3>
            <button onClick={() => internNavigation(2)} className='invit-button'>{t('profile.fidelite.inviteStart')} <ArrowRight /></button>
            <div className='gift-icon' style={{ backgroundImage: `url(${gift_icon})` }}>
            </div>
        </main>

    )
}

export default InviteBanner