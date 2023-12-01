import React from "react";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { clearCart } from "../../../Redux/slices/cart/cartSlice";
import { useAppSelector } from "../../../Redux/store";
import './sameSupplierWarn.scss';
import { useTranslation } from "react-i18next";


interface Props {
    close: () => void;
}

const SameSupplierWarn: React.FC<Props> = ({ close }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const supplier = useAppSelector((state) => state.cart.supplier)
    const { t } = useTranslation()
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
                    {t('Modal.finishCommand')}
                </h3>
                <p className="message">
                    {t('Modal.finishCommand.message')}
                </p>
                <div className="buttons">
                    <button className="finaliser-button" onClick={goToPanierPage}>{t('Modal.finishCommand.finishOldCommande')}</button>
                    <button className="goto-supp-button" onClick={goToSupplier}>{t('Modal.finishCommand.goBackToSupplier')}</button>
                    <button className="delete-cmd-button" onClick={dropCurrentCommand}>{t('Modal.finishCommand.dropOldCommand')}</button>
                </div>
            </div>
        </>

    )
}

export default SameSupplierWarn