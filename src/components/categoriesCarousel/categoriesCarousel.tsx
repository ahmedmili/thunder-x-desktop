import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import { array, string } from 'zod';
import 'pure-react-carousel/dist/react-carousel.es.css';
import './categoriesCarousel.scss';
import { Container, Row, Col } from 'react-bootstrap';



interface Category {
  id: number;
  name: string;
  order_id: number;
  parent_id: number;
  description: string;
  children: typeof array;
  image?: React.ReactElement;
  selected: boolean;
}

interface CategoryCarouselProps {
  onCategorySelect: (category: string) => void;
  categories: Category[];
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({

  onCategorySelect,
  categories: initialCategories,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [categories, setCategories] = useState(initialCategories);

  const handleCategoryClick = (categoryName: string) => {
    const updatedCategories = categories.map((category, index) => ({
      ...category,
      image: category.image,
      selected: category.name === categoryName ? !category.selected : false,
    }));

    setCategories(updatedCategories);
    onCategorySelect(categoryName);
  };

  const handlePrevious = () => {
    setCurrentSlide((prevSlide) => prevSlide - 1);
  };

  const handleNext = () => {
    setCurrentSlide((prevSlide) => prevSlide + 1);
  };


  // Helper function to calculate the number of visible slides based on screen width
  const calculateVisibleSlides = () => {
    return window.innerWidth >= 700 ? 3 : 2;
  };

  return (
    <Container className='container' >
      <Row>
        <p className='carousal-cat-title'>Qu’est ce qu’on vous apporte ?</p>
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
                    {categories.map((category, index) => (


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

              <Row>
                <Col>
                  <div className='categories-list-buttons-container'>
                    <ButtonBack className='btn'>
                      <KeyboardDoubleArrowLeftIcon className=' slider-button-icon' />
                    </ButtonBack>
                    <ButtonNext className='btn btn-default'>
                      <KeyboardDoubleArrowRightIcon className=' slider-button-icon' />
                    </ButtonNext>

                  </div>
                </Col>

              </Row>

            </CarouselProvider>


          </div>

        </Col>
      </Row>

    </Container>



  );
};

export default React.memo(CategoryCarousel);
