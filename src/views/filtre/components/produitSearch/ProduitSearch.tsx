

import { useEffect, useState } from "react"
import "./produitSearch.scss"
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../Redux/store";
import { homeRefresh, setRefresh } from "../../../../Redux/slices/home";
import { debounce } from 'lodash';
import { useSelector } from "react-redux";

function SearchProduit() {
    const dispatch = useAppDispatch();
    const [active, setActive] = useState("");
    const navigate = useNavigate();
    const refresh = useSelector(homeRefresh)
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.has("filter") && searchParams.get("filter")!="") {
            const filter: any = searchParams.get("filter");
            setActive(filter);
        }        
    }, []);
    useEffect(() => {    
        if (refresh) {
            const searchParams = new URLSearchParams(location.search);
            if (!searchParams.has('filter')) {
                setActive("");
            }
        }    
    }, [refresh]);

    function clickHandle(event: any) {
        setActive(event.target.value);
        handleInputChange(event)
    }
    const handleInputChange = debounce((event) => {  
        if (event.target.value !="") {
            const searchParams = new URLSearchParams(location.search);
            if (searchParams.has('filter')) {
                searchParams.set('filter', event.target.value);
            }
            else {
                searchParams.append('filter', event.target.value);
            }
            navigate(`/search/?${searchParams.toString()}`, {      
                replace: false,
            });
        }
        else {
            const searchParams = new URLSearchParams(location.search);
            if (searchParams.has('filter')) {
                searchParams.delete('filter');
                navigate(`/search/?${searchParams.toString()}`, {      
                    replace: false,
                });
            }           
        }        
        dispatch(setRefresh(true));
    }, 500); 
    return (
        <div className="search-filter-container">
            <div className="search-filter-container__input">
                <input type="text" className="search-input" name="search" id="search" placeholder="Qu’est ce qu’on vous apporte ?" value={active} onChange={clickHandle}/>
                <SearchIcon className="text-search-icon" />
                <span className="search-icon"></span>
            </div>
        </div>
    )
}

export default SearchProduit