import React, { RefObject, Suspense, useEffect, useReducer, useRef, useState } from "react";

import './closedSupplier.scss'
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { localStorageService } from "../../../services/localStorageService";


interface Props {
    accept?: () => void;
    close: () => void;
    message: string;
    closeButtonText: string;
    confirmButtonText: string;
}

const ClosedSupplier: React.FC<Props> = ({ message, confirmButtonText, closeButtonText, close, accept }) => {

    const navigate = useNavigate()
    const navigateToHome = () => {
        const currentLocation = localStorageService.getCurrentLocation()
        currentLocation ? navigate('/search') : navigate('/')
    }
    const defaultAccept = () => {
        navigateToHome()
    }
    return (
        <>
            <div className="confirm-popup-container">

                <p className="confirm-message">
                    {message}
                </p>
                <div className="buttons">
                    <button className="confirm-accept" onClick={accept != null ? accept : defaultAccept}>{confirmButtonText}</button>
                    <button className="confirm-refuse" onClick={close}>{closeButtonText}</button>
                </div>
            </div>
        </>

    )
}

export default ClosedSupplier