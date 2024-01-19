import { changeItemQuantity, removeItemWithIndex } from '../../Redux/slices/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '../../Redux/store';

import React, { useEffect, useState } from 'react';
import { FoodItem } from '../../services/types';

import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import empty from '../../assets/panier/empty.png';

import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { adressService } from '../../services/api/adress.api';
import { localStorageService } from '../../services/localStorageService';
import './cart.scss';
interface CartProps {
  items: FoodItem[];
  closeButton: any
  type?: string
}


interface Article {
  id: number;
  image: string;
  price: number;
  default_price: number;
  total: number;
  name: string;
  description: string;
  count: number,
  type?: string,
  remove: () => void

}


export const Cart: React.FC<CartProps> = ({ items, closeButton, type }) => {
  const [sousTotal, setSousTotal] = useState<number>(0)
  const [locationName, setLocationName] = useState<string>("")
  const [discount_value, setDiscountValue] = useState<number>(0)
  const [delivPrice, setDelivPrice] = useState<number>(0)

  var distance: number = 0;
  var extraDeliveryCost = 0;
  var max_distance: number = 5;

  const location = useAppSelector(state => state.location.position)
  const userPosition = useAppSelector((state) => state.location.position);

  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const { t } = useTranslation()

  const navigateToHome = () => {
    const currentLocation = localStorageService.getCurrentLocation()
    currentLocation ? navigate('/search') : navigate('/')
  }

  const ArticlesProvider: React.FC<Article> = (props) => {
    const [count, setCount] = useState<number>(props.count)
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
            <div className='unit-total'>{props.price != props.default_price && props.default_price && <span className='default-price'> {Number(props.default_price).toFixed(2)}DT </span>}   {Number(props.price).toFixed(2)} DT</div>
            <div className="description" dangerouslySetInnerHTML={{ __html: props.description }}></div>

          </div>

          {
            type != "addToCart" ? (
              <button className="remove-btn" onClick={props.remove}>
                <CloseIcon className='close-icon'></CloseIcon>
              </button>
            ) : (
              <div className="notif-count-container">
                {count}
              </div>
            )
          }

        </div>
        {
          type != "addToCart" && (
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
          )
        }

      </section>
    );
  };

  const getSousTotal = () => {
    let sum = 0;
    let discountVal = 0;
    items.forEach((item: FoodItem) => {

      sum += item.total
      discountVal += (item.default_price * item.quantity) - item.total
    });
    setSousTotal(sum);
    setDiscountValue(discountVal)
  }

  const getDistance = async () => {
    if (items.length > 0) {
      let obj = {
        supplier_id: items[0].supplier_data.supplier_id,
        lat: userPosition?.coords.latitude,
        long: userPosition?.coords.longitude,
      };
      const res = await adressService.getDistance(obj)
      res.data.code == 200 ? distance = res.data.data.distance : distance = 0
      extraDeliveryCost = (distance - max_distance) > 0 ? Math.ceil(distance - max_distance) : 0
      const deliveryPrice = items.length > 0 ? Number(items[0].supplier_data.delivery_price) + extraDeliveryCost : 0
      setDelivPrice(deliveryPrice)
    }
  }

  const removeItemsWithIndex = (i: number) => {
    dispatch(removeItemWithIndex({ index: i }))
  }

  useEffect(() => {
    getSousTotal();
  }, [items])

  useEffect(() => {
    setLocationName("" + location?.coords.label)
  }, [location])

  useEffect(() => {
    getDistance()
  }, [])

  return (
    <div className={`cart-main`} style={type != "addToCart" ? {} : { maxHeight: '21vh' }}>

      {
        items.length > 0 ? (
          <>
            <section className="cart-info">
              {
                type != "addToCart" && (
                  <div className="text-info">
                    <span className='title'>{t('cart.payment.yourCommand')}</span>
                    <p className='supplier-name'>{items[0].supplier_data.supplier_name}</p>
                    <p className='position'>{t("cart.payment.delivTo")} {": " + locationName}</p>
                  </div>
                )
              }
              <button className="close-btn" onClick={closeButton} style={type != "addToCart" ? {} : { marginBottom: '12px' }}>
                <CloseIcon className='close-icon'></CloseIcon>
              </button>

            </section>
            {
              type != "addToCart" && (
                <div className='sous-total'>
                  <span>{items.length} {t('product')}</span>
                  <span>{t('profile.commands.sousTotal')} {sousTotal.toFixed(2)} dt</span>
                </div>
              )
            }

            {
              items.length > 0 &&
              items.map((item, index) => {
                let data: Article = {
                  id: item.product.id,
                  image: item.product.image[0] ? item.product.image[0].path : "",
                  price: item.unitePrice,
                  default_price: item.product.default_price ? item.default_price : item.unitePrice,
                  total: item.total,
                  name: item.product.name,
                  description: item.product.description,
                  count: item.quantity,
                  remove: () => removeItemsWithIndex(index)
                }
                return (
                  <div key={index}>
                    <ArticlesProvider {...data} />
                  </div>)
              })
            }
            {
              type != "addToCart" && (
                <>
                  <section className="price-resume">
                    <div className="info-text">
                      <span className='title'>{t('profile.commands.sousTotal')}</span>
                      <span className='value'>{sousTotal.toFixed(2)} DT</span>
                    </div>
                    {
                      discount_value && discount_value > 0 ?
                        <div className="info-text">
                          <span className='title'>{t('cart.discount')}</span>
                          <span className='value'>-{Number(discount_value).toFixed(2)}DT</span>
                        </div> : <></>
                    }
                    <div className="info-text">
                      <span className='title'>{t("supplier.delivPrice")}</span>
                      <span className='value'>{Number(delivPrice).toFixed(2)}DT</span>
                    </div>
                  </section>
                  <section className="price-resume">
                    <div className="info-text">
                      <span className='title'>{t("cartPage.total")}</span>
                      <span className='value'>{(sousTotal + Number(delivPrice)).toFixed(2)} DT</span>
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
                  </section>
                </>
              )
            }


          </>
        ) : (
          <>
            {
              type != "addToCart" && (
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
                      navigateToHome()
                    }}>
                      {t('cart.payment.iCommand')}
                    </button>
                  </section>
                </>

              )
            }

          </>
        )
      }
    </div>
  );
};
