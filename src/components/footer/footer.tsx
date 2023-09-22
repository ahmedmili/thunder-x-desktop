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
import { useEffect, useRef, useState } from "react";
import Carousel from 'react-multi-carousel';
// import 'react-multi-carousel/lib/styles.css';

const Footer: React.FC<FooterProps> = () => {

  const adsSelector = useSelector(adsHomeSelector);
  const ads = adsSelector.HOME_1;

  const carouselContainerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const imagesPerSlide = 3; // Number of images per slide
  const [images, setImages] = useState<any>([]);

  useEffect(() => {
    setImages(ads);
    console.log("ads", ads)
  }, [ads]);

  // useEffect(() => {
  //   const carouselContainer = carouselContainerRef.current;

  //   if (!carouselContainer) {
  //     // Handle the case where carouselContainer is null
  //     return;
  //   }

  //   // Handle the animation
  //   const handleAnimation = () => {
  //     carouselContainer.style.animation = 'none';
  //     setTimeout(() => {
  //     carouselContainer.style.animation = 'slide 5s linear infinite';
  //     handleNextSlide()
  //     }, 100);
  //   };

  //   // Listen for animation iteration to restart the animation
  //   carouselContainer.addEventListener('animationiteration', handleAnimation);

  //   // Initial setup
  //   handleAnimation();

  //   // Cleanup when unmounting the component
  //   return () => {
  //     carouselContainer.removeEventListener('animationiteration', handleAnimation);
  //   };
  // }, []);


  // const handleNextSlide = () => {
  //   setCurrentIndex((prevIndex) => (prevIndex + imagesPerSlide) % images.length);
  //   console.log(currentIndex)
  // };

  // const handlePrevSlide = () => {
  //   setCurrentIndex(
  //     (prevIndex) => (prevIndex - imagesPerSlide + images.length) % images.length
  //   );
  // }
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
      paritialVisibilityGutter: 40,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      paritialVisibilityGutter: 40,

    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      paritialVisibilityGutter: 40,

    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      paritialVisibilityGutter: 40,

    }
  };

  useEffect(() => {
    console.log("ads", ads)
  }, [ads])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Slide by 3 items
    }, 3000); // Change slide every 3 seconds (adjust as needed)
    console.log(images)
    return () => clearInterval(interval);
  }, [images]);

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
                          <img src={item.image} alt="" />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* <Carousel
                    showDots={false} // Hide the dots
                    arrows={false}   // Hide the control arrows
                    swipeable={false} // Disable swipe gestures on mobile
                    draggable={false} // Disable dragging the carousel
                    responsive={responsive} // Set the responsive breakpoints
                    ssr={true} // Server-side rendering support
                    infinite={true} // Enable infinite loop
                    autoPlay={true} // Auto-play the carousel
                    autoPlaySpeed={3000} // Auto-play interval in milliseconds
                    itemClass="vertical-carousel-item"
                    containerClass="vertical-carousel-container"
                    additionalTransfrom={-50} // Adjust this value to control the vertical sliding
                    centerMode={false} // Disable center mode
                    focusOnSelect={false} // Disable focus on select


                  >
                    {images.map((image: any, index: number) => (
                      <div key={index}>
                        <img src={image.image} alt={`Image ${index}`} />
                      </div>
                    ))}
                  </Carousel>; */}
                </>

              ) :
                (
                  <>
                  </>
                )
            }
          </div>
        </Col>
        <div className="demi-cercle">

        </div>
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
