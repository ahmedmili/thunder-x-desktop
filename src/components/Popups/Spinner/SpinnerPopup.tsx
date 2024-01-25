import React from "react";

import Spinner from "../../spinner/Spinner";
import './spinnerPopup.scss';


interface Props {

    borderColor?: string;
    borderLeftColor?: string;
    name?: string;
}

const SpinnerPopup: React.FC<Props> = ({ borderColor = "#2EB5B2", borderLeftColor = "white", name = "" }) => {



    return (

        <>
            <div className="popup-overlay">
            </div>
            <div className="spinner">
                <Spinner name={name} borderColor={borderColor} borderLeftColor={borderLeftColor} />
            </div>
        </>

    )
}

export default SpinnerPopup