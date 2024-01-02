import { Card, CardMedia } from "@mui/material";
import {
  ButtonBack,
  ButtonNext,
  CarouselProvider,
  Slide,
  Slider,
} from "pure-react-carousel";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Ads } from "../../services/types";
import "./homePageAds.scss"

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Props {
  homeAds: Ads[];
}

const HomPageAds: React.FC<Props> = ({ homeAds }) => {

  return (
    <div className={`recommandedContainer`}>

      <Container className={`container`}>
        <CarouselProvider
          naturalSlideWidth={100}
          naturalSlideHeight={50}
          totalSlides={homeAds.length}
          visibleSlides={2}
          step={1}
          isPlaying={true}
          infinite={true}
          className={`carouselProvider`}
        >
          <Slider >
            {homeAds.map((ad, index) => (
              <Slide index={index} key={index}>
                <Card sx={{ maxWidth: 345 }}>
                  {
                    ad.type === "IMAGE" ?
                      <CardMedia
                        component="img"
                        height="194"
                        image={`${ad.image}`}
                        alt="ads image"
                      />
                      :
                      <CardMedia
                        component="video"
                        height="194"
                        controls // This adds play/pause controls to the video
                      >
                        <source src={`${ad.image}`} type="video/mp4" />
                        Your browser does not support the video tag.
                      </CardMedia>
                  }
                </Card>
              </Slide>
            ))}
          </Slider>
          <Row className={`recommandedListButtonsContainer`}>
            <Col>
              <ButtonBack className={`btn`}>
                <ArrowBackIosIcon
                  className={`sliderButtonIcon`}
                />
              </ButtonBack>
            </Col>
            <Col className={`rightBtn`}>
              <ButtonNext className={`btn`}>
                <ArrowForwardIosIcon
                  className={`sliderButtonIcon`}
                />
              </ButtonNext>
            </Col>
          </Row>
        </CarouselProvider>
      </Container>

    </div>
  );
};

export default HomPageAds;
