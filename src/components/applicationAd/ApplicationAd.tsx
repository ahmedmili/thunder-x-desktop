import { Container, Row, Col } from 'react-bootstrap';
import addsStyles from "./applicationAdd.module.scss"
export const ApplicationAd = () => {

    return (
        <Container className={addsStyles.applicationAdsMainContainer}>
            <Row>
                <Col>
                    <img className={addsStyles.applicationAdsImg} src="src\assets\home\phone-icn 3.png" alt="phone app" />
                </Col>
            </Row>
            <Row className={addsStyles.applicationAdsDesignContainer} >
                <Col className='d-flex justify-content-center'>
                    <div className={addsStyles.applicationAdsInfo}>
                        <div className={addsStyles.infoContainer}>

                            <div className={addsStyles.info1}>
                                <p className={addsStyles.info1P1}>Livraison rapide & pick-up facile</p>
                                <p className={addsStyles.info1P2}>Suivez les commandes jusqu’à votre porte</p>

                                <button className={addsStyles.info1Button} >Commandez</button>
                            </div>
                            <div className={addsStyles.info2}>
                                <h3 className={addsStyles.info2P1}>OU</h3>
                            </div>
                            <div className={addsStyles.info3}>
                                <p className={addsStyles.info3P1}>Téléchargez <br />
                                    <span>
                                        notre Application mobile
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>



        </Container>
    )
}
