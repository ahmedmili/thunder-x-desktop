

import { useState } from "react"
import "./priceSlide.scss"
function PriceSlide() {

    const [rangeValue, setRangeValue] = useState(0)

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


    const handleRangeChange = (event:any) => {
        const newValue = event.target.value;
        setRangeValue(newValue);
        console.log(newValue)
      };
    return (
        <div className="trie-filter-container">
            <h1> filtrer par prix</h1>
            <div className="info-container" >
                <span> Prix</span>
                <span className="rang-value"> {rangeValue}</span>
            </div>

            <input type="range" onChange={handleRangeChange} className="formm-range"  min="0" max="100" step="1" value={rangeValue} id="customRange1"/>
        </div>
    )
}

export default PriceSlide