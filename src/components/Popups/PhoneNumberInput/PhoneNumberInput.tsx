import React, { useEffect, useState } from "react";

import './phoneNumberInput.scss'

import { localStorageService } from "../../../services/localStorageService";
import { useTranslation } from "react-i18next";
interface Props {
    close: any,

}

const PhoneNumberInput: React.FC<Props> = ({ close }) => {
const {t} = useTranslation()
    const [phone, setPhone] = useState<string>("")

    const getPhone = () => {
        const user = localStorageService.getUser()
        if (user) {
            setPhone(JSON.parse(user).tel)
        }
    }

    const handlePhoneChange = (number: string) => {
        setPhone(number)
    }

    const handleKeyNumberClick = (i: number) => {
        (i < 10 && i >= 0) && setPhone((current) => current + i);
        (i === 10) && setPhone((current) => current.slice(0, current.length - 1));
    }

    useEffect(() => {
        getPhone()
    }, [])

    return (
        <div className="phone-input-popup-container" >

            <div className="phone-popup-box">
                <button className="phone-input-popup-close" onClick={close} >X</button>
                <div className="input-text-zone">
                    <label htmlFor="phoneNumber">{t('Verifier.phone')}</label>
                    <div className="input-box">
                        <input value={phone} onChange={(e) => handlePhoneChange(e.target.value)} placeholder="27380570" className="phone-input" type="number" name="phoneNumber" id="phoneNumber" />
                    </div>
                </div>
                <div className="input-numbers-keys-zone">
                    {
                        (() => {
                            let elements: JSX.Element[] = [];
                            for (let index = 1; index < 10; index++) {
                                elements.push(
                                    <React.Fragment key={index}>
                                        <button className="number-key" onClick={() => handleKeyNumberClick(index)} >{index}</button>
                                    </React.Fragment>
                                );
                            }
                            return elements;
                        })()
                    }
                    <button className="number-delete"></button>
                    <button className="number-key" onClick={() => handleKeyNumberClick(0)} >0</button>
                    <button className="number-delete" onClick={() => handleKeyNumberClick(10)} >x</button>

                </div>
            </div>
        </div >
    )

}

export default PhoneNumberInput