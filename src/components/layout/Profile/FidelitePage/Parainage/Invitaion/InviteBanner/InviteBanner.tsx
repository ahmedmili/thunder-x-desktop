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
            <h3 className='invit-title'>Invitez des amis sur Thunder Express.</h3>
            <button onClick={() => internNavigation(2)} className='invit-button'>Commencez à inviter des amis <ArrowRight /></button>
            <div className='gift-icon' style={{ backgroundImage: `url(${gift_icon})` }}>
            </div>
        </main>

    )
}

export default InviteBanner