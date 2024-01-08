

import { useState } from "react"
import "./BtnReset.scss"
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../Redux/store";
import { setRefresh } from "../../../../Redux/slices/home";
import { useTranslation } from "react-i18next";
function BtnReset() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { t } = useTranslation()
    function clickHandle() {
        navigate(`/search/`, {
            replace: false,
        });
        dispatch(setRefresh(true));
    }
    return (
        <div className="reset-filter-container">
            <button className="btn reset-filter-container__btn" onClick={clickHandle}>{t('Reset')}</button>
        </div>
    )
}

export default BtnReset