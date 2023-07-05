import { Box, CircularProgress, Container } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../Redux/store';
import Map from '../components/Location';
import Switches from '../components/toggleSwitch';
import { useCallback, useEffect, useMemo, useState } from 'react';
import PinDropIcon from '@mui/icons-material/PinDrop';
import SearchBar from '../components/searchBar';
import CategoryCarousel from '../components/categoriesCarousel';
import {
  selectHomeData,
  selectIsDelivery,
} from '../Redux/slices/homeDataSlice';
import React from 'react';
import { Restaurant } from '../services/types';
import { CarouselProvider, Slide, Slider } from 'pure-react-carousel';
import RestaurantList from '../components/recommendedRestaurants';
import { useTranslation } from 'react-i18next';
import FAQList from '../components/faq';
import 'laravel-echo/dist/echo';
import eventEmitter from '../services/thunderEventsService';

const googleMapKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const HomePage = () => {
  const { t } = useTranslation();
  const location = useAppSelector((state) => state.location.position);
  const homeData = useAppSelector(selectHomeData);
  const isLoading = useAppSelector((state) => state.homeData.loading);
  const isDelivery = useAppSelector(selectIsDelivery);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showMap, setShowMap] = useState(false);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );

  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      // User clicked on the same category again, so show the restaurants that correspond to the state of isDelivery
      setSelectedCategory('');
      const filteredRestaurants = homeData?.recommended.filter(
        (restaurant: Restaurant) => {
          const hasDelivery = isDelivery && restaurant.delivery === 1;
          const hasTakeAway = !isDelivery && restaurant.take_away === 1;
          return hasDelivery || hasTakeAway;
        }
      );
      setFilteredRestaurants(filteredRestaurants ? filteredRestaurants : []);
    } else {
      setSelectedCategory(category);
      const filteredRestaurants = homeData?.recommended.filter(
        (restaurant: Restaurant) => {
          const isInCategory =
            restaurant.parents_cat
              .map((cat: any) => cat.name.toLowerCase())
              .includes(category.toLowerCase()) || category === '';
          const hasDelivery = isDelivery && restaurant.delivery === 1;
          const hasTakeAway = !isDelivery && restaurant.take_away === 1;
          return isInCategory && (hasDelivery || hasTakeAway);
        }
      );
      setFilteredRestaurants(filteredRestaurants ? filteredRestaurants : []);
    }
  };

  useEffect(() => {
    handleCategorySelect('');
  }, [homeData?.recommended, isDelivery]);

  useEffect(() => {
    if (showMap) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showMap]);

  return (
    <Container maxWidth='lg'>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          py: 1,
          px: 1,
          bgcolor: '#f0f0f0',
          borderRadius: '0 0 1rem 1rem',
        }}>
        <Box
          sx={{
            height: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#0f0f0f',
          }}
          onClick={() => setShowMap(true)}>
          <PinDropIcon /> <div>&nbsp;&nbsp;</div>
          <h3>
            {location
              ? `${location?.coords.label} ! ${t('clickToChange')}`
              : t('no_location_detected')}
          </h3>
        </Box>
      </Box>

      {showMap && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
          onClick={() => setShowMap(false)}>
          <div
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.5rem',
              margin: '5rem',
              boxShadow: '1px 2px 4px 2px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}>
            <Map apiKey={googleMapKey} />
          </div>
        </div>
      )}
      <Switches />
      <div>
        <SearchBar placeholder={t('search_placeholder')} />
      </div>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <div style={{ padding: '4px' }}>
            <CategoryCarousel
              onCategorySelect={handleCategorySelect}
              categories={homeData?.categories}
            />
          </div>
          <div style={{ padding: '4px' }}>
            <RestaurantList restaurants={filteredRestaurants} />
          </div>
        </>
      )}
      {!isLoading && homeData && homeData.ads && (
        <div style={{ maxWidth: '1000px', margin: '5rem' }}>
          <CarouselProvider
            naturalSlideWidth={850}
            naturalSlideHeight={300}
            totalSlides={
              homeData?.ads.HOME_1.length +
              homeData?.ads.HOME_2.length +
              homeData?.ads.HOME_3.length
            }
            visibleSlides={1}
            step={1}
            infinite={true}
            isPlaying={true}
            lockOnWindowScroll={true}>
            <Slider>
              {homeData.ads.HOME_1.map((ad: any) => (
                <Slide key={ad.id} index={ad.id - 1}>
                  <img
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                    }}
                    src={ad.image}
                    alt={`Ad ${ad.id}`}
                    loading='lazy'
                  />
                </Slide>
              ))}
              {homeData.ads.HOME_2.map((ad: any) => (
                <Slide key={ad.id} index={ad.id - 1}>
                  <img
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                    }}
                    src={ad.image}
                    alt={`Ad ${ad.id}`}
                  />
                </Slide>
              ))}
              {homeData.ads.HOME_3.map((ad: any) => (
                <Slide key={ad.id} index={ad.id - 1}>
                  <img
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                    }}
                    src={ad.image}
                    alt={`Ad ${ad.id}`}
                  />
                </Slide>
              ))}
            </Slider>
          </CarouselProvider>
        </div>
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <FAQList />
      </div>
    </Container>
  );
};

export default React.memo(HomePage);
