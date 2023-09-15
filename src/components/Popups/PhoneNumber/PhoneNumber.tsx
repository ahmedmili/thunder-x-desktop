import React, { useEffect, useState } from "react";

import './phoneNumber.scss'

import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
interface Props {
    close: any
}

const PhoneNumber: React.FC<Props> = ({ close }) => {

    return (
        <div className="popup-container" onClick={close}>
            <div className="phone-popup-box">
                <LocalPhoneRoundedIcon className="phone-icon" />
                <span className="phone-number">44 100 162</span>
            </div>
        </div>
    )

}

export default PhoneNumber