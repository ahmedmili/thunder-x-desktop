

import React, { useEffect, useState } from 'react';

import { DiscountRounded, Star } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Box, Card, CardContent, CardMedia } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import missingImage from '../../assets/missingImage.png';
import { userService } from '../../services/api/user.api';
import { Restaurant } from '../../services/types';
import supplierStyle from './SupplierWhiteCard.module.scss';

interface SupplierWhiteCard {
    data: Restaurant,
    favors?: boolean,
    className?: string
}

const SupplierWhiteCard: React.FC<SupplierWhiteCard> = ({ data, favors = false, className }) => {
    const { t } = useTranslation();

    const [fav, setFav] = useState<boolean>(data.favor !== undefined ? data.favor : favors);
    const isOpen = data.status === 1 ? true : false;


    const getImageUrl = (restaurant: Restaurant) => {
        const image1 = restaurant.images.length > 0 ? restaurant.images[0] : null;
        const image2 = restaurant.images.length > 1 ? restaurant.images[1] : null;
        return image1 ? `${image1.path}` : image2 ? `${image2.path}` : '';
    };

    const MAX_NAME_LENGTH = 19;

    const getTruncatedName = (name: string) => {
        return name.length > MAX_NAME_LENGTH
            ? `${name.slice(0, MAX_NAME_LENGTH)}...`
            : name;
    };
    const handleFavorsAdd = async () => {
        const response = await userService.addfavorite(data.id)
        response.data.success && setFav(true)
    }
    const deletefavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const response = await userService.deletefavorite(data.id)
        response.data.success && setFav(false)
    }
    return (
        <div className={`${supplierStyle.SupplierWhiteCard} ${className}`}>

            <Link
                className={supplierStyle.restaurantLink}
                to={{
                    pathname: `/restaurant/${data.id}-${data.name.split(' ').join('-')}/All/`,
                }}
                state={{ restaurant: data }}
            >

                <Card className={supplierStyle.card} elevation={1} >

                    <Box className={supplierStyle.imageContainer}>
                        {/* promo lable */}
                        {
                            (data.discount_title && data.status === 1)
                            && (
                                <Box className={supplierStyle.discountBox}>
                                    <p>

                                        {`${data.discount_title}`}
                                    </p>
                                </Box>
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
                            <div className={supplierStyle.name}>
                                <h3 title={data.name}>

                                    {getTruncatedName(data.name)}
                                </h3>
                                <span className={supplierStyle.rate}>
                                    <Star className={supplierStyle.starIcon} />
                                    {
                                        data.star && data.star > 0 && (
                                            <>
                                                {data.star}
                                            </>
                                        )
                                    }
                                </span>
                            </div>
                            {/* option take_away & delivery */}
                            <p className={supplierStyle.option} >
                                {
                                    data.delivery === 1 && t('cartPage.delivery')
                                }
                                {
                                    data.delivery === 1 && data.take_away === 1 && (" / ")
                                }
                                {
                                    data.take_away === 1 && t("emporter")
                                }
                            </p>
                            {/* delivery Price */}
                            <div className={supplierStyle.price}>
                                <span>
                                    {t('deliveryPrice')}
                                    <span>
                                        {`${data.delivery_price}DT `}
                                    </span>
                                </span>
                                {/* time lable */}
                                {data.medium_time && (
                                    <Box className={`${supplierStyle.restaurantTime} ${!isOpen ? supplierStyle.closedSpan : ""}`}>
                                        {
                                            isOpen ? (
                                                <p>
                                                    {`${data.medium_time - 10}-${data.medium_time + 10} min`}
                                                </p>
                                            ) : (
                                                <p >
                                                    {t('closed')}
                                                </p>
                                            )
                                        }
                                    </Box>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </div>
    )
}

export default SupplierWhiteCard