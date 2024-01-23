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
import traitementA from "../../../../../assets/profile/ArchivedCommands/traitement-B.svg";
import traitementB from "../../../../../assets/profile/ArchivedCommands/traitement-B.svg";

import { useTranslation } from 'react-i18next';
import delivD from "../../../../../assets/profile/ArchivedCommands/deliv-D.svg";
import doneD from "../../../../../assets/profile/ArchivedCommands/done-D.svg";
import preparatinD from "../../../../../assets/profile/ArchivedCommands/preparatin-D.svg";
import traitementD from "../../../../../assets/profile/ArchivedCommands/traitement-D.svg";
import { commandService } from '../../../../../services/api/command.api';
import { Product } from '../../../../../services/types';
import SignaleProblem from '../../../../Popups/SignaleProblem/SignaleProblem';
import WarnPopup from '../../../../Popups/WarnPopup/WarnPopup';
import CommandsFooter from '../Footer/Footer';
import eventEmitter from '../../../../../services/thunderEventsService';

interface CommandsListProps {
    data: any
    removeCommand: any;
    goToPassedCommands: any;
}

interface CommandsData {
    products: [],
    total_price: number,
    is_delivery: number,
    delivery_price: number
    command_id: number,
    bonus: number,
    gift_ammount: number,
    total_price_coupon: number,
    mode_pay: number,
    coupon: {
        type: string,
        value: number,
        delivery_fixed: number,
    },
}
interface CommandProps {
    removeCommand: any;
    data: CommandsData

}

const Command: React.FC<CommandProps> = ({ removeCommand, data }) => {
    const [total, setTotal] = useState<number>(0)
    const [showCancleConfirm, setShowCancleConfirm] = useState<boolean>(false)
    const [tax, setTax] = useState<number>(0)

    const { t } = useTranslation()

    const calculSomme = (products: any) => {
        const totalCost = products.reduce((accumulator: any, currentItem: any) => {
            let itemCost: any;
            if (currentItem.computed_value.discount_value > 0) {
                const discountPrice = (currentItem.price * currentItem.computed_value.discount_value) / 100;
                itemCost = (currentItem.price - discountPrice) * currentItem.quantity;
            } else {
                itemCost = currentItem.price * currentItem.quantity;
            }
            return accumulator + itemCost;
        }, 0);
        return totalCost;
    }

    const calculTax = (command: any) => {
        const totalPrice = parseFloat(command?.total_price);
        const totalProducts = calculSomme(command?.products);
        const deliveryPrice = parseFloat(command.delivery_price);
        const bonus = command.bonus > 0 ? (command.bonus / 1000) : 0;
        const gift = command.gift_ammount > 0 ? command.gift_ammount : 0;
        const tax = (totalPrice + bonus + gift) - (totalProducts + deliveryPrice);
        return tax;
    }

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
        const tax = calculTax(data)
        setTax(tax)
        calculeData()
    }, [data])

    const handleConfrmModal = () => {
        setShowCancleConfirm(!showCancleConfirm)
    }
    const dropCommand = (id: number) => {
        removeCommand(id)
    }
    return (
        <div className='command-product-container'>
            <h3 className='title'> {t('profile.commands.command')}</h3>

            {/* total */}
            <div className='total'>
                <span className="total-txt">{t('cartPage.total')}</span>
                <span className='total-value'>{Number(data.total_price).toFixed(2)} DT</span>
            </div>
            {/* sous Total */}
            <div className='sous-total'>
                <span className="text">{t('profile.commands.sousTotal')}</span>
                <span className='price'>{total.toFixed(2)} DT</span>
            </div>
            {/* deliv price */}
            {
                data.is_delivery === 1 &&
                <div className='deliv-price'>
                    <span className="text">{t('supplier.delivPrice')}</span>
                    <span className='price'>{Number(data.delivery_price).toFixed(2)} DT</span>
                </div>
            }
            {/* products discriptions */}
            <ul className="products-list">
                {(data.products && data.products.length > 0) &&
                    data.products.map((product: any, index: number) => {
                        return (
                            <li key={index}>
                                <div className='product'>
                                    <div className='product-info'>
                                        <span className='product-name'>{product.name}</span>
                                        <span className='product-qt'>X{product.quantity}</span>
                                    </div>
                                    <span className='product-value'>{(product.price * product.quantity).toFixed(2)} DT</span>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
            <hr />

            <h3 className='title'>{t('cart.payment.payment')}</h3>
            {/* payment methode */}

            <div className='payment-methode'>

                <span>
                    {data.mode_pay === 1 ? t('cartPage.espece') : t('cartPage.bankPay')}
                </span>
            </div>
            {/* tax section */}
            {
                (tax > 0) && (
                    <div className='tax'>
                        <span >{t('orderTrackingPage.BankTaxes')}</span>
                        <span className='left-price'>-{tax.toFixed(2)} dt</span>
                    </div>
                )
            }
            {/* bonus discount */}
            {
                (data.bonus > 0) && (
                    <div className='bonus'>
                        <span>Bonus</span>
                        <span className='left-price'>-{(data.bonus / 1000).toFixed(2)} dt</span>
                    </div>
                )
            }

            {/* gift discount */}
            {
                data.gift_ammount > 0 && (
                    <div className='repas'>
                        <span>{t('repasGratuit')}</span>
                        <span className='left-price'>-{(data.gift_ammount / 1000).toFixed(2)} dt</span>
                    </div>
                )
            }
            {/* code promo discount */}
            {
                data.total_price_coupon > 0 && (
                    <div className='promo'>
                        <span>Code promo</span>
                        <span className='left-price'>-{(data.total_price_coupon).toFixed(2)} dt</span>
                    </div>
                )
            }
            {/* deliv price */}
            <button className='cancel-btn' onClick={handleConfrmModal}>{t('profile.commands.annuler')}</button>
            {
                showCancleConfirm && (

                    <WarnPopup close={handleConfrmModal} accept={() => dropCommand(data.command_id)} closeButtonText={t('Annuler')} confirmButtonText={t('delete')} message={t('profile.commands.annuler.warnMessage')} />
                )
            }
        </div>
    )

}

const CurrentCommands: React.FC<CommandsListProps> = ({ removeCommand, goToPassedCommands, data}) => {

    const { t } = useTranslation()
    const [commandData, setCommandData] = useState<any>(data)
    const [status, setStatus] = useState<number>(0)
    const [messsage, setMessage] = useState<string>('')
    const [time, setTime] = useState<string>('')
    const [date, setDate] = useState<string>('')
    const [problemPopup, setProblemPopup] = useState<boolean>(false)

    const supplier = commandData.supplier
    const delivery = commandData.delivery
    const toAdress = commandData.to_adresse
    const cycle = commandData.cycle
    const isReady = commandData.is_ready
    const isDelevery = commandData.is_delivery
    const take_away_date = commandData.take_away_date
    const lat = supplier.localisation.lat;
    const long = supplier.localisation.long;
    const position = supplier.street + " " + supplier.region + " " + supplier.city

    const id = data.id    

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

    const getProgressDescription = (cycle: string): { message: string, status: number, color: string } => {
        switch (cycle) {
        case 'PENDING':
            return {
            message: t('profile.commands.acceptation'),
            status: 1,
            color:'#E77F76'
            };
        case 'VERIFY':
            return {
            message: t('profile.commands.acceptation'),
            status: 2,
            color:'#E77F76'
            };
        case 'AUTHORIZED':
            return {
            message: t('profile.commands.prépaartion'),
            status: 3,
            color:'#F2C525'
            };
        case 'PRE_ASSIGN_ADMIN':
            return {
            message: t('profile.commands.prépaartion'),
            status: 4,
            color:'#F2C525'
            };
        case 'PRE_ASSIGN':
            return {
            message: t('profile.commands.prépaartion'),
            status: 4,
            color: '#F2C525'
            };
        case 'ASSIGNED':
            return {
            message: t('profile.commands.prépaartion'),
            status: 5,
            color:'#F2C525'
            };
        case 'INPROGRESS':
            return {
            message: t('profile.commands.livraison'),
            status: 6,
            color:'#3BB3C4'
            };
        default:
            return {
            message: '',
            status: -1,
            color:'#E77F76'
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
        const { message, status } = isReady ? {
            message: t('orderTrackingPage.isReady'),
            status: 6
        } : getProgressDescription(cycle)
        setStatus(status)
        setMessage(message)
    }, [commandData])

    useEffect(() => {
        const { message, status } = isReady ? {
            message: t('orderTrackingPage.isReady'),
            status: 6
        } : getProgressDescription(cycle)
        setStatus(status)
        setMessage(message)
    }, [])

    const commanddata: CommandProps = {
        removeCommand: removeCommand,
        data: {
            command_id: id,
            delivery_price: commandData.delivery_price,
            products: commandData.products,
            total_price: commandData.total_price,
            bonus: commandData.bonus,
            gift_ammount: Number(commandData.gift_ammount),
            total_price_coupon: Number(commandData.total_price_coupon),
            mode_pay: commandData.mode_pay,
            coupon: commandData.coupon,
            is_delivery: isDelevery,
        }
    }

    useEffect(() => {
        console.log('supplier :', supplier)
        console.log('image :   ', supplier.images[0].path)
    }, [supplier])

    return (
        <>
            <div className="current-commands-container">
                <header className={`current-command-header`}>
                    <div className="current-command-img">
                        <img src={supplier.images[1].path} loading="lazy" alt="supplier background" />
                    </div>
                    <div className="current-command_desc">
                        <div className='supplier-info'>
                            <div className="supplier-info_img">
                                <img src={`${supplier.images[0].path}`}  alt="supplier logo" />
                            </div>
                            <div className='name-rate'>
                                <p className='supplier-name'>{supplier.name}</p>
                                {(supplier.star && supplier.star > 0) && <p className='supplier-rates'><StarIcon className='rate-icon' /> {supplier.star.toFixed(1)}</p>}
                            </div>
                            <button className="btn btn-get-location"></button>
                        </div>
                        <div className='command-info'>
                            <p className="title" style={{color: getProgressDescription(cycle).color}}>{messsage}</p>
                            {
                                status <= 2 && <p className="description">{t('profile.commands.sousMessage')}</p>
                            }
                            {
                                status > 2 && status < 6 && !isReady && <p className="description">{t('profile.commands.sousMessage2')}</p>
                            }
                            {
                                status == 6 && isDelevery && isReady ? <p className="description">{t('profile.commands.sousMessage3')}</p> : !isDelevery && isReady ? <p className="description">{t('orderTrackingPage.importedReady')}</p> : <></>
                            }
                        </div>
                    </div>
                    
                </header>
                <main className={`current-command-main `}>
                    
                    <div className='command-info'>
                        <div className='command-graph'>
                            <div className='time-line'></div>
                            <img loading="lazy" src={(status === 1 || status === 2) ? traitementA : traitementD} alt="traitement logo" className='traitement-logo' />
                            <img loading="lazy" src={(status <= 5 && status > 2) ? preparatinA : preparatinD} alt="preparation logo" className='preparation-logo' />
                            {
                                isDelevery === 1 ? (
                                    <img loading="lazy" src={(status === 6) ? delivA : delivD} alt="deliv logo" className='deliv-logo' />

                                ) : (
                                    <img loading="lazy" src={(status === 6) ? doneA : doneD} alt="deliv logo" className='deliv-logo' />

                                )
                            }
                        </div>
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
                                                    <img loading="lazy" src={(delivery && delivery.image.path) ? delivery.image.path : defaultImage} alt="supplier image" />
                                                    <div className='delivery-info'>
                                                        <p className="title">{t('profile.commands.votreLiv')}</p>
                                                        <p className="name">{(delivery && delivery.name) ? delivery.name : "Med Fendri"}</p>
                                                        <p className="rate"><StarIcon className='rate-icon' /> {(delivery && delivery.star && delivery.star > 0) ? delivery.star : ""}</p>
                                                    </div>
                                                </div>
                                                <hr />
                                            </>
                                        )
                                    }
                                    {
                                        (status <= 6 && status > 2) && (

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
                            ) : status > 2 && (
                                <>
                                    <div className="buttons">
                                        <button className='lieu-button' onClick={openGoogleMap}> <span className='position-icon' style={{ backgroundImage: `url(${positionIconBlue})` }}></span> {t('profile.commands.lieu')}</button>
                                        {
                                            status == 6 && (

                                                <button className='recup-btn'>{t('profile.commands.recupere')}</button>
                                            )
                                        }

                                    </div>
                                    <hr />
                                    <div className='import-position'>
                                        <div className='position-icon' style={{ backgroundImage: `url(${positionIcon}) ` }}></div>
                                        <p className='position-text' > {toAdress}</p>
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
                        status == 6 && isDelevery ? (
                            <div className='buttons'>
                                <button className="problem" onClick={handleProblemPopup}>{t('profile.commands.problem')}</button>
                            </div>
                        ) : <></>
                    }
                    {status != 6 ? <CommandsFooter /> : <></>}
                </main>
            </div>

            {
                problemPopup &&
                <SignaleProblem command_id={id} action={submitProblem} close={handleProblemPopup} />
            }
        </>

    )
}



export default CurrentCommands;
