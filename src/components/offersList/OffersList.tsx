import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Restaurant } from "../../services/types";
import "./OffersList.scss";
import Slider from "react-slick";
import SupplierWhiteCard from "../supplier-white-card/SupplierWhiteCard";

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
      ""
    );
  }

  if (restaurants.length === 0 && listType == "discount") {
    return <div></div>;
  }
  else if (loaded) {
    return (
      <div className="offers-list">       
        <Slider
          {...{
            "slidesToShow": restaurantsList.length < 3 ? restaurantsList.length : 3,
            "dots": false,
            "infinite": true,
            "slidesToScroll": 1,
            "centerMode": true,
            "centerPadding": "40px",
            "autoplay": true,
            "speed": 500,
            "autoplaySpeed": 2000,
            "cssEase": "linear",
            "nextArrow": <NextArrow />,
            "prevArrow": <PrevArrow />,
            "responsive": [
              {
                breakpoint: 1343,
                settings: {
                  slidesToShow: restaurantsList.length < 2 ? restaurantsList.length : 2,
                }
              },]     
            }}>
            {restaurantsList.map(function(slide : any) {
              return (
                <div key={slide.id}>
                  <SupplierWhiteCard data={slide} />
                </div>
              );
            })}
        </Slider>
      </div>
    );    
  }  
};
function PrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className + " prev-offers-arrow"}
      style={{ ...style }}
      onClick={onClick}
    />
  );
}
function NextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className + " next-arrow"}
      style={{ ...style}}
      onClick={onClick}
    />
  );
}

export default OffersList;
