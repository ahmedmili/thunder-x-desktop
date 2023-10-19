import React, { RefObject, Suspense, useEffect, useReducer, useRef, useState } from "react";

import './menuPopup.scss';

import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

import { CircularProgress } from '@mui/material';


import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "../../../Redux/slices";
import { addItem, setDeliveryPrice, setSupplier } from "../../../Redux/slices/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../../../Redux/store";
import { productService } from "../../../services/api/product.api";
import { localStorageService } from "../../../services/localStorageService";
import { Option } from "../../../services/types";

interface Props {
    restaurant: any;
    close: any;
    isOpen: boolean
}


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

const MenuPopup: React.FC<Props> = ({ close, restaurant }) => {

    const { t } = useTranslation();
    const packRef: RefObject<HTMLFormElement> = useRef(null);
    const itemsPerPage = 3;

    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [allContent, setAllContent] = useState<any[]>([]);
    const [displayedContent, setDisplayedContent] = useState<any[]>([]);
    const [productCount, setProductCount] = useState<number>(1);
    const [product, setProduct] = useState<any>([])

    const [state, dispatch] = useReducer(reducer, initialState);
    const [isLoading, setIsLoading] = useState(true);

    const usedispatch = useAppDispatch();

    const { items } = useSelector((state: RootState) => state.cart);
    const cartItems = useAppSelector((state) => state.cart.items);
    const selectedMenuItem = useAppSelector((state) => state.restaurant.product);



    const getProduct = async () => {
        try {
            const { status, data } = await productService.getProduct(selectedMenuItem?.id);
            if (status === 200) {
                setIsLoading(false)
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

                let viande = data.data.product.options.filter((option: any) => option.type === "viande");
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
        } catch (error: any) {
            throw (error)
        }
    };

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
        const newContent = displayedContent.map((option) => {
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

        setDisplayedContent(newContent)
        calculateTotal();
    }

    const handleCount = (type: string) => {
        if (type === "add") setProductCount((current) => current + 1)
        if ((type === "remove") && (productCount > 1)) setProductCount((current) => current - 1)
    }

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
                setCurrentPage(1)
                packRef.current && packRef.current.scrollIntoView({ behavior: 'smooth' });
                return false;
            }
        }

        const obj = {
            product: product,
            options: opts,
            quantity: productCount,
            total: state.total,
            supplier_data: {
                supplier_id: restaurant.id,
                supplier_name: restaurant.name,
                delivery_price: restaurant.delivery_price,
            },
            unitePrice: Number(state.unitPrice)

        };

        if (items.length > 0 && items[0].supplier_data.supplier_id !== obj.supplier_data.supplier_id) {
            toast.warn("you have already selected items", {
                position: toast.POSITION.TOP_CENTER, // Change the position
            });
            return;
        }
        toast.success("item added ")
        usedispatch(setDeliveryPrice(restaurant.delivery_price));
        usedispatch(setSupplier(restaurant));
        localStorageService.setSupplier(restaurant);
        localStorageService.setBonus(restaurant.bonus);
        usedispatch(addItem(obj));
        getProduct()
        setCurrentPage(1)
    }

    // handle displayed content
    const handleContent = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const displayedContent = allContent.slice(startIndex, endIndex)
        setDisplayedContent(displayedContent)
    }

    useEffect(() => {
        localStorageService.setCart(cartItems)
    }, [cartItems])

    useEffect(() => {
        calculateTotal()
    }, [productCount])

    useEffect(() => {
        getProduct();
    }, []);

    useEffect(() => {
        let totalPages: number = 1;
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

        let optionsCount: number = allContent.length;
        totalPages = Math.ceil(optionsCount / itemsPerPage)
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const displayedContent = allContent.slice(startIndex, endIndex)
        setDisplayedContent(displayedContent)
        totalPages > 0 ? setTotalPages(totalPages) : setTotalPages(1)
        setAllContent(allContent)
        dispatch({ type: 'SET_TOTAL', payload: Number(product.default_price) })
        dispatch({ type: 'SET_UNITPRICE', payload: Number(product.default_price) })
        if (product.computed_value?.discount_value) {
            dispatch({ type: 'SET_UNITPRICE', payload: state.unitPrice - (state.unitPrice * (product?.computed_value?.discount_value / 100)) })
            dispatch({ type: 'SET_TOTAL', payload: state.total - (state.total * (product?.computed_value?.discount_value / 100)) })
        }
    }, [product])


    useEffect(() => {
        handleContent()
    }, [currentPage])

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    }
    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    }

    // close popup when user click outside the box
    const handleOutsideClick = () => {
        close();
    };

    return (
        <Suspense fallback={
            <CircularProgress style={{ alignSelf: "center" }} />

        }>
            <>
                <div className="popup-overlay" onClick={handleOutsideClick}>

                </div>
                <div className="menu-popup-container">
                    <div className="popup-box">
                        <div className="modal-content-image"
                            style={{ backgroundImage: `url(${selectedMenuItem?.image[0]?.path})`, }}>
                        </div>
                        <div className="modal-content-options">
                            <div className="options-info">
                                <h5 className="menu-title" dangerouslySetInnerHTML={{ __html: selectedMenuItem?.name }}></h5>
                                <h6 className='menu-price'>
                                    A partir de {selectedMenuItem?.price}
                                </h6>
                                <p className='menu-description' dangerouslySetInnerHTML={{ __html: selectedMenuItem?.description }}></p>
                            </div>

                            {
                                isLoading && (
                                    <div className="loader">
                                        <CircularProgress style={{ alignSelf: "center" }} />
                                    </div>
                                )
                            }
                            <div className="menu-options">

                                {
                                    state.optionslist.length === 0 ? (
                                        <>
                                        </>
                                    ) : (
                                        <>
                                            {
                                                <>
                                                    {displayedContent.length > 0 && displayedContent.map((options, index) => {
                                                        return (
                                                            <>
                                                                <>
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

                                                                    <div className="devider">

                                                                    </div>
                                                                </>

                                                            </>)
                                                    })
                                                    }

                                                    <div className="prev-next-buttons">
                                                        {/* prev button */}
                                                        <span className="prev-page-button">
                                                            {!(currentPage === 1) &&
                                                                <button onClick={prevPage}>
                                                                    <ArrowRightAltIcon className="prev-page-icon" />
                                                                </button>
                                                            }
                                                        </span>
                                                        {/* next button  */}
                                                        <span className="next-page-button">
                                                            {!(currentPage === totalPages) &&
                                                                <button onClick={nextPage}>
                                                                    <ArrowRightAltIcon className="next-page-icon" />
                                                                </button>
                                                            }
                                                        </span>


                                                    </div>
                                                    {/* command buttons */}

                                                </>
                                            }

                                        </>
                                    )


                                }

                                {(currentPage === totalPages) &&

                                    <div className="buttons">
                                        {/* counting */}
                                        <div className="count-container">
                                            <input type="number" name="product-count" id="product-count" value={productCount} onChange={(e) => { (parseInt(e.target.value) >= 1) && setProductCount(parseInt(e.target.value)) }} />
                                            <div className="count-buttons">
                                                <button onClick={() => handleCount("add")} >
                                                    <KeyboardArrowUpOutlinedIcon className="count-more" />
                                                </button>
                                                <button onClick={() => handleCount("remove")} >

                                                    <KeyboardArrowDownOutlinedIcon className="count-less" />
                                                </button>
                                            </div>
                                        </div>
                                        {/* add to cart */}
                                        <button className="add-to-cart-button" onClick={() => { addToCart() }}>
                                            <ShoppingCartOutlinedIcon className='cart-icon' />
                                            {t('add_to_cart')}
                                        </button>

                                    </div>
                                }
                            </div >

                        </div>

                    </div>
                </div>
            </>
        </Suspense>
    )
}

export default MenuPopup