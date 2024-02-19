import {
  BuildRounded,
  DriveEtaRounded,
  EmojiEvents,
  HomeRounded,
  Phone,
  ShoppingCartRounded,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CircularProgress,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  setCommands,
  setSelectedCommand,
  setSelectedLocation,
} from '../../Redux/slices/commandsSlice';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import livreur from '../../assets/livreur-img-1.png';
import MapComponent from '../../components/mapComponent/mapComponent';
import eventEmitter from '../../services/thunderEventsService';
import './track.css';

const ApiEndpoint = import.meta.env.VITE_SERVER_ENDPOINT;
const API_URL = `${ApiEndpoint}/mycommands`;

const OrderTrackingPage: React.FC = () => {
  const userToken = localStorage.getItem('token');
  const commands = useAppSelector((state) => state.commands.commands);
  const dispatch = useAppDispatch();
  const selectedCommand = useAppSelector(
    (state) => state.commands.selectedCommand
  );
  const selectedLocation = useAppSelector(
    (state) => state.commands.selectedLocation
  );
  const { t } = useTranslation();
  const handleCommandUpdated = useCallback(async () => {
    await getCommands(userToken);
  }, [userToken]);

  useEffect(() => {
    eventEmitter.on('commandUpdated', handleCommandUpdated);

    return () => {
      eventEmitter.off('commandUpdated', handleCommandUpdated);
    };
  }, [handleCommandUpdated]);

  useEffect(() => {
    dispatch(setSelectedLocation(selectedCommand?.supplier.localisation));
  }, [selectedCommand]);

  useEffect(() => {
    if (commands.length > 0) {
      dispatch(setSelectedCommand(commands[0]));
    }
  }, [commands]);

  const getCommands = async (token: string | null) => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        dispatch(setCommands(response.data.data));
      }
    } catch (error: any) {
      console.error('Error fetching commands:', error.message);
    }
  };

  const handleCommandClick = (command: any) => {
    dispatch(setSelectedCommand(command));
  };
  const getProgressDescription = (cycle: string) => {
    switch (cycle) {
      case 'PENDING':
        return 'Waiting for driver';
      case 'VERIFY':
        return 'Verified by supplier';
      case 'AUTHORIZED':
        return 'About to be assigned';
      case 'PRE_ASSIGN_ADMIN':
        return 'About to be assigned';
      case 'ASSIGNED':
        return 'Driver on the way to supplier';
      case 'INPROGRESS':
        return 'Command is on its way';
      default:
        return '';
    }
  };

  useEffect(() => {
    getCommands(userToken);
  }, []);
  return (
    <Container maxWidth='lg'
      className='containerr'
    >
      {commands && commands.length > 0 ? (
        <Box
          className='container-box'
        >
          <Box
            className='list-box'
          >
            <List>
              {commands &&
                commands.map((command: any) => (
                  <ListItem
                    className={`list-item ${selectedCommand === command ? 'selected' : ''}`}
                    key={command.id}
                    button
                    selected={selectedCommand === command.id}
                    onClick={() => handleCommandClick(command)}>
                    <ListItemText
                      primary={command.supplier.name}
                      secondary={`${t('orderTrackingPage.price')} ${Math.round(
                        command.total_price
                      )}DT`}
                    />
                  </ListItem>
                ))}
            </List>
          </Box>
          <Box
            className='card-box'
          >
            {commands ? (
              <Card
                className='cardd'
              >
                <Box className='card-header'>
                  <Box className='header-left'>
                    <img
                      loading="lazy"
                      src={livreur}
                      alt='Delivery Person'
                      className='header-image'
                    />
                    <Box className='header-info'>
                      <Typography
                        variant='h6'
                        component='span'
                        className='header-title'
                      >
                        {t('orderTrackingPage.status')}
                      </Typography>
                      <Typography
                        variant='h4'
                        component='span'
                        className='header-status'
                      >
                        {getProgressDescription(selectedCommand?.cycle)}
                        <span className='dot-one'> .</span>
                        <span className='dot-two'> .</span>
                        <span className='dot-three'> .</span>
                      </Typography>
                    </Box>
                  </Box>

                  <Box className='header-right'>
                    <Box className='driver-info'>
                      {selectedCommand && selectedCommand.delivery && (
                        <div className='driver-name'>
                          <Typography
                            variant='body1'
                            component='span'
                            className='driver-label'>
                            {t('orderTrackingPage.deliveryDriver')}
                          </Typography>
                          <Typography
                            variant='h6'
                            component='span'
                            className='driver-value'>
                            {selectedCommand.delivery.name}
                          </Typography>
                        </div>
                      )}
                    </Box>
                    <Box className='caller-info'>
                      <div className='caller'>
                        <div className='text'>
                          {t('orderTrackingPage.callUs')}
                        </div>
                        <div className='icon'>
                          <Phone className='phone-icon' />
                        </div>
                        <div className='number'>99 888 777</div>
                      </div>
                    </Box>
                  </Box>
                </Box>
                <Box className='card-content'>
                  <Typography
                    variant='body1'
                    component='span'
                    className='content-title'
                  >
                    {t('orderTrackingPage.commandContent')}
                  </Typography>{' '}
                  <Grid container spacing={2}>
                    {selectedCommand &&
                      selectedCommand?.products.map((product: any) => (
                        <Card
                          key={product.id}
                          className='product-card'>
                          <Typography variant='body2' fontSize={14} noWrap>
                            {product.quantity} {product.name}
                          </Typography>
                          <Typography variant='body2' fontSize={12} noWrap>
                            {Math.round(product.price)} Dinars
                          </Typography>
                        </Card>
                      ))}
                  </Grid>
                </Box>
                <div>
                  {selectedCommand.cycle}
                </div>
                <Box className='card-footer'>
                  <Box
                    className='custom-box-inner'
                  >

                    {selectedCommand.cycle ? (

                      <Box className='custom-box-inner-selected'>

                        {/* PENDING  waitingForDriver*/}
                        <Box className='custom-box-inner-selected-cart'>
                          <Box className={`custom-box-inner-selected-cart-box ${selectedCommand.cycle ? '' : 'pending'}`}>
                            <ShoppingCartRounded className={`custom-box-inner-selected-cart-icon ${selectedCommand.cycle ? 'selected' : ''}`} />
                          </Box>
                          <Typography noWrap className={`custom-box-inner-selected-cart-text ${selectedCommand.cycle == 'PENDING' ? 'selected' : ''}`} >
                            {t('orderTrackingPage.waitingForDriver')}
                          </Typography>
                        </Box>
                        {/* VERIFY verifiedBySupplier */}
                        <Box className='custom-box-inner-selected-cart'>
                          <Box className={`custom-box-inner-selected-cart-box ${selectedCommand.cycle !== 'PENDING' ? '' : 'pending'}`}>
                            <BuildRounded className={`custom-box-inner-selected-cart-icon ${selectedCommand.cycle !== 'PENDING' ? 'selected' : ''}`} />
                          </Box>
                          <Typography
                            noWrap
                            className={`custom-box-inner-selected-cart-text ${selectedCommand.cycle !== 'VERIFY' ? '' : 'selected'
                              }`} >
                            {t('orderTrackingPage.verifiedBySupplier')}
                          </Typography>
                        </Box>
                        {/* AUTHORIZED assignedToDriver */}
                        <Box className={`custom-box-inner-selected-cart`}>
                          <Box className={`custom-box-inner-selected-cart-box ${selectedCommand.cycle !== ('PENDING' || 'VERIFY') ? '' : 'pending'}`}>
                            <EmojiEvents className={`custom-box-inner-selected-cart-icon ${selectedCommand.cycle !== ('PENDING' || 'VERIFY') ? 'selected' : ''}`} />
                          </Box>
                          <Typography
                            noWrap
                            className={`custom-box-inner-selected-cart-text ${selectedCommand.cycle !== 'AUTHORIZED' ? '' : 'selected' //AUTHORIZED
                              }`}>
                            {t('orderTrackingPage.assignedToDriver')}
                          </Typography>
                        </Box>
                        {/* ASSIGNED driverOnTheWay */}
                        <Box className={`custom-box-inner-selected-cart`}>
                          <Box className={`custom-box-inner-selected-cart-box ${selectedCommand.cycle !== ('PENDING' || 'VERIFY' || 'AUTHORIZED') ? '' : 'pending'}`}>
                            <DriveEtaRounded className={`custom-box-inner-selected-cart-icon ${selectedCommand.cycle === ('ASSIGNED' || 'INPROGRESS') ? 'selected' : ''}`} />
                          </Box>
                          <Typography
                            noWrap
                            className={`custom-box-inner-selected-cart-text ${selectedCommand.cycle !== 'ASSIGNED' ? '' : 'selected'
                              }`}>
                            {t('orderTrackingPage.driverOnTheWay')}
                          </Typography>
                        </Box>
                        {/* INPROGRESS */}
                        <Box className={`custom-box-inner-selected-cart`}>
                          <Box className={`custom-box-inner-selected-cart-box ${selectedCommand.cycle == 'INPROGRESS' ? '' : 'pending'}`}>
                            <HomeRounded className={`custom-box-inner-selected-cart-icon ${selectedCommand.cycle == 'INPROGRESS' ? 'selected' : ''}`} />
                          </Box>
                          <Typography
                            noWrap
                            className={`custom-box-inner-selected-cart-text ${selectedCommand.cycle !== 'INPROGRESS' ? '' : 'selected'
                              }`}
                          >
                            {t('orderTrackingPage.commandOnItsWay')}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <></>
                    )}
                  </Box>
                  <Box sx={{ p: 4, width: '66.66%' }}>
                    <MapComponent selectedLocation={selectedLocation} />
                  </Box>
                </Box>
              </Card>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  margin: '25%',
                }}>
                <CircularProgress />
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 10,
            my: 10,
            bgcolor: '#343333',
          }}>
          <Typography variant='h3' color={'white'}>
            {t('orderTrackingPage.noCommands')}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default React.memo(OrderTrackingPage);