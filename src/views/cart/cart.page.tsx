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
  const userItem = localStorageService.getUser();
  const codePromo = localStorageService.getCodePromo();
  const comment = localStorageService.getComment();
  const user = userItem ? JSON.parse(userItem) : null;
  const [name, setName] = React.useState(user?.firstname || "");
  const [phoneNumber, setPhoneNumber] = React.useState(user?.tel || "");
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);


  const [aComment, setAComment] = React.useState<string>(comment ? comment : "");
  const [promo, setPromo] = React.useState<string>(codePromo ? codePromo : "");
  const [sousTotal, setSousTotal] = useState<number>(0)


  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("userPosition", userPosition)
    console.log("deliveryOption", deliveryOption)
    console.log("deliveryPrice", deliveryPrice)
    console.log("cartItems", cartItems)
    console.log("supplier", supplier);
    isAuthenticated && (
      async () => {
        const { status, data } = await cartService.getAllPromoCodes()
        console.log("data", data)
      })
  }, [])



  const handleCommentChange = (comment: string) => {
    setAComment(comment);
    localStorageService.setComment(comment);
    dispatch(setComment(comment));
  };
  const handlePromoChange = (code: string) => {
    setPromo(code);
    localStorageService.setCodePromo(code);
    dispatch(setCodePromo(code));
  };

  useEffect(() => {
    localStorageService.setCart(cartItems);
    if (cartItems.length == 0) {
      dispatch(setSupplier(null));
      dispatch(setDeliveryPrice(null));
    }
  }, [cartItems]);

  const submitOrder = async (
    cartItems: FoodItem[],
    deliveryOption: "delivery" | "pickup" | "surplace",
    name: string,
    phoneNumber: string,
    aComment: string,
    total: number,
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
        total_price: total,
        products: cartItems.map((item) => ({
          id: item.product.id,
          supplier_id: item.supplier_data.supplier_id,
          qte: item.quantity, // set the quantity to the item's quantity
          options: item.options
            .map((option) => ({ option_id: option.id })),
        })),
        lat: userPosition?.coords.latitude,
        lng: userPosition?.coords.longitude,
        total_price_coupon: 14,
        tip: 14,
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
  useEffect(() => {
    getSousTotal()
  }, [])

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
                  {/* <tr className="devider-row">
                    <td className="devider">
                    </td>
                  </tr> */}
                </tbody>
              </table>
              <div className="devider">
              </div>

              <div className="commentaire-section">
                <span>Commentaire</span>
                <textarea name="commentaire" id="commentaire" cols={30} rows={10} value={aComment} onChange={(e) => handleCommentChange(e.target.value)} ></textarea>
              </div>

              <div className="devider">
              </div>

              <div className="promo-container">
                <input type="text" name="code_promo" id="code_promo" placeholder="Code promo" value={promo} onChange={(e) => handlePromoChange(e.target.value)} />
                <button>
                  Applique
                </button>
              </div>

              <div className="devider">
              </div>

              <div className="bonus">
                <span>Bonus : 0 pts</span>

                <button>
                  Appliquer
                </button>
              </div>
              <ul>
                <li>
                  <p className="bonus-message">vous pouvez utiliser vos points une fois que vous avez accumulé un total de 5000 points</p>
                </li>
              </ul>
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
                  <div className="panie-row">
                    <span>Forfait</span>
                    <span>0.00 DT</span>
                  </div>
                  <div className="panie-row">
                    <span>Frais de livraison</span>
                    <span>{cartItems[0].supplier_data.delivery_price} DT</span>
                  </div>
                  <div className="panie-row"></div>
                </div>

                <div className="a-payer">
                  <span className="title">A payer</span>
                  <span className="value">{sousTotal + Number(cartItems[0].supplier_data.delivery_price)} DT</span>
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
    // <Container maxWidth={false} className="container">
    //   <Box
    //     width="100%"
    //     sx={{
    //       backgroundColor: "#fcfcfc",
    //       alignSelf: "center",
    //       display: "flex",
    //       flexDirection: "column",
    //     }}
    //   >
    //     <Typography style={{ color: "#000000", margin: "1rem" }} variant="h4">
    //       {t("cartPage.yourCart")}
    //     </Typography>

    //     {/* suppliers section */}
    //     <Typography className="suppliers" variant="h6">
    //       {t("cartPage.supplier")}:{" "}
    //       {supplier ? supplier.name : t("cartPage.noSupplierYet")}
    //     </Typography>

    //     {/* <Cart items={cartItems} /> */}

    //     <Typography className="delivery" variant="h6">
    //       {t("cartPage.delivery")}:{" "}
    //       {deliveryPrice ? Math.round(deliveryPrice) : "0"} DT
    //     </Typography>

    //     <Typography style={{ color: "#000000", margin: "1rem" }} variant="h6">
    //       {t("cartPage.total")}: {/*total*/} DT
    //     </Typography>
    //     <TextField
    //       label={t("cartPage.addComment")}
    //       value={aComment}
    //       onChange={handleCommentChange}
    //       fullWidth
    //       margin="normal"
    //     />
    //     <RadioGroup
    //       value={deliveryOption}
    //       onChange={(event: any) =>
    //         dispatch(setDeliveryOption(event.target.value))
    //       }
    //       className="RadioGroup"
    //     >
    //       <FormControlLabel
    //         className="FormControlLabel"
    //         value="delivery"
    //         control={<Radio />}
    //         label={t("livraison")}
    //       />
    //       <FormControlLabel
    //         className="FormControlLabel"
    //         value="pickup"
    //         control={<Radio />}
    //         label={t("emporter")}
    //       />
    //       <FormControlLabel
    //         className="FormControlLabel"
    //         value="surplace"
    //         control={<Radio />}
    //         label="Sur place"
    //       />
    //     </RadioGroup>
    //     <Box>
    //       <TextField
    //         label={t("cartPage.name")}
    //         value={name}
    //         onChange={(event) => setName(event.target.value)}
    //         fullWidth
    //         margin="normal"
    //       />
    //       <TextField
    //         label={t("cartPage.phoneNumber")}
    //         value={phoneNumber}
    //         onChange={(event) => setPhoneNumber(event.target.value)}
    //         fullWidth
    //         margin="normal"
    //       />
    //     </Box>
    //     <Button
    //       variant="contained"
    //       color="primary"
    //       style={{ margin: "2rem" }}
    //       // onClick={() =>
    //       //   submitOrder(
    //       //     cartItems,
    //       //     deliveryOption,
    //       //     name,
    //       //     phoneNumber,
    //       //     aComment,
    //       //     total,
    //       //     dispatch,
    //       //     userPosition,
    //       //     supplier.id,
    //       //     deliveryPrice
    //       //   )
    //       // }
    //     >
    //       {t("submitOrder")}
    //     </Button>
    //   </Box>
    // </Container>
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
      options: z.array(z.object({ option_id: z.number() })),
    })
  ),
  tip: z.number(),
  total_price_coupon: z.number(),
  lat: z.number(),
  lng: z.number(),
  is_delivery: z.number(),
  phone: phoneSchema,
  name: nameSchema,
});
