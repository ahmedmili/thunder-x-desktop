import React, { useCallback, useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Grid,
} from '@mui/material';
import eventEmitter from '../services/thunderEventsService';
import {
  setCommands,
  setSelectedLocation,
  setSelectedCommand,
} from '../Redux/slices/commandsSlice';
import './track.css';
import { useTranslation } from 'react-i18next';
import livreur from '../assets/livreur-img-1.png';
import {
  BuildRounded,
  DriveEtaRounded,
  EmojiEvents,
  HomeRounded,
  Phone,
  ShoppingCartRounded,
} from '@mui/icons-material';
import MapComponent from '../components/mapComponent/mapComponent';
import { useAppDispatch, useAppSelector } from '../Redux/store';
import { commandService } from '../services/api/command.api';
import { localStorageService } from '../services/localStorageService';


const OrderTrackingPage: React.FC = () => {
  const userToken = localStorageService.getUserToken();
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
    await getCommands();
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

  const getCommands = async () => {
    const {status,data} = await commandService.myCommands();
    if (status === 200) {
      dispatch(setCommands(data.data));
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
    getCommands();
  }, []);
  return (
    <Container maxWidth='lg' sx={{ marginBottom: '1%' }}>
      {commands && commands.length > 0 ? (
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{
              width: '20%',
              my: '2%',
              maxHeight: '580px',
              overflowY: 'auto',
            }}>
            <List>
              {commands &&
                commands.map((command: any) => (
                  <ListItem
                    sx={{
                      mb: '2%',
                      backgroundColor:
                        selectedCommand === command ? 'lightblue' : 'initial',
                    }}
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
          <Box sx={{ width: '80%' }}>
            {commands ? (
              <Card sx={{ my: '3%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: 1,
                    px: 1,
                    bgcolor: '#343333',
                  }}>
                  <Box
                    sx={{
                      width: '100%',
                      color: 'white',
                      textAlign: 'center',
                      py: 1,
                      px: 2,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <img
                      src={livreur}
                      alt='Delivery Person'
                      style={{ marginLeft: '0.5rem', height: '5rem' }}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        ml: '1rem',
                        textAlign: 'left',
                      }}>
                      <Typography
                        variant='h6'
                        component='span'
                        sx={{ fontWeight: 'light' }}>
                        {t('orderTrackingPage.status')}
                      </Typography>
                      <Typography
                        variant='h4'
                        component='span'
                        sx={{ fontWeight: 'medium' }}>
                        {getProgressDescription(selectedCommand?.cycle)}
                        <span className='dot-one'> .</span>
                        <span className='dot-two'> .</span>
                        <span className='dot-three'> .</span>
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      width: '100%',
                      color: 'white',
                      textAlign: 'right',
                      alignContent: 'right',
                      py: 1,
                      px: 2,
                    }}>
                    <Box
                      sx={{
                        width: '100%',
                        color: 'white',
                        textAlign: 'right',
                        py: 1,
                        px: 4,
                      }}>
                      {selectedCommand && selectedCommand.delivery && (
                        <div style={{ flex: 'flexbox', alignItems: 'row' }}>
                          <Typography
                            variant='body1'
                            component='span'
                            sx={{ fontWeight: 'light' }}>
                            {t('orderTrackingPage.deliveryDriver')}
                          </Typography>
                          <Typography
                            variant='h6'
                            component='span'
                            sx={{ fontWeight: 'normal' }}>
                            {selectedCommand.delivery.name}
                          </Typography>
                        </div>
                      )}
                    </Box>
                    <Box
                      sx={{
                        width: '100%',
                        color: 'white',
                        alignContent: 'right',
                      }}>
                      <div className='caller'>
                        <div className='text'>
                          {t('orderTrackingPage.callUs')}
                        </div>
                        <div className='icon'>
                          <Phone sx={{ fontSize: '1.2rem' }} />
                        </div>
                        <div className='number'>99 888 777</div>
                      </div>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', mt: '4%' }}>
                  <Typography
                    variant='body1'
                    component='span'
                    sx={{ fontWeight: 'medium', ml: '5%' }}>
                    {t('orderTrackingPage.commandContent')}
                  </Typography>{' '}
                  <Grid container spacing={2}>
                    {selectedCommand &&
                      selectedCommand?.products.map((product: any) => (
                        <Card
                          key={product.id}
                          sx={{
                            backgroundColor: 'whitesmoke',
                            width: '10rem',
                            padding: '3%',
                            mx: '0.8%',
                          }}>
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
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ p: 1, mx: 2, width: '33.33%' }}>
                    {selectedCommand.cycle ? (
                      <Box
                        sx={{
                          alignItems: 'left',
                          textJustify: 'left',
                          justifyContent: 'space-between',
                          pb: 1,
                          position: 'relative',
                        }}>
                        <Box
                          sx={{
                            textAlign: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            my: 2,
                          }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '5%',
                              bgcolor: 'rgb(45, 178, 177)',
                              width:
                                selectedCommand.cycle !== 'PENDING'
                                  ? '40px'
                                  : '50px',
                              height:
                                selectedCommand.cycle !== 'PENDING'
                                  ? '40px'
                                  : '50px',
                              ml:
                                selectedCommand.cycle !== 'PENDING'
                                  ? '0'
                                  : '-2%',
                            }}>
                            <ShoppingCartRounded
                              sx={{
                                fontSize:
                                  selectedCommand.cycle !== 'PENDING' ? 26 : 18,
                                color:
                                  selectedCommand.cycle !== 'PENDING'
                                    ? 'darkgray'
                                    : 'whitesmoke',
                              }}
                            />
                          </Box>
                          <Typography
                            noWrap
                            sx={{
                              mt: 1,
                              ml: 2,
                              color:
                                selectedCommand.cycle !== 'PENDING'
                                  ? 'gray'
                                  : 'black',
                              fontSize:
                                selectedCommand.cycle !== 'PENDING'
                                  ? '1rem'
                                  : '1.4rem',
                              fontWeight:
                                selectedCommand.cycle !== 'PENDING'
                                  ? 'light'
                                  : 'medium',
                            }}>
                            {t('orderTrackingPage.waitingForDriver')}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            textAlign: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            my: 2,
                          }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '5%',
                              bgcolor:
                                selectedCommand.cycle === 'PENDING'
                                  ? 'gray'
                                  : 'rgb(45, 178, 177)',
                              width:
                                selectedCommand.cycle !== 'VERIFY'
                                  ? '40px'
                                  : '50px',
                              height:
                                selectedCommand.cycle !== 'VERIFY'
                                  ? '40px'
                                  : '50px',
                              ml:
                                selectedCommand.cycle !== 'VERIFY'
                                  ? '0'
                                  : '-2%',
                            }}>
                            <BuildRounded
                              sx={{
                                fontSize:
                                  selectedCommand.cycle !== 'VERIFY' ? 18 : 26,
                                color:
                                  selectedCommand.cycle !== 'VERIFY'
                                    ? 'darkgray'
                                    : 'whitesmoke',
                              }}
                            />
                          </Box>
                          <Typography
                            noWrap
                            sx={{
                              mt: 1,
                              ml: 2,
                              color:
                                selectedCommand.cycle !== 'VERIFY'
                                  ? 'gray'
                                  : 'black',
                              fontSize:
                                selectedCommand.cycle !== 'VERIFY'
                                  ? '1rem'
                                  : '1.4rem',
                              fontWeight:
                                selectedCommand.cycle !== 'VERIFY'
                                  ? 'light'
                                  : 'medium',
                            }}>
                            {t('orderTrackingPage.verifiedBySupplier')}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            textAlign: 'left',
                            display: 'flex',
                            my: 2,
                            alignItems: 'center',
                          }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '5%',
                              bgcolor:
                                selectedCommand.cycle === 'PENDING' ||
                                selectedCommand.cycle === 'VERIFY'
                                  ? 'gray'
                                  : 'rgb(45, 178, 177)',
                              width:
                                selectedCommand.cycle !== 'AUTHORIZED'
                                  ? '40px'
                                  : '50px',
                              height:
                                selectedCommand.cycle !== 'AUTHORIZED'
                                  ? '40px'
                                  : '50px',
                              ml:
                                selectedCommand.cycle !== 'AUTHORIZED'
                                  ? '0'
                                  : '-2%',
                            }}>
                            <EmojiEvents
                              sx={{
                                fontSize:
                                  selectedCommand.cycle !== 'AUTHORIZED'
                                    ? 18
                                    : 26,
                                color:
                                  selectedCommand.cycle !== 'AUTHORIZED'
                                    ? 'darkgray'
                                    : 'whitesmoke',
                              }}
                            />
                          </Box>
                          <Typography
                            noWrap
                            sx={{
                              mt: 1,
                              ml: 2,
                              fontSize:
                                selectedCommand.cycle !== 'AUTHORIZED'
                                  ? '1rem'
                                  : '1.4rem',
                              fontWeight:
                                selectedCommand.cycle !== 'AUTHORIZED'
                                  ? 'light'
                                  : 'medium',
                              color:
                                selectedCommand.cycle !== 'AUTHORIZED'
                                  ? 'gray'
                                  : 'black',
                            }}>
                            {t('orderTrackingPage.assignedToDriver')}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            my: 2,
                          }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '5%',
                              bgcolor:
                                selectedCommand.cycle === 'PENDING' ||
                                selectedCommand.cycle === 'VERIFY' ||
                                selectedCommand.cycle === 'AUTHORIZED' ||
                                selectedCommand.cycle === 'PRE_ASSIGN_ADMIN'
                                  ? 'gray'
                                  : 'rgb(45, 178, 177)',
                              width:
                                selectedCommand.cycle !== 'ASSIGNED'
                                  ? '40px'
                                  : '50px',
                              height:
                                selectedCommand.cycle !== 'ASSIGNED'
                                  ? '40px'
                                  : '50px',
                              ml:
                                selectedCommand.cycle !== 'ASSIGNED'
                                  ? '0'
                                  : '-2%',
                            }}>
                            <DriveEtaRounded
                              sx={{
                                fontSize:
                                  selectedCommand.cycle !== 'ASSIGNED'
                                    ? 18
                                    : 26,
                                color:
                                  selectedCommand.cycle !== 'ASSIGNED'
                                    ? 'darkgray'
                                    : 'whitesmoke',
                              }}
                            />
                          </Box>
                          <Typography
                            noWrap
                            sx={{
                              mt: 1,
                              ml: 2,
                              textJustify: 'left',
                              fontSize:
                                selectedCommand.cycle !== 'ASSIGNED'
                                  ? '1rem'
                                  : '1.2rem',
                              fontWeight:
                                selectedCommand.cycle !== 'ASSIGNED'
                                  ? 'light'
                                  : 'medium',
                              color:
                                selectedCommand.cycle !== 'ASSIGNED'
                                  ? 'gray'
                                  : 'black',
                            }}>
                            {t('orderTrackingPage.driverOnTheWay')}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            my: 2,
                          }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '5%',
                              bgcolor:
                                selectedCommand.cycle === 'INPROGRESS'
                                  ? 'rgb(45, 178, 177)'
                                  : 'gray',
                              width:
                                selectedCommand.cycle !== 'INPROGRESS'
                                  ? '40px'
                                  : '50px',
                              height:
                                selectedCommand.cycle !== 'INPROGRESS'
                                  ? '40px'
                                  : '50px',
                              ml:
                                selectedCommand.cycle !== 'INPROGRESS'
                                  ? '0'
                                  : '-2%',
                            }}>
                            <HomeRounded
                              sx={{
                                fontSize:
                                  selectedCommand.cycle !== 'INPROGRESS'
                                    ? 18
                                    : 26,
                                color:
                                  selectedCommand.cycle !== 'INPROGRESS'
                                    ? 'darkgray'
                                    : 'whitesmoke',
                              }}
                            />
                          </Box>
                          <Typography
                            noWrap
                            sx={{
                              mt: 1,
                              ml: 2,
                              fontSize:
                                selectedCommand.cycle !== 'INPROGRESS'
                                  ? '1rem'
                                  : '1.4rem',
                              fontWeight:
                                selectedCommand.cycle !== 'INPROGRESS'
                                  ? 'light'
                                  : 'medium',
                              color:
                                selectedCommand.cycle !== 'INPROGRESS'
                                  ? 'gray'
                                  : 'black',
                            }}>
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
