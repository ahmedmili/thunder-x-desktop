import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
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
  const [categories, setCategories] = useState(initialCategories);

  const handleCategoryClick = (categoryName: string) => {
    const updatedCategories = categories.map((category, index) => ({
      ...category,
      image: category.image,
      selected: category.name === categoryName ? !category.selected : false,
    })
    );

    setCategories(updatedCategories);
    onCategorySelect(categoryName);
  };
  return categories != null ?
    (
    <CarouselProvider
      naturalSlideWidth={200}
      naturalSlideHeight={150}
      totalSlides={categories.length}
      visibleSlides={4}
      step={1}
      infinite={false}>
      <Slider className="carousel-slider">
        {

          categories.map((category, index) => (
            <Slide key={category.id} index={category.id - 1}>
              <Box
                className={`category-box ${category.selected ? 'selected' : ''}`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <Box className="category-image">
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
                  className={category.selected ? 'category selected' : 'category'}
                >
                  {category.name}
                </Typography>
              </Box>
            </Slide>
          ))
          }
      </Slider>
    </CarouselProvider>
  ) : ( <div></div>)
        
}

export default React.memo(CategoryCarousel);
