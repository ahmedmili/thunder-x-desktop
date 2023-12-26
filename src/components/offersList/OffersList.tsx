import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Restaurant } from "../../services/types";
import SupplierCard from "../supplierCard/SupplierCard";
import "./OffersList.scss";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import useMediaQuery from "../../utils/useMediaQuery";
import Slider from "react-slick";

interface Props {
  listType: string;
  restaurants: Restaurant[];
}

const OffersList: React.FC<Props> = ({ restaurants, listType }) => {
  const { t } = useTranslation();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToScroll: 1
  };
  const [restaurantsList, setRestaurantsList] = useState(restaurants);
  const [loaded, setLoading] = useState(false);


  

  useEffect(() => {
    if (listType !== "popular") {
      let list: Restaurant[];
      if (listType === "recommanded") {
        list = restaurants.filter((rest: Restaurant) => {
          return rest.discount_title === null;
        });
      } else {
        list = restaurants.filter((rest: Restaurant) => {
          return rest.discount_title !== null;
        });
      }
      setRestaurantsList(list);
    }    
    setLoading(true);
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
  else if (loaded) {
    return (
      <div className="restaurant-list">       
        <Slider { ...{"slidesToShow": restaurantsList.length<3 ? restaurantsList.length : 3,  "dots": true,
            "infinite": true,
            "speed": 500,
            "slidesToScroll": 1} }>
            {restaurantsList.map(function(slide : any) {
              return (
                <div key={slide.id}>
                  <SupplierCard data={slide} />
                </div>
              );
            })}
          </Slider>
      </div>
    );    
  }  
};

export default OffersList;
