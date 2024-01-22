import React from "react";

import { useTranslation } from "react-i18next";
import './shareSocial.scss';

import copy from 'clipboard-copy';
import {
    EmailShareButton,
    FacebookShareButton,
    InstapaperShareButton,
    TwitterShareButton,
    WhatsappShareButton
} from "react-share";
import facebook_img from '../../../assets/Socials/facebook.png';
import insta_img from '../../../assets/Socials/insta.png';
import mail_img from '../../../assets/Socials/mail.png';
import twitter_img from '../../../assets/Socials/twitter.png';
import whatsup_img from '../../../assets/Socials/whatsup.png';
interface Props {
    close: () => void;
    code: string;
}

const ShareSocialModal: React.FC<Props> = ({ code, close }) => {

    const { t } = useTranslation()

    const handleOutsideClick = () => {
        close();
    };

    const copyCode = () => {
        copy(code)
    }

    let sharedContent = "https://thunderweb.webify.pro/profile/Fidelite/parainage/1/"
    let title = `Thunder Express Parainage`
    const Hashtag = `#${code}  #Thunder_Express`
    const description = `join thunder express and earn more points parainage code : ${code}    `

    return (

        <>
            <div className="popup-overlay" onClick={handleOutsideClick}></div>
            <div className="share-social-popup-container">
                <div className="share-social_header">
                    <h3 className="title">{t("profile.fidelite.inviteNow")}</h3>
                    <button onClick={close} className='close-btn'></button>
                </div>
                
                <div className="social-buttons-section">
                    <WhatsappShareButton className="button-box" title={title} url={`sharedContent`}>
                        <input type="button" value="" className="whatsApp" name="WhatsApp" style={{ backgroundImage: `url(${whatsup_img})` }} />
                        <label htmlFor="WhatsApp">WhatsApp</label>
                    </WhatsappShareButton>

                    <FacebookShareButton className="button-box" content={description} title={description} url={sharedContent} hashtag={Hashtag}  >
                        <input type="button" value="" className="facebook" name="Facebook" style={{ backgroundImage: `url(${facebook_img})` }} />
                        <label htmlFor="Facebook">Facebook</label>
                    </FacebookShareButton>

                    <TwitterShareButton className="button-box" title={description} url={sharedContent} >
                        <input type="button" value="" className="twitter" name="Twitter" style={{ backgroundImage: `url(${twitter_img})` }} />
                        <label htmlFor="Twitter">Twitter</label>
                    </TwitterShareButton>

                    <EmailShareButton className="button-box" body={description} subject={title} url={sharedContent} >
                        <input type="button" value="" className="email" name="Email" style={{ backgroundImage: `url(${mail_img})` }} />
                        <label htmlFor="Email">E-mail</label>
                    </EmailShareButton>

                    <InstapaperShareButton description={description} url={sharedContent} title={description} className="button-box">
                        <input type="button" value="" className="instagram" name="Instagram" style={{ backgroundImage: `url(${insta_img})` }} />
                        <label htmlFor="Instagram">Instagram</label>
                    </InstapaperShareButton>
                </div>
                <div className="code-section">
                    <input type="text" maxLength={6} readOnly value={code} />
                    <button onClick={copyCode} className="copier-btn" >copier</button>
                </div>
            </div>
        </>

    )
}

export default ShareSocialModal