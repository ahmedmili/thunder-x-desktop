import React, { useEffect } from "react";

import './paymentPopup.scss'

import Command_vailde from "../../../assets/payment/command-success.png"
import Payment_valide from "../../../assets/payment/payment-success.png"
import Payment_echec from "../../../assets/payment/payment-not-success.png"
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import CloseIcon from '@mui/icons-material/Close';
interface Props {
    type: string;
    close: any
}

const PaymentPopup: React.FC<Props> = ({ close, type }) => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    var popup_image
    var popup_title
    var title_color
    var popup_msg
    switch (type) {
        case "error":
            popup_title = t('popup.payment.invalidePayment');
            title_color = '#FBC000'
            popup_image = Payment_echec;
            popup_msg = t('popup.payment.invalidePayment.msg');
            break;
        case "command_success":
            popup_title = t('popup.payment.valideCommand');
            popup_image = Command_vailde;
            popup_msg = t('popup.payment.validePayment.msg');
            title_color = '#24A6A4'
            break;
        case "payment_success":
            popup_title = t('popup.payment.validePayment');
            title_color = '#24A6A4'
            popup_image = Payment_valide;
            popup_msg = t('popup.payment.validePayment.msg');
            break;
        default:
            break;
    }

    return (
        <div className="popup-container" onClick={() => {
            close()
            type !== "error" && navigate("/", { replace: true })
        }
        }>
            <div className="popup-box">
                <button className="close-btn" onClick={() => {
                    close()
                    type !== "error" && navigate("/", { replace: true })
                }
                }>
                <CloseIcon className='close-icon'></CloseIcon>
                </button>
                <p className="title" style={{ color: title_color }}>{popup_title}</p>
                <img loading="lazy" src={popup_image} alt="echec payment" />
                <p>{popup_msg}</p>
            </div>
        </div>
    )

}

export default PaymentPopup