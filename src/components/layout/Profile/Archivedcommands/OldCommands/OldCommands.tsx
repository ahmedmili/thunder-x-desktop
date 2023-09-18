import React from 'react'

import "./oldCommands.scss"
import PositionIcon from "../../../../../assets/profile/ArchivedCommands/position.svg"
import DestinationIcon from "../../../../../assets/profile/ArchivedCommands/destination.svg"
import TimeIcon from "../../../../../assets/profile/ArchivedCommands/time.svg"
import DefaultImg from "../../../../../assets/profile/ArchivedCommands/default.jpg"

interface CommandsListProps {
    data: any
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
        <div className='product-container'>
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

const OldCommands: React.FC<CommandsListProps> = ({ data }) => {
    const supplier = data.supplier
    const delivery = data.delivery
    const products = data.products

    const position = supplier.street + " " + supplier.region + " " + supplier.city

    return (
        <>
            {
                (supplier && delivery && products) && (
                    <>

                        <div className='command-info-container'>
                            <div className='supplier-info'>
                                <div className='logo' >
                                    <div className='logo-img' style={{ backgroundImage: `url(${supplier.images[0].path.length > 0 ? supplier.images[0].path : DefaultImg})` }}></div>
                                    <div className="name-rate">
                                        <span className='supplier-name'>{supplier.name}</span>
                                        <span className='supplier-rates'>{(supplier.star && supplier.star > 0) ? supplier.star : "no rates"}</span>
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
                                <div className='delay'>
                                    <img className='time-icon' src={TimeIcon} alt="time icon" />
                                    <span className='meduim-time'>{supplier.medium_time}<span>min</span> </span>
                                </div>
                                <div className='end'>
                                    <img src={DestinationIcon} alt="Client position" />
                                    <div className="info">
                                        <p className="deliv-type">Domicile</p>
                                        <p className="supplier-position">{data.to_adresse}</p>
                                    </div>
                                </div>
                            </div>
                            <span className='devider'></span>
                            <div className='delivery-info'>
                                <div className='logo' >
                                    <div className='logo-img' style={{ backgroundImage: `url(${(delivery.image.length > 0 && delivery.image != null) ? delivery.image : DefaultImg})` }}></div>
                                    <div className="name-rate">
                                        <span className='supplier-Title'>Votre livreur</span>
                                        <span className='supplier-name'>{delivery.name}</span>
                                        <span className='supplier-rates'>{(delivery.star && delivery.star > 0) ? delivery.star : "no rates"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {
                            (products.length > 0) && (
                                products.map((product: any, index: number) => {
                                    const productData: ProductProps = {
                                        data: {
                                            img: product.computed_value.image[0].path,
                                            name: product.name,
                                            description: product.computed_value.description,
                                            qt: product.quantity,
                                            price: product.price
                                        }
                                    }
                                    return (
                                        <>
                                            <Product key={index} data={productData.data}></Product>
                                        </>
                                    )
                                })
                            )
                        }
                        <footer className='command-footer'>
                            <p>{data.total_price}</p>
                            <button className='avis'>Donner votre avis</button>

                        </footer>
                    </>
                )
            }
        </>

    )
}



export default OldCommands