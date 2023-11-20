import { changeItemQuantity, removeItem } from '../../Redux/slices/cart/cartSlice'; // Change import statement to changeItemQuantity
import { useAppDispatch, useAppSelector } from '../../Redux/store';

import React, { useEffect, useState } from 'react';
import { FoodItem } from '../../services/types';

import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import empty from '../../assets/panier/empty.png';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PaymentPopup from '../Popups/payment/PaymentPopup';
import './cart.scss';
import CloseIcon from '@mui/icons-material/Close';
interface CartProps {
  items: FoodItem[];
  closeButton: any
}

interface Article {
  id: number;
  image: string;
  price: number
  total: number;
  name: string;
  description: string;
  count: number
}


export const Cart: React.FC<CartProps> = ({ items, closeButton }) => {
  const [sousTotal, setSousTotal] = useState<number>(0)
  const [popupType, setPopupType] = useState<string>("")
  const [locationName, setLocationName] = useState<string>("")
  const [showPopup, setShowPopup] = useState<boolean>(false)


  const location = useAppSelector(state => state.location.position)

  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const { t } = useTranslation()


  useEffect(() => {
    setLocationName("" + location?.coords.label)
  }, [location])

  const ArticlesProvider: React.FC<Article> = (props) => {
    const [count, setCount] = useState<number>(props.count)


    const handleRemoveItemFromCart = () => dispatch(removeItem({ id: props.id }));

    const handleIncreaseQuantity = () => {
      dispatch(
        changeItemQuantity({
          itemId: Number(props.id),
          quantity: props.count + 1,
        })
      );
    };

    const handleDecreaseQuantity = () => {
      if (count > 1) {
        dispatch(
          changeItemQuantity({
            itemId: Number(props.id),
            quantity: props.count - 1,
          })
        );
      }
    };

    return (
      <section className='article-provider'>
        {/* Use the props here */}
        <div className='head'>
          <div className="image-container">
            <img src={`${props.image ? props.image : ""}`} loading="lazy" alt="product image" className='product-image' />
          </div>
          <div className="product-info">
            <div className='name'>{props.name}</div>
            <div className='unit-total'>{props.price} DT</div>
            <div className="description" dangerouslySetInnerHTML={{ __html: props.description }}></div>

          </div>
          <button className="remove-btn" onClick={handleRemoveItemFromCart}>
            <CloseIcon className='close-icon'></CloseIcon>
          </button>
        </div>
        <div className='foot'>
          <div className="count-container">
            <input readOnly={true} type="number" name="product-count" id="product-count" value={count} onChange={(e) => { (parseInt(e.target.value) >= 1) && setCount(parseInt(e.target.value)) }} />

            <div className="count-buttons">
              <button onClick={handleIncreaseQuantity} >
                <KeyboardArrowUpOutlinedIcon className="count-more" />
              </button>
              <button onClick={handleDecreaseQuantity} >

                <KeyboardArrowDownOutlinedIcon className="count-less" />
              </button>
            </div>
          </div>
          <span className='total'>{props.total.toFixed(2)} DT</span>
        </div>
      </section>
    );
  };

  const getSousTotal = () => {
    let sum = 0;
    items.forEach((item: FoodItem) => sum = sum + item.total);
    setSousTotal(sum);
  }

  const handlePopupe = () => {
    setShowPopup(!showPopup)
    setPopupType("error")
  }

  useEffect(() => {
    getSousTotal();
  }, [items])

  return (
    <div className={`cart-main`}>

      {
        items.length > 0 ? (
          <>
            <section className="cart-info">
              <div className="text-info">
                <span className='title'>{t('cart.payment.yourCommand')}</span>
                <p className='supplier-name'>{items[0].supplier_data.supplier_name}</p>
                <p className='position'>{t("cart.payment.delivTo")} {": " + locationName}</p>
              </div>
              <button className="close-btn" onClick={closeButton}>
                <CloseIcon className='close-icon'></CloseIcon>
              </button>
            </section>
            <div className='sous-total'>
              <span>{items.length} article</span>
              <span>{t('profile.commands.sousTotal')} {sousTotal.toFixed(2)} dt</span>
            </div>


            {
              items.length > 0 &&
              items.map((item, index) => {
                let data: Article = {
                  id: item.product.id,
                  image: item.product.image[0] ? item.product.image[0].path : "",
                  price: item.unitePrice,
                  total: item.total,
                  name: item.product.name,
                  description: item.product.description,
                  count: item.quantity
                }
                return (
                  <div key={index}>
                    <ArticlesProvider {...data} />
                  </div>)
              })
            }

            <section className="price-resume">
              <div className="info-text">
                <span className='title'>{t('profile.commands.sousTotal')}</span>
                <span className='value'>{sousTotal.toFixed(2)} DT</span>
              </div>
              <div className="info-text">
                <span className='title'>Forfait</span>
                <span className='value'>0.00 DT</span>
              </div>
              <div className="info-text">
                <span className='title'>{t("supplier.delivPrice")}</span>
                <span className='value'>{Number(items[0].supplier_data.delivery_price).toFixed(2)}DT</span>
              </div>
            </section>
            <section className="price-resume">
              <div className="info-text">
                <span className='title'>{t("cartPage.total")}</span>
                <span className='value'>{sousTotal + Number(items[0].supplier_data.delivery_price)} DT</span>
              </div>
            </section>
            <section className='cart-btns' >
              <button className='to-panier' onClick={() => {
                closeButton()
                navigate('/cart')
              }

              }>
                {t('cart.payment.checkCart')}
              </button>
              <button className='to-paiment'
                onClick={
                  () => {
                    handlePopupe()
                  }
                }
              >
                {t("cart.payment.toPayment")}
              </button>
            </section>

            {
              showPopup && (
                <>
                  <PaymentPopup type='error' close={handlePopupe} />
                </>
              )

            }
          </>
        ) : (
          <>
            <section className="cart-info">
              <div className="text-info">
                <span className='title'> {t('cart.payment.yourCommand')}</span>
              </div>
              <button className="close-btn" onClick={closeButton}>
                <CloseIcon className='close-icon'></CloseIcon>
              </button>
            </section>
            <section className='empty-cart-main'>
              <img loading="lazy" src={empty} alt="empty cart" />
              <p>{t('cart.payment.noCommands')}</p>
              <button className='emptyButton' onClick={() => {
                closeButton()
                navigate('/')
              }}>
                {t('cart.payment.iCommand')}
              </button>
            </section>
          </>
        )
      }
    </div>
  );
};
