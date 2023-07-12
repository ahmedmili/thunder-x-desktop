import { Box, CircularProgress, Container } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import Map from '../../components/Location/Location';
import Switches from '../../components/toggleSwitch/toggleSwitch';
import { useCallback, useEffect, useMemo, useState } from 'react';
import PinDropIcon from '@mui/icons-material/PinDrop';
import SearchBar from '../../components/searchBar/searchBar';
import CategoryCarousel from '../../components/categoriesCarousel/categoriesCarousel';
import {
  selectHomeData,
  selectIsDelivery,
} from '../../Redux/slices/homeDataSlice';
import React from 'react';
import { Restaurant } from '../../services/types';
import { CarouselProvider, Slide, Slider } from 'pure-react-carousel';
import RestaurantList from '../../components/recommendedRestaurants/recommendedRestaurants';
import { useTranslation } from 'react-i18next';
import FAQList from '../../components/faq/faq';
import 'laravel-echo/dist/echo';
import eventEmitter from '../../services/thunderEventsService';

import './home.page.css'
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
    <Container maxWidth='lg' className="containerr">
      <Box className="box">
        <Box
          className="box-inner"
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
          className="map-overlay"
          onClick={() => setShowMap(false)}>
          <div
            onClick={(e) => e.stopPropagation()}>
            <Map apiKey={googleMapKey} />
          </div>
        </div>
      )}
      <Switches />
      <div>
        <SearchBar placeholder={t('search_placeholder')} />
      </div>
      {
        isLoading ? (
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
