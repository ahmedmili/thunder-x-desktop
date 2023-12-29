

import { useState } from "react"
import "./BtnReset.scss"
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../Redux/store";
import { setRefresh } from "../../../../Redux/slices/home";
function BtnReset() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    function clickHandle() {        
        navigate(`/search/`, {      
            replace: false,
        });
        dispatch(setRefresh(true));
    }
    return (
        <div className="reset-filter-container">
          <button className="btn reset-filter-container__btn" onClick={clickHandle}>Reset</button>
        </div>
    )
}

export default BtnReset