import React, { RefObject, Suspense, useEffect, useReducer, useRef, useState } from "react";

import './shareSocial.scss'
import { useTranslation } from "react-i18next";

import whatsup_img from '../../../assets/Socials/whatsup.png'
import facebook_img from '../../../assets/Socials/facebook.png'
import twitter_img from '../../../assets/Socials/twitter.png'
import mail_img from '../../../assets/Socials/mail.png'
import insta_img from '../../../assets/Socials/insta.png'
import copy from 'clipboard-copy';
import {
    FacebookShareButton,
    WhatsappShareButton,
    TwitterShareButton,
    MailruShareButton,
    InstapaperShareButton
} from "react-share"
interface Props {
    close: () => void;
    code: string;
}
// FacebookShareButton

const ShareSocialModal: React.FC<Props> = ({ code, close }) => {

    const handleOutsideClick = () => {
        close();
    };

    const copyCode = () => {
        copy(code)
    }
    const sharedContent = "https://mobile.thunder.webify.pro/#/client/wallet/parainnage"
    return (

        <>
            <div className="popup-overlay" onClick={handleOutsideClick}></div>
            <div className="share-social-popup-container">
                <div onClick={close} className='close-btn'>X</div>
                <h3 className="title">Inviter maintenant</h3>
                <section className="social-buttons-section">
                    <WhatsappShareButton className="button-box" url={`sharedContent`}>
                        <input type="button" value="" className="whatsApp" name="WhatsApp" style={{ backgroundImage: `url(${whatsup_img})` }} />
                        <label htmlFor="WhatsApp">WhatsApp</label>
                    </WhatsappShareButton>

                    <FacebookShareButton className="button-box" url={sharedContent} hashtag={`#${code} `} >
                        <input type="button" value="" className="facebook" name="Facebook" style={{ backgroundImage: `url(${facebook_img})` }} />
                        <label htmlFor="Facebook">Facebook</label>
                    </FacebookShareButton>

                    <TwitterShareButton className="button-box" url={sharedContent} >
                        <input type="button" value="" className="twitter" name="Twitter" style={{ backgroundImage: `url(${twitter_img})` }} />
                        <label htmlFor="Twitter">Twitter</label>
                    </TwitterShareButton>

                    <MailruShareButton className="button-box" url={sharedContent} >
                        <input type="button" value="" className="email" name="Email" style={{ backgroundImage: `url(${mail_img})` }} />
                        <label htmlFor="Email">E-mail</label>
                    </MailruShareButton>

                    <InstapaperShareButton url={sharedContent} className="button-box">
                        <input type="button" value="" className="instagram" name="Instagram" style={{ backgroundImage: `url(${insta_img})` }} />
                        <label htmlFor="Instagram">Instagram</label>
                    </InstapaperShareButton>

                </section>
                <section className="code-section">
                    <input type="text" maxLength={6} readOnly value={code} />
                    <button onClick={copyCode} className="copier-btn" >copier</button>
                </section>
            </div>
        </>

    )
}

export default ShareSocialModal