import { useTranslation } from 'react-i18next';
import './parent.scss';

import Copie from '../../../../../../assets/icons/copier.svg';
import Logo from '../../../../../../assets/profile/profile_img.png';

import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { useEffect, useState } from 'react';
import { userService } from '../../../../../../services/api/user.api';
import Spinner from '../../../../../spinner/Spinner';

interface CodeProps {
    parent: any
}

function Parent({ parent }: CodeProps) {
    const { t } = useTranslation()
    const [show, setShow] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [messasge, setMessage] = useState<string>('')
    const [messageColor, setMessageColor] = useState<string>("2EB5B2")
    const [code, setCode] = useState<string>("");
    const [disabled, setDisabled] = useState<boolean>(false);



    const showContent = () => {
        setShow(!show)
    }

    const getCode = (code: string) => {
        if (code.length === 6) {
            createSponsorship(code)
        } else {
            setMessage('')
        }
    }

    useEffect(() => {
        getCode(code)
    }, [code])

    const createSponsorship = async (value: string) => { //b55a43
        setLoading(true)
        const response = await userService.createsponsorship(value);
        if (response.data != null) {
            const sponsoring_points = response.data.data.points
            const message = `Code approuvé.  Nous sommes ravis de vous accorder ${sponsoring_points} points`
            setMessage(message)
            setDisabled(true)
            setMessageColor("#2EB5B2")
            setLoading(false)
        } else {
            setMessage("Code non approuvé !")
            setMessageColor("#F00")
            setLoading(false)
        }
    }


    return (
        <main className='parainage-code-container'>
            <header className='parainage-header' onClick={showContent}>
                <p>{t('profile.fidelite.CodeParrainage')}</p>
                <KeyboardArrowUpOutlinedIcon className={` icon ${show ? 'active' : ''} `} />
            </header>
            {
                show && (parent.firstname === undefined) && (
                    <section className='parainage-code-body'>
                        <div className='copier-code-btn-container' >
                            <button className='copier-code-btn' style={{ backgroundImage: `url(${Copie})` }} />
                            <span>{t('profile.fidelite.EnterCode')}</span>
                        </div>
                        <div className='code-input-container' >
                            <div>
                                <input disabled={disabled} className='code-input' value={code} maxLength={6} type="text" placeholder='-' name='code-input' onChange={(event) => { setCode(event.target.value) }} />
                                {
                                    loading && <Spinner name='' />
                                }

                            </div>
                            {
                                messasge.length > 0 && <label htmlFor="code-input" style={{ color: messageColor }} >{messasge}</label>
                            }
                        </div>
                    </section>
                )
            }
            {
                show && (parent.firstname != undefined) && (
                    <div className='partnair-display-body'>
                        <div className="parrainage-list">
                            <div className="parrainage-list-item">
                                <div className="partner-blc">
                                    <div className="partner-logo-blc">
                                        {/* 
                                            <div className='partner-logo' style={{ backgroundImage: `url(${Logo})` }}></div>
                                        */}
                                        <img src={Logo} alt="Logo" />
                                    </div>
                                    <p className="partner-name"> {`${parent.firstname} ${parent.lastname}`}</p>
                                </div>
                                <div className="partner-blc">
                                    <div className="points-count">
                                        10 Points
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </main>

    )
}

export default Parent