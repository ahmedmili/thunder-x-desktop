import React, { useEffect, useState } from 'react';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
// import { Facebook, Instagram } from '@mui/icons-material';
import footerStyles from './footer.module.scss'
import { Container, Row, Col } from "react-bootstrap"
interface FooterProps { }
import icon from '../../assets/icon.png';
import { useAppSelector } from '../../Redux/store';
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import FacebookIcon from '../../assets/icons/FacebookIcon';
import InstaIcon from '../../assets/icons/InstaIcon';
import TikTokIcon from '../../assets/icons/TiktokIcon';
import Email from '../../assets/icons/Email';

const Footer: React.FC<FooterProps> = () => {
  const data = useAppSelector((state) => state.homeData.data);
  const ads = data?.ads.HOME_1;

  return (
    <Container fluid className={footerStyles.footerContainer}>
      <Row className={footerStyles.bodyRow}>
        {/* logo section */}
        <Col className={footerStyles.footerLogoCol} >
          <img className={footerStyles.webifyIcon} src={icon} alt="webify-icon" />
        </Col>
        {/* contact numbers sections */}
        <Col className={footerStyles.footerContacteTelCol}>
          <div>
            <p className={footerStyles.footerTitle}>Contactez-Nous</p>
            <p className={footerStyles.FooterText} ><span> <LocalPhoneIcon /></span>  +216 22 543 123 </p>
            <p className={footerStyles.FooterText} > <span><LocalPhoneIcon /></span> +216 22 543 123 </p>

            <div className={footerStyles.socialMedia}>
              <div className={footerStyles.icon}>
                <FacebookIcon ></FacebookIcon>

              </div>
              <div className={footerStyles.icon}>
                <InstaIcon ></InstaIcon>

              </div>
              
              <div className={footerStyles.icon}>
                <TikTokIcon></TikTokIcon>

              </div>
            </div>
          </div>
        </Col>
        {/* email section */}
        <Col className={footerStyles.footerContacteEmailCol}>
          <div className={footerStyles.footerContacteEmailContainer}>
            <p className={footerStyles.footerTitle}>
              <span>
                <Email></Email>
              </span>
              contacte
            </p>
            <p className={footerStyles.FooterText}> thunder-express.com</p>

          </div>
        </Col>
        {/* pubs section */}
        <Col className={footerStyles.footerPubsCol}>
          <div className={footerStyles.pubsContainer}>

            <p className={footerStyles.footerTitle}> Derniere publication</p>

            {
              ads ? (
                <CarouselProvider
                  naturalSlideWidth={250}
                  naturalSlideHeight={80}
                  totalSlides={
                    ads.length
                  }
                  visibleSlides={2}
                  step={1}
                  infinite={true}
                  isPlaying={true}
                  lockOnWindowScroll={true}
                  orientation='vertical'
                >

                  <Slider >
                    {ads.map((ad: any) => (
                      <Slide key={ad.id} index={ad.id}>
                        <div className={footerStyles.slideInner}>
                          <img src={ad.image} alt="ads images" className={footerStyles.pubsImage} />
                          <p className={footerStyles.FooterText}>{ad.menu?.description}</p>
                        </div>
                      </Slide>
                    ))}
                  </Slider>
                </CarouselProvider>
              ) :
                (
                  <>
                  </>
                )
            }
          </div>

        </Col>
      </Row>

      {/* all right reserved section */}
      <Row >
        <Col className={footerStyles.footerRightReserverCol}>
          <p >Tous droits réservés © 2023</p>
        </Col>
      </Row>

    </Container>
  );
};

export default Footer;
