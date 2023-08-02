import React, { useEffect, useState } from "react";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
// import { Facebook, Instagram } from '@mui/icons-material';
import footerStyles from "./footer.module.scss";
import { Container, Row, Col } from "react-bootstrap";
interface FooterProps {}
import icon from "../../assets/icon.png";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { selectHomeData } from "../../Redux/slices/homeDataSlice";
import { useSelector } from "react-redux";
import { adsHomeSelector } from "../../Redux/slices/home";

const Footer: React.FC<FooterProps> = () => {
  //const data = useAppSelector((state) => state.homeData.data);

  const adsSelector = useSelector(adsHomeSelector);
  const ads = adsSelector.HOME_1;

  return (
    <Container fluid className={footerStyles.footerContainer}>
      <Row>
        {/* logo section */}
        <Col className={footerStyles.footerLogoCol}>
          <img
            className={footerStyles.webifyIcon}
            src={icon}
            alt="webify-icon"
          />
        </Col>
        {/* contact numbers sections */}
        <Col className={footerStyles.footerContacteTelCol}>
          <div className="number-container">
            <p className={footerStyles.footerTitle}>Contactez-Nous</p>
            <p className={footerStyles.FooterText}>
              <span>
                <LocalPhoneIcon />
              </span>
              +216 22 543 123
            </p>
            <p className={footerStyles.FooterText}>
              <span>
                <LocalPhoneIcon />
              </span>
              +216 22 543 123{" "}
            </p>
          </div>
        </Col>
        {/* email section */}
        <Col className={footerStyles.footerContacteEmailCol}>
          <div>
            <p className={footerStyles.footerTitle}>
              {" "}
              <span>
                {" "}
                <EmailIcon /> contacte{" "}
              </span>{" "}
            </p>
            <p className={footerStyles.FooterText}> thunder-express.com</p>
          </div>
        </Col>
        {/* pubs section */}
        <Col className={footerStyles.footerPubsCol}>
          <p className={footerStyles.footerTitle}> Derniere publication</p>

          {ads ? (
            ads.map((pub: any, index: number) => {
              // console.log(pub)

              return (
                <div key={pub.id} className={footerStyles.footerPubsContainer}>
                  <img
                    src={pub.image}
                    alt=""
                    className={footerStyles.pubsImage}
                  />
                  <p className={footerStyles.FooterText}>
                    {pub.menu?.description}
                  </p>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </Col>
      </Row>

      {/* all right reserved section */}
      <Row>
        <Col className={footerStyles.footerRightReserverCol}>
          <p>Tous droits réservés © 2023</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
