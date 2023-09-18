import React, { useEffect, useState } from 'react'

import "./currentCommands.scss"
import PositionIcon from "../../../../../assets/profile/ArchivedCommands/position.svg"
import DestinationIcon from "../../../../../assets/profile/ArchivedCommands/destination.svg"
import TimeIcon from "../../../../../assets/profile/ArchivedCommands/time.svg"
import DefaultImg from "../../../../../assets/profile/ArchivedCommands/default.jpg"


import delivA from "../../../../../assets/profile/ArchivedCommands/deliv-A.svg"
import traitementA from "../../../../../assets/profile/ArchivedCommands/traitement-A.svg"
import preparatinA from "../../../../../assets/profile/ArchivedCommands/preparatin-A.svg"

import delivD from "../../../../../assets/profile/ArchivedCommands/deliv-D.svg"
import traitementD from "../../../../../assets/profile/ArchivedCommands/traitement-D.svg"
import preparatinD from "../../../../../assets/profile/ArchivedCommands/preparatin-D.svg"
import { commandService } from '../../../../../services/api/command.api'
import { useAppSelector } from '../../../../../Redux/store'
import { useNavigate } from 'react-router-dom'

interface CommandsListProps {
    data: any
    removeCommand: any;
}

interface CommandProps {
    removeCommand: any;
    data: {
        products: [],
        total_price: number,
        delivery_price: number
        command_id: number,
    }

}

const Command: React.FC<CommandProps> = ({ removeCommand, data }) => {
    return (
        <div className='command-product-container'>
            <p className='title'> Commande</p>
            <div className='total'>
                <span>Total</span>
                <span className='total-value'>{data.total_price}</span>
            </div>
            <div className='sous-total'>
                <span>Sous-total</span>
                <span>{data.total_price}</span>
            </div>

            <ul>
                {(data.products && data.products.length > 0) &&
                    data.products.map((product: any, index: number) => {
                        return (
                            <li key={index}>
                                <div className='product'>
                                    <span className='product-name'>{product.name}</span>
                                    <span className='product-value'>{product.price}</span>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
            <hr />
            <button className='cancel-btn' onClick={() => removeCommand(data.command_id)}>Annuler la comamnde</button>
        </div>
    )

}




const CurrentCommands: React.FC<CommandsListProps> = ({ removeCommand, data }) => {
    const theme = useAppSelector((state) => state.home.theme)
    const client = data.client
    const supplier = data.supplier
    const delivery = data.delivery
    const products = data.products
    const cycle = data.cycle

    const position = supplier.street + " " + supplier.region + " " + supplier.city
    const [status, setStatus] = useState<number>(0)
    const [template, setTemplate] = useState<number>(theme)
    const [messsage, setMessage] = useState<string>('')

    const getProgressDescription = (cycle: string): { message: string, status: number } => {
        switch (cycle) {
            case 'PENDING':
                return {
                    message: 'Waiting for driver',
                    status: 1
                };
            case 'VERIFY':
                return {
                    message: 'Verified by supplier',
                    status: 2
                };
            case 'AUTHORIZED':
                return {
                    message: 'About to be assigned',
                    status: 3
                };
            case 'PRE_ASSIGN_ADMIN':
                return {
                    message: 'About to be assigned',
                    status: 4
                };
            case 'ASSIGNED':
                return {
                    message: 'Driver on the way to supplier',
                    status: 5
                };
            case 'INPROGRESS':
                return {
                    message: 'Command is on its way',
                    status: 6
                };
            default:
                return {
                    message: '',
                    status: -1
                };
        }
    };
    useEffect(() => {
        const { message, status } = getProgressDescription(cycle)
        setStatus(status)
        setMessage(message)
    }, [])

    useEffect(() => {
        setTemplate(theme)
    }, [theme])


    const commanddata: CommandProps = {
        removeCommand: removeCommand,
        data: {
            command_id: data.id,
            delivery_price: data.delivery_price,
            products: data.products,
            total_price: data.total_price
        }

    }
    return (

        <>
            <div className="current-commands-container">
                <header className='current-command-header'>
                    <img src={supplier.images[1].path} alt="supplier background" />
                </header>
                <main className='current-command-main'>
                    <section className='supplier-info'>
                        <img src={supplier.images[0].path} alt="supplier logo" />
                        <div className='name-rate'>
                            <p className='supplier-name'>{supplier.name}</p>
                            <p className='supplier-rates'>{(supplier.star && supplier.star > 0) ? supplier.star : "no rates"}</p>

                        </div>

                    </section>

                    <section className='command-info'>
                        <p className="title">En cours de traitement</p>
                        <p className="description">La commande est en attente d’acceptation de la part du restaurant</p>
                        <div className='command-graph'>
                            <div className='time-line'></div>
                            <img src={status === 1 ? traitementA : traitementD} alt="traitement logo" className='traitement-logo' />
                            <img src={status === 4 ? preparatinA : preparatinD} alt="preparation logo" className='preparation-logo' />
                            <img src={status === 6 ? delivA : delivD} alt="deliv logo" className='deliv-logo' />
                        </div>
                        <hr />
                    </section>
                    <section className='command-list-product'>
                        {
                            (status === 1) && <Command removeCommand={removeCommand} data={commanddata.data} />
                        }
                    </section>
                    <section className='deliv-info-section'>
                        {
                            (status >= 5) ? (
                                <>
                                    <img src={delivery.image[0].path} alt="supplier image" />
                                    <div className='delivery-info'>
                                        <p className="title">Votre livreur</p>
                                        <p className="name">{delivery.name}</p>
                                        <p className="rate">{(delivery.star && delivery.star > 0) ? delivery.star : "no rates"}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                </>
                            )
                        }
                    </section>
                </main>
            </div>
        </>

    )
}



export default CurrentCommands;