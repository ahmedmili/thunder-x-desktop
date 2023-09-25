

import React, { useEffect } from 'react'

import supplierStyle from './SupplierCard.module.scss'
import { Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { DiscountRounded, Star } from '@mui/icons-material';
import { Restaurant } from '../../services/types';
import missingImage from '../../assets/missingImage.png';
import { useTranslation } from 'react-i18next';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface SupplierCard {
    data: Restaurant,
    favors?: boolean,
    className?: string
}

const SupplierCard: React.FC<SupplierCard> = ({ data, favors, className }) => {
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
        <div className={`${supplierStyle.supplierCard} ${className}`}>

            <Link
                className={supplierStyle.restaurantLink}
                to={{
                    pathname: `/supplier-store/${data.id}`,
                }}
                state={{ restaurant: data }}
            >

                <Card className={supplierStyle.card} elevation={1} >

                    <Box className={supplierStyle.imageContainer}>
                        {/* promo lable */}
                        {(data.discount_title !== 'PROMO') && (data.discount_title !== undefined) && (data.discount_title !== null) && (
                            <Box className={supplierStyle.discountBox}>
                                <p>
                                    <DiscountRounded
                                        className={supplierStyle.discountIcon}
                                    />{' '}
                                    {`${data.discount_title}`}
                                </p>
                            </Box>
                        )}

                        {/* favors icons */}
                        {(data.favor || favors) ? (
                            <button className={supplierStyle.favorIcon}>
                                <FavoriteIcon className={supplierStyle.activeIcon} />
                            </button>
                        ) : (
                            <button className={supplierStyle.favorIcon}>
                                <FavoriteBorderIcon />
                            </button>
                        )}

                        {/* card image */}
                        <CardMedia
                            className={supplierStyle.restaurantImage}
                            component='img'
                            src={getImageUrl(data)}
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
                                <abbr title={data.name}>

                                    {getTruncatedName(data.name)}
                                </abbr>
                            </p>
                            {/* option take_away & delivery */}
                            <p className={supplierStyle.option} >
                                {
                                    data.delivery === 1 && ("delivery")
                                }
                                {
                                    data.delivery === 1 && data.take_away === 1 && (" / ")
                                }
                                {
                                    data.take_away === 1 && ("Home")
                                }
                            </p>
                            {/* delivery Price */}
                            <p className={supplierStyle.price}>
                                {t('deliveryPrice')}
                                <span>
                                    {" " + data.delivery_price + " DT"}
                                </span>
                            </p>
                        </div>

                        <div className={supplierStyle.rightSide}>

                            {/* rating lable */}
                            <Box className={supplierStyle.ratingBox} style={data.star ? { visibility: 'visible' } : { visibility: 'hidden' }} >
                                <Star className={supplierStyle.starIcon} />
                                <Typography>
                                    {data.star && data.star}
                                </Typography>
                            </Box>
                            {/* time lable */}
                            {data.medium_time && (
                                <Box
                                    className={supplierStyle.restaurantTime}>

                                    <p>
                                        {`${data.medium_time - 10}mins - ${data.medium_time + 10
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