

import { useState } from "react";
import "./priceSlide.scss";
function PriceSlide() {
    const [rangeValues, setRangeValues] = useState([0, 12]);
    const lists = [
        {
            id: 1,
            name: "Offres du jour"
        },
        {
            id: 2,
            name: "Recommandé"
        },
        {
            id: 3,
            name: "Offre Premuim"
        },
        {
            id: 4,
            name: "Les plus populaires"
        },
        {
            id: 5,
            name: "Les mieux notés",
        },
    ]
    const handleRangeChange = (event: any) => {     
        event.preventDefault();
        if (Number(event.target.value) <= rangeValues[1]) {
            setRangeValues([Number(event.target.value), rangeValues[1]]);
        } 
    };
    const handleSecondRangeChange = (event: any) => {
        event.preventDefault();
        if (Number(event.target.value) >= rangeValues[0]) {
            setRangeValues([rangeValues[0], Number(event.target.value)]);
        }
    };
    const getBackgroundGradient = () => {
        const [start, end] = rangeValues;
        return `linear-gradient(to right, #FBC000 ${start}%, #24A6A4 ${start}%, #24A6A4 ${end}%, #FBC000 ${end}%)`;
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
                    max={100}
                    className="price-filter-container__container__form-range price-filter-container__container__form-range--first"
                    style={{ background: getBackgroundGradient() }}
                />  
                <input
                    type="range"
                    id="range2"
                    value={rangeValues[1]}
                    onChange={handleSecondRangeChange}
                    min={0}
                    max={100}
                    className="price-filter-container__container__form-range price-filter-container__container__form-range--second"
                />                
            </div>           
        </div>
    )
}

export default PriceSlide