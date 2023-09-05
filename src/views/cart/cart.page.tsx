import React, { useEffect, useState } from "react";
import {
  changeItemQuantity,
  clearCart,
  removeItem,
  setCodePromo,
  setComment,
  setDeliveryOption,
  setDeliveryPrice,
  setSupplier,
} from "../../Redux/slices/cart/cartSlice";
import { Cart } from "../../components/cart/cart";

import PaymentIcon from '@mui/icons-material/Payment';
import PayCashSVG from '../../assets/panier/pay-cash.svg'

import bagPaperShoppingIcn from '../../assets/panier/bag-paper-shopping-icn.png'
import dinnerFurnitureIcn from '../../assets/panier/dinner-furniture-icn.png'
import scooterTransportIcn from '../../assets/panier/scooter-transport-icn.png'

import { RootState, useAppDispatch, useAppSelector } from "../../Redux/store";
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

import * as z from "zod";
import { logout } from "../../Redux/slices/userSlice";
import { FoodItem } from "../../services/types";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./cart.page.scss";
import { cartService } from "../../services/api/cart.api";
import { localStorageService } from "../../services/localStorageService";
import { Col, Container, Row } from "react-bootstrap";
import { supplierServices } from "../../services/api/suppliers.api";
import { adressService } from "../../services/api/adress.api";

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const supplier = useAppSelector((state: RootState) => state.cart.supplier);
  const deliveryPrice = useAppSelector(
    (state: RootState) => state.cart.deliveryPrice
  );

  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const userPosition = useAppSelector((state) => state.location.position);
  const deliveryOption = useAppSelector(
    (state: RootState) => state.cart.deliveryOption
  );
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  // const codePromo = localStorageService.getCodePromo();
  // const supplier_bonus = localStorageService.getBonus();
  const comment = localStorageService.getComment();
  const userItem = localStorageService.getUser();
  const user = userItem ? JSON.parse(userItem) : null;

  const [name, setName] = React.useState(user?.firstname || "");
  const [phoneNumber, setPhoneNumber] = React.useState(user?.tel || "");

  const [sousTotal, setSousTotal] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  
  const [aComment, setAComment] = React.useState<string>(comment ? comment : "");

  const [promo, setPromo] = React.useState<string>("");
  const [promosList, setPromosList] = useState<any>([])
  const [couponExiste, setCouponExiste] = React.useState<boolean>(false);
  const [selectedCoupon, setSelectedCoupon] = React.useState<any>(null);
  const [promoReduction, setPromoReduction] = useState<number>(0)

  const [bonus, setbonus] = useState<number>(Number(supplier.bonus))
  const [appliedBonus, setAppliedBonus] = useState<number>(0)
  const [bonusApplied, setBonusApplied] = useState<boolean>(false)
  const [limitReachedBonus, setLimitReachedBonus] = useState<boolean>(false)

  const [has_gift, setHas_gift] = useState<boolean>(false)
  const [giftApplied, setGiftApplied] = useState<boolean>(false)
  const [maxGiftCost, setMaxGiftCost] = useState<any>(null)
  const [giftId, setMaxGiftId] = useState<number>(0)
  const [giftAmmount, setGiftAmmount] = useState<number>(0)
  const [limitReachedGift, setLimitReachedGift] = useState<boolean>(false)

  const [selectedOption, setSelectedOption] = useState<number>(1);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();


  const handleCommentChange = (comment: string) => {
    setAComment(comment);
    localStorageService.setComment(comment);
    dispatch(setComment(comment));
  };

  const handleOptionChange = (event: any) => {
    setSelectedOption(parseInt(event.target.value));
  };

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
      const order = {
        addresse_id: 1,
        supplier_id: supplier,
        delivery_price: Math.round(deliveryPrice),
        mode_pay: 1,
        applied_bonus: applied_bonus,
        total_price: total,
        promo_code: promo,
        products: cartItems.map((item) => ({
          id: item.product.id,
          supplier_id: item.supplier_data.supplier_id,
          qte: item.quantity, // set the quantity to the item's quantity
          // options: item.options
          //   .map((option) => ({ option_id: option.id })),
        })),
        lat: userPosition?.coords.latitude,
        lng: userPosition?.coords.longitude,
        total_price_coupon: promoReduction,
        tip: 0,
        is_delivery: deliveryOption === "delivery" ? 1 : 0,
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

        const { status, data } = await cartService.createOrder(order);
        if (status === 200) {
          dispatch(clearCart());
          toast.success("Order submitted successfully", data);
          dispatch(setDeliveryPrice(0));
          dispatch(setComment(""));
          dispatch(setCodePromo(""));
          dispatch(setSupplier(null));
          navigate("/track-order");
        }
      } else {
        navigate("/login");
        toast.warn("You need to be logged in to make an order!");
      }
    } catch (error: any) {
      console.error("Error submitting order:", error.message);
      toast.error("Failed to submit order. Please try again.", error.message);
    }
  };


  const getSousTotal = () => {
    let sum = 0;
    cartItems.forEach((item: FoodItem) => sum = sum + item.total);
    setSousTotal(sum);
  }


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

    return <>
      <td className="image-container">
        <img src={item.product.image[0].path} alt="product image" />
        <div className="info-text">
          <span className="title">{item.product.name}</span>
          <span className="description">{item.product.description}</span>
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

  // const applyGift = () => {
  //   setGiftApplied(true)
  //   let sum = 0
  //   if (bonusApplied) {
  //     sum = sousTotal - (appliedBonus / 1000);
  //   } else {
  //     sum = sousTotal;
  //   }
  //   if (sum > 0 && sum <= maxGiftCost) {
  //     setGiftAmmount(sum);
  //   }
  //   else {
  //     setGiftAmmount(maxGiftCost);
  //   }
  //   if (sum === giftAmmount) {
  //     setLimitReachedGift(true);

  //   }
  //   else {
  //     setLimitReachedGift(false);
  //   }
  // }

  const handlePromoChange = (code: string) => {
    setPromo(code);
    // localStorageService.setCodePromo(code);
    dispatch(setCodePromo(code));
    setCouponExiste(true)
    if (code.length <= 0) {
      setCouponExiste(false)
    }
  };

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
          }else {
            toast.error("code promo invalid")
            return 0
          }
        } 
      })
    }
  }

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

  const calcTotal = () => {
    console.log("caluating total")
    console.log("caluating total", ((sousTotal - (appliedBonus / 1000)) + Number(cartItems[0].supplier_data.delivery_price) - promoReduction))
    setTotal(
      ((sousTotal - (appliedBonus / 1000)) + Number(cartItems[0].supplier_data.delivery_price) - promoReduction)
    )
  }
  // const clearGift = () => {
  //   setGiftAmmount(0)
  //   setGiftApplied(false)
  //   setLimitReachedBonus(false)
  // }

  // const getSupplierById = async () => {
  //   const { status, data } = await supplierServices.getSupplierById(supplier.id)
  //   max_distance = data?.max_distance;
  //   minCost = data?.min_cost;
  //   isClosed = data?.status;
  // }

  // const getDistance = () => {
  //   let obj = {
  //     supplier_id: supplier.id,
  //     lat: userPosition?.coords.latitude,
  //     lng: userPosition?.coords.longitude,
  //   };
  //   adressService.getDistance(obj).then(res => console.log("distance", res))
  // }

  // useEffect(() => {
  //   console.log("total", total)
  //   console.log("giftAmmount", giftAmmount)
  //   console.log("limitReachedBonus", limitReachedBonus)
  // }, [giftAmmount])


  const getPromo = async () => {
    const { status, data } = await cartService.getAllPromoCodes()
    setPromosList(data.data)
  }

  useEffect(() => {
    // console.log("userPosition", userPosition)
    // console.log("bonus", bonus)
    // console.log("deliveryOption", deliveryOption)
    // console.log("deliveryPrice", deliveryPrice)
    // console.log("cartItems", cartItems)
    // console.log("supplier", supplier);
    // getDistance()
  }, [])

  useEffect(() => {
    localStorageService.setCart(cartItems);
    if (cartItems.length == 0) {
      dispatch(setSupplier(null));
      dispatch(setDeliveryPrice(null));
    }
  }, [cartItems]);


  useEffect(() => {
    isAuthenticated && getPromo();
    isAuthenticated && getclientGift();
    // getSupplierById()
    getSousTotal()
  }, [])

  useEffect(() => {
    calcTotal()
  }, [sousTotal, appliedBonus, promoReduction])

  return (
    <Container className="cart-page-container" fluid>
      <Row className="header">
        <div className="image-container">
          <img src={supplier.images[0].path} alt="supplier image" className="background-image" />
          <span>Mon Panier</span>
        </div>
      </Row>
      <Row>
        <Col>
          <main>
            <div className="product-detail-container">
              <table>
                <thead>
                  <td className="header-name">
                    Produit
                  </td>
                  <td>
                    Prix
                  </td>
                  <td>
                    Quantité
                  </td>
                  <td >
                    Sous-total
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
                <span>Commentaire</span>
                <textarea name="commentaire" id="commentaire" cols={30} rows={10} value={aComment} onChange={(e) => handleCommentChange(e.target.value)} ></textarea>
              </div>
              {
                has_gift && (
                  <>
                  </>
                )
              }
              <div className="devider">
              </div>

              <div className="promos-list">
                <ul>
                  {
                    promosList.length !== 0 && (
                      <>
                        {
                          promosList.map((promo: any, index: number) => {
                            return (<>
                              <button className="promo-button" onClick={() => {
                                selectCoupon(promo)
                                // handlePromoChange(promo.code_coupon)
                              }}>
                                {promo.code_coupon}
                              </button>
                              <li></li>
                            </>)

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
                  Applique
                </button>
              </div>

              <div className="devider">
              </div>

              <div className="bonus">
                <span>Bonus : {bonus.toFixed(2)} pts</span>

                <button className={(bonus < 5000 || appliedBonus || limitReachedBonus) ? "button disabled" : "button"} disabled={bonus < 5000} onClick={() => applyBonus()}>
                  Appliquer
                </button>
              </div>
              <ul>
                <li>
                  <p className="bonus-message">vous pouvez utiliser vos points une fois que vous avez accumulé un total de 5000 points</p>
                </li>
              </ul>

              <div className="devider">
              </div>

              <div className="paiment-container">
                <span className="title">Mode de paiement</span>
                <div className="method">
                  <img className="icon" src={PayCashSVG} alt="My SVG" />
                  <label htmlFor="espece">En espèces à la livraison</label>
                  <input className="form-check-input" type="radio" name="pay" id="espece" />
                </div>
                <div className="method">
                  <PaymentIcon className="icon" />
                  <label htmlFor="bnc-cart">Par carte bancaire</label>
                  <input className="form-check-input" type="radio" name="pay" id="bnc-cart" />
                </div>
              </div>

              <div className="devider">
              </div>

              <div className="deliv-details">
                <div className={`select ${selectedOption == 1 ? "selected" : ""}`}  >
                  <img className="icon1" src={dinnerFurnitureIcn} alt="sur place icon" onClick={() => setSelectedOption(1)} />
                  <input type="radio" value="1" id='domicile' name='type' checked={selectedOption === 1} onChange={handleOptionChange} />
                  <label htmlFor="domicile">Sur palce</label>
                </div>
                <div className={`select ${selectedOption == 2 ? "selected" : ""}`}  >
                  <img className="icon2" src={bagPaperShoppingIcn} alt="a emporter icon" onClick={() => setSelectedOption(2)} />

                  <input type="radio" value="2" id='travail' name='type' checked={selectedOption === 2} onChange={handleOptionChange} />
                  <label htmlFor="travail">A emporter</label>
                </div>
                <div className={`select ${selectedOption == 3 ? "selected" : ""}`}  >
                  <img className="icon3" src={scooterTransportIcn} alt="Livraison icon" onClick={() => setSelectedOption(3)} />
                  <input type="radio" value="3" id='autre' name='type' checked={selectedOption === 3} onChange={handleOptionChange} />
                  <label htmlFor="autre">Livraison</label>
                </div>
              </div>

              <div className="deliv-to">
                <span className="title">Livraison à</span>
                <div className="info-container">
                  <label htmlFor="client-name">Client : </label>
                  <input type="text" name="client-name" value={name} placeholder="Client Name" onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="info-container">
                  <label htmlFor="client-name">N° de téléphone :</label>
                  <input type="text" name="" value={phoneNumber} placeholder="phone number" onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
                <div className="adress">
                  <p className="title" style={{ margin: 0 }} >
                    Adresse de livraison :
                  </p>
                  <p className="adress-text">
                    {userPosition?.coords.label}
                  </p>
                </div>

                <div className="buttons">
                  <button className="continue" onClick={() => navigate('/')}>
                    Continuer mes achats
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
                    Commander
                  </button>
                </div>

              </div>

            </div>

            <div className="summair-container">
              <span>Total</span>
              <div className="info">
                <div className="sous-total">
                  <span className="title">Sous-total</span>
                  <span className="value">{sousTotal.toFixed(2)} DT</span>
                </div>
                <div className="panier">
                  <span>Panier</span>
                  {appliedBonus > 0 &&
                    (
                      <div className="panie-row">
                        <span>bonus</span>
                        <span> - {(appliedBonus / 1000).toFixed(2)} DT</span>
                      </div>
                    )
                  }
                  {
                    promoReduction > 0 && (
                      <div className="panie-row">
                        <span>Coupon</span>
                        <span> - {(promoReduction).toFixed(2)} DT</span>
                      </div>
                    )
                  }
                  <div className="panie-row">
                    <span>Frais de livraison</span>
                    <span>{cartItems[0].supplier_data.delivery_price} DT</span>
                  </div>
                  <div className="panie-row"></div>
                </div>

                <div className="a-payer">
                  <span className="title">A payer</span>
                  <span className="value">{total.toFixed(2)} DT</span>
                </div>
                <div className="button-container">
                  <button type="button">
                    contenu le paiement
                  </button>
                </div>
              </div>
            </div>
          </main>
        </Col>
      </Row>

    </Container>
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