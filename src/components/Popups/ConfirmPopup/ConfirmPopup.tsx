import React, { RefObject, Suspense, useEffect, useReducer, useRef, useState } from "react";

import './confirmPopup.scss'
import { useTranslation } from "react-i18next";


interface Props {
    accept: any;
    close: any;
    title: string;
}

const ConfirmPopup: React.FC<Props> = ({ title, close, accept }) => {

    const { t } = useTranslation();


    return (

        <>
            <div className="confirm-popup-container">
                <button className="close-button"></button>
                <p className="confirm-message">
                    {title}
                </p>
                <div className="buttons">
                    <button className="confirm-accept" onClick={accept}>Oui</button>
                    <button className="confirm-refuse" onClick={close}>Non</button>
                </div>
            </div>
        </>

    )
}

export default ConfirmPopup