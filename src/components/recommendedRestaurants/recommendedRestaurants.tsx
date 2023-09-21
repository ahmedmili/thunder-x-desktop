import React, { useEffect, useState } from "react";
import { Restaurant } from "../../services/types";
import { Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import recommandedStyle from "./recommendedRestaurants.module.scss";
import SupplierCard from "../supplierCard/SupplierCard";
import {
  ButtonBack,
  ButtonNext,
  CarouselProvider,
  Slide,
  Slider,
} from "pure-react-carousel";
import { Container, Row, Col } from "react-bootstrap";

import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useAppSelector } from "../../Redux/store";

interface Props {
  listType: string;
  restaurants: Restaurant[];
}

const RestaurantList: React.FC<Props> = ({ restaurants, listType }) => {
  const { t } = useTranslation();

  const [restaurantsList, setRestaurantsList] = useState(restaurants);

  const theme = useAppSelector(state => state.home.theme)
  const [template, setTemplate] = useState<number>(theme)

  useEffect(() => {
    setTemplate(theme)
  }, [theme])

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
        <Container className={recommandedStyle.container +` ${template === 1 && 'dark-background2'}`}>
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
                <Slider>
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
                        <>

                          {displayNormal ? (
                            <div key={i}>
                              <Slide index={i}>
                                {firstMiddle![i] && (
                                  <SupplierCard data={firstMiddle![i]} />
                                )}

                                <br />
                                {lastMiddle![i] && (
                                  <SupplierCard data={lastMiddle![i]} />
                                )}
                              </Slide>
                            </div>
                          ) : (
                            <div key={i} className={recommandedStyle.uniqueDivCard}>
                              <SupplierCard data={restaurantsList[i]} />
                            </div>
                          )}
                        </>
                      );
                    }
                    return cart;
                  })()}
                </Slider>
              </Col>
            </Row>
            <Row className={` ${recommandedStyle.recommandedListButtonsContainer} ${!displayNormal ? recommandedStyle.uniqueButtons + "" : " test"}`}>
              <Col >
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
