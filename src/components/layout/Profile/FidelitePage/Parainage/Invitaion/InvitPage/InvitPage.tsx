import { useTranslation } from 'react-i18next';
import './invitPage.scss';

import MoneyPack from '../../../../../../../assets/profile/MoneyPack.png'
import chaine from '../../../../../../../assets/profile/chaine.svg'
import SocialShare from '../../../../../../../assets/profile/socialShare.svg'
import { useEffect, useState } from 'react';
import { localStorageService } from '../../../../../../../services/localStorageService';
import copy from 'clipboard-copy';
import ShareSocialModal from '../../../../../../Popups/ShareSocial/ShareSocial';

interface InvitPageProps {
    internNavigation: (page: number) => void,
}


function InvitPage({ internNavigation }: InvitPageProps) {
    const { t } = useTranslation()
    const [code, setCode] = useState<string>('')
    const [OpenModal, setOpenModal] = useState<boolean>(true)

    const handleModal = () => {
        setOpenModal(!OpenModal)
    }
    useEffect(() => {
        let user = localStorageService.getUser()
        if (user) {
            let userData = JSON.parse(user)
            let sponsorship = userData.sponsorship
            setCode(sponsorship)
        }
    }, [])

    const copyCode = () => {
        copy(code)
    }

    return (
        <main className='invit-page-container'>
            <h3 className='P-title'>Parrainage</h3>
            <section className='money-image-container'>
                <div className='money-img' style={{ backgroundImage: `url(${MoneyPack})` }} > </div>
            </section>
            <section className='copy-code-section' >
                <h2 className='invite-Q'>Invitez vos amis ?</h2>
                <div className='code-input-container'>
                    <input type="text" maxLength={6} readOnly value={code} />
                    <button onClick={copyCode} className='copy-btn' ><span className='chaine-icon' style={{ backgroundImage: `url(${chaine})` }} ></span> Copier</button>
                </div>
            </section>

            <section className='notes-section'>
                <h2>Comment ça marche</h2>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</p>
            </section>

            <button onClick={handleModal} className='social-share-button'>
                <span className='social-share-icon' style={{ backgroundImage: `url(${SocialShare})` }}></span>
                Inviter maintenant
            </button>
            {
                OpenModal && <ShareSocialModal code={code} close={handleModal} />
            }
        </main>

    )
}

export default InvitPage