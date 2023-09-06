import { useAppDispatch } from '../../Redux/store';
import { removeItem, changeItemQuantity } from '../../Redux/slices/cart/cartSlice'; // Change import statement to changeItemQuantity

import { FoodItem } from '../../services/types';
import React, { useEffect, useState } from 'react';

import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import empty from '../../assets/panier/empty.png'

import './cart.scss'
import { useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    console.log(items)
  }, [items])

  const dispatch = useAppDispatch();
  const navigate = useNavigate()
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
            <img src={props.image} alt="product image" className='product-image' />
          </div>
          <div className="product-info">
            <div className='name'>{props.name}</div>
            <div className='unit-total'>{props.price} DT</div>
            <div className='description'>{props.description}</div>
          </div>
          <button className="remove-btn" onClick={handleRemoveItemFromCart}>
            X
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

  useEffect(() => {
    getSousTotal();
  }, [items])
  return (
    <div className="cart-main">

      {
        items.length > 0 ? (
          <>
            <section className="cart-info">
              <div className="text-info">
                <span className='title'> Votre Commande</span>
                <p className='supplier-name'>{items[0].supplier_data.supplier_name}</p>
                <p className='position'>Livraison a khzama sousse</p>
              </div>
              <button className="close-btn" onClick={closeButton}>
                X
              </button>
            </section>
            <div className='sous-total'>
              <span>{items.length} article</span>
              <span>sous-total {sousTotal.toFixed(2)} dt</span>
            </div>


            {
              items.length > 0 &&
              items.map((item, index) => {
                let data: Article = {
                  id: item.product.id,
                  image: item.product.image[0].path,
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
                <span className='title'>Sous-total</span>
                <span className='value'>{sousTotal.toFixed(2)} DT</span>
              </div>
              <div className="info-text">
                <span className='title'>Forfait</span>
                <span className='value'>0.00 DT</span>
              </div>
              <div className="info-text">
                <span className='title'>Frais de livraison</span>
                <span className='value'>{Number(items[0].supplier_data.delivery_price).toFixed(2)}DT</span>
              </div>
            </section>
            <section className="price-resume">
              <div className="info-text">
                <span className='title'>Total</span>
                <span className='value'>{sousTotal + Number(items[0].supplier_data.delivery_price)} DT</span>
              </div>
            </section>
            <section className='cart-btns' >
              <button className='to-panier' onClick={() => {
                closeButton()
                navigate('/cart')
              }

              }>
                Voir le panier
              </button>
              <button className='to-paiment'>
                Passer au paiement
              </button>
            </section>
          </>
        ) : (
          <>
            <section className="cart-info">
              <div className="text-info">
                <span className='title'> Votre Commande</span>
              </div>
              <button className="close-btn" onClick={closeButton}>
                X
              </button>
            </section>
            <section className='empty-cart-main'>
              <img src={empty} alt="empty cart" />
              <p>Vous n’avez passé aucune commande pour le moment</p>
              <button className='emptyButton' onClick={() => navigate('/')}>
                Je commande
              </button>
            </section>
          </>
        )

      }

    </div>
  );
};
