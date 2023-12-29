import { Box, Card, CardMedia, Typography } from "@mui/material";
import {
  ButtonBack,
  ButtonNext,
  CarouselProvider,
  Slide,
  Slider,
} from "pure-react-carousel";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Restaurant, Ads } from "../../services/types";
import SupplierCard from "../supplierCard/SupplierCard";
import "./HomPageAds.scss";

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; import useMediaQuery from "../../utils/useMediaQuery";

interface Props {
  homeAds: Ads[];
}

const HomPageAds: React.FC<Props> = ({ homeAds }) => {
  const { t } = useTranslation();

  const [ads, setAds] = useState(homeAds);

  useEffect(() => {
    console.log("homeAds : ", homeAds)
  }, [homeAds])

  return (
    <div className={`recommandedContainer`}>

      <Container className={`container`}>
        <CarouselProvider
          naturalSlideWidth={100}
          naturalSlideHeight={70}
          totalSlides={homeAds.length}
          visibleSlides={2}
          step={3}
          infinite={true}
          className={`carouselProvider`}
        >
          <Slider >
            {homeAds.map((ad, index) => (
              <Slide index={index} key={index}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    component="img"
                    height="194"
                    image={`${ad.image}`}
                    alt="Paella dish"
                  />

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
