import { Box, Typography } from "@mui/material";
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
import { Restaurant } from "../../services/types";
import SupplierCard from "../supplierCard/SupplierCard";
import recommandedStyle from "./recommendedRestaurants.module.scss";

import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

interface Props {
  listType: string;
  restaurants: Restaurant[];
}

const RestaurantList: React.FC<Props> = ({ restaurants, listType }) => {
  const { t } = useTranslation();

  const [restaurantsList, setRestaurantsList] = useState(restaurants);


  useEffect(() => {
    setRestaurantsList(restaurants);
  }, [restaurants]);

  if (restaurants.length === 0 && listType == "recommanded") {
    return (
      <div style={{ height: "350px", backgroundColor: "#fffff1" }}>
        <h2>{t("recommendedForYou")}</h2>
        <Typography variant="h5" component="h2" align="center">
          {t("noSuggestions")}
        </Typography>
      </div>
    );
  }

  if (restaurants.length === 0 && listType == "discount") {
    return <div></div>;
  }
  const displayNormal = restaurantsList.length >= 6;
  var middleIndex: any;
  var firstMiddle: any;
  var lastMiddle: any;
  if (displayNormal) {
    middleIndex = Math.ceil(restaurantsList.length / 2);
    firstMiddle = restaurantsList.slice(0, middleIndex);
    lastMiddle = restaurantsList.slice(middleIndex);
  }

  return (
    <div className={recommandedStyle.recommandedContainer}>
      {
        <Container fluid className={recommandedStyle.container + ` ${!displayNormal && recommandedStyle.uniqueContainer} `}>
          <Row>
            {listType == "recommanded" && (
              <h2 className={recommandedStyle.recaommandedTitle}>
                {" "}
                {t("recommendedForYou")}
              </h2>
            )}
            {listType == "discount" && (
              <Box className={recommandedStyle.discountTitleContainer}>
                <h2>Jusqu'à 25 % de réduction - Offres de repas</h2>
                <p>
                  Besoin d'une pause de cuisine ou simplement envie de votre{" "}
                  <br />
                  restaurant préféré ?
                </p>
              </Box>
            )}
          </Row>

          <div
            className={
              displayNormal ? recommandedStyle.bouble : recommandedStyle.unique
            }
          ></div>
          <CarouselProvider
            naturalSlideWidth={100}
            naturalSlideHeight={displayNormal ? 200 : 350}
            totalSlides={
              displayNormal
                ? restaurantsList.length / 2 + 1
                : restaurantsList.length
            }
            visibleSlides={3}
            step={3}
            infinite={true}
            className={recommandedStyle.carouselProvider}
          >
            <Row>
              <Col>
                {(() => {
                  const cart = [];
                  for (
                    let i = 0;
                    i <
                    (displayNormal
                      ? restaurantsList.length / 2
                      : restaurantsList.length);
                    i++
                  ) {
                    cart.push(
                      <div key={i}>
                        {displayNormal ? (
                          <>
                            <Slide index={i} key={firstMiddle![i].id}>
                              {firstMiddle![i] && (
                                <SupplierCard data={firstMiddle![i]} />
                              )}
                              <br />
                              {lastMiddle![i] && (
                                <SupplierCard data={lastMiddle![i]} />
                              )}
                            </Slide>
                          </>
                        ) : (
                          <div className={recommandedStyle.uniqueDivCard}>
                            <SupplierCard data={restaurantsList[i]} />
                          </div>
                        )}
                      </div>
                    );
                  }
                  // Generate a unique key for the Slider
                  const sliderKey = 'uniqueSliderKey'; // Replace with your unique key
                  return (
                    <Slider key={sliderKey}>
                      {cart}
                    </Slider>
                  );
                })()}
              </Col>
            </Row>
            <Row className={` ${recommandedStyle.recommandedListButtonsContainer} ${!displayNormal ? recommandedStyle.uniqueButtons + "" : " test"}`}>
              <Col>
                <ButtonBack className={recommandedStyle.btn}>
                  <KeyboardDoubleArrowLeftIcon
                    className={recommandedStyle.sliderButtonIcon}
                  />
                </ButtonBack>
              </Col>
              <Col className={recommandedStyle.rightBtn}>
                <ButtonNext className={recommandedStyle.btn}>
                  <KeyboardDoubleArrowRightIcon
                    className={recommandedStyle.sliderButtonIcon}
                  />
                </ButtonNext>
              </Col>
            </Row>
          </CarouselProvider>
        </Container>
      }
    </div>
  );
};

export default RestaurantList;
