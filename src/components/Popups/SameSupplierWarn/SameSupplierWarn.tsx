import React, { RefObject, Suspense, useEffect, useReducer, useRef, useState } from "react";

import './sameSupplierWarn.scss'
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { clearCart } from "../../../Redux/slices/cart/cartSlice";
import { useLocation, useNavigate } from "react-router";
import { useAppSelector } from "../../../Redux/store";


interface Props {
    finaliseCommand?: () => void;
    dropCommand?: () => void;
    goTo?: () => void;
    close: () => void;

}

const SameSupplierWarn: React.FC<Props> = ({ close, finaliseCommand, dropCommand, goTo }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const supplier = useAppSelector((state) => state.cart.supplier)
    const location = useLocation()
    const dropCurrentCommand = () => {
        dispatch(clearCart())
        close()
    }
    const goToSupplier = () => {
        const supplier_id = supplier.id
        const supplier_name = supplier.name
        const supplier_full_url_data = `${supplier_id} ${supplier_name}`.split(' ').join('-');
        const new_url = `/restaurant/${supplier_full_url_data}/All/`
        navigate(new_url)
        close()
    }
    const goToPanierPage = () => {
        navigate('/cart/')

    }
    return (

        <>
            <div className="popup-overlay" onClick={close}>

            </div>
            <div className="not-same-popup-container">
                <div onClick={close} className="close-button">X</div>

                <h3 className="title">
                    Finaliser de la commande
                </h3>
                <p className="message">
                    Veuillez finaliser votre commande pour pouvoir commander à nouveau, sinon supprimer la commande non-finalisée
                </p>
                <div className="buttons">
                    <button className="finaliser-button" onClick={goToPanierPage}>Finaliser la commande précédente</button>
                    <button className="goto-supp-button" onClick={goToSupplier}>Réaccéder au même fournisseur</button>
                    <button className="delete-cmd-button" onClick={dropCurrentCommand}>Supprimer la commande précédente</button>
                </div>
            </div>
        </>

    )
}

export default SameSupplierWarn