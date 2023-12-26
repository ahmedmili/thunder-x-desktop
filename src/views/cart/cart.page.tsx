import React, { MouseEventHandler, useEffect, useState } from "react";
import {
  changeItemQuantity,
  clearCart,
  removeItem,
  removeItemWithIndex,
  setCodePromo,
  setComment,
  setDeliveryPrice,
  setSupplier
} from "../../Redux/slices/cart/cartSlice";

import CartSVG from '../../assets/panier/cart.svg';
import PayCashSVG from '../../assets/panier/pay-cash.svg';

import bagPaperShoppingIcn from '../../assets/panier/bag-paper-shopping-icn.png';
import dinnerFurnitureIcn from '../../assets/panier/dinner-furniture-icn.png';
import empty from '../../assets/panier/empty.png';
import scooterTransportIcn from '../../assets/panier/scooter-transport-icn.png';

import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { RootState, useAppDispatch, useAppSelector } from "../../Redux/store";

import 'react-clock/dist/Clock.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import * as z from "zod";
import { logout } from "../../Redux/slices/userSlice";
import { FoodItem } from "../../services/types";

import CloseIcon from '@mui/icons-material/Close';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { Col, Container, Row } from "react-bootstrap";
import MessangerBtnIcon from '../../assets/profile/Discuter/messanger-btn.svg';
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
import Messanger from "../../components/Popups/Messanger/Messanger";
import { fetchMessages } from "../../Redux/slices/messanger";
import MinCostError from "../../components/Popups/MinCostError/MinCostError";
import { toast } from "react-toastify";

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

  const ArticleProvider: React.FC<Article> = ({ item, remove }) => {
    const [count, setCount] = useState<number>(item.quantity)
    const handleIncreaseQuantity = () => {
      dispatch(
        changeItemQuantity({
          itemId: Number(item.product.id),
          quantity: item.quantity + 1,
        })
      );
    };


    const handleDecreaseQuantity = () => {
      if (count > 1) {
        dispatch(
          changeItemQuantity({
            itemId: Number(item.product.id),
            quantity: item.quantity - 1,
          })
        );
      }
    };

    return (
      <>
        <div className="supplier-name">
          <span >{item.supplier_data.supplier_name}</span>
        </div>
        <div className="info-text">
          <span className="title">{item.product.name}</span>
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
            : ""
          }

        </div>
        <div className="total-price">
          <span >{item.unitePrice.toFixed(2)} DT</span>
        </div>
        <div className="quantite">
          <div className="count-container">
            <input readOnly={true} type="number" name="product-count" id="product-count" value={count} />
            <div className="count-buttons">
              <button onClick={handleIncreaseQuantity} >
                <KeyboardArrowUpOutlinedIcon className="count-more" />
              </button>
              <button onClick={handleDecreaseQuantity} >
                <KeyboardArrowDownOutlinedIcon className="count-less" />
              </button>
            </div>
          </div>
          <div className="total-price">
            <span>
              {item.total.toFixed(2)} DT
            </span>
          </div>
          <div>
            <button type="button" className="remove-btn" onClick={remove}>
              <CloseIcon className='close-icon'></CloseIcon>
            </button>
          </div>
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
      id: item.product.id,
      supplier_id: item.supplier_data.supplier_id,
      qte: item.quantity,
      options: item.options.flatMap((op: any) => op),
      computed_value: item.product.computed_value,
      total: item.total,
      discount_value: item.product.discount_value,
      cost: item.product.cost,
      old_value: item.product.old_value,
    }))

    try {
      var year = takeAwayDate.getFullYear();
      var month = (takeAwayDate.getMonth() + 1).toString().padStart(2, '0');
      var day = takeAwayDate.getDate().toString().padStart(2, '0');
      var hours = takeAwayDate.getHours().toString().padStart(2, '0');
      var minutes = takeAwayDate.getMinutes().toString().padStart(2, '0');
      var seconds = "00";
      var formattedDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
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
          extraDelivFixed  === 1 ? dispatch(setDeliveryPrice(selectedCoupon.value)) :  dispatch(setDeliveryPrice(selectedCoupon.value + extraDeliveryCost))
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

  useEffect(() => {
    switch (selectedOption) {
      case 1:
        take_away_plan = "default"
        setIsDelevery("surplace")
        setTakeAwayDate(new Date(new Date().getTime() + 30 * 60000))
        break;
      case 2:
        take_away_plan = "default"
        setIsDelevery("pickup")
        setTakeAwayDate(new Date(new Date().getTime() + 30 * 60000))
        break;
      case 3:
        take_away_plan = "plan"
        setIsDelevery("delivery")
        setTakeAwayDate(new Date(new Date().getTime() + 30 * 60000))
        break;
      default:
        take_away_plan = "plan"
        break;
    }
  }, [selectedOption])

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
            <Container fluid>
              <Row className="header">
                <div className="image-container">
                  <img loading="lazy" src={supplier ? supplier.images[0].path : ""} alt="supplier image" className="background-image" />
                  <span>{t('cartPage.monPanier')}</span>
                </div>
              </Row>
            </Container>
            <Container>
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
                          <ul className="cart-items__list" >
                            {
                              cartItems.map((item: any, index: number) => {
                                return (
                                  <li className="cart-items__list__product" key={index}>
                                    <ArticleProvider item={item} remove={() => removeItemsWithIndex(index)} />
                                  </li>
                                )
                              })
                            }
                          </ul>
                        </div>
                        <div className="devider">
                        </div>
                        <div className="commentaire-section">
                          <span>{t('cartPage.commentaire')}</span>
                          <textarea name="commentaire" id="commentaire" cols={30} rows={10} value={aComment} onChange={(e) => handleCommentChange(e.target.value)} placeholder="Ex:sandwich"></textarea>
                        </div>

                        <div className="devider">
                        </div>
                        <div className="promos-list">
                          <ul>
                            {
                              promosList.length !== 0 && (
                                <>
                                  {
                                    promosList.map((promo: any, index: number) => {
                                      return (
                                        <button key={index} className="promo-button" onClick={() => {
                                          selectCoupon(promo)
                                        }}>
                                          {promo.title}
                                        </button>
                                      )

                                    })
                                  }
                                </>
                              )
                            }
                          </ul>
                        </div>
                        {/* promo start */}
                        <div className="promo-container">
                          <span>{t('cart.PromosCode')}</span>
                          <textarea name="code_promo" id="code_promo" placeholder="Code promo" value={promo} onChange={(e) => handlePromoChange(e.target.value)} ></textarea>
                          <button disabled={!couponExiste} style={{ backgroundColor: `${promoApplied ? "red" : "#FBC000"}` }} className={(couponExiste) ? "button" : "button disabled"} onClick={checkPromoCode}>
                            {promoApplied ? t('Annuler') : t('cartPage.appliquer')}
                          </button>
                        </div>
                        <div className="devider">
                        </div>
                        {/* promo end */}
                        {/* gift start */}

                        {
                          has_gift &&
                          <>
                            <div className="promo-container">
                              <span>{t('repasGratuit')}</span>
                              <textarea name="code_promo" readOnly id="gift_ammount" placeholder="0" value={`${giftAmmount.toFixed(3)}`} ></textarea>
                              <button style={{ backgroundColor: `${giftApplied ? "red" : "#FBC000"}` }} className={"button"} onClick={() => giftApplied ? clearGift() : applyGift()}>
                                {giftApplied ? t('Annuler') : t('cartPage.appliquer')}
                              </button>
                            </div>
                            <div className="devider">
                            </div>
                          </>

                        }
                        {/* gift end */}
                        {/* bonus start */}
                        <div className="promo-container">
                          <span>{t('cartPage.bonus')}</span>
                          <textarea name="bonus" id="bonus" placeholder="Bonnus" value={bonus.toFixed(2) + ' pts'}></textarea>
                          <button style={{ backgroundColor: `${appliedBonus > 0 ? "red" : '#FBC000'}` }} className={(bonus < 5000 || limitReachedBonus) ? "button disabled" : "button"} disabled={(bonus < 5000 || limitReachedBonus)} onClick={() => applyBonus()}>
                            {appliedBonus > 0 ? t('Annuler') : t('cartPage.appliquer')}
                          </button>
                        </div>
                        <ul>
                          <li>
                            <p className="bonus-message">{t('cartPage.bonusMsg')}</p>
                          </li>
                        </ul>
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
                            <span className="title">{t('cartPage.payMode')}</span>
                            <div className="method">
                              <img loading="lazy" className="icon" src={PayCashSVG} alt="My SVG" />
                              <label htmlFor="espece">{t('cartPage.espece')}</label>
                              <input className="form-check-input" type="radio" name="pay" id="espece" checked={payMode === 1} onClick={() => setPayMode(1)} />
                            </div>
                            <div className="method">
                              <img loading="lazy" className="cart" src={CartSVG} alt="My SVG" />
                              <label htmlFor="bnc-cart">{t('cartPage.bankPay')}</label>
                              <input className="form-check-input" type="radio" name="pay" id="bnc-cart" checked={payMode === 2} onClick={() => setPayMode(2)} />
                            </div>
                          </div>
                          <div className="devider">
                          </div>
                          <div className="deliv-details">
                            <div className={`select ${selectedOption == 1 ? "selected" : ""}`}  >
                              <img loading="lazy" className="icon1" src={dinnerFurnitureIcn} alt="sur place icon" onClick={() => handleOptionChange(1)} />
                              <input type="radio" value="1" id='domicile' name='type' checked={selectedOption === 1} />
                              <label htmlFor="domicile"  >{t('cartPage.surPalce')}</label>
                            </div>
                            <div className={`select ${selectedOption == 2 ? "selected" : ""}`}  >
                              <img loading="lazy" className="icon2" src={bagPaperShoppingIcn} alt="a emporter icon" onClick={() => handleOptionChange(2)} />

                              <input type="radio" value="2" id='travail' name='type' checked={selectedOption === 2} />
                              <label htmlFor="travail">{t('cartPage.emporter')}</label>
                            </div>
                            <div className={`select ${selectedOption == 3 ? "selected" : ""}`}  >
                              <img loading="lazy" className="icon3" src={scooterTransportIcn} alt="Livraison icon" onClick={() => handleOptionChange(3)} />
                              <input type="radio" value="3" id='autre' name='type' checked={selectedOption === 3} />
                              <label htmlFor="autre">{t('cartPage.delivery')}</label>
                            </div>
                          </div>
                          {
                            selectedOption == 2 && (
                              <>
                                <TimePicker
                                  className="time-picker"
                                  onChange={(newTime) => {
                                    // Parse the selected time and create a Date object
                                    if (newTime !== null) {
                                      const [hours, minutes] = newTime.split(':');
                                      const selectedDate = new Date();
                                      selectedDate.setHours(parseInt(hours, 10));
                                      selectedDate.setMinutes(parseInt(minutes, 10));
                                      const formattedTime = selectedDate.toLocaleString('en-US', {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                        year: 'numeric',
                                      });
                                      const parsedDate = new Date(formattedTime);
                                      setTakeAwayDate(parsedDate);
                                    }
                                  }}
                                  value={takeAwayDate}
                                  format="h:m a"
                                  disableClock={true}
                                />

                              </>
                            )
                          }
                          <div className="deliv-to">
                            <span className="title">{t('cartPage.delivto')}</span>
                            <div className="info-container">
                              <label htmlFor="client-name">{t('cartPage.client')} : </label>
                              <input type="text" name="client-name" value={name} placeholder="Client Name" onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className="info-container">
                              <label htmlFor="client-name">{t('cartPage.phoneNumber2')}</label>
                              <input type="text" name="" value={phoneNumber} placeholder="phone number" onChange={(e) => setPhoneNumber(e.target.value)} />
                            </div>
                            <div className="adress">
                              <p className="title" style={{ margin: 0 }} >
                                {t('profile.mesConfig.delivAdress')} :
                              </p>
                              <p className="adress-text">
                                {userPosition?.coords.label}
                              </p>
                            </div>

                            <div className="buttons">
                              <button className="continue" onClick={() => navigate('/', { replace: true })}>
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
                        </div>
                        )}
                    </div>

                    {/* 
                      order datails
                    */}
                    <div className="summair-container">
                      <span>{t('cartPage.total')}</span>
                      <div className={`info`}>

                        <div className="sous-total">
                          <span className="title">{t('profile.commands.sousTotal')}</span>
                          <span className="value">{sousTotal.toFixed(2)} DT</span>
                        </div>
                        <div className="panier">
                          <span>{t('cartPage.yourCart')}</span>
                          {appliedBonus > 0 &&
                            (
                              <div className="panie-row">
                                <span>{t('cartPage.bonus')}</span>
                                <span> - {(appliedBonus / 1000).toFixed(2)} DT</span>
                              </div>
                            )
                          }
                          {
                            promoReduction > 0 && (
                              <div className="panie-row">
                                <span>{t('cartPage.Coupon')}</span>
                                <span> - {(promoReduction).toFixed(2)} DT</span>
                              </div>
                            )

                          }
                          {
                            discountValue > 0 && (
                              <div className="panie-row">
                                <span>{t('cart.discount')}</span>
                                <span> - {(discountValue).toFixed(2)} DT</span>
                              </div>
                            )
                          }
                          {
                            giftAmmount > 0 && (
                              <div className="panie-row">
                                <span>{t('Repas Gratuit')}</span>
                                <span> - {(giftAmmount).toFixed(2)} DT</span>
                              </div>
                            )
                          }
                          <div className="panie-row">
                            <span>{t('supplier.delivPrice')}</span>
                            <span>{Number(deliveryPrice).toFixed(2)} DT</span>
                          </div>
                          <div className="panie-row"></div>
                        </div>

                        <div className="a-payer">
                          <span className="title">A payer</span>
                          <span className="value">{total.toFixed(2)} DT</span>
                        </div>
                        {/* <div className="button-container">
                          <button type="button"
                            onClick={goNextStep}>
                            {t('cartPage.paymentContinue')}
                          </button>
                        </div> */}
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
                  <button className="emptyButton" onClick={() => navigate('/', { replace: true })}>
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