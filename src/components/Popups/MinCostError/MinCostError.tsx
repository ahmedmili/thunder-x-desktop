import React from "react";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { clearCart } from "../../../Redux/slices/cart/cartSlice";
import { useAppSelector } from "../../../Redux/store";
import './minCostError.scss';


interface Props {
    close: () => void;
}

const MinCostError: React.FC<Props> = ({ close }) => {
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

    return (
        <>
            <div className="popup-overlay" onClick={close}>

            </div>
            <div className="min-cost-popup-container">
                <div onClick={close} className="close-button">X</div>

                <p className="message">
                    Le total de votre commande est inférieur au montant minimal d’achat fixé à {supplier.min_cost}Dt par {supplier.name}. Veuillez ajouter autre article au panier.
                </p>
                <div className="buttons">
                    <button className="goto-supp-button" onClick={goToSupplier}>Continuer vos achats</button>
                    <button className="delete-cmd-button" onClick={close}>Annuler</button>
                </div>
            </div>
        </>

    )
}

export default MinCostError