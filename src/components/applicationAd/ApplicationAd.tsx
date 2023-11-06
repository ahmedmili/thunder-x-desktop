import { Col, Container, Row } from 'react-bootstrap';
import addsStyles from "./applicationAdd.module.scss";


import phone_icn from "../../assets/home/phone-icn.png";

import app_store from "../../assets/home/app_store.png";
import google_play from "../../assets/home/google_play.png";

export const ApplicationAd = () => {



    return (
        <Container className={` ${addsStyles.applicationAdsMainContainer}`}>
            <Row>
                <Col>
                    <img className={addsStyles.applicationAdsImg} loading='lazy' src={phone_icn} alt="phone app" />
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
                                <p className={addsStyles.info3P1}>Téléchargez</p>
                                <p className={addsStyles.info3P2} > notre Application mobile</p>
                                <div className={addsStyles.socialBoxs}>
                                    <img src={app_store} loading='lazy' alt="app_store" />
                                </div>
                                <div className={addsStyles.socialBoxs}>
                                    <img src={google_play} loading='lazy' alt="google_play" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>



        </Container>
    )
}
