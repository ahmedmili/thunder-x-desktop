import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import "./footer.scss";
import { Container, Row, Col } from "react-bootstrap";
interface FooterProps { }
import icon from "../../assets/icon.png";
import { useSelector } from "react-redux";
import { adsHomeSelector } from "../../Redux/slices/home";
import { CarouselProvider, Slide, Slider } from "pure-react-carousel";
import Email from "../../assets/icons/Email";
import TikTokIcon from "../../assets/icons/TiktokIcon";
import InstaIcon from "../../assets/icons/InstaIcon";
import FacebookIcon from "../../assets/icons/FacebookIcon";

const Footer: React.FC<FooterProps> = () => {

  const adsSelector = useSelector(adsHomeSelector);
  const ads = adsSelector.HOME_1;
  return (
    <Container fluid className="footerContainer">
      <Row className="bodyRow">
        {/* logo section */}
        <Col className="footerLogoCol" >
          <img className="webifyIcon" src={icon} alt="webify-icon" />
        </Col>
        {/* contact numbers sections */}
        <Col className={"footerContacteTelCol"}>
          <div>
            <p className={"footerTitle"}>Contactez-Nous</p>
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
            <p className={"footerTitle"}>
              <span>
                <Email></Email>
              </span>
              contacte
            </p>
            <p className={"FooterText"}> thunder-express.com</p>

          </div>
        </Col>
        {/* pubs section */}
        <Col className={"footerPubsCol"}>
          <div className={"pubsContainer"}>

            <p className={"footerTitle"}> Derniere publication</p>

            {
              ads ? (
                <CarouselProvider
                  naturalSlideWidth={250}
                  naturalSlideHeight={80}
                  totalSlides={
                    ads.length
                  }
                  visibleSlides={3}
                  step={1}
                  infinite={true}
                  isPlaying={true}
                  lockOnWindowScroll={true}
                  orientation='vertical'
                >

                  <Slider >
                    {ads.map((ad: any) => (
                      <Slide key={ad.id} index={ad.id}>
                        <div className={"slideInner"}>
                          <img src={ad.image} alt="ads images" className={"pubsImage"} />
                          <p className={"FooterText"}>{ad.menu?.description}</p>
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
        <Col className={"footerRightReserverCol"}>
          <p >Tous droits réservés © 2023</p>
        </Col>
      </Row>

    </Container>
  );

};

export default Footer;
