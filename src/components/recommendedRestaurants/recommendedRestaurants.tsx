import React, { useState } from 'react';
import { Restaurant } from '../../services/types';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import { DiscountRounded, Star } from '@mui/icons-material';
import missingImage from '../../assets/missingImage.png';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import { toast } from 'react-toastify';
import './recommendedRestaurants.css'

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
      className='containerr'
    >
      <h2>{t('recommendedForYou')}</h2>
      <Grid container spacing={2}>
        {restaurants.slice(0, displayCount).map((restaurant) => (
          <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
            <Link
              className="restaurant-link"
              to={{
                pathname: `/supplier-store/${restaurant.id}`,
              }}
              state={{ restaurant: restaurant }}
              >
              <Card className='card' elevation={1} >
                <Box position='relative' className="image-container">
                  <CardMedia
                      className="restaurant-image"
                    component='img'
                    src={getImageUrl(restaurant)}
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = missingImage;
                    }}
                    loading='lazy'
                  />
                  <Box
                    className='restaurant-time'>
                    {restaurant.medium_time ? (
                      <Typography variant='subtitle2'>
                        {`${restaurant.medium_time - 10}mins - ${restaurant.medium_time + 10
                          }mins`}
                      </Typography>
                    ) : (
                      <Typography variant='subtitle2'></Typography>
                    )}
                  </Box>

                  {restaurant.discount_title !== 'PROMO' ? (
                    <Box className="discount-box">
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

                  <Box className="rating-box">
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
                  <Box className={`status-box ${isOpen(restaurant) ? 'open' : 'closed'}`}>
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
        className="see-more">
          <button
            onClick={() => setDisplayCount(displayCount + increment)}
            className="see-more-button" >
            See More
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
