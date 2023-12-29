import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Restaurant } from "../../services/types";
import "./RecommandedList.scss";
import Slider from "react-slick";
import SupplierWhiteCard from "../supplier-white-card/SupplierWhiteCard";

interface Props {
  listType: string;
  restaurants: Restaurant[];
}

const RecommandedList: React.FC<Props> = ({ restaurants, listType }) => {
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
      <div className="recommanded-list">       
        <Slider
          {...{
            "slidesToShow": restaurantsList.length < 4 ? restaurantsList.length : 4,
            "dots": false,
            "infinite": true,
            "speed": 500,
            "slidesToScroll": 1,
            "rows": 2,
            "nextArrow": <NextArrow />,
            "prevArrow": <PrevArrow />}}>
            {restaurantsList.map(function(slide : any) {
              return (
                <div key={slide.id}>
                  <SupplierWhiteCard data={slide} className="mb-32"/>
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
      className={className + " prev-recommanded-arrow"}
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

export default RecommandedList;
