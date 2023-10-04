import style from './footerNewsLetter.module.scss'
import { Container, Row, Col } from 'react-bootstrap'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
export const FooterNewsLeter = () => {
    return (
        <Container fluid className={style.newsLetterContainer}>
            <Row className={style.newsLetterRow} >
                <Col className={"col-6 " + style.textContainer}>
                    <p  className={style.firstPara}>Abonnez-vous à notre newsletter</p>
                    <p className={style.secondPara}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.</p>
                </Col >
                <Col className={"col-6 " + style.inputContainer}>
                    <div className={style.emailInputContainer}>
                        <input type="email" name="email" id="email" placeholder='Votre adresse e-mail' />
                        <button> s'abonner <span className={style.iconContainer}><KeyboardArrowRightIcon className={style.icon}/></span></button>
                    </div>
                </Col>
            </Row>

        </Container>
    )
}
