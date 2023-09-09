import { Button } from '@mui/material';
import './menuOptions.scss'
import { Add as AddIcon, Star } from '@mui/icons-material';
import { useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../Redux/store';
import { RootState } from '../../../Redux/slices';
import { addItem, setDeliveryPrice, setSupplier } from '../../../Redux/slices/cart/cartSlice';
import { localStorageService } from '../../../services/localStorageService';
import { productService } from '../../../services/api/product.api';
import { toast } from 'react-toastify';

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { Option } from '../../../services/types';

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

function MenuOptions() {

    const { t } = useTranslation();

    const [productCount, setProductCount] = useState<number>(1);
    const [product, setProduct] = useState<any>([])

    const [state, dispatch] = useReducer(reducer, initialState);

    const usedispatch = useAppDispatch();

    const location = useLocation();
    const restaurant = location.state.restaurant;
    const { items } = useSelector((state: RootState) => state.cart);
    const cartItems = useAppSelector((state) => state.cart.items);
    const selectedMenuItem = useAppSelector((state) => state.restaurant.product);

    const getProduct = async () => {
        try {
            const { status, data } = await productService.getProduct(selectedMenuItem?.id);
            if (status === 200) {
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
        } catch (error: any) {
        } finally {
        }
    };

    useEffect(() => {
        getProduct();
        console.log(restaurant)
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
    const selectExtra = (index: number, event: any) => {
        if (state.extra_max.max !== -1 && event.target.checked == true) {
            let opts = [];
            let extra = state.extra.filter((item: any) => item.checked === true)
            extra.length > 0 && opts.push(extra);
            if (opts.length >= state.extra_max.max) {
                event.target.checked = false;
                return true;
            }
        }
        state.extra[index].checked = event.target.checked;
        calculateTotal();
    }

    const selectSauce = (index: number, event: any) => {
        let ok = true;
        if (state.sauce_max.max !== -1 && event.target.checked == true) {
            let opts = [];
            let sauce = state.sauce.filter((item: any) => item.checked === true)
            sauce.legth > 0 && opts.push(sauce);
            if (opts.length >= state.sauce_max.max) {
                event.target.checked = false;
                ok = false
            }
        }
        if (ok) {
            state.sauce[index].checked = event.target.checked;
            calculateTotal();
        }
    }

    const selectViande = (index: number, event: any) => {
        let ok = true;
        if (state.viande_max.max !== -1 && event.target.checked == true) {
            let opts = [];
            let viande = state.viande.filter((item: any) => item.checked === true)
            viande.legth > 0 && opts.push(viande);
            if (opts.length >= state.viande_max.max) {
                event.target.checked = false;
                ok = false
            }
        }
        if (ok) {
            state.viande[index].checked = event.target.checked;
            calculateTotal();
        }
    }

    const selectSupp = (index: number, event: any) => {

        if (state.supplement_max.max !== -1 && event.target.checked == true) {
            let opts = [];
            let suppls = state.supplement.filter((item: any) => item.checked === true)
            suppls.length > 0 && opts.push(suppls);
            if (opts.length >= state.supplement_max.max) {
                event.target.checked = false;
                return true;
            }
        }
        state.supplement[index].checked = event.target.checked;
        calculateTotal();
    }

    const selectFree = (index: number, event: any) => {
        state.free[index].checked = event.target.checked;
    }

    const selectPack = (index: number, event: any) => {
        state.packet?.forEach((item: any) => item.checked = false);
        state.packet[index].checked = event.target.checked;
        calculateTotal();
    }

    const selectPate = (index: number, event: any) => {
        state.pate?.forEach((item: any) => item.checked = false);
        state.pate[index].checked = event.target.checked;
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
                window.scrollTo({ top: 10, behavior: 'smooth' });
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
            toast.warn("you have allready selected items")
            return;
        }
        usedispatch(setDeliveryPrice(restaurant.delivery_price));
        usedispatch(setSupplier(restaurant));
        localStorageService.setSupplier(restaurant);
        localStorageService.setBonus(restaurant.bonus);
        usedispatch(addItem(obj));
    }

    useEffect(() => {
        localStorageService.setCart(cartItems)
    }, [cartItems])

    useEffect(() => {
        calculateTotal()
    }, [productCount])

    return (
        <div className="menue-options-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content-image">
                <div className="modal-content-image-inner"
                    style={{ backgroundImage: `url(${selectedMenuItem?.image[0]?.path})`, }}>
                </div>
            </div>
            <div className="modal-content-options">
                <div className="options-info">
                    <h5 className="menu-title">
                        {selectedMenuItem?.name}
                    </h5>
                    <h6 className='menu-price'>
                        A partir de {selectedMenuItem?.price}
                    </h6>
                    <p className='menu-description'>
                        {selectedMenuItem?.description}
                    </p>
                </div>
                {state.optionslist.length === 0 ? (
                    <>
                        <h6 className="no-options-needed">
                            {t('no_options_needed')}
                        </h6>

                        <Button
                            variant='contained'
                            color='primary'
                            startIcon={<AddIcon />}
                            className="add-to-cart-button"
                            onClick={() => {
                                addToCart()
                            }}>
                            {t('add_to_cart')}
                        </Button>
                    </>
                ) : (
                    <div className="menu-options">
                        {/* pate options */}
                        {state.pate.length > 0 && (
                            <>
                                <div className='menu-options-header'>
                                    <div className="option-name">Choisissez votre pate</div>
                                </div>
                                <form>
                                    {state.pate.map((option: any, index: number) => (
                                        <div key={option.id} className="options-list">
                                            <div className="checkBox">
                                                <input type='checkbox' name={option.id} id={option.id} value={option.id || ''} onChange={(e) => selectPate(index, e)} checked={option?.checked}>
                                                </input>
                                                <div className="custom-checkbox"></div>
                                                <label htmlFor={option.id}>{option.name} </label>
                                            </div>
                                            <span className='option-price'>{option.price} DT</span>
                                        </div>
                                    ))}
                                </form>
                            </>
                        )}
                        {/* packet options */}
                        {state.packet.length > 0 && (
                            <>
                                <div className='menu-options-header'>
                                    <div className="option-name">Choisissez votre packet</div>
                                    <div className="option-obligatoir">Obligatoire</div>
                                </div>
                                <form>
                                    {state.packet.map((option: any, index: number) => (
                                        <div key={option.id} className="options-list">
                                            <div className="checkBox">
                                                <input type='checkbox'
                                                    name={option.id}
                                                    id={option.id}
                                                    value={option.id || ''}
                                                    onChange={(e) => selectPack(index, e)}
                                                    checked={option?.checked}
                                                >
                                                </input>
                                                <div className="custom-checkbox"></div>
                                                <label htmlFor={option.id}>{option.name} </label>
                                            </div>
                                            <span className='option-price'>{option.price} DT</span>
                                        </div>
                                    ))}
                                </form>
                            </>
                        )}
                        {/* supplement options */}
                        {state.supplement.length > 0 && (
                            <>
                                <div className='menu-options-header'>
                                    <div className="option-name">Choisissez votre supplement</div>
                                    {/* <div className="option-obligatoir">{"MAX " + state.supplement_max?.max}</div> */}
                                </div>
                                <form>
                                    {state.supplement.map((option: any, index: number) => (
                                        <div key={option.id} className="options-list">
                                            <div className="checkBox">
                                                <input type='checkbox'
                                                    name={option.id}
                                                    id={option.id}
                                                    value={option.id || ''}
                                                    checked={option?.checked}
                                                    onChange={(e) => selectSupp(index, e)}
                                                >
                                                </input>
                                                <div className="custom-checkbox"></div>
                                                <label htmlFor={option.id}>{option.name} </label>
                                            </div>
                                            <span className='option-price'>{option.price} DT</span>
                                        </div>
                                    ))}
                                </form>
                            </>
                        )}
                        {/* sauce options */}
                        {state.sauce.length > 0 && (
                            <>
                                <div className='menu-options-header'>
                                    <div className="option-name">Choisissez votre sauce</div>
                                    {
                                        state.sauce_max?.max > 0 &&
                                        <div className="option-max">{"MAX " + state.sauce_max?.max}</div>
                                    }
                                </div>
                                <form>
                                    {state.sauce.map((option: any, index: number) => (
                                        <div key={option.id} className="options-list">
                                            <div className="checkBox">
                                                <input type='checkbox'
                                                    name={option.id}
                                                    id={option.id}
                                                    value={option.id || ''}
                                                    checked={option?.checked}
                                                    onChange={(e) => selectSauce(index, e)}
                                                >
                                                </input>
                                                <div className="custom-checkbox"></div>
                                                <label htmlFor={option.id}>{option.name} </label>
                                            </div>
                                            <span className='option-price'>{option.price} DT</span>
                                        </div>
                                    ))}
                                </form>
                            </>
                        )}
                        {/* viande options */}
                        {state.viande.length > 0 && (
                            <>
                                <div className='menu-options-header'>
                                    <div className="option-name">Choisissez votre viande</div>
                                    {
                                        state.viande_max?.max > 0 &&
                                        <div className="option-max">{"MAX " + state.viande_max?.max}</div>
                                    }
                                </div>
                                <form>
                                    {state.viande.map((option: any, index: number) => (
                                        <div key={option.id} className="options-list">
                                            <div className="checkBox">
                                                <input type='checkbox'
                                                    name={option.id}
                                                    id={option.id}
                                                    value={option.id || ''}
                                                    checked={option?.checked}
                                                    onChange={(e) => selectViande(index, e)}
                                                >
                                                </input>
                                                <div className="custom-checkbox"></div>
                                                <label htmlFor={option.id}>{option.name} </label>
                                            </div>
                                            <span className='option-price'>{option.price} DT</span>
                                        </div>
                                    ))}
                                </form>
                            </>
                        )}
                        {/* extra options */}
                        {state.extra.length > 0 && (
                            <>
                                <div className='menu-options-header'>
                                    <div className="option-name">Choisissez votre extra</div>
                                    {
                                        state.extra_max?.max > 0 &&
                                        <div className="option-max">{"MAX " + state.extra_max?.max}</div>
                                    }
                                </div>
                                <form>
                                    {state.extra.map((option: any, index: number) => (
                                        <div key={option.id} className="options-list">
                                            <div className="checkBox">
                                                <input type='checkbox'
                                                    name={option.id}
                                                    id={option.id}
                                                    value={option.id || ''}
                                                    checked={option?.checked}
                                                    onChange={(e) => selectExtra(index, e)}

                                                >
                                                </input>
                                                <div className="custom-checkbox"></div>
                                                <label htmlFor={option.id}>{option.name} </label>
                                            </div>
                                            <span className='option-price'>{option.price} DT</span>
                                        </div>
                                    ))}
                                </form>
                            </>
                        )}
                        {/* free options */}
                        {state.free.length > 0 && (
                            <>
                                <div className='menu-options-header'>
                                    <div className="option-name">Free</div>
                                </div>

                                <form>
                                    {state.free.map((option: any, index: number) => (
                                        <div key={option.id} className="options-list">
                                            <div className="checkBox">

                                                <input type='checkbox'
                                                    name={option.id}
                                                    id={option.id}
                                                    value={option.id || ''}
                                                    onChange={(e) => selectFree(index, e)}
                                                    checked={option?.checked}

                                                >
                                                </input>
                                                <div className="custom-checkbox"></div>
                                                <label htmlFor={option.id}>{option.name} </label>
                                            </div>
                                            <span className='option-price'>{option.price} DT</span>

                                        </div>
                                    ))}
                                </form>
                            </>
                        )}
                    </div >
                )}

                <div className="buttons">
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

                    <button className="add-to-cart-button" onClick={() => { addToCart() }}>
                        <ShoppingCartOutlinedIcon className='cart-icon' />
                        {t('add_to_cart')}
                    </button>

                </div>
            </div>
        </div>
    )
}

export default MenuOptions