import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import "./footer.scss";
import { Container, Row, Col } from "react-bootstrap";
interface FooterProps { }
import icon from "../../assets/icon.png";
import { useSelector } from "react-redux";
import { adsHomeSelector } from "../../Redux/slices/home";
import Email from "../../assets/icons/Email";
import TikTokIcon from "../../assets/icons/TiktokIcon";
import InstaIcon from "../../assets/icons/InstaIcon";
import FacebookIcon from "../../assets/icons/FacebookIcon";
import { useAppSelector } from "../../Redux/store";
import { Suspense, useEffect, useState } from "react";

const Footer: React.FC<FooterProps> = () => {

  const adsSelector = useSelector(adsHomeSelector);
  const ads = adsSelector.HOME_1;
  const theme = useAppSelector((state) => state.home.theme)
  const [template, setTemplate] = useState<number>(theme)
  useEffect(() => {
    setTemplate(theme)
  }, [theme])
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<any>([]);

  useEffect(() => {
    ads && setImages(ads);
  }, [ads]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <Suspense
      fallback={
        <>
        </>
      }
      
    >

      <Container fluid className={`footerContainer ${template === 1 && 'dark-background2'}`}>
        <Row className="bodyRow">
          {/* logo section */}
          <Col className="footerLogoCol" >
            <img loading="lazy" className="webifyIcon" src={icon} alt="webify-icon" />
          </Col>
          {/* contact numbers sections */}
          <Col className={"footerContacteTelCol"}>
            <div>
              <h4 className={"footerTitle"}>Contactez-Nous</h4>
              <p className={"FooterText"} ><span> <LocalPhoneIcon className="icon" /></span> &nbsp; +216 22 543 123 </p>
              <p className={"FooterText"} > <span><LocalPhoneIcon className="icon" /></span> &nbsp; +216 22 543 123 </p>

              <div className={"socialMedia"}>
                <div className={"icons"}>
                  <FacebookIcon className="icon"></FacebookIcon>

                </div>
                <div className={"icons"}>
                  <InstaIcon className="icon" ></InstaIcon>

                </div>

                <div className={"icons"}>
                  <TikTokIcon className="icon" ></TikTokIcon>

                </div>
              </div>
            </div>
          </Col>
          {/* email section */}
          <Col className={"footerContacteEmailCol"}>
            <div className={"footerContacteEmailContainer"}>
              <h4 className={"footerTitle"}>
                contacts
              </h4>
              <p className={"FooterText"}> thunder-express.com</p>
            </div>
          </Col>
          {/* pubs section */}
          <Col className={"footerPubsCol"}>
            <div className={"pubsContainer"}>

              <p className={"footerTitle"}> Derniere publication</p>

              {
                images ? (
                  <>
                    <div className="bottom-to-top-scroll-carousel-container">
                      <div
                        className="bottom-to-top-scroll-carousel-items"
                        style={{
                          transform: `translateY(-${currentIndex * 57}px)`,
                          transition: 'transform 1s ease', // Adjust the transition duration as needed
                        }}
                      >
                        {images.map((item: any, index: number) => (
                          <div key={index} className="bottom-to-top-scroll-carousel-item">
                            <img loading="lazy" src={item.image} alt="item image" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>

                ) :
                  (
                    <>
                    </>
                  )
              }
            </div>
          </Col>
          {/* 
            <div className="demi-cerlce-container">
              <div className="demi-cercle">
              </div>
            </div>
          */}
        </Row>

        {/* all right reserved section */}
        <Row >
          <Col className={`footerRightReserverCol  ${template === 1 && 'dark-background'} `} >
            <p >Tous droits réservés © 2023</p>
          </Col>
        </Row>

      </Container>
    </Suspense>

  );

};

export default Footer;
