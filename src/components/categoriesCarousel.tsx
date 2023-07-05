import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import { array, string } from 'zod';
import 'pure-react-carousel/dist/react-carousel.es.css';
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
    }));

    setCategories(updatedCategories);
    onCategorySelect(categoryName);
  };

  return (
    <CarouselProvider
      naturalSlideWidth={200}
      naturalSlideHeight={150}
      totalSlides={categories.length}
      visibleSlides={4}
      step={1}
      infinite={false}>
      <Slider style={{ marginRight: '10rem', marginLeft: '10rem' }}>
        {categories.map((category, index) => (
          <Slide key={category.id} index={category.id - 1}>
            <Box
              className='category-box'
              onClick={() => handleCategoryClick(category.name)}
              sx={{
                cursor: 'pointer',
                textAlign: 'center',
                backgroundColor: category.selected ? '#2db2b1' : '#f5f5f5',
                padding: '15px',
                borderRadius: '15px',
                margin: '2rem',
                boxShadow: '1px 2px 4px 2px rgba(0,0,0,0.09)',
              }}>
              <Box sx={{ color: '#080808' }}>
                <img
                  src={
                    typeof category.image === 'string'
                      ? category.image
                      : undefined
                  }
                  style={{ width: '50px', height: '50px' }}
                  loading='lazy'
                  alt={category.name}
                />
              </Box>
              <Typography
                variant='h6'
                align='center'
                sx={{
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: '400',
                  fontSize: '14px',
                  lineHeight: '21px',
                  color: category.selected ? '#ffffff' : '#080808',
                }}>
                {category.name}
              </Typography>
            </Box>
          </Slide>
        ))}
      </Slider>
    </CarouselProvider>
  );
};

export default React.memo(CategoryCarousel);
