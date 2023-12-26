

import { useState } from "react"
import "./produitSearch.scss"
import SearchIcon from '@mui/icons-material/Search';
function SearchProduit() {

    const [active, setActive] = useState("")

    function clickHandle(searchQuery: string) {
        setActive(searchQuery)
        // add api here when its ready
    }
    return (
        <div className="search-filter-container">
            <div className="search-filter-container__input">
                <input type="text" className="search-input" name="search" id="search" placeholder="Produit ?" />
                <SearchIcon className="text-search-icon" />
                <span className="search-icon"></span>
            </div>
        </div>
    )
}

export default SearchProduit