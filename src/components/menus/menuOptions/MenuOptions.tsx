import React, { RefObject, useEffect, useReducer, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RootState } from '../../../Redux/slices';
import { addItem, setDeliveryPrice, setSupplier } from '../../../Redux/slices/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '../../../Redux/store';
import { productService } from '../../../services/api/product.api';
import { Container, Button } from 'react-bootstrap';
// import { toast } from 'react-toastify';
import './menuOptions.scss';

import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { supplierServices } from '../../../services/api/suppliers.api';
import { localStorageService } from '../../../services/localStorageService';
import { AppProps, Option, Restaurant } from '../../../services/types';

import { fetchMessages } from '../../../Redux/slices/messanger';
import MessangerBtnIcon from '../../../assets/profile/Discuter/messanger-btn.svg';
import SupplierIcn from './../../../assets/supplier-icn.png';
import menuImg from './../../../assets/menu-1.png';
import Messanger from '../../Popups/Messanger/Messanger';
import SameSupplierWarn from '../../Popups/SameSupplierWarn/SameSupplierWarn';

// Define the initial state
const initialState = {
    optionslist: [],
    packet: [],
    free: [],
    extra: [],
    pate: [],
    sauce: [],
    viande: [],
    supplement: [],
    total: 0,
    unitPrice: 0,
    extra_max: 0,
    sauce_max: 0,
    supplement_max: 0,
    viande_max: 0,
};

// Reducer function
const reducer = (state: any, action: any) => {
    switch (action.type) {
        case 'DISPATCH_ALL':
            return { ...state, state: action.payload };
        case 'SET_UNITPRICE':
            return { ...state, unitPrice: action.payload };
        case 'SET_TOTAL':
            return { ...state, total: action.payload };
        case 'SET_OPTIONS':
            return { ...state, optionslist: action.payload };
        case 'SET_PACKET':
            return { ...state, packet: action.payload };
        case 'SET_FREE':
            return { ...state, free: action.payload };
        case 'SET_EXTRA':
            return { ...state, extra: action.payload };
        case 'SET_PATE':
            return { ...state, pate: action.payload };
        case 'SET_SAUCE':
            return { ...state, sauce: action.payload };
        case 'SET_VIANDE':
            return { ...state, viande: action.payload };
        case 'SET_SUPPLEMENT':
            return { ...state, supplement: action.payload };
        case 'SET_EXTRA_MAX':
            return { ...state, extra_max: action.payload };
        case 'SET_SAUCE_MAX':
            return { ...state, sauce_max: action.payload };
        case 'SET_SUPPLEMENT_MAX':
            return { ...state, supplement_max: action.payload };
        case 'SET_VIANDE_MAX':
            return { ...state, viande_max: action.payload };
        default:
            return state;
    }
};

function MenuOptions({ initialData }: AppProps) {

    const { t } = useTranslation();
    const { productId } = useParams<{ productId: string }>();
    const packRef: RefObject<HTMLFormElement> = useRef(null);
    const [productCount, setProductCount] = useState<number>(1);
    const [allContent, setAllContent] = useState<any[]>(initialData ? initialData.productResponse?.data.product : []);
    const [product, setProduct] = useState<any>(initialData ? initialData.productResponse?.data.product : {})
    const [supplierId, setSupplierId] = useState<number>(initialData ? initialData.productResponse?.data.product.menu[0].supplier_id : 0)
    const [productSupplier, setProductSupplier] = useState<Restaurant>(initialData ? initialData.supplierResponse?.data : null)
    const [state, dispatch] = useReducer(reducer, initialState);

    const usedispatch = useAppDispatch();
    const location = useLocation();
    const { items } = useSelector((state: RootState) => state.cart);
    const cartItems = useAppSelector((state) => state.cart.items);
    var ssrState: any = {};

    const [notSameError, setNotSameError] = useState<boolean>(false)

    // handle messanger
    const unReadMessages = useAppSelector((state) => state.messanger.unReadedMessages)
    const [messangerPopup, setMessangerPopup] = useState<boolean>(false)
    const [unReadedQt, setUnReadedQt] = useState<number>(unReadMessages)
    useEffect(() => {
        setUnReadedQt(unReadMessages)
    }, [unReadMessages])

    const handleMessangerPopup = () => {
        setMessangerPopup(!messangerPopup)
    }
    useEffect(() => {
        fetchMessages()
    }, [])

    /*
     *
     * url handling part
     *
     */

    useEffect(() => {
        let locationArray = location.pathname.split('/');
        locationArray[1] = "restaurant";
        const newUrl = locationArray.join("/");
        window.history.pushState({}, '', newUrl);
    }, [])

    const getSupplier = async (id: number) => {
        const { status, data } = await supplierServices.getSupplierById(id)
        status === 200 && setProductSupplier(data.data)
    }

    useEffect(() => {
        supplierId != 0 && getSupplier(supplierId)
    }, [supplierId])

    const getProduct = async () => {
        try {
            if ((typeof window != "undefined")) {

                const { status, data } = await productService.getProduct(Number(productId));
                if (status === 200) {
                    setSupplierId(data.data.product.menu[0].supplier_id);
                    setProduct(data.data.product);

                    let optionslist = data.data.product.options;
                    dispatch({ type: 'SET_OPTIONS', payload: optionslist })

                    let packet = data.data.product.options.filter((option: any) => option.type === 'pack');
                    dispatch({ type: 'SET_PACKET', payload: packet })

                    let free = data.data.product.options.filter((option: any) => option.type === 'option');
                    dispatch({ type: 'SET_FREE', payload: free })

                    let extra = data.data.product.options.filter((option: any) => option.type === 'extra');
                    dispatch({ type: 'SET_EXTRA', payload: extra })

                    let pate = data.data.product.options.filter((option: any) => option.type === 'pate');
                    dispatch({ type: 'SET_PATE', payload: pate })

                    let sauce = data.data.product.options.filter((option: any) => option.type === 'sauce');
                    dispatch({ type: 'SET_SAUCE', payload: sauce })

                    let viande = data.data.product.options.filter((option: any) => option.type === 'viande');
                    dispatch({ type: 'SET_VIANDE', payload: viande })

                    let supplement = data.data.product.options.filter((option: any) => option.type === 'supplement');
                    dispatch({ type: 'SET_SUPPLEMENT', payload: supplement })

                    let extra_max = data.data.product.options_max.filter((op: any) => op.type_option === 'extra')[0] ?? { max: -1 };
                    dispatch({ type: 'SET_EXTRA_MAX', payload: extra_max })

                    let sauce_max = data.data.product.options_max.filter((op: any) => op.type_option === 'sauce')[0] ?? { max: -1 };
                    dispatch({ type: 'SET_SAUCE_MAX', payload: sauce_max })

                    let supplement_max = data.data.product.options_max.filter((op: any) => op.type_option === 'supplement')[0] ?? { max: -1 };
                    dispatch({ type: 'SET_SUPPLEMENT_MAX', payload: supplement_max })

                    let viande_max = data.data.product.options_max.filter((op: any) => op.type_option === 'viande')[0] ?? { max: -1 };
                    dispatch({ type: 'SET_VIANDE_MAX', payload: viande_max })


                }
            } else {
                setSupplierId(initialData.productResponse?.data.product.menu[0].supplier_id);
                setProduct(initialData.productResponse?.data.product);

                let optionslist = initialData.productResponse?.data.product.options;
                dispatch({ type: 'SET_OPTIONS', payload: optionslist })

                let packet = initialData.productResponse?.data.product.options.filter((option: any) => option.type === 'pack');
                dispatch({ type: 'SET_PACKET', payload: packet })

                let free = initialData.productResponse?.data.product.options.filter((option: any) => option.type === 'option');
                dispatch({ type: 'SET_FREE', payload: free })

                let extra = initialData.productResponse?.data.product.options.filter((option: any) => option.type === 'extra');
                dispatch({ type: 'SET_EXTRA', payload: extra })

                let pate = initialData.productResponse?.data.product.options.filter((option: any) => option.type === 'pate');
                dispatch({ type: 'SET_PATE', payload: pate })

                let sauce = initialData.productResponse?.data.product.options.filter((option: any) => option.type === 'sauce');
                dispatch({ type: 'SET_SAUCE', payload: sauce })

                let viande = initialData.productResponse?.data.product.options.filter((option: any) => option.type === 'viande');
                dispatch({ type: 'SET_VIANDE', payload: viande })

                let supplement = initialData.productResponse?.data.product.options.filter((option: any) => option.type === 'supplement');
                dispatch({ type: 'SET_SUPPLEMENT', payload: supplement })

                let extra_max = initialData.productResponse?.data.product.options_max.filter((op: any) => op.type_option === 'extra')[0] ?? { max: -1 };
                dispatch({ type: 'SET_EXTRA_MAX', payload: extra_max })

                let sauce_max = initialData.productResponse?.data.product.options_max.filter((op: any) => op.type_option === 'sauce')[0] ?? { max: -1 };
                dispatch({ type: 'SET_SAUCE_MAX', payload: sauce_max })

                let supplement_max = initialData.productResponse?.data.product.options_max.filter((op: any) => op.type_option === 'supplement')[0] ?? { max: -1 };
                dispatch({ type: 'SET_SUPPLEMENT_MAX', payload: supplement_max })

                let viande_max = initialData.productResponse?.data.product.options_max.filter((op: any) => op.type_option === 'viande')[0] ?? { max: -1 };
                dispatch({ type: 'SET_VIANDE_MAX', payload: viande_max })

            }
        } catch (error: any) {
        } finally {
        }
    };

    useEffect(() => {
        getProduct();
    }, []);

    useEffect(() => {
        state.packet?.forEach((item: any) => item.checked = false);
        state.free?.forEach((item: any) => item.checked = false);
        state.extra?.forEach((item: any) => item.checked = false);
        state.supplement?.forEach((item: any) => item.checked = false);
        state.pate?.forEach((item: any) => item.checked = false);
        dispatch({ type: 'SET_TOTAL', payload: Number(product.default_price) })
        dispatch({ type: 'SET_UNITPRICE', payload: Number(product.default_price) })
        if (product.computed_value?.discount_value) {
            dispatch({ type: 'SET_UNITPRICE', payload: state.unitPrice - (state.unitPrice * (product?.computed_value?.discount_value / 100)) })
            dispatch({ type: 'SET_TOTAL', payload: state.total - (state.total * (product?.computed_value?.discount_value / 100)) })
        }
    }, [product])

    const calculateTotal = () => {
        let selectedPack = null;
        let unite_price = 0
        let sum = 0;
        if (state.packet.length > 0) {
            selectedPack = state.packet.find((item: any) => item.checked === true);
        }
        if (selectedPack) {
            unite_price = Number(selectedPack.price);
        }
        else {

            unite_price = Number(product.default_price);

        }

        state.extra.forEach((item: any) => {
            if (item.checked) {
                sum = sum + Number(item.price);
            }
        });
        unite_price = unite_price + sum;
        sum = 0;
        state.pate.forEach((item: any) => {
            if (item.checked) {
                sum = sum + Number(item.price);
            }
        });
        unite_price = unite_price + sum;
        sum = 0;
        state.sauce.forEach((item: any) => {
            if (item.checked) {
                sum = sum + Number(item.price);
            }
        });
        unite_price = unite_price + sum;
        sum = 0;
        state.viande.forEach((item: any) => {
            if (item.checked) {
                sum = sum + Number(item.price);
            }
        });
        unite_price = unite_price + sum;

        if (product?.computed_value?.discount_value) {
            unite_price = unite_price - (unite_price * (product?.computed_value?.discount_value / 100));
        }

        dispatch({ type: 'SET_UNITPRICE', payload: unite_price });
        dispatch({ type: 'SET_TOTAL', payload: unite_price * productCount })
    }

    const selectOption = (type: string, index: number, event: any) => {
        allContent.map((option) => {
            if (Object.keys(option)[0] === type) {
                const updatedOption = { ...option };
                var max = -1;
                switch (type) {
                    case 'viande':
                        max = state.viande_max.max
                        break;

                    case 'sauce':
                        max = state.sauce_max.max
                        break;

                    case 'extra':
                        max = state.extra_max.max
                        break;
                    case 'supplement':
                        max = state.supplement_max.max
                        break;

                    default:
                        break;
                }
                if (!((type == "pate") || (type == 'packet' || (type == 'free')))) {
                    let ok = true;
                    if (max !== -1 && event.target.checked == true) {
                        let opts = [];
                        let max_selected = updatedOption[type].filter((item: any) => item.checked === true)
                        max_selected.legth > 0 && opts.push(max_selected);
                        if (max_selected.length >= max) {
                            event.target.checked = false;
                            ok = false
                        }
                    }
                    if (ok) {
                        updatedOption[type][index].checked = event.target.checked;
                    }
                } else if ((type == "pate") || (type == 'packet')) {
                    updatedOption[type].forEach((item: any) => item.checked = false);
                    updatedOption[type][index].checked = event.target.checked;
                } else {
                    updatedOption[type][index].checked = event.target.checked;

                }
                return updatedOption; // Return the updated object
            }

            return option; // Return unchanged objects
        });

        // setDisplayedContent(newContent)
        calculateTotal();
    }

    const handleCount = (type: string) => {
        if (type === "add") setProductCount((current) => current + 1)
        if ((type === "remove") && (productCount > 1)) setProductCount((current) => current - 1)
    }

    useEffect(() => {
        const allContent = []
        state.packet.length > 0 && state.packet?.forEach((item: any) => item.checked = false)
        state.free.length > 0 && state.free?.forEach((item: any) => item.checked = false);
        state.extra.length > 0 && state.extra?.forEach((item: any) => item.checked = false);
        state.supplement.length > 0 && state.supplement?.forEach((item: any) => item.checked = false);
        state.pate.length > 0 && state.pate?.forEach((item: any) => item.checked = false);
        state.viande.length > 0 && state.viande?.forEach((item: any) => item.checked = false);
        state.sauce.length > 0 && state.sauce?.forEach((item: any) => item.checked = false);
        state.packet.length > 0 && allContent.push({ packet: state.packet });
        state.extra.length > 0 && allContent.push({ extra: state.extra });
        state.supplement.length > 0 && allContent.push({ supplement: state.supplement });
        state.pate.length > 0 && allContent.push({ pate: state.pate });
        state.sauce.length > 0 && allContent.push({ sauce: state.sauce });
        state.viande.length > 0 && allContent.push({ viande: state.viande });
        state.free.length > 0 && allContent.push({ free: state.free });
        setAllContent(allContent)

        dispatch({ type: 'SET_TOTAL', payload: Number(product.default_price) })
        dispatch({ type: 'SET_UNITPRICE', payload: Number(product.default_price) })
        if (product.computed_value?.discount_value) {
            dispatch({ type: 'SET_UNITPRICE', payload: state.unitPrice - (state.unitPrice * (product?.computed_value?.discount_value / 100)) })
            dispatch({ type: 'SET_TOTAL', payload: state.total - (state.total * (product?.computed_value?.discount_value / 100)) })
        }
    }, [product])

    const addToCart = () => {
        let opts: Option[] = [];
        let extra = state.extra.filter((item: any) => item.checked === true)
        extra.length > 0 && opts.push(extra);

        let free = state.free.filter((item: any) => item.checked === true)
        free.length > 0 && opts.push(free);

        let pate = state.pate.filter((item: any) => item.checked === true)
        pate.length > 0 && opts.push(pate);

        let supplement = state.supplement.filter((item: any) => item.checked === true)
        supplement.length > 0 && opts.push(supplement);

        let sauce = state.sauce.filter((item: any) => item.checked === true)
        sauce.length > 0 && opts.push(sauce);

        let viande = state.viande.filter((item: any) => item.checked === true)
        viande.length > 0 && opts.push(viande);

        let packs = state.packet.filter((item: any) => item.checked === true)
        packs.length > 0 && opts.push(packs);
        if (state.packet.length > 0) {
            if (packs.length <= 0) {
                packRef.current && packRef.current.scrollIntoView({ behavior: 'smooth' });
                return false;
            }
        }

        const obj: any = {
            product: product,
            options: opts,
            quantity: productCount,
            total: state.total,
            supplier_data: {
                supplier_id: productSupplier!.id,
                supplier_name: productSupplier!.name,
                delivery_price: productSupplier!.delivery_price,
            },
            unitePrice: Number(state.unitPrice)
        };

        if (items.length > 0 && items[0].supplier_data.supplier_id !== obj.supplier_data.supplier_id) {
            setNotSameError(true)
            return;
        }

        toast.success("item added ")
        usedispatch(setDeliveryPrice(productSupplier!.delivery_price));
        usedispatch(setSupplier(productSupplier));
        localStorageService.setSupplier(productSupplier);
        // localStorageService.setBonus(productSupplier!.bonus);
        usedispatch(addItem(obj));
        getProduct()
    }

    useEffect(() => {
        localStorageService.setCart(cartItems)
    }, [cartItems])

    useEffect(() => {
        calculateTotal()
    }, [productCount])

    const handleSameSupplierModal = () => {
        setNotSameError(!notSameError)
    }

    return (
        <div className="menue-options-container" onClick={(e) => e.stopPropagation()}>

            <Container>
                <div className="btn-back-blc">
                    <Button className="btn-back" variant="link">Retour</Button>
                </div>

                <div className="supplier-details-header">
                    <div className="supplier-title-area">
                        <div className="supplier-logo">
                            <img src={SupplierIcn} alt="supplier icn" />
                        </div>
                        <div className="supplier-title-blc">
                            <h1 className="supplier-title">L’instant café & restaurant</h1>
                            <p className="supplier-desc">Restaurant - chiken  Grillade  hamburger  pate  pizza  sandwich  salade</p>
                        </div>
                    </div>
                    <div className="supplier-infos_list">
                        <ul>
                            <li>
                                <p className="supplier-infos_list-item location">Khzema sousse</p>
                            </li>
                            <li>
                                <p className="supplier-infos_list-item time-work">Ouvert jusqu’à 22:00 PM</p>
                            </li>
                            <li>
                                <p className="supplier-infos_list-item shipping-cost">Frais de livraison: 3 Dt</p>
                            </li>
                            <li>
                                <div className="time">1123-1143min</div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="supplier-details-body">
                    <div className="modal-content-image">
                        <div className="modal-content-image-inner"
                            style={{ backgroundImage: `url(${(product.image?.length > 0) ? product.image[0].path : productSupplier?.images[0].path})`, }}>
                        </div>
                    </div>
                    <div className="modal-content-options">
                        <div className="options-info">

                            <h2 className="menu-title" dangerouslySetInnerHTML={{ __html: product?.name }}></h2>
                            <p className='menu-price'>
                                A partir de {product.price}
                            </p>
                            <div className='menu-description' dangerouslySetInnerHTML={{ __html: product?.description }}></div>

                        </div>
                        <div className="menu-options">
                            {
                                state.optionslist.length === 0 ? (
                                    <>
                                    </>
                                ) : allContent.map((options, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <div className="menu-options-blc">
                                                <div className='menu-options-header'>
                                                    <div className="option-name">Choisissez votre {Object.keys(options)[0]}</div>
                                                    {

                                                        Object.keys(options)[0] === "packet" && <div className="option-obligatoir">Obligatoire</div>
                                                    }

                                                    {
                                                        Object.keys(options)[0] === "sauce" && state.sauce_max?.max > 0 && <div className="option-max">{"MAX " + state.sauce_max?.max}</div>
                                                    }
                                                    {
                                                        Object.keys(options)[0] === "viande" && state.viande_max?.max > 0 && <div className="option-max">{"MAX " + state.viande_max?.max}</div>
                                                    }
                                                    {
                                                        Object.keys(options)[0] === "extra" && state.extra_max?.max > 0 && <div className="option-max">{"MAX " + state.extra_max?.max}</div>
                                                    }
                                                    {
                                                        Object.keys(options)[0] === "supplement" && state.supplement_max?.max > 0 && <div className="option-max">{"MAX " + state.supplement_max?.max}</div>
                                                    }
                                                </div>
                                                <form>
                                                    {state[Object.keys(options)[0]].map((option: any, index: number) => (
                                                        <div key={index} className="options-list">
                                                            <div className="checkBox">
                                                                <input type='checkbox' name={option.id} id={option.id} value={option.id || ''} onChange={(e) => selectOption(Object.keys(options)[0], index, e)} checked={option?.checked}>
                                                                </input>
                                                                <div className="custom-checkbox"></div>
                                                                <label htmlFor={option.id}>{option.name} </label>
                                                            </div>
                                                            <span className='option-price'>{option.price} DT</span>
                                                        </div>
                                                    ))}
                                                </form>
                                            </div>
                                        </React.Fragment>)
                                })
                            }


                        </div >


                        <div className="buttons btns-group">
                            <div className="count-container">
                                <input type="number" name="product-count" id="product-count" value={productCount} onChange={(e) => { (parseInt(e.target.value) >= 1) && setProductCount(parseInt(e.target.value)) }} />
                                <div className="count-buttons">
                                    <button className="btn counter-more" onClick={() => handleCount("add")} ></button>
                                    <button className="btn counter-minus" onClick={() => handleCount("remove")} ></button>
                                </div>
                            </div>

                            <button className="add-to-cart-button" onClick={() => {
                                addToCart()
                            }}>
                                {t('add_to_cart')}
                            </button>

                        </div>
                    </div>
                </div>


                <div className="menu-container">
                    <div className="menu-title-blc">
                        <h3 className="menu-title">Produits achetés ensemble</h3>
                    </div>

                    <div className="menu-grid">
                        <div className="product-card">
                            <div className="info-container">
                                <h4 className="product-title">Lasagne Bo...</h4>
                                <p className="product-price">Prix: 13 DT</p>
                                <p className="product-description">
                                    <p>Lasagne Bolognaise</p>
                                </p>
                                <div className="labels-container"></div>
                                <button className="product-button">
                                    <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium product-button-icon css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AddIcon"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                                </button>
                            </div>
                            <div className="product-image-blc">
                                <img loading="lazy" src={menuImg} alt="product photo" className="product-image" />
                            </div>
                        </div>
                        <div className="product-card">
                            <div className="info-container">
                                <h4 className="product-title">Lasagne Bo...</h4>
                                <p className="product-price">Prix: 13 DT</p>
                                <p className="product-description">
                                    <p>Lasagne Bolognaise</p>
                                </p>
                                <div className="labels-container"></div>
                                <button className="product-button">
                                    <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium product-button-icon css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AddIcon"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                                </button>
                            </div>
                            <div className="product-image-blc">
                                <img loading="lazy" src={menuImg} alt="product photo" className="product-image" />
                            </div>
                        </div>
                        <div className="product-card">
                            <div className="info-container">
                                <h4 className="product-title">Lasagne Bo...</h4>
                                <p className="product-price">Prix: 13 DT</p>
                                <p className="product-description">
                                    <p>Lasagne Bolognaise</p>
                                </p>
                                <div className="labels-container"></div>
                                <button className="product-button">
                                    <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium product-button-icon css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AddIcon"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                                </button>
                            </div>
                            <div className="product-image-blc">
                                <img loading="lazy" src={menuImg} alt="product photo" className="product-image" />
                            </div>
                        </div>
                        <div className="product-card">
                            <div className="info-container">
                                <h4 className="product-title">Lasagne Bo...</h4>
                                <p className="product-price">Prix: 13 DT</p>
                                <p className="product-description">
                                    <p>Lasagne Bolognaise</p>
                                </p>
                                <div className="labels-container"></div>
                                <button className="product-button">
                                    <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium product-button-icon css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AddIcon"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                                </button>
                            </div>
                            <div className="product-image-blc">
                                <img loading="lazy" src={menuImg} alt="product photo" className="product-image" />
                            </div>
                        </div>
                        <div className="product-card">
                            <div className="info-container">
                                <h4 className="product-title">Lasagne Bo...</h4>
                                <p className="product-price">Prix: 13 DT</p>
                                <p className="product-description">
                                    <p>Lasagne Bolognaise</p>
                                </p>
                                <div className="labels-container"></div>
                                <button className="product-button">
                                    <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium product-button-icon css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AddIcon"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                                </button>
                            </div>
                            <div className="product-image-blc">
                                <img loading="lazy" src={menuImg} alt="product photo" className="product-image" />
                            </div>
                        </div>
                        <div className="product-card">
                            <div className="info-container">
                                <h4 className="product-title">Lasagne Bo...</h4>
                                <p className="product-price">Prix: 13 DT</p>
                                <p className="product-description">
                                    <p>Lasagne Bolognaise</p>
                                </p>
                                <div className="labels-container"></div>
                                <button className="product-button">
                                    <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium product-button-icon css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AddIcon"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                                </button>
                            </div>
                            <div className="product-image-blc">
                                <img loading="lazy" src={menuImg} alt="product photo" className="product-image" />
                            </div>
                        </div>
                    </div>


                </div>


                <div className='bulles'>
                    <button className='messanger-popup-btn' onClick={handleMessangerPopup} style={{ backgroundImage: `url(${MessangerBtnIcon})` }}>
                        {unReadedQt > 0 && (
                            <div className='messanger-bull-notif-icon'>
                                {unReadedQt}
                            </div>
                        )}
                    </button>
                    {/* <button className='phone-popup-btn' onClick={handlePhonePopup} style={{ backgroundImage: `url(${PhoneBtnIcon})` }}></button> */}
                </div>
            </Container>

            {
                messangerPopup && <Messanger className="discuter-messanger-popup" close={handleMessangerPopup} />
            }
            {
                notSameError && <SameSupplierWarn close={handleSameSupplierModal} />
            }
        </div>

    )
}

export default MenuOptions