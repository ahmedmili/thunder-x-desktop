import React, { useEffect, useState } from "react";

import './signaleProblem.scss';

import { useTranslation } from "react-i18next";
interface Props {
    command_id: number,
    close: any,
    action: any

}

const SignaleProblem: React.FC<Props> = ({ command_id, close, action }) => {
    const { t } = useTranslation()

    const [problem, setProblem] = useState<string>("")
    const handleAction = () => {
        action(problem)

    }

    return (
        <div className="dignale-problem-popup-container" >

            <div className="dignale-problem-box">
                <button className="dignale-problem-close" onClick={close} >X</button>
                <div className="messages-container">
                    <h1 className="problem-title">{t('profile.commands.signal.title')}</h1>
                    <h3 className="problem-question">{t('profile.commands.signal.question')} N° {command_id} ?</h3>
                    <p className="problem-msg">{t('profile.commands.signal.message')}</p>
                </div>

                <textarea className="problem-text-input" placeholder="Saisir votre problème ici..." name="problem" id="problem" onChange={(e) => setProblem(e.target.value)} cols={30} rows={10}>

                </textarea>
                <button className="submit-problem" onClick={handleAction}>{t('Envoyer')}</button>
            </div>
        </div >
    )

}

export default SignaleProblem