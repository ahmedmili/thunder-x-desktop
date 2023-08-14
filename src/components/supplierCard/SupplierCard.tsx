

import React from 'react'

import supplierStyle from './SupplierCard.module.scss'
import { Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { DiscountRounded, Star } from '@mui/icons-material';
import { Restaurant } from '../../services/types';
import missingImage from '../../assets/missingImage.png';
import { useTranslation } from 'react-i18next';
import { Container, Row } from 'react-bootstrap';

const SupplierCard = (props: any) => {
    const { t } = useTranslation();
    const getImageUrl = (restaurant: Restaurant) => {
        const image1 = restaurant.images.length > 0 ? restaurant.images[0] : null;
        const image2 = restaurant.images.length > 1 ? restaurant.images[1] : null;
        return image1 ? `${image1.path}` : image2 ? `${image2.path}` : '';
    };


    const MAX_NAME_LENGTH = 10;

    const getTruncatedName = (name: string) => {
        return name.length > MAX_NAME_LENGTH
            ? `${name.slice(0, MAX_NAME_LENGTH)}...`
            : name;
    };

    
        return (
        <div className={supplierStyle.supplierCard}>

            <Link
                className={supplierStyle.restaurantLink}
                to={{
                    pathname: `/supplier-store/${props.data.id}`,
                }}
                state={{ restaurant: props.data }}
            >

                <Card className={supplierStyle.card} elevation={1} >

                    <Box className={supplierStyle.imageContainer}>
                        {/* promo lable */}
                        {(props.data.discount_title !== 'PROMO') && (props.data.discount_title !== undefined) && (props.data.discount_title !== null) ? (
                            <Box className={supplierStyle.discountBox}>
                                <p>
                                    <DiscountRounded
                                        className={supplierStyle.discountIcon}
                                    />{' '}
                                    {`${props.data.discount_title}`}
                                </p>
                            </Box>
                        ) : (
                            <></>
                        )}
                        {/* card image */}
                        <CardMedia
                            className={supplierStyle.restaurantImage}
                            component='img'
                            src={getImageUrl(props.data)}
                            onError={(e: any) => {
                                e.target.onerror = null;
                                e.target.src = missingImage;
                            }}
                            loading='lazy'
                        />

                    </Box>

                    <CardContent className={supplierStyle.contentContainer}>

                        <div className={supplierStyle.leftSide}>
                            {/* supplier name */}
                            <p className={supplierStyle.name}>
                            <abbr title={props.data.name}>
                                
                                {getTruncatedName(props.data.name)}
                            </abbr>
                            </p>
                            {/* option take_away & delivery */}
                            <p className={supplierStyle.option} >
                                {
                                    props.data.delivery === 1 && ("delivery")
                                }
                                {
                                    props.data.delivery === 1 && props.data.take_away === 1 && (" / ")
                                }
                                {
                                    props.data.take_away === 1 && ("Home")
                                }
                            </p>
                            {/* delivery Price */}
                            <p className={supplierStyle.price}>
                                {t('deliveryPrice')}
                                <span>
                                    {" " + props.data.delivery_price + " DT"}
                                </span>
                            </p>
                        </div>

                        <div className={supplierStyle.rightSide}>

                            {/* rating lable */}
                            <Box className={supplierStyle.ratingBox} style={props.data.star ? { visibility: 'visible' } : { visibility: 'hidden' }} >
                                <Star className={supplierStyle.starIcon} />
                                <Typography>
                                    {props.data.star && props.data.star}
                                </Typography>
                            </Box>
                            {/* time lable */}
                            {props.data.medium_time && (
                                <Box
                                    className={supplierStyle.restaurantTime}>

                                    <p>
                                        {`${props.data.medium_time - 10}mins - ${props.data.medium_time + 10
                                            }mins`}

                                    </p>
                                </Box>
                            )}


                        </div>

                    </CardContent>
                </Card>
            </Link>
        </div>
    )
}

export default SupplierCard