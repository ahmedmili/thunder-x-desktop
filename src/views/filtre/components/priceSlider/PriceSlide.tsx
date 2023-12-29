

import { useEffect, useState } from "react";
import "./priceSlide.scss";
import { useNavigate } from "react-router-dom";
import { homeRefresh, setRefresh } from "../../../../Redux/slices/home";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from 'lodash';
function PriceSlide() {
    const [rangeValues, setRangeValues] = useState([0, 1000]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const refresh = useSelector(homeRefresh)
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        let min = 0;
        let max=1000
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
                setRangeValues([0, 1000])
            } 
        }    
    }, [refresh]);
    const handleRangeChange = (event: any) => {     
        event.preventDefault();
        if (Number(event.target.value) <= rangeValues[1]) {
            setRangeValues([Number(event.target.value), rangeValues[1]]);
            handleInputMinChange(event)
        } 
    };
    const handleSecondRangeChange = (event: any) => {
        event.preventDefault();
        if (Number(event.target.value) >= rangeValues[0]) {
            setRangeValues([rangeValues[0], Number(event.target.value)]);
            handleInputMaxChange(event)
        }
    };
    const handleInputMinChange = debounce((event) => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.has('min_price')) {
            searchParams.set('min_price', event.target.value);
        }
        else {
            searchParams.append('min_price', event.target.value);
        }
        navigate(`/search/?${searchParams.toString()}`, {      
            replace: false,
        });
        dispatch(setRefresh(true));
    }, 700);
    const handleInputMaxChange = debounce((event) => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.has('max_price')) {
            searchParams.set('max_price', event.target.value);
        }
        else {
            searchParams.append('max_price', event.target.value);
        }
        navigate(`/search/?${searchParams.toString()}`, {      
            replace: false,
        });
        dispatch(setRefresh(true));       
    }, 700);
    const getBackgroundGradient = () => {
        const [start, end] = rangeValues;
        return `linear-gradient(to right, #FBC000 ${start/10}%, #24A6A4 ${start/10}%, #24A6A4 ${end/10}%, #FBC000 ${end/10}%)`;
    };
    return (
        <div className="price-filter-container">
            <h1 className="price-filter-container__title"> filtrer par prix</h1>
            <div className="price-filter-container__container" >
                <span className="price-filter-container__container__price" >Prix:</span>
                <span className="price-filter-container__container__rang-value"> {rangeValues[0]+'dt -' +rangeValues[1]+ 'dt' }</span>
            </div>
            <div>
                <input
                    type="range"
                    id="range1"
                    value={rangeValues[0]}
                    onChange={handleRangeChange}
                    min={0}
                    max={1000}
                    className="price-filter-container__container__form-range price-filter-container__container__form-range--first"
                    style={{ background: getBackgroundGradient() }}
                />  
                <input
                    type="range"
                    id="range2"
                    value={rangeValues[1]}
                    onChange={handleSecondRangeChange}
                    min={0}
                    max={1000}
                    className="price-filter-container__container__form-range price-filter-container__container__form-range--second"
                />                
            </div>           
        </div>
    )
}

export default PriceSlide