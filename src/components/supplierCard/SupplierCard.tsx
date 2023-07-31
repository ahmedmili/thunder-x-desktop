

import React from 'react'

import supplierStryle from './SupplierCard.module.scss'
import { Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { DiscountRounded, Star } from '@mui/icons-material';
import { Restaurant } from '../../services/types';
import missingImage from '../../assets/missingImage.png';
import { useTranslation } from 'react-i18next';

const SupplierCard = (props: any) => {
    const { t } = useTranslation();
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

    return (
        <div className={supplierStryle.supplierCard}>
            <Link
                className={supplierStryle.restaurantLink}
                to={{
                    pathname: `/supplier-store/${props.data.id}`,
                }}
                state={{ restaurant: props.data }}
            >
                <Card className={supplierStryle.card} elevation={1} >

                    <Box className={supplierStryle.imageContainer}>
                        {/* promo lable */}

                        {/* {props.data.discount_title !== 'PROMO' ? ( */}
                            <Box className={supplierStryle.discountBox}>
                                <Typography variant='subtitle2' color={'white'}>
                                    <DiscountRounded
                                        className={supplierStryle.discountIcon}
                                    />{' '}
                                    {`${props.data.discount_title}`}
                                </Typography>
                            </Box>
                        {/* ) : (
                            <></>
                        )} */}
                        {/* card image */}
                        <CardMedia
                            className={supplierStryle.restaurantImage}
                            component='img'
                            src={getImageUrl(props.data)}
                            onError={(e: any) => {
                                e.target.onerror = null;
                                e.target.src = missingImage;
                            }}
                            loading='lazy'
                        />




                        {/* rating lable */}
                        <Box className={supplierStryle.ratingBox}>
                            <Star className={supplierStryle.starIcon} />
                            <Typography>
                                {props.data.star ? props.data.star : t('noRating')}
                            </Typography>
                        </Box>
                    </Box>
                    <CardContent>
                        <Typography
                            variant='h5'
                            component='h2'
                            noWrap
                            style={{ fontWeight: 'bold' }}>
                            {getTruncatedName(props.data.name)}
                        </Typography>
                        <Typography variant='body1' gutterBottom>
                            {`${t('deliveryPrice')} ${Math.round(
                                JSON.parse(props.data.delivery_price)
                            )} DT`}
                        </Typography>


                        {/* time lable */}
                        <Box
                            className={supplierStryle.restaurantTime}>
                            {props.data.medium_time ? (
                                <Typography variant='subtitle2'>
                                    {`${props.data.medium_time - 10}mins - ${props.data.medium_time + 10
                                        }mins`}
                                </Typography>
                            ) : (
                                <Typography variant='subtitle2'></Typography>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Link>
        </div>
    )
}

export default SupplierCard