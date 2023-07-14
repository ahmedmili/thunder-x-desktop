import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import { array, string } from 'zod';
import 'pure-react-carousel/dist/react-carousel.es.css';
import './categoriesCarousel.css';



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



  return (
    <div className='carousal-provider' >


      <CarouselProvider
        naturalSlideWidth={200}
        naturalSlideHeight={150}
        totalSlides={categories.length}
        visibleSlides={4}
        step={1}
        infinite={true}>
        <Slider className="carousel-slider">
          {categories.map((category, index) => (
            <>
            
            <Slide key={category.id} index={category.id - 1}>
              <Box
                className={`category-box ${category.selected ? 'selected' : ''}`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <Box
                  className="category-image"
                >
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
                  className={'category'}
                >
                  {category.name}
                </Typography>
              </Box>
            </Slide>
            </>
            
          ))}

        </Slider>
                      {/* <KeyboardDoubleArrowLeftIcon/> */}

                      <button
          className="prev-button"
          disabled={currentSlide === 0}
          onClick={handlePrevious}
        >
<KeyboardDoubleArrowLeftIcon/>        </button>

        <button
          className="next-button"
          disabled={currentSlide === 2}
          onClick={handleNext}
        >
        <KeyboardDoubleArrowRightIcon/>
        </button>
      </CarouselProvider>

    </div>
  );
};

export default React.memo(CategoryCarousel);
