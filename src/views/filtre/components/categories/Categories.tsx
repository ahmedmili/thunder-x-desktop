

import { useState } from "react"
import "./categories.scss"
function Categories() {

    const [active, setActive] = useState("")

    const datas = [
        {
            id: 1,
            name: "burger",
            count: "8"
        },
        {
            id: 2,
            name: "Pizza",
            count: "12"
        },
        {
            id: 3,
            name: "Tacos",
            count: "9"
        },
        {
            id: 4,
            name: "Crepe",
            count: "5"
        },
        {
            id: 5,
            name: "Sushi",
            count: "8"
        },
        {
            id: 6,
            name: "Pasta",
            count: "10"
        }
    ]


    function clickHandle(searchQuery:string){
        setActive(searchQuery)
        // add api here when its ready
    }
    return (
        <div className="categories-filter-container">
            <h1> Categories</h1>
            <ul>
                {
                    datas.map((data, index) => {
                        return (
                            <li key={index}>
                                <a href="#" className={active == data.name ? "active": ""}
                                onClick={ ()=> clickHandle(data.name)}
                                ><span>{data.name} </span><span>({data.count})</span></a>
                            </li>)
                    })
                }
            </ul>

        </div>
    )
}

export default Categories