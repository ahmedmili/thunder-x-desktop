import React, { useEffect, useState } from 'react';
import { Restaurant } from '../../services/types';
import {
  Typography,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import './recommendedRestaurants.scss'
import SupplierCard from '../supplierCard/SupplierCard';
import { ButtonBack, ButtonNext, CarouselProvider, Slide, Slider } from 'pure-react-carousel';
import { Container, Row, Col } from 'react-bootstrap';


import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

interface Props {
  listType: string
  restaurants: Restaurant[];
}

const RestaurantList: React.FC<Props> = ({ restaurants, listType }) => {
  const { t } = useTranslation();

  const [restaurantsList, setRestaurantsList] = useState(restaurants)

  useEffect(
    () => {
      setRestaurantsList(restaurants)
    }, [restaurants]
  )

  if (restaurants.length === 0 && listType == "recommanded") {
    return (
      <div style={{ height: '350px', backgroundColor: '#fffff1' }}>
        <h2>{t('recommendedForYou')}</h2>
        <Typography variant='h5' component='h2' align='center'>
          {t('noSuggestions')}
        </Typography>
      </div>
    );
  }

  if (restaurants.length === 0 && listType == "discount") {
    return (
      <div>
      </div>
    );
  }
  const displayNormal = restaurantsList.length >= 6;
  var middleIndex;
  var firstMiddle;
  var lastMiddle;
  if (displayNormal) {
    middleIndex = Math.ceil(restaurantsList.length / 2);
    firstMiddle = restaurantsList.slice(0, middleIndex);
    lastMiddle = restaurantsList.slice(middleIndex);
  }

  return (
    <div className='recommanded-container' >

      {
        <Container  >
          <Row>
            {listType == "recommanded" && <h2 className='recaommanded-title'>  {t('recommendedForYou')}</h2>}
            {
              listType == "discount" && (
                <Box className="discount-title-container">
                  <h2>Jusqu'à 25 % de réduction - Offres de repas</h2>
                  <p>Besoin d'une pause de cuisine ou simplement envie de votre <br />restaurant préféré ?</p>
                </Box>

              )
            }
          </Row>

          <div className={`supplier-list-background ${displayNormal ? "unique" : "bouble"}`}></div>
          <CarouselProvider
            naturalSlideWidth={150}
            naturalSlideHeight={displayNormal ? 310 : 200}
            totalSlides={displayNormal ? restaurantsList.length / 2 : restaurantsList.length}
            visibleSlides={3}
            step={3}
            infinite={true}
            className='carousel-provider'
          >

            <Row>
              <Col className='col-12 col-lg-12 align-items-center '>
                <Slider >
                  {(() => {
                    const cart = [];
                    for (let i = 0; i < (displayNormal ? restaurantsList.length / 2 : restaurantsList.length); i++) {
                      cart.push(
                        <div key={i}>
                          {
                            displayNormal ? (
                              <Slide index={i}>
                                {
                                  firstMiddle![i] && <SupplierCard className='col-12 col-md-6 col-lg-12' data={firstMiddle![i]} />
                                }

                                <br />
                                {
                                  lastMiddle![i] && <SupplierCard className='col-12 col-md-6 col-lg-12' data={lastMiddle![i]} />
                                }

                              </Slide>
                            ) :
                              (
                                <SupplierCard className='col-12 col-md-6 col-lg-12' data={restaurantsList[i]} />
                              )
                          }

                        </div>
                      );
                    }
                    return cart;
                  })()}
                </Slider>
              </Col>
            </Row>
            <Row className='recommanded-list-buttons-container' >
              <Col >
                <ButtonBack className='btn'>
                  <KeyboardDoubleArrowLeftIcon className=' slider-button-icon' />
                </ButtonBack>
              </Col>

              <Col className='right-btn'>
                <ButtonNext className='btn'>
                  <KeyboardDoubleArrowRightIcon className=' slider-button-icon' />
                </ButtonNext>
              </Col>
            </Row>
          </CarouselProvider>
        </Container>

      }
    </div>
  );
};

export default RestaurantList;
