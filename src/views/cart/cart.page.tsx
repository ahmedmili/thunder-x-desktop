import React, { useEffect, useState } from "react";
import {
  changeItemQuantity,
  clearCart,
  removeItem,
  setCodePromo,
  setComment,
  setDeliveryPrice,
  setSupplier
} from "../../Redux/slices/cart/cartSlice";

import PaymentIcon from '@mui/icons-material/Payment';
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
import { toast } from "react-toastify";
import * as z from "zod";
import { logout } from "../../Redux/slices/userSlice";
import { FoodItem } from "../../services/types";

import { Col, Container, Row } from "react-bootstrap";
import PaymentPopup from "../../components/Popups/payment/PaymentPopup";
import { adressService } from "../../services/api/adress.api";
import { cartService } from "../../services/api/cart.api";
import { supplierServices } from "../../services/api/suppliers.api";
import { localStorageService } from "../../services/localStorageService";
import "./cart.page.scss";

const CartPage: React.FC = () => {
  const { t } = useTranslation();

  // redux state vars
  const theme = useAppSelector(state => state.home.theme)
  const [template, setTemplate] = useState<number>(theme)
  const supplier = useAppSelector((state: RootState) => state.cart.supplier);
  const deliveryPrice = useAppSelector((state: RootState) => state.cart.deliveryPrice);
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const userPosition = useAppSelector((state) => state.location.position);
  const deliveryOption = useAppSelector((state: RootState) => state.cart.deliveryOption);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

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
  const [aComment, setAComment] = React.useState<string>(comment ? comment : "");

  const [popupType, setPopupType] = React.useState<string>("");
  const [showPopup, setShowPopup] = React.useState<boolean>(false);

  // promo vars
  const [promo, setPromo] = React.useState<string>("");
  const [promosList, setPromosList] = useState<any>([])
  const [couponExiste, setCouponExiste] = React.useState<boolean>(false);
  const [selectedCoupon, setSelectedCoupon] = React.useState<any>(null);
  const [promoReduction, setPromoReduction] = useState<number>(0)

  // bonus vars
  const [bonus, setbonus] = useState<number>(Number(supplier ? supplier.bonus : 0))
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


  // take away plan vars
  const command_type = deliveryOption === "delivery" ? 3 : 1;
  const [selectedOption, setSelectedOption] = useState<number>(command_type);

  var extraDeliveryCost = 0;
  var max_distance: any = 5;
  var distance = 0;

  var take_away_plan = 'default';
  const [takeAwayDate, setTakeAwayDate] = useState(new Date());

  var minCost: any;
  var isClosed: any;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // article component 
  interface Article {
    item: FoodItem,
  }

  const ArticleProvider: React.FC<Article> = ({ item }) => {
    const [count, setCount] = useState<number>(item.quantity)

    const handleRemoveItemFromCart = () => dispatch(removeItem({ id: item.product.id }));

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
    useEffect(() => {
      setTemplate(theme)
    }, [theme])

    return <>
      <td className="image-container">
        <img src={`${item.product.image[0] ? item.product.image[0].path : ""}`} alt="product image" />
        <div className="info-text">
          <span className="title">{item.product.name}</span>
          <span className="description" dangerouslySetInnerHTML={{ __html: item.product.description }}></span>

        </div>
      </td>
      <td className="sous-total">
        <span >{item.unitePrice.toFixed(2)} DT</span>
      </td>

      <td >
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
        </div>
      </td>

      <td className="sous-total">
        <span >
          {item.total.toFixed(2)} DT
        </span>
      </td>
      <td>
        <button type="button" onClick={handleRemoveItemFromCart}>X</button>
      </td>
    </>
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
    try {
      const options: any[] = cartItems.flatMap((item) => item.options);
      const optionsIds = options.map((opt) => (
        { option_id: opt[0].id }
      )
      )
      var year = takeAwayDate.getFullYear();
      var month = (takeAwayDate.getMonth() + 1).toString().padStart(2, '0'); // Zero-padding month
      var day = takeAwayDate.getDate().toString().padStart(2, '0'); // Zero-padding day
      var hours = takeAwayDate.getHours().toString().padStart(2, '0'); // Zero-padding hours
      var minutes = takeAwayDate.getMinutes().toString().padStart(2, '0'); // Zero-padding minutes
      var seconds = "00"; // Assuming you don't have seconds information

      var formattedDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

      const order = {
        addresse_id: 1,
        supplier_id: supplier,
        extraDeliveryCost: extraDeliveryCost,
        delivery_price: Math.round(deliveryPrice),
        mode_pay: payMode,
        applied_bonus: applied_bonus,
        total_price: total,
        promo_code: promo,
        products: cartItems.map((item) => ({
          id: item.product.id,
          supplier_id: item.supplier_data.supplier_id,
          qte: item.quantity, // set the quantity to the item's quantity
          options: optionsIds
        })),
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
      };
      if (isAuthenticated) {

        // validate the order object against the schema
        orderSchema.parse(order);
        const userToken = localStorageService.getUserToken();
        if (!userToken) {
          dispatch(logout());
          return;
        }
        if (Number(minCost) > total) {
          toast.warn("You have not reached the minimum cost.")
        } else if (isClosed === 0) {
          toast.warn("This restaurant is currently closed, please complete your order later.")
        } else {
          const { status, data } = await cartService.createOrder(order);
          if (status === 200) {
            dispatch(clearCart());
            toast.success("Order submitted successfully", data);
            dispatch(setDeliveryPrice(0));
            dispatch(setComment(""));
            dispatch(setCodePromo(""));
            dispatch(setSupplier(null));
            setPopupType('command_success')
            handlePopup()
          } else {
            toast.warn("something went wrong")
          }
        }

      } else {
        navigate("/login");
        toast.warn("You need to be logged in to make an order!");
      }
    } catch (error: any) {
      toast.error("Failed to submit order. Please try again.", error.message);
    }
  };

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
  const handleOptionChange = (event: any) => {
    setSelectedOption(parseInt(event.target.value));
  };

  //  get gifts
  const getclientGift = async () => {
    let body = { supplier_id: cartItems[0].supplier_data.supplier_id };
    const { status, data } = await cartService.getGift(body)
    if (data.data.succuss) {
      let gift = data.data.has_gift
      setHas_gift(gift);
      if (gift) {
        setMaxGiftCost(data.data.max_gift_cost)
        setMaxGiftId(data.data.gift_id)
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
    }
    else {
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
    const list = data.data.filter((item: any) => {
      item.nbr_commands > 0
    })
    setPromosList(list)
  }

  //  check promo validation
  const checkPromoCode = async () => {
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
            toast.success("valide code")
            CalculatePromoPrice();
            return 0;
          } else {
            toast.error("code promo invalid")
            return 0
          }
        }
      })
    }
  }

  // handle promo text state
  const handlePromoChange = (code: string) => {
    setPromo(code);
    // localStorageService.setCodePromo(code);
    dispatch(setCodePromo(code));
    setCouponExiste(true)
    if (code.length <= 0) {
      setCouponExiste(false)
    }
  };

  // handle promo state from list 
  const selectCoupon = (coupon: any) => {
    setPromo(coupon.code_coupon);
    //check if you're clicking on the same promo code
    if (selectedCoupon !== coupon) {
      setSelectedCoupon(coupon);
      setCouponExiste(true)
    } else {
      setCouponExiste(false)
    }
  }
  // calc promo value
  const CalculatePromoPrice = () => {
    var promoReduction
    if (Object.keys(selectedCoupon).length > 0) {

      if (selectedCoupon.apply_on === 'DELIVERY') {
        if (selectedCoupon.type === 'percentage') {
          promoReduction = (deliveryPrice * (selectedCoupon.value / 100));
          setPromoReduction(promoReduction)
          return 0
        }
        promoReduction = selectedCoupon.value;
        setPromoReduction(promoReduction)
        return 0
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
    }
    promoReduction = 0;
    setPromoReduction(promoReduction)
    return 0;
  }

  //  calc total befor reduction (gift / promo / bonus ...)
  const getSousTotal = () => {
    let sum = 0;
    cartItems.forEach((item: FoodItem) => sum = sum + item.total);
    setSousTotal(sum);
  }

  // calc total function
  const calcTotal = () => {
    setTotal(
      ((sousTotal - (appliedBonus / 1000)) + extraDeliveryCost + Number(cartItems[0].supplier_data.delivery_price) - promoReduction)
    )
  }

  // get supplier request
  const getSupplierById = async () => {
    const { status, data } = await supplierServices.getSupplierById(supplier.id)
    max_distance = data?.max_distance;
    minCost = data?.data.min_cost;
    isClosed = data?.status;
  }

  // get distance 
  const getDistance = () => {
    let obj = {
      supplier_id: supplier.id,
      lat: userPosition?.coords.latitude,
      lng: userPosition?.coords.longitude,
    };
    adressService.getDistance(obj).then(res => {
      res.data.data.code == 200 ? distance = res.data.data.distance : distance = 0
    })
  }
  // calc extra cost
  const getExtraSupplierInfo = () => {
    let extra_cost = localStorage.getItem('extra_delivery_cost') ?? 0;
    if (Number(extra_cost) > 0) {
    } else {
      extraDeliveryCost = (distance - max_distance) > 0 ? (distance - max_distance) : 0

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
    getDistance()
    getExtraSupplierInfo()

  }, [])

  // calc total for each changement 
  useEffect(() => {
    let check = supplier && cartItems.length > 0
    check && calcTotal()
  }, [sousTotal, appliedBonus, promoReduction])

  return (
    <>
      {
        cartItems.length > 0 && supplier ? (
          <Container className="cart-page-container" fluid>
            <Row className="header">
              <div className="image-container">
                <img src={supplier ? supplier.images[0].path : ""} alt="supplier image" className="background-image" />
                <span>{t('cartPage.monPanier')}</span>
              </div>
            </Row>
            <Row>
              <Col>
                <main>
                  <div className={`product-detail-container ${template === 1 && 'dark-background2'}`}>
                    <table>
                      <thead>
                        <td className="header-name">
                          {t('cartPage.product')}
                        </td>
                        <td>
                          {t('orderTrackingPage.price')}
                        </td>
                        <td>
                          {t('cartPage.Quantite')}
                        </td>
                        <td >
                          {t('profile.commands.sousTotal')}
                        </td>
                        <td>   </td>
                      </thead>
                      <tbody>
                        {
                          cartItems.map((item, index) => {
                            return (
                              <>
                                <tr key={index} className="ariticle-info-container">
                                  <ArticleProvider item={item} />
                                </tr>
                              </>)
                          })
                        }
                      </tbody>
                    </table>
                    <div className="devider">
                    </div>

                    <div className="commentaire-section">
                      <span>{t('cartPage.commentaire')}</span>
                      <textarea name="commentaire" id="commentaire" cols={30} rows={10} value={aComment} onChange={(e) => handleCommentChange(e.target.value)} ></textarea>
                    </div>
                    {/* {
                    has_gift && (
                      <>
                      </>
                    )
                  } */}
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
                                      {promo.code_coupon}
                                    </button>
                                  )

                                })
                              }
                            </>
                          )
                        }
                      </ul>
                    </div>
                    <div className="promo-container">
                      <input type="text" name="code_promo" id="code_promo" placeholder="Code promo" value={promo} onChange={(e) => handlePromoChange(e.target.value)} />
                      <button disabled={!couponExiste} className={(couponExiste) ? "button" : "button disabled"} onClick={checkPromoCode}>
                        {t('cartPage.appliquer')}
                      </button>
                    </div>

                    <div className="devider">
                    </div>

                    <div className="bonus">
                      <span>{t('cartPage.bonus')} : {bonus.toFixed(2)} pts</span>

                      <button className={(bonus < 5000 || appliedBonus || limitReachedBonus) ? "button disabled" : "button"} disabled={bonus < 5000} onClick={() => applyBonus()}>
                        {t('cartPage.appliquer')}
                      </button>
                    </div>
                    <ul>
                      <li>
                        <p className="bonus-message">{t('cartPage.bonusMsg')}</p>
                      </li>
                    </ul>

                    <div className="devider">
                    </div>

                    <div className="paiment-container">
                      <span className="title">{t('cartPage.payMode')}</span>
                      <div className="method">
                        <img className="icon" src={PayCashSVG} alt="My SVG" />
                        <label htmlFor="espece">{t('cartPage.espece')}</label>
                        <input className="form-check-input" type="radio" name="pay" id="espece" checked={payMode === 1} onClick={() => setPayMode(1)} />
                      </div>
                      <div className="method">
                        <PaymentIcon className="icon" />
                        <label htmlFor="bnc-cart">{t('cartPage.bankPay')}</label>
                        <input className="form-check-input" type="radio" name="pay" id="bnc-cart" checked={payMode === 2} onClick={() => setPayMode(2)} />
                      </div>
                    </div>

                    <div className="devider">
                    </div>

                    <div className="deliv-details">
                      <div className={`select ${selectedOption == 1 ? "selected" : ""}`}  >
                        <img className="icon1" src={dinnerFurnitureIcn} alt="sur place icon" onClick={() => setSelectedOption(1)} />
                        <input type="radio" value="1" id='domicile' name='type' checked={selectedOption === 1} onChange={handleOptionChange} />
                        <label htmlFor="domicile">{t('cartPage.surPalce')}</label>
                      </div>
                      <div className={`select ${selectedOption == 2 ? "selected" : ""}`}  >
                        <img className="icon2" src={bagPaperShoppingIcn} alt="a emporter icon" onClick={() => setSelectedOption(2)} />

                        <input type="radio" value="2" id='travail' name='type' checked={selectedOption === 2} onChange={handleOptionChange} />
                        <label htmlFor="travail">{t('cartPage.emporter')}</label>
                      </div>
                      <div className={`select ${selectedOption == 3 ? "selected" : ""}`}  >
                        <img className="icon3" src={scooterTransportIcn} alt="Livraison icon" onClick={() => setSelectedOption(3)} />
                        <input type="radio" value="3" id='autre' name='type' checked={selectedOption === 3} onChange={handleOptionChange} />
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

                  <div className="summair-container">
                    <span>{t('cartPage.total')}</span>
                    <div className={`info ${template === 1 && "dark-background2"}`}>
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
                        <div className="panie-row">
                          <span>{t('supplier.delivPrice')}</span>
                          <span>{cartItems.length > 0 ? cartItems[0].supplier_data.delivery_price : 0} DT</span>
                        </div>
                        <div className="panie-row"></div>
                      </div>

                      <div className="a-payer">
                        <span className="title">A payer</span>
                        <span className="value">{total.toFixed(2)} DT</span>
                      </div>
                      <div className="button-container">
                        <button type="button"
                          onClick={
                            () => {
                              setPopupType("error")
                              handlePopup()
                            }
                          }
                        >
                          {t('cartPage.paymentContinue')}
                        </button>
                      </div>
                    </div>
                  </div>
                </main>
              </Col>
            </Row>
            {
              showPopup && (

                <PaymentPopup close={handlePopup} type={popupType} />
              )
            }

          </Container>
        ) : (
          <Container>
            <Row>
              <Col>
                <div className="noDataFound">

                  <div className="empty-container-tab">
                    <div className="empty-header">
                    </div>
                    <p>Votre panier est actuellement vide.</p>
                  </div>
                  <img src={empty} alt=" not command items" />
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