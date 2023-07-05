import React, { useState } from 'react';
import { Restaurant } from '../services/types';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import { DiscountRounded, Star } from '@mui/icons-material';
import missingImage from '../assets/missingImage.png';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface Props {
  restaurants: Restaurant[];
}

const RestaurantList: React.FC<Props> = ({ restaurants }) => {
  const { t } = useTranslation();
  const [displayCount, setDisplayCount] = useState(9);
  const increment = 9;

  const currentDateTime = new Date();

  const isOpen = (restaurant: Restaurant) => {
    const currentTime = currentDateTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    if (restaurant.forced_status === 'AUTO') {
      return (
        currentTime >= restaurant.starttime &&
        currentTime <= restaurant.closetime
      );
    } else {
      if (restaurant.forced_status_at !== null) {
        const forcedStatusTime = new Date(
          restaurant.forced_status_at
        ).getTime();
        const forcedStatusEndTime =
          forcedStatusTime + restaurant.forced_status_hours * 60 * 60 * 1000;
        if (restaurant.forced_status === 'OPEN') {
          return currentTime >= JSON.stringify(forcedStatusEndTime);
        } else if (restaurant.forced_status === 'CLOSE') {
          return currentTime < JSON.stringify(forcedStatusEndTime);
        }
      }
    }
  };

  const getImageUrl = (restaurant: Restaurant) => {
    const image1 = restaurant.images.length > 0 ? restaurant.images[0] : null;
    const image2 = restaurant.images.length > 1 ? restaurant.images[1] : null;
    return image1 ? `${image1.path}` : image2 ? `${image2.path}` : '';
  };

  const MAX_NAME_LENGTH = 25;

  const getTruncatedName = (name: string) => {
    return name.length > MAX_NAME_LENGTH
      ? `${name.slice(0, MAX_NAME_LENGTH)}...`
      : name;
  };

  if (restaurants.length === 0) {
    return (
      <div style={{ height: '350px', backgroundColor: '#fffff1' }}>
        <h2>{t('recommendedForYou')}</h2>
        <Typography variant='h5' component='h2' align='center'>
          {t('noSuggestions')}
        </Typography>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#fffff6',
        justifyContent: 'center',
      }}>
      <h2>{t('recommendedForYou')}</h2>
      <Grid container spacing={2}>
        {restaurants.slice(0, displayCount).map((restaurant) => (
          <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
            <Link
              to={{
                pathname: `/supplier-store/${restaurant.id}`,
              }}
              state={{ restaurant: restaurant }}
              style={{ textDecoration: 'none' }}>
              <Card
                elevation={1}
                style={{
                  height: '100%',
                  maxHeight: '300px',
                  boxShadow: '1px 2px 4px 2px rgba(0,0,0,0.15)',
                }}>
                <Box position='relative' sx={{ height: '60%' }}>
                  <CardMedia
                    component='img'
                    src={getImageUrl(restaurant)}
                    style={{ objectFit: 'cover', height: '100%' }}
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = missingImage;
                    }}
                    loading='lazy'
                  />
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='flex-start'
                    bgcolor='rgba(237, 199, 47, 0.8)'
                    p='0.2rem 0.4rem'
                    borderRadius='0 0 1rem 0'
                    position='absolute'
                    top='0'
                    left='0'
                    zIndex={1}>
                    {restaurant.medium_time ? (
                      <Typography variant='subtitle2'>
                        {`${restaurant.medium_time - 10}mins - ${
                          restaurant.medium_time + 10
                        }mins`}
                      </Typography>
                    ) : (
                      <Typography variant='subtitle2'></Typography>
                    )}
                  </Box>

                  {restaurant.discount_title !== 'PROMO' ? (
                    <Box
                      display='flex'
                      alignItems='center'
                      justifyContent='flex-start'
                      bgcolor='rgba(200, 0, 0, 0.8)'
                      p='0.2rem 0.4rem'
                      borderRadius='0 1rem 1rem 0'
                      position='absolute'
                      top='70%'
                      left='0'
                      zIndex={1}>
                      <Typography variant='subtitle2' color={'white'}>
                        <DiscountRounded
                          sx={{ height: '1rem', marginBottom: '-0.2rem' }}
                        />{' '}
                        {`${restaurant.discount_title}`}
                      </Typography>
                    </Box>
                  ) : (
                    <></>
                  )}

                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='flex-end'
                    bgcolor='rgba(255, 255, 255, 0.8)'
                    p='0.2rem 0.4rem'
                    borderRadius='0 0 0 1rem'
                    position='absolute'
                    top='0'
                    right='0'
                    zIndex={1}>
                    <Star sx={{ mr: '0.3rem', color: '#FFD700' }} />
                    <Typography>
                      {restaurant.star ? restaurant.star : t('noRating')}
                    </Typography>
                  </Box>
                </Box>
                <CardContent>
                  <Typography
                    variant='h5'
                    component='h2'
                    noWrap
                    style={{ fontWeight: 'bold' }}>
                    {getTruncatedName(restaurant.name)}
                  </Typography>
                  <Typography variant='body1' gutterBottom>
                    {`${t('deliveryPrice')} ${Math.round(
                      JSON.parse(restaurant.delivery_price)
                    )} DT`}
                  </Typography>
                  <Box
                    bgcolor={
                      isOpen(restaurant)
                        ? 'rgba(0, 200, 0, 0.5)'
                        : 'rgba(255, 0, 0, 0.5)'
                    }
                    p='0.2rem 0.4rem'
                    borderRadius='1rem'
                    display='inline-block'>
                    <Typography variant='body2' color='white'>
                      {isOpen(restaurant) ? t('open') : t('closed')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
      {displayCount < restaurants.length && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1.5rem',
          }}>
          <button
            onClick={() => setDisplayCount(displayCount + increment)}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              backgroundColor: '#2db2b1',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              cursor: 'pointer',
            }}>
            See More
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
