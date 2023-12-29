import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Restaurant } from "../../services/types";
import "./PopularList.scss";
import Slider from "react-slick";
import SupplierWhiteCard from "../supplier-white-card/SupplierWhiteCard";
import SupplierMiniCard from "../supplier-mini-card/SupplierMiniCard";

interface Props {
  listType: string;
  restaurants: Restaurant[];
}

const PopularList: React.FC<Props> = ({ restaurants, listType }) => {
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
    else {
      let list: Restaurant[];
      list = restaurants.filter((rest: Restaurant, index: any) => {
        return index < 9;
      });
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
      <div className="restaurant-list"> 
        <div className="row">  
          {restaurantsList.map(function(slide : any) {
                return (
                  <div key={slide.id} className="col-4 restaurant-list__column">
                    <SupplierMiniCard data={slide} />
                  </div>
                );
          })}
        </div>
      </div>
    );    
  }  
};


export default PopularList;
