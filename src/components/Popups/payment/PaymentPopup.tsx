import React, { useEffect } from "react";

import './paymentPopup.scss'

import Command_vailde from "../../../assets/payment/Command_vailde.svg"
import Payment_valide from "../../../assets/payment/Payment_valide.svg"
import Payment_echec from "../../../assets/payment/Payment_echec.svg"
import { useNavigate } from "react-router";
interface Props {
    type: string;
    close: any
}

const PaymentPopup: React.FC<Props> = ({ close, type }) => {
    const navigate = useNavigate()

    var popup_image
    var popup_title
    var title_color
    var popup_msg
    switch (type) {
        case "error":
            popup_title = "Paiement non valide !";
            title_color = '#FBC000'
            popup_image = Payment_echec;
            popup_msg = "Echec de paiement, veuillez réessayer";
            break;
        case "command_success":
            popup_title = "Commande validé !";
            popup_image = Command_vailde;
            popup_msg = "Vous serez alerté lorsque le livreur arrive prés de chez vous.";
            title_color = '#24A6A4'
            break;
        case "payment_success":
            popup_title = "Paiement validé !";
            title_color = '#24A6A4'
            popup_image = Payment_valide;
            popup_msg = "Vous serez alerté lorsque le livreur arrive prés de chez vous.";
            break;
        default:
            break;
    }

    return (
        <div className="popup-container" onClick={() => {
            close()
            type !== "error" && navigate("/track-order",{replace:true})
        }
        }>
            <div className="popup-box">
                <p style={{ color: title_color }}>{popup_title}</p>
                <img src={popup_image} alt="echec payment" />
                <p>{popup_msg}</p>
            </div>
        </div>
    )

}

export default PaymentPopup