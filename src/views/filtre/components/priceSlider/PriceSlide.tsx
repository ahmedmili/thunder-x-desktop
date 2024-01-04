

import { useEffect, useState } from "react";
import "./priceSlide.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { homeRefresh, setRefresh } from "../../../../Redux/slices/home";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from 'lodash';
import Slider from '@mui/material/Slider';
function PriceSlide() {
    const [rangeValues, setRangeValues] = useState<any>([0, 100]);
    const navLocation = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const refresh = useSelector(homeRefresh)
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        let min = 0;
        let max=100
        if (searchParams.has("min_price")) {
           min = Number(searchParams.get("min_price"))
        }
        if (searchParams.has("max_price")) {
           max = Number(searchParams.get("max_price"))
        }
        setRangeValues([min, max]);
    }, []);
    useEffect(() => {    
        if (refresh) {
           const searchParams = new URLSearchParams(location.search);
            if (!searchParams.has("min_price")&&!searchParams.has("max_price")) {
                setRangeValues([0, 100])
            } 
        }    
    }, [refresh]);
    const handleRangeChange = (event: any) => { 
        event.preventDefault();
        setRangeValues([Number(event.target?.value[0]), Number(event.target?.value[1])]);    
             
    };   
    const onGlissEnd = (event: any) => { 
        handleInputChange();
    }    
    const handleInputChange = debounce(() => {
        const searchParams = new URLSearchParams(location.search);
        if (Number(searchParams.get('min_price')) !== Number(rangeValues[0]) || Number(searchParams.get('max_price')) !== Number(rangeValues[1])) {
            if (searchParams.has('min_price')) {
                searchParams.set('min_price', rangeValues[0]);
            }
            else {
                searchParams.append('min_price', rangeValues[0]);
            }
            if (searchParams.has('max_price')) {
                searchParams.set('max_price', rangeValues[1]);
            }
            else {
                searchParams.append('max_price', rangeValues[1]);
            }
            navigate(`/search/?${searchParams.toString()}`, {      
                replace: false,
            });
            dispatch(setRefresh(true));   
        }     
    }, 200);  
    return (
        <div className="price-filter-container">
            <h1 className="price-filter-container__title"> filtrer par prix</h1>
            <div className="price-filter-container__container" >
                <span className="price-filter-container__container__price" >Prix:</span>
                <span className="price-filter-container__container__rang-value"> {rangeValues[0]+'dt -' +rangeValues[1]+ 'dt' }</span>
            </div>
            <Slider
                value={rangeValues}
                onChange={handleRangeChange}
                valueLabelDisplay="off"
                disableSwap
                onMouseUp={onGlissEnd}
                size="small"
            />          
        </div>
    )
}

export default PriceSlide