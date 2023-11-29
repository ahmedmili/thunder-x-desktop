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
  

    const showContent = () => {
        setShow(!show)
    }

    const getCode = (e: any) => {
        let targetCode = e.target.value
        if (targetCode.length === 6) {
            createSponsorship(targetCode)
        }
    }

    const createSponsorship = async (value: string) => {
        setLoading(true)
        const { status, data } = await userService.createsponsorship(value);
        if (status == 422) {
            setMessage("Code non approuvé !")
            setMessageColor("#F00")
            setLoading(false)
        } else if (status == 200) {
            if (data.success) {
                setMessage("Code approuvé !")
                setMessageColor("#2EB5B2")
                setLoading(false)
            } else {
                setMessage("Code non approuvé !")
                setMessageColor("#F00")
                setLoading(false)

            }
        } else if (!status) {
            setMessage("Error !!")
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
                show && !parent && (
                    <section className='parainage-code-body'>
                        <div className='copier-code-btn-container' >
                            <button className='copier-code-btn' style={{ backgroundImage: `url(${Copie})` }} />
                            <span>Entrer le code</span>
                        </div>
                        <div className='code-input-container' >
                            <div>
                                <input className='code-input' maxLength={6} type="text" placeholder='-' name='code-input' onChange={(event) => { getCode(event) }} />
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
                show && parent && (
                    <section className='partnair-display-body'>
                        <div className='partner-logo' style={{ backgroundImage: `url(${Logo})` }}></div>
                        <p> {`${parent.firstname} ${parent.lastname}`}</p>
                    </section>
                )
            }
        </main>

    )
}

export default Parent