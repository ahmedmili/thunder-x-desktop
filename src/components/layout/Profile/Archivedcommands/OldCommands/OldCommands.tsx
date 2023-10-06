import React, { useEffect, useState } from 'react'

import "./oldCommands.scss"
import PositionIcon from "../../../../../assets/profile/ArchivedCommands/position.svg"
import DestinationIcon from "../../../../../assets/profile/ArchivedCommands/destination.svg"
import TimeIcon from "../../../../../assets/profile/ArchivedCommands/time.svg"
import DefaultImg from "../../../../../assets/profile/ArchivedCommands/default.jpg"
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '../../../../../Redux/store'
import { Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'

interface CommandsListProps {
    data: any,
    feedbacksList: number[],
}

interface ProductProps {
    data: {
        img: string,
        name: string,
        description: string,
        qt: number,
        price: number
    }
}

const Product: React.FC<ProductProps> = ({ data }) => {
    return (
        <div className='old-commands-product-container'>
            <img src={data.img} alt="product image" />
            <div className='product-info' >
                <p className='name'> {data.name}</p>
                <p className='qt'> X{data.qt}</p>
                <p className='description' dangerouslySetInnerHTML={{ __html: data.description }} />
                <p className='price'> {data.price}</p>
            </div>

        </div>
    )

}

const OldCommands: React.FC<CommandsListProps> = ({ data, feedbacksList }) => {

    const { t } = useTranslation()
    // const theme = useAppSelector((state) => state.home.theme)
    const navigate = useNavigate()
    const supplier = data.supplier
    const delivery = data.delivery
    const products = data.products
    const position = supplier.street + " " + supplier.region + " " + supplier.city

    const gotToFeedBack = () => {
        let command_id = data.id
        navigate(`/profile/Feedback/${command_id}`)
    }

    useEffect(() => {
        console.log(feedbacksList)
        console.log(data)
    }, [])

    return (
        <>
            {
                (supplier && products) && (
                    <>

                        <div className='old-command-info-container'>
                            <div className='supplier-info'>
                                <div className='logo' >
                                    <div className='logo-img' style={{ backgroundImage: `url(${supplier.images[0].path.length > 0 ? supplier.images[0].path : DefaultImg})` }}></div>
                                    <div className="name-rate">
                                        <span className='supplier-name'>{supplier.name}</span>
                                        {
                                            (supplier.star && supplier.star > 0) ? (
                                                <span className='supplier-rates'> <Star className='star-icon' />{supplier.star}  </span>
                                            )
                                                :
                                                (
                                                    <>
                                                    </>
                                                )
                                        }
                                    </div>
                                </div>
                            </div>
                            <span className='devider'></span>
                            <div className='command-info'>
                                <div className='start'>
                                    <img src={PositionIcon} alt="Supplier position" />
                                    <div className="info">
                                        <p className="supplier-name">{supplier.name}</p>
                                        <p className="supplier-position">{position}</p>
                                    </div>
                                </div>
                                {
                                    delivery && (
                                        <>
                                            <div className='delay'>
                                                <img className='time-icon' src={TimeIcon} alt="time icon" />
                                                <span className='meduim-time'>{supplier.medium_time}<span>min</span> </span>
                                            </div>
                                            <div className='end'>
                                                <img src={DestinationIcon} alt="Client position" />
                                                <div className="info">
                                                    <p className="deliv-type">{t("home2")}</p>
                                                    <p className="supplier-position">{data.to_adresse}</p>
                                                </div>
                                            </div>

                                        </>
                                    )
                                }
                            </div>
                            {
                                delivery && (
                                    <>

                                        <span className='devider'></span>
                                        <div className='delivery-info'>
                                            <div className='logo' >
                                                <div className='logo-img' style={{ backgroundImage: `url(${(delivery.image.length > 0 && delivery.image != null) ? delivery.image : DefaultImg})` }}></div>
                                                <div className="name-rate">
                                                    <span className='supplier-Title'>{t("profile.commands.votreLiv")}</span>
                                                    <span className='supplier-name'>{delivery.name}</span>
                                                    <span className='supplier-rates'> <Star className='star-icon' /> {(delivery.star && delivery.star > 0) ? delivery.star : "no rates"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )
                            }

                        </div>


                        {
                            (products && (products.length > 0)) && (
                                products.map((product: any, index: number) => {
                                    const productData: ProductProps = {
                                        data: {
                                            img: product.computed_value ? product.computed_value.image[0].path : '',
                                            name: product.name,
                                            description: product.computed_value.description,
                                            qt: product.quantity,
                                            price: product.price
                                        }
                                    }
                                    return (
                                        <React.Fragment key={index}>
                                            <Product key={index} data={productData.data}></Product>
                                        </React.Fragment>
                                    )
                                })
                            )
                        }
                        <footer className='command-footer'>
                            <p>{data.total_price}Dt</p>
                            {
                                feedbacksList.some(feedback => feedback === data.id) ? (
                                    <>
                                        {/* <p className=''>
                                            On Vous remercie pour votre feedback concernant cette commande
                                        </p> */}
                                    </>
                                ) : (
                                    <>
                                        <button className='avis' onClick={gotToFeedBack}>{t('profile.commands.avis')}</button>
                                    </>
                                )
                            }
                        </footer>
                    </>
                )
            }
        </>

    )
}



export default OldCommands