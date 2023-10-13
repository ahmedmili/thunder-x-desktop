import React, { RefObject, Suspense, useEffect, useReducer, useRef, useState } from "react";

import './warnPopup.scss'
import { useTranslation } from "react-i18next";


interface Props {
    accept: () => void;
    close: () => void;
    message: string;
    closeButtonText: string;
    confirmButtonText: string;
}

const WarnPopup: React.FC<Props> = ({ message, confirmButtonText, closeButtonText, close, accept }) => {
    
    const handleOutsideClick = () => {
        close();
    };

    return (

        <>
            <div className="popup-overlay" onClick={handleOutsideClick}>

            </div>
            <div className="confirm-popup-container">

                <p className="confirm-message">
                    {message}
                </p>
                <div className="buttons">
                    <button className="confirm-accept" onClick={accept}>{confirmButtonText}</button>
                    <button className="confirm-refuse" onClick={close}>{closeButtonText}</button>
                </div>
            </div>
        </>

    )
}

export default WarnPopup