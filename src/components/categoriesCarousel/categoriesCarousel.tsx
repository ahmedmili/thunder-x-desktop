import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { ButtonBack, ButtonNext, CarouselProvider, Slide, Slider } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setfilterRestaurants } from '../../Redux/slices/restaurantSlice';
import { useAppSelector } from '../../Redux/store';
import { supplierServices } from '../../services/api/suppliers.api';
import { localStorageService } from '../../services/localStorageService';
import './categoriesCarousel.scss';

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
interface CategoryCarouselProps {
  onCategorySelect: (category: string) => void;
  ssrCategories?: any;
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  onCategorySelect, ssrCategories
}) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  var cats = ssrCategories ? ssrCategories : useAppSelector((state) => state.home.data.categories)
  const navLocation = useLocation();
  const { t } = useTranslation();
  const [categories, setCategories] = useState(cats.filter((category: any) => category.description !== "Promo"));

  const [selectedCategories, setSelectedCategories] = useState("");

  const [subCat, setSubCat] = useState(false);

  useEffect(() => {
    if (cats && cats.length > 0) {
        setCategories(cats.filter((category: any) => category.description !== "Promo"))
    }
  }, [cats])

  useEffect(() => {
    onCategorySelect(selectedCategories);

  }, [selectedCategories])

  function findProductIdByName(productName: string) {
    for (const category of categories) {
      if (category.name === productName) {
        return category.id;
      }

      for (const product of category.children) {
        if (product.name === productName) {
          return product.id;
        }
      }
    }
    return null; // Product not found
  }

  const handleCategoryClick = (categoryName: string) => {
    const updatedCategories = categories.map((category: any) => ({
      ...category,
      image: category.image,
      selected: category.name === categoryName ? !category.selected : false,
    }));

    const subCategories = categories.filter((cat: any) => {
      if (cat.children) {
        return cat.name == categoryName && cat.children.length > 0
      }
    })
    if (categoryName == selectedCategories) {
      setCategories(cats.filter((category: any) => category.description !== "Promo"));
      setSelectedCategories("");
      setSubCat(false)
    } else {
      if (subCategories.length > 0) {
        if (subCat == false) {
          setSelectedCategories(categoryName);
          const newCategories = [subCategories[0], ...subCategories[0]["children"]]
          setSubCat(true)
          setCategories(newCategories);
        } else if (subCat == true) {
          setSelectedCategories("");
          setCategories(updatedCategories);
          setSubCat(false)
        }
      } else {

        const location = JSON.parse(localStorageService.getCurrentLocation()!).coords
        const cat_id = findProductIdByName(categoryName)
        const requestData = {
          category_id: cat_id,
          lat: location!.latitude,
          long: location!.longitude
        }
        supplierServices.searchSupplierBySubArticle(requestData).then((res: any) => {
          dispatch(setfilterRestaurants(res.data.data.suppliers))
          !navLocation.pathname.includes("/search/") && navigate(`/search/category=` + categoryName);
          navLocation.pathname.includes("/search/") && navigate(`/search/category=` + categoryName, { replace: true });

        })
      }
    }
  };

  useEffect(() => {
    handleCategoryClick("")
  }, [])

  // Helper function to calculate the number of visible slides based on screen width
  const calculateVisibleSlides = () => {
    if (typeof window != 'undefined') {
      const width = window.innerWidth;
      let items = 2;
      switch (true) {
        case width >= 1200:
          items = 4;
          break;
        case width >= 768 && width < 1200:
          items = 3;
          break;
        case width < 768:
          items = 2;
          break;
        default:
          items = 1;
          break;
      }
      return items;
    } else {
      return 3
    }
  };

  return (
    <Container  >
      <Row>
        <p className='carousal-cat-title'>{t('home.categorie')} {selectedCategories}</p>
      </Row>
      <Row>
        <Col >
          <div className='carousal-provider' >

            <CarouselProvider
              naturalSlideWidth={250}
              naturalSlideHeight={200}
              totalSlides={categories.length}
              visibleSlides={calculateVisibleSlides()}
              // visibleSlides={3}
              step={1}
              infinite={true}
              className='categorie-carousel'
            >
              <Row>
                <Col >
                  <Slider>
                    {categories.map((category: any) => (

                      <Slide className='carousel-slide' key={category.id} index={category.id - 1}>
                        <Box
                          className={`category-box ${category.selected ? 'selected' : ''}`}
                          onClick={() => handleCategoryClick(category.name)}
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
                      </Slide>
                    ))}

                  </Slider>
                </Col>
              </Row>
              <div className='categories-list-buttons-container'>
                <ButtonBack className='btn'>
                  <ArrowBackIosIcon className=' slider-button-icon' />
                </ButtonBack>
                <ButtonNext className='btn btn-default'>
                  <ArrowForwardIosIcon className=' slider-button-icon' />
                </ButtonNext>
              </div>
            </CarouselProvider>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default React.memo(CategoryCarousel);
