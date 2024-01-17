import React, { useEffect, useState } from "react";

import './modifPassword.scss'

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from "react-router";
import { userService } from "../../../services/api/user.api";
// import { toast } from "react-toastify";
import * as yup from 'yup';
interface Props {
    close: any
}

const ModifPassword: React.FC<Props> = ({ close }) => {
    const navigate = useNavigate()

    const [password, setPassword] = useState<string>("")
    const [Newpassword, setNewPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
    const [valid, setValid] = useState<boolean>(false);
    const [eroorMessage, setErrorMessage] = useState<string>('');

    const schema = yup.object().shape({
        oldpassword: yup
            .string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters long'),
        newpassword: yup
            .string()
            .required('New password is required')
            .min(8, 'Password must be at least 8 characters long'),
        confirm_password: yup
            .string()
            .oneOf([yup.ref('newpassword'), null], 'Passwords must match'),
    });

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const userData = {
            oldpassword: password,
            newpassword: Newpassword,
            confirm_password: confirmPassword
        }
        schema
            .isValid(userData)
            .then((isValid) => {
                setValid(isValid)
                if (!isValid) {
                    schema.validate(userData)
                        .catch((err) => {
                            setErrorMessage(err.errors[0]);
                        });
                } else {
                    setErrorMessage('');
                }
            });

        try {
            if (valid) {

                const { status, data } = await userService.updatePassword(userData)

                if (data && data.success === undefined) {
                    const errors = Object.keys(data).map(key => data[key]);
                    errors.map((element: string) => {
                        // toast.warn(element[0])
                    })
                } else if (data.success === false) {
                    // toast.warn(data.message)

                }
            }
        } catch (error) {
            throw error
        }

    }
    const handleDisplayPW = (index: number) => {
        index === 1 && setShowPassword(!showPassword)
        index === 2 && setShowNewPassword(!showNewPassword)
        index === 3 && setShowConfirmPassword(!showConfirmPassword)
    }

    return (
        <div className="popup-container" >
            <div className="popup-box">
                <button onClick={close} className="close-button"></button>
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <label htmlFor="old-password">Ancien mot de passe</label>
                        <div className="input">
                            <input className="password-input form-control" type={showPassword ? "text" : "password"} name="old-password" placeholder="Entrer ici" onChange={(e) => setPassword(e.target.value)} />
                            {showPassword ? <VisibilityIcon onClick={() => handleDisplayPW(1)} className="visible-icon" /> : <VisibilityOffIcon onClick={() => handleDisplayPW(1)} className="visible-icon" />}
                        </div>
                    </div>
                    <div className="input-container">
                        <label htmlFor="new-password">Mot de passe</label>
                        <div className="input">
                            <input className="password-input form-control" type={showNewPassword ? "text" : "password"} name="new-password" placeholder="Entrer ici" onChange={(e) => setNewPassword(e.target.value)} />
                            {showNewPassword ? <VisibilityIcon onClick={() => handleDisplayPW(2)} className="visible-icon" /> : <VisibilityOffIcon onClick={() => handleDisplayPW(2)} className="visible-icon" />}
                        </div>
                    </div>
                    <div className="input-container">
                        <label htmlFor="confirm-password">Confirmation du mot de passe</label>
                        <div className="input">
                            <input className="password-input form-control" type={showNewPassword ? "text" : "password"} name="confirm-password" placeholder="Entrer ici" onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>

                    </div>
                    {!valid && <p className={`error-message ${!valid ? "visible" : ""}`} >{eroorMessage}</p>}
                    <div className="buttons">
                        <button type="reset" className="annule">Annuler</button>
                        <button type="submit" className="submit">Enregistrer</button>

                    </div>
                </form>
            </div>
        </div>
    )

}

export default ModifPassword