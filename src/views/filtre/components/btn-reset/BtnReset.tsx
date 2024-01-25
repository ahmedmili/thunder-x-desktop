

import { useState } from "react"
import "./BtnReset.scss"
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../Redux/store";
import { setRefresh } from "../../../../Redux/slices/home";
import { useTranslation } from "react-i18next";
import { paramsService } from "../../../../utils/params";
function BtnReset() {
    const navigate = useNavigate();
    const navLocation = useLocation()
    const dispatch = useAppDispatch();
    const { t } = useTranslation()
    function clickHandle() {
        const searchParams = new URLSearchParams(location.search);
        let resultObject = paramsService.fetchParams(searchParams);
        let newParams :any = {
            lat: resultObject.lat,
            lng: resultObject.lng
        }
        newParams = paramsService.handleUriParams(newParams);
        searchParams.set('search', newParams);
        const { pathname } = navLocation;
        const newURL = pathname !== '/' ? `${pathname}?${searchParams.toString()}` : `/search/?${searchParams.toString()}`;
        navigate(newURL);   
        dispatch(setRefresh(true));
    }
    return (
        <div className="reset-filter-container">
            <button className="btn reset-filter-container__btn" onClick={clickHandle}>{t('Reset')}</button>
        </div>
    )
}

export default BtnReset