

import { useState } from "react"
import "./trie.scss"
function Trie() {

    const [active, setActive] = useState("")

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


    function clickHandle(searchQuery: string) {
        setActive(searchQuery)
        // add api here when its ready
    }
    return (
        <div className="trie-filter-container">
            <h1> Trier</h1>
            <ul>
                {
                    lists.map((data, index) => {
                        return (
                            <li key={index}>
                                <div className="form-check" onClick={() => clickHandle(data.name)}>
                                    <input className="form-check-input" type="radio" name="trie" id={`flexRadioDefault${index}`} /> {/* Self-closing tag */}
                                    <label className= {`form-check-label`} htmlFor={`flexRadioDefault${index}`}>
                                        {data.name}
                                    </label>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default Trie