import style from './footerNewsLetter.module.scss'
import { Container, Form } from 'react-bootstrap'
import newsLetterImg from './../../assets/newsletter-icn.png'

export const FooterNewsLeter = () => {
    return (
        <div className={style.newsLetterArea}>
            <Container className={style.newsLetterContainer}>      
                <div className={style.newsLetterDescription}>
                    <h3 className={style.newsLetterTitle}>Abonnez-vous à notre newsletter</h3>
                    <p className={style.newsLetterDesc}>
                        Restez au courant 
                    </p>
                    <div className={style.emailWrapper}>
                        <Form.Control className={style.formControl} type="email" placeholder="Votre adresse e-mail" />
                        <button className={style.btnEmailSubmit}> 
                            s'abonner 
                            <span className={style.icon}>
                            </span>
                        </button>
                    </div>
                </div>
                <div className={style.newsLetterImg}>
                    <img src={newsLetterImg} alt="" />
                </div>
            </Container>
        </div>
    )
}
