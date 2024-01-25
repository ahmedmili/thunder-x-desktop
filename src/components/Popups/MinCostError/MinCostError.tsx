import React from "react";

import { useNavigate } from "react-router";
import { useAppSelector } from "../../../Redux/store";
import './minCostError.scss';
import { useTranslation } from "react-i18next";


interface Props {
    close: () => void;
}

const MinCostError: React.FC<Props> = ({ close }) => {
    const navigate = useNavigate()
    const supplier = useAppSelector((state) => state.cart.supplier)
    const { t } = useTranslation()

    const goToSupplier = () => {
        const supplier_id = supplier.id
        const supplier_name = supplier.name
        const supplier_full_url_data = `${supplier_id} ${supplier_name}`.split(' ').join('-');
        const new_url = `/restaurant/${supplier_full_url_data}/All/`
        navigate(new_url)
        close()
    }

    return (
        <>
            <div className="min-cost-popup-container">
                <div onClick={close} className="close-button">X</div>

                <p className="message">
                    {
                        ` ${t('Modal.minCostError.Message.section1')} ${supplier.min_cost} Dt ${t('Modal.minCostError.Message.by')} ${supplier.name}. ${t('Modal.minCostError.Message.section2')} `
                    }
                </p>
                <div className="buttons">
                    <button className="goto-supp-button" onClick={goToSupplier}>{t('Modal.minCostError.Continue')}</button>
                    <button className="delete-cmd-button" onClick={close}>{t('Annuler')}</button>
                </div>
            </div>
        </>

    )
}

export default MinCostError