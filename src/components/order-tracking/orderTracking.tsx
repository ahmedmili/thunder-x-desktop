import './orderTracking.scss';
import { Container } from 'react-bootstrap'
import orderTrackingMap from './../../assets/order-tracking-map-img.jpg';

export const OrderTracking = () => {
    return (
        <div className="order-tracking-area">
            <Container>
                <div className="order-tracking-description">
                    <h3 className="order-tracking-title">
                        Suivez votre commande jusqu'à votre porte & recevez votre plat préféré rapidement.
                    </h3>
                    <p className="order-tracking-desc">
                        Dès que votre livreur prend en charge votre commande, vous pouvez suivre sa progression 
                        tout au long du trajet. Recevez une notification dès qu'il approche de votre emplacement 
                        pour une expérience de livraison transparente et pratique.
                    </p>
                    
                </div>
                <div className="order-tracking-map">
                    <img src={orderTrackingMap} alt="" />
                </div>
            </Container>
        </div>
    )
}