import React, { MouseEventHandler, useEffect, useState } from "react";
import {
  changeItemQuantity,
  clearCart,
  removeItemWithIndex,
  setCodePromo,
  setComment,
  setDeliveryPrice,
  setSupplier
} from "../../Redux/slices/cart/cartSlice";

import CartSVG from '../../assets/card-icn.svg';
import PayCashSVG from '../../assets/money-icn.svg';

import empty from '../../assets/panier/empty.png';
import scooterTransportIcn from '../../assets/panier/ondelivery-icn.svg';
import dinnerFurnitureIcn from '../../assets/panier/onthespot-icn.svg';
import bagPaperShoppingIcn from '../../assets/panier/take-away-icn.svg';

import { RootState, useAppDispatch, useAppSelector } from "../../Redux/store";

import 'react-clock/dist/Clock.css';



import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { logout } from "../../Redux/slices/userSlice";
import { FoodItem } from "../../services/types";

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { fetchMessages } from "../../Redux/slices/messanger";
import MessangerBtnIcon from '../../assets/profile/Discuter/messanger-btn.svg';
import Messanger from "../../components/Popups/Messanger/Messanger";
import MinCostError from "../../components/Popups/MinCostError/MinCostError";
import WarnPopup from "../../components/Popups/WarnPopup/WarnPopup";
import PaymentPopup from "../../components/Popups/payment/PaymentPopup";
import { LocationService } from "../../services/api/Location.api";
import { adressService } from "../../services/api/adress.api";
import { cartService } from "../../services/api/cart.api";
import { commandService } from "../../services/api/command.api";
import { supplierServices } from "../../services/api/suppliers.api";
import { userService } from "../../services/api/user.api";
import { localStorageService } from "../../services/localStorageService";
import "./cart.page.scss";
import TimePickerComponent from "../../components/TimePicker/TimePicker";

const CartPage: React.FC = () => {
  const { t } = useTranslation();

  // redux state vars
  const supplier = useAppSelector((state: RootState) => state.cart.supplier);
  const deliveryPrice = useAppSelector((state: RootState) => state.cart.deliveryPrice);
  var cartItems = useAppSelector((state: RootState) => state.cart.items);
  const userPosition = useAppSelector((state) => state.location.position);
  const deliveryOption = useAppSelector((state: RootState) => state.cart.deliveryOption);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  // const searchByDeliv = useAppSelector((state) => state.homeData.isDelivery);

  const [isDelevery, setIsDelevery] = useState(deliveryOption)
  //local storege vars
  const comment = localStorageService.getComment();
  const userItem = localStorageService.getUser();
  const user = userItem ? JSON.parse(userItem) : null;

  //util vars
  const [name, setName] = React.useState(user?.firstname || "");
  const [phoneNumber, setPhoneNumber] = React.useState(user?.tel || "");

  const [payMode, setPayMode] = useState<number>(1)

  const [sousTotal, setSousTotal] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  // const [delivPrice, setDelivPrice] = useState<number>(0)
  const [aComment, setAComment] = React.useState<string>(comment ? comment : "");
  const [showTimer, setShowTimer] = React.useState<boolean>(false);

  const [popupType, setPopupType] = React.useState<string>("");
  const [showPopup, setShowPopup] = React.useState<boolean>(false);
  const [showServicePopup, setShowServicePopup] = React.useState<boolean>(false);

  // promo vars
  const [promo, setPromo] = React.useState<string>("");
  const [promoApplied, setPromoApplied] = React.useState<boolean>(false);
  const [promosList, setPromosList] = useState<any>([])
  const [couponExiste, setCouponExiste] = React.useState<boolean>(false);
  const [selectedCoupon, setSelectedCoupon] = React.useState<any>(null);
  const [promoReduction, setPromoReduction] = useState<number>(0)

  // bonus vars
  const [bonus, setbonus] = useState<number>(0)
  const [appliedBonus, setAppliedBonus] = useState<number>(0)
  const [bonusApplied, setBonusApplied] = useState<boolean>(false)
  const [limitReachedBonus, setLimitReachedBonus] = useState<boolean>(false)

  // gift vars
  const [has_gift, setHas_gift] = useState<boolean>(false)
  const [giftApplied, setGiftApplied] = useState<boolean>(false)
  const [maxGiftCost, setMaxGiftCost] = useState<any>(null)
  const [giftId, setMaxGiftId] = useState<number>(0)
  const [giftAmmount, setGiftAmmount] = useState<number>(0)
  const [limitReachedGift, setLimitReachedGift] = useState<boolean>(false)
  const [discountValue, setDiscountValue] = useState<number>(0)
  const [extraDeliveryCost, setExtraDeliveryCost] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // take away plan vars
  const command_type = deliveryOption === "delivery" ? 3 : 1;
  const [selectedOption, setSelectedOption] = useState<number>(command_type);

  // var extraDeliveryCost = 0;
  var max_distance: number = 5;
  var distance: number = 0;
  var discount = 0

  var take_away_plan = 'default';
  const [takeAwayDate, setTakeAwayDate] = useState(new Date());
  const [minCost, setMinCost] = useState<number>(0)
  const [isClosed, setIsClosed] = useState<number>(1)
  const [minCostError, setMinCostError] = useState<boolean>(false)



  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  // article component 
  interface Article {
    item: FoodItem,
    remove: () => void
  }
  const handleIncreaseQuantity = (item: FoodItem) => {
    dispatch(
      changeItemQuantity({
        itemId: Number(item.product.id),
        quantity: item.quantity + 1,
      })
    );
    // setCount(item.quantity + 1)

  };
  const handleDecreaseQuantity = (item: FoodItem) => {
    if (item.quantity > 1) {
      dispatch(
        changeItemQuantity({
          itemId: Number(item.product.id),
          quantity: item.quantity - 1,
        })
      );
      // setCount(item.quantity - 1)
    }
  };

  const ArticleProvider: React.FC<Article> = ({ item, remove }) => {
    return (
      <>

        <div className="supplier-desc-header">


          <div className="show-all-link-blc">
            <a className="show-all-link">
              Tout afficher
            </a>
          </div>
        </div>

        <div className="supplier-desc-body">
          <div className="supplier-name-blc">
            {
              item.product.image.length > 0 && (
                <div className="supplier-img-blc">
                  <img src={item.product.image[0].path} alt="Supplier Img" />
                </div>
              )
            }

            <div className="supplier-title-blc">
              <h4 className="supplier-title">{item.product.name}</h4>
              <div className="total-price">
                <span >{item.unitePrice.toFixed(2)} DT</span>
              </div>
            </div>
          </div>
          <div className="count-container">
            <input readOnly={true} type="number" name="product-count" id="product-count" value={item.quantity} />
            <div className="count-buttons">
              <button className="btn count-more" onClick={() => handleIncreaseQuantity(item)}></button>
              <button className="btn count-less" onClick={() => handleDecreaseQuantity(item)}></button>
            </div>
          </div>
          <div className="total-price-area">
            <div className="total-price">
              <span>
                {item.total.toFixed(2)} DT
              </span>
            </div>
            <div>
              <button type="button" className="remove-btn" onClick={remove}></button>
            </div>
          </div>

        </div>

        <div className="info-text">
          {item.options.length ?
            (<Accordion className="link-accordion">
              <AccordionSummary
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <p>Voir détail</p>
              </AccordionSummary>
              <AccordionDetails>
                {
                  item.options.map((i: any, index: number) => {
                    return (
                      <>
                        <strong className="description description--title">{i[0].type}</strong>
                        <span className="description">
                          {i.map((option: any, indexOption: number) => {
                            return (
                              <span key={indexOption}>{option.name}</span>
                            )
                          })}
                        </span>
                      </>
                    )
                  })
                }
              </AccordionDetails>
            </Accordion>)
            : <></>
          }
        </div>
      </>
    )
  }


  // handle submit and command creation
  const submitOrder = async (
    cartItems: FoodItem[],
    deliveryOption: "delivery" | "pickup" | "surplace",
    name: string,
    phoneNumber: string,
    aComment: string,
    total: number,
    applied_bonus: number,
    dispatch: any,
    userPosition: any,
    supplier: number,
    deliveryPrice: number
  ) => {
    let products = cartItems.flatMap((item) => ({
      ...item.product,
      id: item.product.id,
      supplier_id: item.supplier_data.supplier_id,
      qte: item.quantity,
      options: item.options.flatMap((op: any) => op),
      computed_value: item.product.computed_value,
      total: item.total,
      discount_value: item.product.discount_value,
      cost: item.unitePrice,
      old_value: item.default_price,
    }))


    try {
      var year;
      var month;
      var day;
      var hours;
      var minutes;
      var seconds = "00";
      var formattedDate;

      if (takeAwayDate instanceof Date) {
        year = takeAwayDate.getFullYear();
        month = (takeAwayDate.getMonth() + 1).toString().padStart(2, '0');
        day = takeAwayDate.getDate().toString().padStart(2, '0');
        hours = takeAwayDate.getHours().toString().padStart(2, '0');
        minutes = takeAwayDate.getMinutes().toString().padStart(2, '0');
        formattedDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
      } else if (typeof (takeAwayDate) === 'object') {
        year = takeAwayDate.year();
        month = (takeAwayDate.month() + 1).toString().padStart(2, '0');
        day = takeAwayDate.date().toString().padStart(2, '0');
        hours = takeAwayDate.hour().toString().padStart(2, '0');
        minutes = takeAwayDate.minute().toString().padStart(2, '0');

        formattedDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
      } else {
        console.error('Invalid date type');

      }

      const order = {
        addresse_id: 1,
        supplier_id: supplier,
        extraDeliveryCost: extraDeliveryCost,
        delivery_price: isDelevery == "delivery" ? Math.round(deliveryPrice) : 0,
        mode_pay: payMode,
        applied_bonus: applied_bonus,
        total_price: total,
        promo_code: promo,
        products: products,
        lat: userPosition?.coords.latitude,
        lng: userPosition?.coords.longitude,
        total_price_coupon: promoReduction,
        take_away_plan: take_away_plan,
        take_away_date: formattedDate,
        tip: 0,
        is_delivery: selectedOption === 3 ? 1 : 0,
        phone: phoneNumber,
        name: name,
        comment: aComment,
        has_gift: has_gift,
        gift_ammount: giftAmmount,
        gift_id: giftId,
      };
      if (isAuthenticated) {
        orderSchema.parse(order);
        try {
          const userToken = localStorageService.getUserToken();
          if (!userToken) {
            dispatch(logout());
            navigator.geolocation.getCurrentPosition(
              (position: any) => {
                const { latitude, longitude } = position.coords;
                LocationService.geoCode(latitude, longitude).then(data => {
                  dispatch({
                    type: "SET_LOCATION",
                    payload: {
                      ...data
                    },
                  });
                });
              },
              (error: GeolocationPositionError) => {
                toast.error(error.message)
              }
            );
            return;
          }
        } catch (error) {
          throw error
        }

        if (Number(minCost) > sousTotal) {
          setMinCostError(true)
        } else if (isClosed === 0) {
          toast.warn("This restaurant is currently closed, please complete your order later.")
        } else {
          try {
            const { status, data } = await cartService.createOrder(order);
            if (status === 200) {
              dropOrder()
              setPopupType('command_success')
              handlePopup()
            } else {
              toast.warn("something went wrong")
            }
          } catch (error) {
            throw error
          }
        }
      }
    } catch (e) {
      throw e
    };

  }

  const getUser = async () => {
    const user_id = localStorageService.getUserId()
    const response = await userService.getUser(user_id!)
    const data = response.data.data.client;
    const bonus = data.bonus
    setbonus(bonus)
  }

  const handlePopup = () => {
    setShowPopup(!showPopup)
  }

  //  manage comments state
  const handleCommentChange = (comment: string) => {
    setAComment(comment);
    localStorageService.setComment(comment);
    dispatch(setComment(comment));
  };

  // handle deliv program state changes
  const handleOptionChange = async (value: number) => {
    if (value === 3) {
      setSelectedOption(value);
    } else {
      const take_away = await commandService.isdelivery(supplier.id)
      take_away === 1 ? setSelectedOption(value) : handleServicePopup();
    }
  };

  const handleServicePopup = () => {
    setShowServicePopup((current) => !current)
  }

  // remove order
  const dropOrder = () => {
    dispatch(clearCart());
    dispatch(setDeliveryPrice(0));
    dispatch(setComment(""));
    dispatch(setCodePromo(""));
    dispatch(setSupplier(null));
  }

  //  get gifts
  const getclientGift = async () => {
    if (cartItems.length > 0) {

      let body = { supplier_id: cartItems[0].supplier_data.supplier_id };
      const { status, data } = await cartService.getGift(body)
      if (data.success) {
        let gift = data.data.has_gift
        if (gift) {
          setHas_gift(gift);
          setMaxGiftCost(data.data.max_gift_cost)
          setMaxGiftId(data.data.gift_id)
        }
      }
    }
  }

  // apply gift and calculate total
  const applyGift = () => {
    setGiftApplied(true)
    let sum = 0
    if (bonusApplied) {
      sum = sousTotal - (appliedBonus / 1000);
    } else {
      sum = sousTotal;
    }
    if (sum > 0 && sum <= maxGiftCost) {
      setGiftAmmount(sum);
    } else {
      setGiftAmmount(maxGiftCost);
    }
    if (sum === giftAmmount) {
      setLimitReachedGift(true);
    }
    else {
      setLimitReachedGift(false);
    }
  }

  // clear gift state
  const clearGift = () => {
    setGiftAmmount(0)
    setGiftApplied(false)
    setLimitReachedBonus(false)
  }

  // calc bonus
  const applyBonus = () => {
    let sum = 0;
    if (giftApplied) {
      sum = sousTotal - giftAmmount;
    } else {
      sum = sousTotal;
    }
    //  if the bonus exceeds 40000pts
    if (bonus > 40000 && sum > 40) {
      setAppliedBonus(40000);
      setbonus((bonus) => bonus - 40000);
    }
    //   // if bonus exceeds the total amouunt
    else if (bonus / 1000 > sum) {
      setAppliedBonus(sum * 1000);
      setbonus((bonus) => bonus - (sum * 1000));
    }
    // if the bonus less than the total amount
    else {
      setAppliedBonus(bonus);
      setbonus(0);
    }
    setBonusApplied(true);
    if (sum === (appliedBonus / 1000)) {
      setLimitReachedBonus(true);
    }
    else {
      setLimitReachedBonus(false);
    }
  }

  //  get promos list 
  const getPromo = async () => {
    const { status, data } = await cartService.getAllPromoCodes()
    setPromosList(data.data)
  }

  //  check promo validation
  const checkPromoCode = async () => {
    if (promoApplied) {
      const initDeliveryPrice = cartItems.length <= 0 ? 0 : Number(cartItems[0].supplier_data.delivery_price) + extraDeliveryCost;

      // setDelivPrice(initDeliveryPrice)
      dispatch(setDeliveryPrice(initDeliveryPrice));

      setPromoApplied(false)
      setPromoReduction(0)
      selectCoupon(selectedCoupon)
    } else {
      if (promo.length >= 0) {
        let formData = new FormData();
        formData.append('code_coupon', promo)
        cartService.getPromoCode(formData).then((res) => {
          if (res.status === 422) {
            toast.error("code promo invalid")
            return 0
          }
          if (res.data.code && res.data.code === 200) {
            if (res.data.success) {
              CalculatePromoPrice();
              setPromoApplied(true)

              return 0;
            } else {
              toast.error("code promo invalid")
              return 0
            }
          }
        })
      }
    }

  }

  // handle promo text state
  const handlePromoChange = (code: string) => {
    setPromo(code);
    dispatch(setCodePromo(code));
    setCouponExiste(true)
    if (code.length <= 0) {
      setCouponExiste(false)
    }
  };

  // handle promo state from list 
  const selectCoupon = (coupon: any) => {
    //check if you're clicking on the same promo code
    if (selectedCoupon !== coupon) {
      setPromo(coupon.code_coupon);
      setSelectedCoupon(coupon);
      setCouponExiste(true)
    } else {
      setPromo('');
      setSelectedCoupon(null)
      setCouponExiste(false)
    }
  }
  // calc promo value
  const CalculatePromoPrice = () => {
    var promoReduction;
    if (Object.keys(selectedCoupon).length > 0) {
      const initDeliveryPrice = (cartItems.length <= 0) ? 0 : Number(cartItems[0].supplier_data.delivery_price) + (extraDeliveryCost)
      const extraDelivFixed = selectedCoupon.extra_delivery_fixed
      if (selectedCoupon.apply_on === 'DELIVERY') {
        if (selectedCoupon.delivery_fixed != 1) {
          if (selectedCoupon.type === 'percentage') {
            promoReduction = (deliveryPrice * (selectedCoupon.value / 100));
            setPromoReduction(promoReduction)
            dispatch(setDeliveryPrice(initDeliveryPrice))
            return 0
          } else if (selectedCoupon.type !== 'percentage') {
            promoReduction = (deliveryPrice - selectedCoupon.value);
            setPromoReduction(promoReduction)
            dispatch(setDeliveryPrice(initDeliveryPrice))
            return 0
          }
          dispatch(setDeliveryPrice(initDeliveryPrice))
          promoReduction = selectedCoupon.value;
          setPromoReduction(promoReduction)
          return 0
        } else {
          setPromoReduction(0)
          extraDelivFixed === 1 ? dispatch(setDeliveryPrice(selectedCoupon.value)) : dispatch(setDeliveryPrice(selectedCoupon.value + extraDeliveryCost))
          return 0
        }
      }

      if (selectedCoupon.apply_on === 'COMMAND') {
        if (selectedCoupon.type === 'percentage') {
          promoReduction = (sousTotal * (selectedCoupon.value / 100));
          setPromoReduction(promoReduction)
          return 0;
        }
        promoReduction = selectedCoupon.value;
        setPromoReduction(promoReduction)
        return 0;
      }
      if (selectedCoupon.apply_on === 'ALL') {
        if (selectedCoupon.type === 'percentage') {
          promoReduction = (total * (selectedCoupon.value / 100));
          setPromoReduction(promoReduction)
          return 0;
        }
        promoReduction = selectedCoupon.value;
        setPromoReduction(promoReduction)
        return 0;
      }
      setPromoApplied(false)
      promoReduction = 0;
      setPromoReduction(promoReduction)
      return 0;
    }
    promoReduction = 0;
    setPromoReduction(promoReduction)
    return 0;
  }

  //  calc total befor reduction (gift / promo / bonus ...)
  const getSousTotal = () => {

    let cartItems2 = [...cartItems];
    var discount = 0;
    cartItems.forEach((item: any, index: number) => {
      let sub_total_final = item.total;
      if (item.product.computed_value.discount_value && item.product.computed_value.discount_value > 0) {
        sub_total_final = item.total - ((item.total * item.product.computed_value.discount_value) / 100)
        discount += (item.default_price - item.unitePrice) * item.quantity
      }
      cartItems2[index] = {
        ...cartItems2[index],
        product: {
          ...item.product,
          cost: sub_total_final,
          old_value: item.total,
          discount_value: item.product.computed_value.discount_value,
        },
      }
    })

    setDiscountValue(discount)
    cartItems = cartItems2;
    let sum = 0;

    cartItems.forEach((item: FoodItem) => sum = sum + (item.total));
    setSousTotal(sum);
  }

  // calc total function
  const calcTotal = () => {
    setTotal(
      ((sousTotal + deliveryPrice) - ((appliedBonus / 1000) + (giftAmmount) + promoReduction + discount)))
  }
  // get supplier request
  const getSupplierById = async () => {
    const { status, data } = await supplierServices.getSupplierById(supplier.id)
    max_distance = data.data?.max_distance;
    setMinCost(data?.data.min_cost);
    setIsClosed(data?.status);
  }

  // get distance 
  const getDistance = async () => {
    if (cartItems.length > 0) {
      let obj = {
        supplier_id: supplier.id,
        lat: userPosition?.coords.latitude,
        long: userPosition?.coords.longitude,
      };
      const res = await adressService.getDistance(obj)
      res.data.code == 200 ? distance = res.data.data.distance : distance = 0
      let extraDeliveryCost = (distance - max_distance) > 0 ? Math.ceil(distance - max_distance) : 0

      const deliveryPrice = cartItems.length <= 0 ? 0 : Number(cartItems[0].supplier_data.delivery_price) + extraDeliveryCost
      setExtraDeliveryCost(extraDeliveryCost)
      // setDelivPrice(deliveryPrice)
      dispatch(setDeliveryPrice(deliveryPrice))

    }
  }

  const navigateToHome = () => {
    const currenLocation = localStorageService.getCurrentLocation()
    let path = '';
    currenLocation ? path = '/search' : path = '/'
    navigate(path, { replace: true })
  }


  useEffect(() => {
    switch (selectedOption) {
      case 1:
        take_away_plan = "default"
        setIsDelevery("surplace")
        // setTakeAwayDate(new Date(new Date().getTime() + 30 * 60000))
        break;
      case 2:
        take_away_plan = "default"
        setIsDelevery("pickup")
        // setTakeAwayDate(new Date(new Date().getTime() + 30 * 60000))
        break;
      case 3:
        take_away_plan = "plan"
        setIsDelevery("delivery")
        // setTakeAwayDate(new Date(new Date().getTime() + 30 * 60000))
        break;
      default:
        take_away_plan = "plan"
        break;
    }
  }, [selectedOption])

  const handleSelectedDate = (date: Date) => {
    setTakeAwayDate(new Date(date))
  }

  useEffect(() => {
    !showTimer && setTakeAwayDate(new Date(new Date().getTime() + 30 * 60000))
  }, [showTimer])



  useEffect(() => {
    getSousTotal()
    localStorageService.setCart(cartItems);
    if (cartItems.length == 0) {
      dispatch(setSupplier(null));
      dispatch(setDeliveryPrice(null));
    }
  }, [cartItems]);

  useEffect(() => {
    let check = supplier && cartItems.length > 0
    isAuthenticated && getPromo();
    isAuthenticated && getclientGift();
    check && getSupplierById()
    check && getSousTotal()
    getUser()
    getDistance()
  }, [])

  /*
   check if supplier support delivery | pickup | inside 
  */
  useEffect(() => {
    if (supplier) {
      let take_away = supplier.take_away
      let delivery = supplier.delivery
      if (delivery === 1 && take_away == 1) {
        setIsDelevery("delivery")
        setSelectedOption(3)
      } else if (delivery === 1 && take_away == 0) {
        setSelectedOption(3)
        setIsDelevery("delivery")
      } else if (delivery === 0 && take_away == 1) {
        setSelectedOption(2)
        setIsDelevery("pickup")
      } else if (delivery === 0 && take_away == 0) {
        setIsDelevery("surplace")
        setSelectedOption(1)
      }
    }

  }, [supplier])

  // calc total for each changement 
  useEffect(() => {
    let check = supplier && cartItems.length > 0
    check && calcTotal()
  }, [sousTotal, giftApplied, appliedBonus, promoReduction, deliveryPrice, discountValue]);

  const goNextStep: MouseEventHandler<HTMLButtonElement> = ((event) => {
    setCurrentStep(2);
  });

  const goPrevStep: MouseEventHandler<HTMLButtonElement> = ((event) => {
    setCurrentStep(1);
  });

  const removeItemsWithIndex = (i: number) => {
    dispatch(removeItemWithIndex({ index: i }))
  }

  const handleMinCostModal = () => {
    setMinCostError(!minCostError)
  }

  return (
    <>
      {
        cartItems.length > 0 && supplier ? (
          <div className="cart-page-container">
            <Container className="cart-page-cont">

              <ul className="breadcrumb-area">
                <li>
                  <a className="breadcrumb-link">{t('home')}</a>
                </li>
                <li>
                  <a className="breadcrumb-link active">{t('cartPage.yourCart')}</a>
                </li>
              </ul>

              <Row>
                <Col>
                  <main>
                    <div className={`product-detail-container`}>
                      {currentStep == 2 && (<button className="btn-back" onClick={goPrevStep}>Retour</button>)}
                      {currentStep == 1 && (<>
                        <div className="cart-items">
                          <div className="cart-items__title">
                            {t('cartPage.product')}
                          </div>
                          <div className="cart-items__list">
                            <h1 className="supplier-name">
                              {supplier.name}
                            </h1>
                            {
                              cartItems.map((item: any, index: number) => {
                                return (
                                  <div className="cart-items__list__product" key={index}>
                                    <ArticleProvider item={item} remove={() => removeItemsWithIndex(index)} />
                                  </div>
                                )
                              })
                            }
                          </div>
                        </div>

                        <div className="commentaire-section">
                          <label>{t('cartPage.commentaire')}</label>
                          <textarea name="commentaire" id="commentaire" cols={30} rows={10} value={aComment} onChange={(e) => handleCommentChange(e.target.value)} placeholder="Ex:sandwich"></textarea>
                        </div>

                        <div className="promos-area">
                          <label>{t('cart.PromosCode')}</label>

                          <div className="promos-wrapper">
                            <div className="promos-list">
                              <ul>
                                {
                                  promosList.length !== 0 && (
                                    <>
                                      {
                                        promosList.map((promo: any, index: number) => {
                                          return (
                                            <li>
                                              <button key={index} className={(!couponExiste) ? "promo-button" : "promo-button active"} onClick={() => {
                                                selectCoupon(promo)
                                              }}>
                                                {promo.title}
                                              </button>
                                            </li>
                                          )

                                        })
                                      }
                                    </>
                                  )
                                }
                              </ul>
                            </div>
                            <div className="promo-container">
                              <textarea name="code_promo" id="code_promo" placeholder={`${t('cart.PromosCode')}`} value={promo} onChange={(e) => handlePromoChange(e.target.value)} ></textarea>
                              <button disabled={!couponExiste} className={(couponExiste) ? "button" : "button disabled"} onClick={checkPromoCode}>
                                {promoApplied ? t('Annuler') : t('cartPage.appliquer')}
                              </button>
                            </div>
                          </div>
                        </div>
                        {/* promo end */}
                        {/* gift start */}

                        {
                          has_gift &&
                          <>
                            <div className="promo-container">
                              <span>{t('repasGratuit')}</span>
                              <textarea name="code_promo" readOnly id="gift_ammount" placeholder="0" value={`${giftAmmount.toFixed(3)}`} ></textarea>
                              <button style={{ backgroundColor: `${giftApplied ? "red" : "#3BB3C4"}` }} className={"button"} onClick={() => giftApplied ? clearGift() : applyGift()}>
                                {giftApplied ? t('Annuler') : t('cartPage.appliquer')}
                              </button>
                            </div>
                            <div className="devider">
                            </div>
                          </>
                        }
                        {/* gift end */}
                        {/* bonus start */}
                        <div className="bonus-area">
                          <label>{t('cartPage.bonus')}</label>
                          <div className="bonus-wrapper">
                            <div className="promo-container">
                              <textarea name="bonus" id="bonus" placeholder={`${t('cartPage.bonus')}`} value={bonus.toFixed(2) + ' pts'}></textarea>
                              <button style={{ backgroundColor: `${appliedBonus > 0 ? "red" : '#3BB3C4'}` }} className={(bonus < 5000 || limitReachedBonus) ? "button disabled" : "button"} disabled={(bonus < 5000 || limitReachedBonus)} onClick={() => applyBonus()}>
                                {appliedBonus > 0 ? t('Annuler') : t('cartPage.appliquer')}
                              </button>
                            </div>
                            <ul>
                              <li>
                                <p className="bonus-message">{t('cartPage.bonusMsg')}</p>
                              </li>
                            </ul>
                          </div>
                        </div>
                        {/* bonus end */}
                        <div className="buttons">
                          <button className="cancel">
                            {t('Annuler')}
                          </button>
                          <button className="commander" onClick={goNextStep} >
                            {t('continuer')}
                          </button>
                        </div>
                      </>)
                      }
                      {
                        currentStep == 2 && (<div className="card-paiment">
                          <div className="paiment-container">
                            <h2 className="title">{t('cartPage.payMode')}</h2>
                            <div className="method-group">
                              <div className={`method ${payMode === 1 ? "active" : ""}`}>
                                <img loading="lazy" className="icon" src={PayCashSVG} alt="My SVG" />
                                <label htmlFor="espece">{t('cartPage.espece')}</label>
                                <input className="form-check-input" type="radio" name="pay" id="espece" checked={payMode === 1} onClick={() => setPayMode(1)} />
                              </div>
                              <div className={`method ${payMode === 2 ? "active" : ""}`}>
                                <img loading="lazy" className="cart" src={CartSVG} alt="My SVG" />
                                <label htmlFor="bnc-cart">{t('cartPage.bankPay')}</label>
                                <input className="form-check-input" type="radio" name="pay" id="bnc-cart" checked={payMode === 2} onClick={() => setPayMode(2)} />
                              </div>
                            </div>
                          </div>

                          <div className="deliv-details">
                            <div className={`select ${selectedOption == 1 ? "selected" : ""}`}>
                              <div className="deliv-details_header">
                                <div className="deliv-details_img-blc icon1">
                                  <img loading="lazy" src={dinnerFurnitureIcn} alt="sur place icon" /* onClick={() => handleOptionChange(1)} */ />
                                </div>
                                <div className="deliv-details_header-desc">
                                  <time>20 MIN</time>
                                  <div className="deliv-type">{t('cartPage.surPalce')}</div>
                                </div>
                              </div>
                              <p className="deliv-details_description">
                                Rue Imem moslem, Khzema, Sousse
                              </p>
                              <button /* onClick={() => handleOptionChange(1)}*/ className="btn btn-deliv">livrer ici</button>
                              <input type="radio" value="1" id='domicile' name='type' checked={selectedOption === 1} />
                            </div>
                            <div className={`select ${selectedOption == 2 ? "selected" : ""}`}>
                              <div className="deliv-details_header">
                                <div className="deliv-details_img-blc icon2">
                                  <img loading="lazy" src={bagPaperShoppingIcn} alt="a emporter icon" onClick={() => handleOptionChange(2)} />
                                </div>
                                <div className="deliv-details_header-desc">
                                  <time>20 MIN</time>
                                  <div className="deliv-type">{t('cartPage.emporter')}</div>
                                </div>
                              </div>
                              <p className="deliv-details_description">
                                Rue Imem moslem, Khzema, Sousse
                              </p>
                              <button onClick={() => handleOptionChange(2)} className="btn btn-deliv">livrer ici</button>
                              <input type="radio" value="2" id='travail' name='type' checked={selectedOption === 2} />
                            </div>
                            <div className={`select ${selectedOption == 3 ? "selected" : ""}`}>
                              <div className="deliv-details_header">
                                <div className="deliv-details_img-blc icon3">
                                  <img loading="lazy" src={scooterTransportIcn} alt="Livraison icon" onClick={() => handleOptionChange(3)} />
                                </div>
                                <div className="deliv-details_header-desc">
                                  <time>20 MIN</time>
                                  <div className="deliv-type">{t('cartPage.delivery')}</div>
                                </div>
                              </div>
                              <p className="deliv-details_description">
                                Rue Imem moslem, Khzema, Sousse
                              </p>
                              <button className="btn btn-deliv" onClick={() => handleOptionChange(3)}>livrer ici</button>
                              <input type="radio" value="3" id='autre' name='type' checked={selectedOption === 3} />

                            </div>
                          </div>
                          <div className="order-recovery-area">
                            <h3 className="order-recovery-title">
                              {t('mismatchModal.selectOption')}
                            </h3>

                            <div className="order-recovery-select-blc">
                              <div className={`order-recovery-select-item ${showTimer ? "" : "active"}`} onClick={() => setShowTimer(false)}>
                                <span>

                                  {`${t('mismatchModal.selectOption.option2.fastest')}
                                  ${t('mismatchModal.selectOption.option2.possible')}
                                  20-40 ${t('mismatchModal.selectOption.option2.minutes')} `}
                                </span>
                              </div>
                              <div className={`order-recovery-select-item ${!showTimer ? "" : "active"}`} onClick={() => setShowTimer(true)}>
                                <span>
                                  {
                                    `
                                    ${t('mismatchModal.selectOption.option1.Modifier')}
                                    ${t('mismatchModal.selectOption.option1.Planning')}
                                    `
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                          {
                            (showTimer) &&
                            <>
                              <TimePickerComponent setSelectedDate={handleSelectedDate} />
                            </>
                          }
                          <div className="deliv-to">
                            <h3 className="title">{selectedOption === 3 ? t('cartPage.delivto') : "Emportée par"}</h3>
                            <div className="deliv-infos-group">
                              <div className="info-container">
                                <label htmlFor="client-name">{t('cartPage.client')} : </label>
                                <input type="text" name="client-name" value={name} placeholder={`${t('cart.clientName')}`} onChange={(e) => setName(e.target.value)} />
                              </div>
                              <div className="info-container">
                                <label htmlFor="client-name">{t('cartPage.phoneNumber2')}</label>
                                <input type="text" name="" value={phoneNumber} placeholder={`${t('cartPage.phoneNumber')}`} onChange={(e) => setPhoneNumber(e.target.value)} />
                              </div>
                            </div>
                            {

                              selectedOption === 3 && <div className="info-container">
                                <label htmlFor="client-name">{t('adress.delivAddress')}</label>
                                <div className="adress">
                                  <p className="adress-text">
                                    {userPosition?.coords.label}
                                  </p>
                                  <button onClick={() => dispatch({ type: "SET_SHOW", payload: true })} className="btn btn-edit"></button>
                                </div>
                              </div>}
                            <div className="message-validation">
                              {t('mismatchModal.validationMessageTitle')}
                            </div>
                          </div>

                          <div className="buttons">
                            <button className="continue" onClick={navigateToHome}>
                              {t('cartPage.continueAchats')}
                            </button>
                            <button className="commander"
                              onClick={() =>
                                submitOrder(
                                  cartItems,
                                  deliveryOption,
                                  name,
                                  phoneNumber,
                                  aComment,
                                  total,
                                  appliedBonus,
                                  dispatch,
                                  userPosition,
                                  supplier.id,
                                  deliveryPrice
                                )
                              }
                            >
                              {t('cartPage.commander')}
                            </button>
                          </div>
                        </div>
                        )}

                      <div className="message-validation-area d-none">
                        <h2 className="message-validation-title">
                          {t('mismatchModal.commandValidate')}
                        </h2>
                        <div className="message-validation_img-blc commande-valide"></div>
                        {/*
                          .commande-valide
                          .commande-nnvalide
                          .paiement-valide
                          .paiement-nnvalide
                        */}
                        <div className="message-validation_desc">
                          <p>
                            {t('mismatchModal.alerte')}
                          </p>
                        </div>
                        <div className="btns-group">
                          <button className="btn btn-valid">{t('cart.payment.iCommand')}</button>
                        </div>
                      </div>

                    </div>

                    {/* 
                      order datails
                    */}
                    <div className="summair-container">
                      <h3 className="summair-title">{t('cartPage.total')}</h3>
                      <div className={`info`}>

                        <div className="info-customer-area">
                          <div className="info-customer-title-blc">
                            <h4 className="info-customer-title">
                              {userPosition ? userPosition.coords.label : ""}
                            </h4>
                            <a className="edit-info-customer-link" onClick={() => dispatch({ type: "SET_SHOW", payload: true })} >{t('update')}</a>
                          </div>
                          <div className="customer-infos-area">
                            <div className="customer-info_name"> {`${user.firstname} ${user.lastname}`}</div>
                            <div className="customer-info_mobile">{t('mobile')} : <span>{phoneNumber}</span></div>
                            <div className="customer-info_adresse">
                              {userPosition?.coords.label}
                            </div>
                          </div>
                        </div>

                        <div className="payment-method">
                          <h4 className="payment-method-title">
                            {t('cartPage.payMode')}
                          </h4>
                          <div className="payment-method-status">
                            <span className="payment-method-status_txt cash">
                              {payMode == 1 ? t('cartPage.espece') : t('cartPage.bankPay')}
                            </span>
                          </div>
                        </div>

                        <div className="calculate-total-price">
                          <div className="supplier-name-blc">
                            <div className="supplier-img-blc">
                              <img src={supplier.images[0].pivot.type === "principal" ? supplier.images[1].path : supplier.images[0].path} alt="Supplier Img" />
                            </div>
                            <div className="supplier-title-blc">
                              <h4 className="supplier-title">{cartItems[0].supplier_data.supplier_name}</h4>
                              <div className="supplier-adresse">
                                {supplier.street}, {supplier.city}
                              </div>
                            </div>
                          </div>
                          {
                            cartItems.map((item: FoodItem, index: number) => {
                              return <React.Fragment key={index}>
                                <div className="products-count-area">
                                  <div className="product-id">
                                    X{item.quantity}
                                  </div>
                                  <div className="product-name">
                                    {item.product.name}
                                  </div>
                                  <div className="count-container">
                                    <input readOnly={true} type="number" name="product-count" id="product-count" value={item.quantity} />
                                    <div className="count-buttons">
                                      <button className="btn count-more" onClick={() => handleIncreaseQuantity(item)}  ></button>
                                      <button className="btn count-less" onClick={() => handleDecreaseQuantity(item)}   ></button>
                                    </div>
                                  </div>
                                  <div className="product-price">
                                    {item.total.toFixed(2)}DT
                                  </div>
                                </div>

                              </React.Fragment>
                            })
                          }
                          <div className="devider">
                          </div>
                          <div className="price-total-area">
                            <div className="sous-total">
                              <div className="title">{t('profile.commands.sousTotal')}</div>
                              <div className="value">{sousTotal ? sousTotal.toFixed(2) : "0.00"} DT</div>
                            </div>
                            {
                              (discountValue && discountValue > 0) ?
                                <div className="sous-total">
                                  <div className="title">{t('cart.discount')}</div>
                                  <div className="value">{discountValue ? (discountValue).toFixed(2) : "0.00"} DT</div>
                                </div>
                                : <></>
                            }
                            {
                              (promoReduction && promoReduction > 0) ?
                                <div className="sous-total">
                                  <div className="title">{t('cartPage.Coupon')}</div>
                                  <div className="value">{promoReduction ? (promoReduction).toFixed(2) : "0.00"} DT</div>
                                </div>
                                : <></>
                            }
                            {
                              (appliedBonus && appliedBonus > 0) ?
                                <div className="sous-total">
                                  <div className="title">{t('cartPage.bonus')}</div>
                                  <div className="value">{appliedBonus ? (appliedBonus / 1000).toFixed(2) : "0.00"} DT</div>
                                </div>
                                : <></>
                            }
                            {
                              (giftAmmount && giftAmmount > 0) ?
                                <div className="sous-total">
                                  <div className="title">{t('repasGratuit')}</div>
                                  <div className="value">{giftAmmount ? (giftAmmount).toFixed(2) : "0.00"} DT</div>
                                </div>
                                : <></>
                            }
                            {
                              (deliveryPrice && deliveryPrice > 0) ?
                                <div className="sous-total">
                                  <div className="title">{t('supplier.delivPrice')}</div>
                                  <div className="value">{Number(deliveryPrice).toFixed(2)} DT</div>
                                </div>
                                : <></>
                            }
                          </div>
                          <div className="a-payer">
                            <span className="title">{t('toPay')}</span>
                            <span className="value">{total.toFixed(2)} DT</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 
                       messsanger 
                    */}
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

                    {
                      messangerPopup && <Messanger className="discuter-messanger-popup" close={handleMessangerPopup} />
                    }
                  </main >
                </Col >
              </Row >
              {
                minCostError && <MinCostError close={handleMinCostModal} />
              }
            </Container>
            {
              showPopup && (

                <PaymentPopup close={handlePopup} type={popupType} />
              )
            }
            {
              showServicePopup && (
                <WarnPopup message="Ce service n'est pas disponible dans votre ville" closeButtonText={t('continuer')} confirmButtonText={t('Modal.finishCommand.dropOldCommand')} close={handleServicePopup} accept={dropOrder} />
              )
            }
          </div >
        ) : (
          <Container>
            <Row>
              <Col>
                <div className="noDataFound">

                  <div className="empty-container-tab">
                    <div className="empty-header">
                    </div>
                    <p>{t('cartPage.empty')}</p>
                  </div>
                  <img loading="lazy" src={empty} alt=" not command items" />
                  <button className="emptyButton" onClick={navigateToHome}>
                    {t('cart.payment.iCommand')}
                  </button>
                </div>
              </Col>
              {
                showPopup && (

                  <PaymentPopup close={handlePopup} type={popupType} />
                )
              }
            </Row>


          </Container>
        )
      }
    </>
  );
};

export default CartPage;

const nameSchema = z
  .string()
  .regex(/^[A-Za-z\s]+$/, "Name must contain only letters and spaces")
  .min(1, "Name is required");

const phoneSchema = z
  .string()
  .min(8, "Phone number must be 8 digits long")
  .max(13, "Phone number must be 8 digits long")
  .optional();

const orderSchema = z.object({
  supplier_id: z.number(),
  addresse_id: z.number(),
  delivery_price: z.number(),
  extraDeliveryCost: z.number(),
  mode_pay: z.number(),
  total_price: z.number(),
  products: z.array(
    z.object({
      id: z.number(),
      supplier_id: z.number(),
      qte: z.number(),
      // options: z.array(z.object({ option_id: z.number() })),
    })
  ),
  tip: z.number(),
  total_price_coupon: z.number(),
  lat: z.number(),
  lng: z.number(),
  applied_bonus: z.number(),
  is_delivery: z.number(),
  phone: phoneSchema,
  name: nameSchema,
});
