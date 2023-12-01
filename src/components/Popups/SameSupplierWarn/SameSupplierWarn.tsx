import React from "react";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { clearCart } from "../../../Redux/slices/cart/cartSlice";
import { useAppSelector } from "../../../Redux/store";
import './sameSupplierWarn.scss';


interface Props {
    close: () => void;
}

const SameSupplierWarn: React.FC<Props> = ({ close }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const supplier = useAppSelector((state) => state.cart.supplier)
    const dropCurrentCommand = () => {
        dispatch(clearCart())
        close()
    }
    const goToSupplier = () => {
        const supplier_id = supplier.id
        const supplier_name = supplier.name
        const supplier_full_url_data = `${supplier_id} ${supplier_name}`.split(' ').join('-');
        const new_url = `/restaurant/${supplier_full_url_data}/All/`
        navigate(new_url)
        close()
    }
    const goToPanierPage = () => {
        navigate('/cart/')

    }
    return (

        <>
            <div className="popup-overlay" onClick={close}>

            </div>
            <div className="not-same-popup-container">
                <div onClick={close} className="close-button">X</div>

                <h3 className="title">
                    Finaliser de la commande
                </h3>
                <p className="message">
                    Veuillez finaliser votre commande pour pouvoir commander à nouveau, sinon supprimer la commande non-finalisée
                </p>
                <div className="buttons">
                    <button className="finaliser-button" onClick={goToPanierPage}>Finaliser la commande précédente</button>
                    <button className="goto-supp-button" onClick={goToSupplier}>Réaccéder au même fournisseur</button>
                    <button className="delete-cmd-button" onClick={dropCurrentCommand}>Supprimer la commande précédente</button>
                </div>
            </div>
        </>

    )
}

export default SameSupplierWarn