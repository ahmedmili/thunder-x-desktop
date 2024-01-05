

import { useEffect, useRef, useState } from "react"
import "./trie.scss"
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { homeRefresh, setRefresh } from "../../../../Redux/slices/home";
import { paramsService } from "../../../../utils/params";
function Trie() {
    const [active, setActive] = useState<any>()
    const [collpased, setCollapse] = useState(false)
    const [contentHeight, setContentHeight] = useState(156);
    const contentRef: any = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const refresh = useSelector(homeRefresh)

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.has('search')) {
            let params = paramsService.fetchParams(searchParams)
            if (params.order) {
                const order_id: any = params.order;
                setActive(order_id);
            }
        }
    }, []);

    useEffect(() => {
        if (refresh) {
            const searchParams = new URLSearchParams(location.search);
            let params = paramsService.fetchParams(searchParams)
            if (!params.order) {
                setActive("")
            }
        }
    }, [refresh]);

    useEffect(() => {
        setTimeout(() => {
            setContentHeight(contentRef?.current?.scrollHeight);
        }, 300);
    }, [collpased]);

    const lists = [
        {
            id: 'created_at',
            name: "Nouveau sur thunder"
        },
        {
            id: 'popular',
            name: "Les plus populaires"
        },
        {
            id: 'stars',
            name: "Les mieux notés",
        },
    ]
    const toggleCollapse = () => {
        setCollapse(!collpased)
    }

    function clickHandle(searchQuery: any) {
        setActive(searchQuery)
        const searchParams = new URLSearchParams(location.search);
        let params = searchParams.has("search") ? paramsService.fetchParams(searchParams) : {}

        params = {
            ...params,
            order_by: searchQuery
        }
        let newParams = paramsService.handleUriParams(params)
        if (searchParams.has('search')) {
            searchParams.set("search", newParams)
        }
        else {
            searchParams.append('search', newParams);
        }
        navigate(`/search/?${searchParams.toString()}`, {
            replace: false,
        });
        dispatch(setRefresh(true));
    }
    return (
        <div className="trie-filter-container">
            <h1 className="trie-filter-container__title"> Trier</h1>
            <ChevronRightIcon className={`trie-filter-container__collapse-icon  ${collpased ? 'close' : 'open'}`} onClick={toggleCollapse}></ChevronRightIcon>
            <ul className={`trie-filter-container__list  ${collpased ? 'hide' : 'show'}`} ref={contentRef} style={{ maxHeight: collpased ? '0' : `${contentHeight}px` }}>
                {
                    lists.map((data, index) => {
                        return (
                            <li key={index} className="trie-filter-container__list__item">
                                <div className="form-check">
                                    <input className="radio-btn" type="radio" name="trie" id={`flexRadioDefault${index}`} onChange={() => clickHandle(data.id)} checked={active == data?.id} /> {/* Self-closing tag */}
                                    <label className={`form-label`} htmlFor={`flexRadioDefault${index}`}>
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