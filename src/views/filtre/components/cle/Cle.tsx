

import { useState } from "react"
import "./cle.scss"
function Cle() {

    const [active, setActive] = useState("")

    const lists = [
        {
            id: 1,
            name: "Desserts"
        },
        {
            id: 2,
            name: "Salade"
        },
        {
            id: 3,
            name: "Pizza"
        },
        {
            id: 4,
            name: "Végétarien"
        },
        {
            id: 5,
            name: "Boissons",
        },
        {
            id: 6,
            name: "Salade",
        },
    ]


    function clickHandle(searchQuery: string) {
        setActive(searchQuery)
        // add api here when its ready
    }
    return (
        <div className="cle-filter-container">
            <h1> Cle</h1>
            <ul>
                {
                    lists.map((data, index) => {
                        return (
                            <li key={index}>
                                <div className="form-check" onClick={() => clickHandle(data.name)}>
                                    <input type="radio" className="btn-check" name="cle" id={`${index}`} />
                                    <label className="radio-button" htmlFor={`${index}`}>{data.name}</label>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default Cle