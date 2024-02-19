import { useTranslation } from 'react-i18next';
import './invitPagee.scss';

import copy from 'clipboard-copy';
import { useEffect, useState } from 'react';
import MoneyPack from '../../../../../../../assets/profile/MoneyPack.png';
import chaine from '../../../../../../../assets/profile/chaine-white.svg';
import SocialShare from '../../../../../../../assets/profile/socialShare.svg';
import { userService } from '../../../../../../../services/api/user.api';
import { localStorageService } from '../../../../../../../services/localStorageService';
import ShareSocialModal from '../../../../../../Popups/ShareSocial/ShareSocial';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface InvitPageProps {
    internNavigation: (page: number) => void,
}


function InvitPage({ internNavigation }: InvitPageProps) {
    const { t } = useTranslation()
    const [code, setCode] = useState<string>('')
    const [sponserShipeActivated, setSponserShipeActivated] = useState<boolean>(false)
    const [OpenModal, setOpenModal] = useState<boolean>(false)

    const handleModal = () => {
        setOpenModal(!OpenModal)
    }

    useEffect(() => {
        let user = localStorageService.getUser()
        if (user) {
            let userData = JSON.parse(user)
            let sponsorship = userData.sponsorship
            sponsorship ? setCode(sponsorship) : setCode("BLOCKED")
        }
    }, [])

    const verifSponsorship = async () => {
        const { status, data } = await userService.getAtivateSponsorship()
        data.success && setSponserShipeActivated(data.data.activate_sponsorship)
    }
    useEffect(() => {
        verifSponsorship()
    }, [])

    const copyCode = () => {
        copy(code)
    }

    return (
        <main className='invit-page-container'>
            <h3 className='P-title' onClick={() => internNavigation(1)} ><ArrowBackIcon className='go-back-icon'></ArrowBackIcon> {t('profile.fidelite.Parrainage')}</h3>
            <div className="parrainage-wrapper">
                {/* 
                <section className='money-image-container'>
                    <div className='money-img' style={{ backgroundImage: `url(${MoneyPack})` }} > </div>
                </section>
                */}

                <div className='notes-section'>
                    <h2>{t('profile.fidelite.inviteStart.howTo.title')}</h2>
                    <p>{t('profile.fidelite.inviteStart.howTo.description')}</p>
                </div>


                <div className="invite-friends-area">
                    <h3 className='invite-Q'>{t('profile.fidelite.inviteFriends')} ?</h3>
                    <div className="invite-friends-wrapper">
                        <div className="invite-friends-blc">
                            {
                                (code && sponserShipeActivated) ?
                                    (
                                        <div className='copy-code-section' >
                                            <div className='code-input-container'>
                                                <input type="text" maxLength={6} readOnly value={code} />
                                                <button onClick={copyCode} className='copy-btn' ><span className='chaine-icon' style={{ backgroundImage: `url(${chaine})` }} ></span> {t('Copier')}</button>
                                            </div>
                                        </div>
                                    )
                                    : (
                                        <>
                                            <p className='sponsorship-not-activated-message'>
                                                {t('profile.fidelite.sponsorShipNotDisponible')}
                                            </p>
                                        </>
                                    )
                            }
                            
                        </div>
                        <div className="invite-friends-blc">
                            <button onClick={handleModal} className='social-share-button'>
                                <span className='social-share-icon' style={{ backgroundImage: `url(${SocialShare})` }}></span>
                                {t('profile.fidelite.inviteNow')}
                            </button>
                        </div>
                    </div>
                </div>
                

                

                

                {
                    OpenModal && <ShareSocialModal code={code} close={handleModal} />
                }
            </div>
        </main>

    )
}

export default InvitPage