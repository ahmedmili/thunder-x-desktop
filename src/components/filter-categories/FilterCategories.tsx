import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';


import 'pure-react-carousel/dist/react-carousel.es.css';
import { Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setfilterRestaurants } from '../../Redux/slices/restaurantSlice';
import { useAppSelector } from '../../Redux/store';
import { supplierServices } from '../../services/api/suppliers.api';
import { localStorageService } from '../../services/localStorageService';
import './FilterCategories.scss';
import Slider from "react-slick";
import { homeRefresh, setRefresh } from "../../Redux/slices/home";


interface Category {
  id: number;
  name: string;
  order_id: number;
  parent_id: number;
  description: string;
  children: [];
  image?: React.ReactElement;
  selected: boolean;
  position: number;
}
interface FilterCategoriesProps {
  onCategorySelect: () => void;
  ssrCategories?: any;
}

const FilterCategories: React.FC<FilterCategoriesProps> = ({
  onCategorySelect, ssrCategories
}) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  var cats = ssrCategories ? ssrCategories : useAppSelector((state) => state.home.data.categories)
  const navLocation = useLocation();
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState("");
  const [selectedSubCategories, setSelectedSubCategories] = useState("");
  const [loaded, setLoaded] = useState(false);
  const refresh = useSelector(homeRefresh)
   

  useEffect(() => {
    if (cats && cats.length > 0) {
      const all : any = cats.filter((category: any) => category.description !== "Promo")
      setCategories(all)   
    }
  }, [cats])
  
  useEffect(() => {
    if (!loaded && categories.length) {
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.has('category')) {
        const selectted: any = parseInt(searchParams.get('category') as string)
        handleInitialState(selectted)
      }
      setLoaded(true)
    }   
  }, [categories]);
  
  const handleCategoryClick = (categoryId: string) => {
      if (Number(categoryId) == Number(selectedSubCategories)) {
      setSelectedSubCategories("");
      const updatedCategories :any = categories.map((category: any) => ({
        ...category,
        image: category.image,
        selected: (Number(category.id) === Number(selectedCategories) ) ? true : false,
      }));
      setCategories(updatedCategories);
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('category', selectedCategories);
      navigate(`/search/?${searchParams.toString()}`, {      
        replace: false,
      });
    }
    else if (categoryId == selectedCategories) {
      setCategories(cats.filter((category: any) => category.description !== "Promo"))
      const searchParams = new URLSearchParams(location.search);
      searchParams.delete('category');
      navigate(`/search/?${searchParams.toString()}`, {      
        replace: false,
      });
      setSelectedCategories("");
    }
    else {
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.has('category')) {
        searchParams.set('category', categoryId);
      }
      else {
        searchParams.append('category', categoryId);
      }
      navigate(`/search/?${searchParams.toString()}`, {      
        replace: false,
      });
      
      const updatedCategories :any = categories.map((category: any) => ({
        ...category,
        image: category.image,
        selected: (Number(category.id) === Number(categoryId) || category.children.find((c:any)=>Number(c.id) === Number(categoryId))) ? true : false,
      }));
      let subCategories :any = categories.find((cat: any) => Number(cat.id) == Number(categoryId) && cat.children.length > 0)
      if (subCategories) {
        const result :any = [{ ...subCategories, selected: true }, ...subCategories.children]
        setCategories(result);
      }    
      else {
        setCategories(updatedCategories);
      }
      let selected = cats.find((c: any) => (c.children.length > 0 && c.children.find((c: any) => Number(c.id) === Number(categoryId))))
      if (selected) {
        setSelectedCategories(selected.id);    
        setSelectedSubCategories(categoryId);
      }        
      else {
        setSelectedCategories(categoryId);
        setSelectedSubCategories("");
      }  
    }
    dispatch(setRefresh(true));   
  };
  const handleInitialState = (categoryId: any) => {      
      const updatedCategories :any = cats.map((category: any) => ({
        ...category,
        image: category.image,
        selected: (Number(category.id) === Number(categoryId) || category.children.find((c:any)=>Number(c.id) === Number(categoryId))) ? true : false,
      }));
      let subCategories :any = categories.find((cat: any) => Number(cat.id) == Number(categoryId) && cat.children.length > 0)
      if (subCategories) {
        const result :any = [{ ...subCategories, selected: true }, ...subCategories.children]
        setCategories(result);
      }    
      else {       
        let selected = cats.find((c: any) => (c.children.length > 0 && c.children.find((c: any) => Number(c.id) === Number(categoryId))))
        if (selected) {
          const clids = selected.children.map((c: any) =>
          ({
            ...c,
            image: c.image,
            selected: (Number(c.id) === Number(categoryId) ) ? true : false,
          }))
          const result :any = [{ ...selected, selected: true }, ...clids]
          setCategories(result);          
        }
        else {
          setCategories(updatedCategories);
        }
      }
      let selected = cats.find((c: any) => (c.children.length > 0 && c.children.find((c: any) => Number(c.id) === Number(categoryId))))
      if (selected) {
        setSelectedCategories(selected.id);    
        setSelectedSubCategories(categoryId);
      }        
      else {
        setSelectedCategories(categoryId);
        setSelectedSubCategories("");
      }
  }
  useEffect(() => {    
    if (refresh) {
      checkSelectedCategory()
    }    
  }, [refresh]);
   const checkSelectedCategory = ()=>{
    const searchParams = new URLSearchParams(location.search);
    const cat: any = searchParams.get("category");
    if (!searchParams.has("category")) {
      setCategories(cats.filter((category: any) => category.description !== "Promo"))
      const searchParams = new URLSearchParams(location.search);
      searchParams.delete('category');
      navigate(`/search/?${searchParams.toString()}`, {      
        replace: false,
      });
      setSelectedCategories("");
      setSelectedCategories("");
    }
    else if ((Number(selectedCategories)!== Number(cat)) && Number(selectedSubCategories)!== Number(cat)) {
      handleInitialState(cat)
    }
  }
  return (
    <div className='container-categories-filter'>   
      <Slider
          {...{
            "variableWidth": true,
            "dots": false,
            "arrows": false,            
            "infinite": false,
            "slidesToScroll": 1,
            "centerMode": false,
            "centerPadding": "100px",
            "autoplay": false,
            "speed": 500,
            "autoplaySpeed": 2000,
            "cssEase": "linear",
            }}>
            {categories.map(function(category : any) {
              return (
                <div key={category.id}>
                  <Box className={`category-box ${category.selected ? 'selected' : '' } ${category.id == selectedCategories ? 'check' : ''}`}
                        onClick={() => handleCategoryClick(category.id)}
                        >
                          <Box>
                            <img
                              src={
                                typeof category.image === 'string'
                                  ? category.image
                                  : undefined
                              }
                              loading='lazy'
                              alt={category.name}
                            />
                          </Box>
                          <Typography
                            variant="h6"
                            align="center"

                            className={'category-name'}>
                            {category.name}
                          </Typography>
                        </Box>
                </div>
              );
            })}
        </Slider>    
    </div>
  );
};

export default React.memo(FilterCategories);
