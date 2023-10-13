import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';

import "./currentCommands.scss";

import StarIcon from '@mui/icons-material/Star';

import destinationIcon from "../../../../../assets/profile/ArchivedCommands/destination.svg";
import positionIcon from "../../../../../assets/profile/ArchivedCommands/position.svg";
import positionIconBlue from "../../../../../assets/profile/ArchivedCommands/position_blue.svg";

import defaultImage from "../../../../../assets/profile/ArchivedCommands/default.jpg";
import delivA from "../../../../../assets/profile/ArchivedCommands/deliv-A.svg";
import doneA from "../../../../../assets/profile/ArchivedCommands/done-A.svg";
import preparatinA from "../../../../../assets/profile/ArchivedCommands/preparatin-A.svg";
import traitementA from "../../../../../assets/profile/ArchivedCommands/traitement-A.svg";

import { useTranslation } from 'react-i18next';
import delivD from "../../../../../assets/profile/ArchivedCommands/deliv-D.svg";
import doneD from "../../../../../assets/profile/ArchivedCommands/done-D.svg";
import preparatinD from "../../../../../assets/profile/ArchivedCommands/preparatin-D.svg";
import traitementD from "../../../../../assets/profile/ArchivedCommands/traitement-D.svg";
import { commandService } from '../../../../../services/api/command.api';
import { Product } from '../../../../../services/types';
import SignaleProblem from '../../../../Popups/SignaleProblem/SignaleProblem';
import CommandsFooter from '../Footer/Footer';

interface CommandsListProps {
    data: any
    removeCommand: any;
    goToPassedCommands: any;
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
    const [total, setTotal] = useState<number>(0)
    const { t } = useTranslation()

    const calculeData = () => {
        let total = 0;
        const products = data.products;
        for (let index = 0; index < products.length; index++) {
            const product: Product = products[index]
            const price = product.price
            const quantity = product.quantity
            const result = quantity! * price
            total = total + result

        }
        setTotal(total)
    }
    useEffect(() => {
        calculeData()
    }, [data])

    return (
        <div className='command-product-container'>
            <p className='title'> {t('profile.commands.command')}</p>
            <div className='total'>
                <span>{t('cartPage.total')}</span>
                <span className='total-value'>{data.total_price}</span>
            </div>

            <div className='sous-total'>
                <span>{t('profile.commands.sousTotal')}</span>
                <span className='left-price'>{total} Dt</span>
            </div>

            <div className='sous-total'>
                <span>Frais de livraison</span>
                <span className='left-price'>{data.delivery_price} DT</span>
            </div>
            <ul>
                {(data.products && data.products.length > 0) &&
                    data.products.map((product: any, index: number) => {
                        return (
                            <li key={index}>
                                <div className='product'>
                                    <div className='product-info'>
                                        <span className='product-name'>{product.name}</span>
                                        <span className='product-qt'>X{product.quantity}</span>
                                    </div>
                                    <span className='product-value'>{product.price * product.quantity} DT</span>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
            <hr />
            <button className='cancel-btn' onClick={() => removeCommand(data.command_id)}>{t('profile.commands.annuler')}</button>
        </div>
    )

}

const CurrentCommands: React.FC<CommandsListProps> = ({ removeCommand, goToPassedCommands, data }) => {

    const { t } = useTranslation()
    const supplier = data.supplier
    const delivery = data.delivery
    const cycle = data.cycle
    const isDelevery = data.is_delivery
    const take_away_date = data.take_away_date
    const lat = supplier.localisation.lat;
    const long = supplier.localisation.long;
    const position = supplier.street + " " + supplier.region + " " + supplier.city
    const [status, setStatus] = useState<number>(0)

    const [messsage, setMessage] = useState<string>('')
    const [time, setTime] = useState<string>('')
    const [date, setDate] = useState<string>('')
    const [problemPopup, setProblemPopup] = useState<boolean>(false)

    const handleProblemPopup = () => {
        setProblemPopup(current => !current)
    }
    const submitProblem = async (problem: string) => {
        try {
            const response = await commandService.signalerCommand(problem, data.id)
            response.data.success === true && handleProblemPopup()
        } catch (error) {
            throw error
        }
    }
    useEffect(() => {
        if (take_away_date != null) {
            const [datePart, timePart] = take_away_date.split(' ');
            const parsedDate = parse(datePart, "yyyy-MM-dd", new Date());
            setDate(format(parsedDate, "dd MMMM yyyy", { locale: fr }))
            setTime(timePart.split(':').slice(0, 2).join(':'))
        }
    }, [take_away_date])

    const getProgressDescription = (cycle: string): { message: string, status: number } => {
        console.log(cycle)
        switch (cycle) {
            case 'PENDING':
                return {
                    message: t('profile.commands.traitement'),
                    status: 1
                };
            case 'VERIFY':
                return {
                    message: t('profile.commands.traitement'),
                    status: 2
                };
            case 'AUTHORIZED':
                return {
                    message: t('profile.commands.prépaartion'),
                    status: 3
                };
            case 'PRE_ASSIGN_ADMIN':
                return {
                    message: t('profile.commands.prépaartion'),
                    status: 4
                };
            case 'ASSIGNED':
                return {
                    message: t('profile.commands.prépaartion'),
                    status: 5
                };
            case 'INPROGRESS':
                return {
                    message: t('profile.commands.livraison'),
                    status: 6
                };
            default:
                return {
                    message: '',
                    status: -1
                };
        }
    };

    const openGoogleMap = () => {
        const latitude = lat;
        const longitude = long;
        const zoom = 15;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}&z=${zoom}`;
        window.open(url, '_blank');
    };

    useEffect(() => {
        const { message, status } = getProgressDescription(cycle)
        setStatus(status)
        setMessage(message)
    }, [])

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
                <header className={` current-command-header `}>
                    <img src={supplier.images[1].path} alt="supplier background" />
                </header>
                <main className={`current-command-main `}>
                    <div className='supplier-info'>
                        <img src={supplier.images[0].path} alt="supplier logo" />
                        <div className='name-rate'>
                            <p className='supplier-name'>{supplier.name}</p>
                            {(supplier.star && supplier.star > 0) && <p className='supplier-rates'><StarIcon className='rate-icon' /> {supplier.star}</p>}
                        </div>

                    </div>

                    <div className='command-info'>
                        <p className="title">{messsage}</p>
                        <p className="description">{t('profile.commands.sousMessage')}</p>
                        <div className='command-graph'>
                            <div className='time-line'></div>
                            <img src={(status === 1 || status === 2) ? traitementA : traitementD} alt="traitement logo" className='traitement-logo' />
                            <img src={(status <= 5 && status > 2) ? preparatinA : preparatinD} alt="preparation logo" className='preparation-logo' />
                            {
                                isDelevery === 1 ? (
                                    <img src={(status === 6) ? delivA : delivD} alt="deliv logo" className='deliv-logo' />

                                ) : (
                                    <img src={(status === 6) ? doneA : doneD} alt="deliv logo" className='deliv-logo' />

                                )
                            }
                        </div>
                        <hr />
                    </div>
                    <div className='command-list-product'>
                        {
                            (status === 1 || status === 2) && <Command removeCommand={removeCommand} data={commanddata.data} />
                        }
                    </div>
                    <div className='deliv-info-section'>
                        {
                            isDelevery === 1 ? (
                                <>
                                    {
                                        (status <= 4 && status > 2) && (
                                            <>
                                                <div className='no-deliv-assigned'>
                                                    <div className='img'></div>
                                                    <div className='delivery-info'>
                                                        <p className="title">{t('profile.commands.livRecherche')}</p>
                                                        <div className='bleck-box'></div>
                                                        <p className="rate"> <StarIcon className='rate-icon' /> <div className='orange-box'></div></p>
                                                    </div>
                                                </div>
                                                <hr />
                                            </>
                                        )
                                    }
                                    {
                                        (status >= 5) && (
                                            <>
                                                <div className='deliv-assigned'>
                                                    <img src={(delivery && delivery.image.path) ? delivery.image.path : defaultImage} alt="supplier image" />
                                                    <div className='delivery-info'>
                                                        <p className="title">{t('profile.commands.votreLiv')}</p>
                                                        <p className="name">{(delivery && delivery.name) ? delivery.name : "Med Fendri"}</p>
                                                        <p className="rate"><StarIcon /> {(delivery && delivery.star && delivery.star > 0) ? delivery.star : ""}</p>
                                                    </div>
                                                </div>
                                                <hr />
                                            </>
                                        )
                                    }
                                    {
                                        (status <= 5 && status > 2) && (

                                            <div className='position'>
                                                <div className='start-position'>
                                                    <div className='position-icon' style={{ backgroundImage: `url(${positionIcon}) ` }}></div>
                                                    <p className='name'>{supplier.name}</p>
                                                    <p className='position-text' > {position}</p>
                                                </div>
                                                <div className='delay'>
                                                    <p className='time-text'> {t('profile.commands.delivTime')} <span>15min</span></p>
                                                </div>
                                                <div className='start-position'>
                                                    <div className='position-icon' style={{ backgroundImage: `url(${destinationIcon}) ` }}></div>
                                                    <p className='name'>{t('home2')}</p>
                                                    <p className='position-text' > {data.to_adresse}</p>
                                                </div>

                                                <div className='time-line'></div>
                                            </div>
                                        )
                                    }
                                </>
                            ) : (
                                <>
                                    <div className="buttons">
                                        <button className='lieu-button' onClick={openGoogleMap}> <span className='position-icon' style={{ backgroundImage: `url(${positionIconBlue})` }}></span> {t('profile.commands.lieu')}</button>
                                        {
                                            status >= 5 && (

                                                <button className='recup-btn'>{t('profile.commands.recupere')}</button>
                                            )
                                        }

                                    </div>
                                    <hr />
                                    <div className='import-position'>
                                        <div className='position-icon' style={{ backgroundImage: `url(${positionIcon}) ` }}></div>
                                        <p className='position-text' > {position}</p>
                                    </div>

                                    <div className='tacke-away-date'>
                                        <span>{t('profile.commands.prevu')}:</span>
                                        <span>{date}</span>
                                        <span>{time}</span>
                                    </div>

                                </>
                            )
                        }

                    </div>

                    {
                        status >= 5 && (
                            <div className='buttons'>
                                <button className="recue" onClick={goToPassedCommands} >{t('profile.commands.recue')}  </button>
                                <button className="problem" onClick={handleProblemPopup}>{t('profile.commands.problem')}</button>
                            </div>
                        )
                    }
                    <CommandsFooter />
                </main >
            </div >

            {
                problemPopup &&
                <SignaleProblem command_id={data.id} action={submitProblem} close={handleProblemPopup} />
            }
        </>

    )
}



export default CurrentCommands;