import { Box } from '@mui/material';
import React, { useEffect } from 'react';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { ButtonBack, ButtonNext, CarouselProvider, Slide, Slider } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Restaurant } from '../../services/types';
import './productCarousel.scss';

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
interface ProductCarouselProps {
  // ssrCategories?: any;
  suppliers: Restaurant[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  suppliers
}) => {

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCategoryClick = (rest: Restaurant) => {

    const goTo = `/restaurant/${rest.id}-${rest.name.split(' ').join('-')}/All/`
    navigate(goTo)
  };

  // Helper function to calculate the number of visible slides based on screen width
  const calculateVisibleSlides = () => {
    if (typeof window != 'undefined') {
      const width = window.innerWidth;
      let items = 2;
      switch (true) {
        case width >= 1440:
          items = 7;
          break;
        case width >= 768 && width < 1440:
          items = 6;
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
    <div className="product-slider">
      <div className="carousal-provider">
        <CarouselProvider
          naturalSlideWidth={250}
          naturalSlideHeight={250}
          totalSlides={suppliers.length}
          visibleSlides={calculateVisibleSlides()}
          // visibleSlides={3}
          isPlaying
          step={1}
          interval={1000 * 3}
          infinite={true}
          className='categorie-carousel'
        >
          <Row>
            <Col >
              <Slider>
                {suppliers.map((supp: any) => (

                  <Slide className='carousel-slide' key={supp.id} index={supp.id - 1}>
                    <Box
                      className={`category-box ${supp.selected ? 'selected' : ''}`}
                      onDoubleClick={() => handleCategoryClick(supp)}
                    >
                      <Box>
                        <img
                          src={
                            typeof supp.images[0].path === 'string'
                              ? supp.images[0].pivot.type === "principal" ? supp.images[0].path : supp.images[1].path
                              : undefined
                          }
                          loading='lazy'
                          alt={supp.name}
                        />
                      </Box>
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
    </div>
  );
};

export default React.memo(ProductCarousel);
