

import { useEffect, useState } from "react";
import "./priceSlide.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { homeRefresh, setRefresh } from "../../../../Redux/slices/home";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from 'lodash';
import Slider from '@mui/material/Slider';
import { paramsService } from "../../../../utils/params";
function PriceSlide() {
    const [rangeValues, setRangeValues] = useState<any>([0, 100]);
    const navLocation = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const refresh = useSelector(homeRefresh)
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        let min = 0;
        let max = 100
        if (searchParams.has("search")) {
            let params = paramsService.fetchParams(searchParams)

            if (params.min_price) {
                min = Number(params.min_price)
            }
            if (params.max_price) {
                max = Number(params.max_price)
            }
        }
        setRangeValues([min, max]);
    }, []);

    useEffect(() => {
        if (refresh) {
            const searchParams = new URLSearchParams(location.search);
            if (!searchParams.has("search")) {
                setRangeValues([0, 100])
            } else {
                let params = paramsService.fetchParams(searchParams)
                if (!params.max_price && !params.min_price) {
                    setRangeValues([0, 100])
                }
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
        if (searchParams.has('search')) {
            let params = paramsService.fetchParams(searchParams)

            if (Number(params.min_price) !== Number(rangeValues[0]) || Number(params.max_price) !== Number(rangeValues[1])) {
                params = {
                    ...params,
                    min_price: rangeValues[0]
                }

                params = {
                    ...params,
                    min_price: rangeValues[0],
                    max_price: rangeValues[1]
                }
            }
            let newParams = paramsService.handleUriParams(params)
            searchParams.has('search') ? searchParams.set("search", newParams):searchParams.append('search', newParams);

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
                <span className="price-filter-container__container__rang-value"> {rangeValues[0] + 'dt -' + rangeValues[1] + 'dt'}</span>
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