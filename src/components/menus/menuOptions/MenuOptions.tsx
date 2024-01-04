import React, { RefObject, useEffect, useReducer, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Add as AddIcon, Star } from '@mui/icons-material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { userService } from "../../../services/api/user.api";
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Skeleton from "@mui/material/Skeleton";
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
import {  Option, Restaurant } from '../../../services/types';
import { scrollToTop } from '../../../utils/utils';

import { fetchMessages } from '../../../Redux/slices/messanger';
import MessangerBtnIcon from '../../../assets/profile/Discuter/messanger-btn.svg';
import SupplierIcn from './../../../assets/supplier-icn.png';
import menuImg from './../../../assets/menu-1.png';
import Messanger from '../../Popups/Messanger/Messanger';
import SameSupplierWarn from '../../Popups/SameSupplierWarn/SameSupplierWarn';
import moment from 'moment';
import ActiveGiftIcon from '../../../assets/profile/ArchivedCommands/activeGift.svg';
import GiftIcon from '../../../assets/profile/ArchivedCommands/gift.svg';
import FavorIcon from '../../../assets/profile/ArchivedCommands/favor.svg';
import FavorActiveIcon from '../../../assets/profile/ArchivedCommands/favor-active.svg';
import { AppProps, MenuData } from '../../../services/types';
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
    const { id, search, productId } = useParams<{ id: string, search?: string, productId?: string }>();
    const packRef: RefObject<HTMLFormElement> = useRef(null);
    const [productCount, setProductCount] = useState<number>(1);
    const [allContent, setAllContent] = useState<any[]>(initialData ? initialData.productResponse?.data.product : []);
    const [product, setProduct] = useState<any>(initialData ? initialData.productResponse?.data.product : {})
    const [supplierId, setSupplierId] = useState<number>(initialData ? initialData.productResponse?.data.product.menu[0].supplier_id : Number(id?.split('-')[0]))
    const [productSupplier, setProductSupplier] = useState<any>(initialData ? initialData.supplierResponse?.data : null)
    const [state, dispatch] = useReducer(reducer, initialState);
    const [favor, setFavor] = useState<boolean>(false)
    const usedispatch = useAppDispatch();
    const location = useLocation();
    const { items } = useSelector((state: RootState) => state.cart);
    const cartItems = useAppSelector((state) => state.cart.items);
    var ssrState: any = {};
    const [closeTime, setCloseTime] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [notSameError, setNotSameError] = useState<boolean>(false)
    const navigate = useNavigate();
    const [menuData, setMenuData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // handle messanger
    const unReadMessages = useAppSelector((state) => state.messanger.unReadedMessages)
    const [messangerPopup, setMessangerPopup] = useState<boolean>(false)
    const [unReadedQt, setUnReadedQt] = useState<number>(unReadMessages)
    const idNumber = id?.split('-')[0];
    const [categories, setCategories] = useState<any>("");
    const [isLoggedIn, setIsLoggedIn] = useState<any>(typeof window != 'undefined' ? localStorageService.getUserToken() : false);
    var currentDate = moment();
    var today = currentDate.format('ddd');
    
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
        // let locationArray = location.pathname.split('/');
        // locationArray[1] = "restaurant";
        // const newUrl = locationArray.join("/");
        // window.history.pushState({}, '', newUrl);
    }, [])

    const getSupplier = async (id: number) => {
        const { status, data } = await supplierServices.getSupplierById(id)
        if (status === 200) {
            setProductSupplier(data.data)
            let categories = data.data.categorys.map((item:any)=>item.name)?.join(' - ')
            setCategories(categories)            
             if (isLoggedIn?.length! > 0) {
                let favList :any = await userService.getClientFavorits(); 
                favList = favList.data.data.map((i: any) => Number(i.id))
                if (favList.includes(Number(id))) {
                    setFavor(true)
                }
                else {
                    setFavor(false)
                }
            }
        }
        
    }
    const getMenu = async () => {
        var data: any;
        try {
        if (typeof window != "undefined") {
            data = await productService.getMenu(idNumber)
            if (data.status === 200) {
                data = data.data
                let otherProducts : any[] = [];
                data.data.map((menu: any) => {
                    menu.products.map((product: any) => {
                        if (Number(product.id) !== supplierId && otherProducts.length <6) {
                            otherProducts.push(product)
                        }
                    })
                })
                setMenuData(otherProducts);
            }
        }
        else {
            data = initialData.menuResponse.data
            setMenuData(data);
        }
        } catch (error) {
        throw error
        }    
  };
    const getSupplierIsOpen = async () => {
        const { status, data } = await supplierServices.getSupplierISoPENById(supplierId)
        data.data.is_open === 1 ? setIsOpen(true) : setIsOpen(false)
    }
    useEffect(() => {
        const schedules = productSupplier ? productSupplier.schedules : []
        var currentDayObject = schedules.find((day: any) => day.day === today);
        if (currentDayObject) {
        let closeTimeArray = currentDayObject.to.toString().split(':')
        let closeTime = `${closeTimeArray[0]}:${closeTimeArray[1]}`
        setCloseTime(closeTime)
        }
    }, [productSupplier])
   
    useEffect(() => {
       fetchData()
    }, [id, search, productId]);
    const fetchData = async () => {
        setLoading(true);
        await getProduct();
        await getSupplier(supplierId);
        await getMenu()
        await getSupplierIsOpen()
        setLoading(false);
    };

    const getProduct = async () => {
        try {
            if ((typeof window != "undefined")) {

                const { status, data } = await productService.getProduct(Number(productId));
                if (status === 200) {
                    // setSupplierId(data.data.product.menu[0].supplier_id);
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
                // setSupplierId(initialData.productResponse?.data.product.menu[0].supplier_id);
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
    
    const goBack = () => {
        const updatedURL = `/restaurant/${id}/${search}/`;
        navigate(updatedURL, { replace: true });
    };
    const handleChooseOptions = (selectedMenuItem: any | null) => {  
        const prodId = selectedMenuItem.id;
        const updatedURL = `/product/${id}/${search}/${prodId}/`;
        navigate(updatedURL);
    };
    useEffect(() => {
        scrollToTop()
    }, [id, search, productId])
    const handleFavorsAdd = async () => {
    const response = await userService.addfavorite(Number(idNumber))
    response.data.success && setFavor(true)
  }
  const deletefavorite = async () => {
    const response = await userService.deletefavorite(Number(idNumber))
    response.data.success && setFavor(false)
  }
  const updatefavorite = () => {
    if (favor) {
      deletefavorite()
    }
    else {
      handleFavorsAdd();
    }
  }
  const getTruncatedName = (name: string, MAX_NAME_LENGTH: number) => {
    return name.length > MAX_NAME_LENGTH
      ? `${name.slice(0, MAX_NAME_LENGTH)}...`
      : name;
  };
    return (        
               
        <div className="menue-options-container" onClick={(e) => e.stopPropagation()}>

            <Container>
                <div className="btn-back-blc">
                    <Button className="btn-back" variant="link" onClick={goBack}>Retour</Button>
                </div>
                {
                    loading ?
                        <>
                            <div className='loading-container'>
                                <Skeleton
                                    variant="rectangular"
                                    width={'100%'}
                                    height={271}
                                />                            
                            </div>
                            <div className='loading-menu-container'>
                                <Skeleton
                                    variant="rectangular"
                                    width={'50%'}
                                    height={945}
                                />                            
                                <div className="right-loaders">                                    
                                    <Skeleton
                                        variant="rectangular"
                                        width={'50%'}
                                        height={22}
                                    /> 
                                    <Skeleton
                                        variant="rectangular"
                                        width={'50%'}
                                        height={10}
                                    /> 
                                    <Skeleton
                                        variant="rectangular"
                                        width={'50%'}
                                        height={10}
                                        style={{marginBottom: 20,borderRadius:10}}
                                    /> 
                                    {[...Array(3)].map((_, index) => (
                                        <>
                                            <Skeleton
                                                variant="rectangular"
                                                width={'100%'}
                                                height={49}
                                                style={{backgroundColor: '#3BB3C480',borderRadius:10, marginTop: 50}}
                                            /> 
                                            {[...Array(3)].map((_, index) => (
                                                <>
                                                    <Skeleton
                                                        variant="rectangular"
                                                        width={'100%'}
                                                        height={22}
                                                    />                                              
                                                </>
                                            ))} 
                                        </>
                                    ))}                                                                                                       
                                </div>
                            </div>
                        </>                        
                    :
                    <>
                        <div className="supplier-details-header">
                            <div className="supplier-title-area">
                                <div className="supplier-logo">
                                    <img src={productSupplier?.images[0].pivot.type === "principal" ? productSupplier?.images[0].path : productSupplier?.images[1].path} alt="supplier icn" />
                                </div>
                                <div className="supplier-title-blc">
                                    <h1 className="supplier-title">{productSupplier?.name}</h1>
                                    <p className="supplier-desc">{categories}</p>
                                </div>
                                <div className="supplier-infos_ratings-count">                    
                                    <div className='rate-gouping'>
                                        { isLoggedIn ?
                                        <div className="favor" style={(favor) ? { backgroundImage: `url(${FavorActiveIcon})` } : { backgroundImage: `url(${FavorIcon})` }} onClick={updatefavorite}>
                                        </div> : ""
                                        }   
                                        {
                                        productSupplier?.bonus ? (
                                            <div className='gift-icon' style={(productSupplier?.bonus > 0) ? { backgroundImage: `url(${ActiveGiftIcon})` } : { backgroundImage: `url(${GiftIcon})` }}></div>
                                        ) : (
                                            <div className='gift-icon' style={{ backgroundImage: `url(${GiftIcon})` }}></div>
                                        )
                                        }
                                    </div>
                                    <div className="stars">
                                        {
                                        (productSupplier?.star && (productSupplier?.star > 0)) && (<span className='star-number'> {productSupplier?.star}</span>)
                                        }
                                        {[...Array(5)].map((_, index) => (
                                        <span key={index + 1}>                          
                                            {(productSupplier?.star && (productSupplier?.star >= index + 1))
                                            ? <Star className='starIcon' style={{ visibility: 'visible' }} /> : <StarBorderIcon className='starIcon'  style={{ visibility: 'visible' }} />  
                                            }
                                        </span>
                                        ))}                     
                                    </div> 
                                </div>
                                </div>
                            <div className="supplier-infos_list">
                                <ul>
                                    <li>
                                        <p className="supplier-infos_list-item location">
                                            {productSupplier?.city +' '+productSupplier?.street+' '+productSupplier?.postcode}
                                        </p>
                                    </li>
                                    <li>
                                        <p  className={`supplier-infos_list-item time-work ${isOpen ? 'open': 'close'}`}>
                                            {
                                                isOpen ?
                                                <span>{t("supplier.opentime")} {closeTime}</span>
                                                :
                                                <span>{t("closed")}</span>
                                            }
                                        </p>
                                    </li>
                                    <li>
                                        <p className="supplier-infos_list-item shipping-cost">Frais de livraison: {productSupplier?.delivery_price} Dt</p>
                                    </li>
                                    <li>
                                        <div className="time">{`${Number(productSupplier?.medium_time) - 10}-${Number(productSupplier?.medium_time + 10)}min`}</div>
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
                                                                        <label htmlFor={option.id} className="custom-checkbox"></label>
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
                            {
                                menuData.length ?
                                    <>
                                        <div className="menu-grid">
                                            {
                                                menuData.map((product) => (
                                                    <div className="product-card">
                                                        <div className="info-container">
                                                            <h4 className="product-title">{getTruncatedName(product.name, 10)}</h4>
                                                            <p className="product-price">{`${t('price')}: ${Math.round(product.price)} DT`}</p>
                                                            <p className="product-description">
                                                                <p>{product.name}</p>
                                                            </p>
                                                            <div className="labels-container"></div>
                                                            <button className="product-button"  onClick={() => {
                                                                handleChooseOptions(product);
                                                            }}>
                                                                <AddIcon className="product-button-icon" />
                                                            </button>
                                                        </div>
                                                        <div className="product-image-blc">
                                                            <img loading="lazy" src={
                                                                product.image[0]?.path ?
                                                                    product.image[0]?.path :
                                                                    productSupplier?.images[0].pivot.type === "principal" ?
                                                                    productSupplier?.images[0].path :
                                                                    productSupplier?.images[1].path
                                                                } alt='product photo' className="product-image" />
                                                        </div>
                                                    </div>  
                                                ))
                                            }                                                         
                                        </div> 
                                    </>
                                : ''
                            }                    
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
                    </>
                }
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