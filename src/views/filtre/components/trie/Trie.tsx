

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { homeRefresh, setRefresh } from "../../../../Redux/slices/home";
import { paramsService } from "../../../../utils/params";
import "./trie.scss";
function Trie() {
    const [active, setActive] = useState<any>()
    const [collpased, setCollapse] = useState(false)
    const [contentHeight, setContentHeight] = useState(156);
    const contentRef: any = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const refresh = useSelector(homeRefresh)
    const { t } = useTranslation()
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.has('search')) {
            let params = paramsService.fetchParams(searchParams);            
            if (params.order_by) {
                const order_id: any = params.order_by;
                setActive(order_id);
            }
        }
    }, []);

    useEffect(() => {
        if (refresh) {
            const searchParams = new URLSearchParams(location.search);
            let params = paramsService.fetchParams(searchParams)
            if (!params.order_by) {
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
            name: t('searchPage.created_at')
        },
        {
            id: 'popular',
            name: t('searchPage.populaires')
        },
        {
            id: 'stars',
            name: t('searchPage.mieux'),
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
        let newParams = paramsService.handleUriParams(params);

        searchParams.has('search') ? searchParams.set("search", newParams) : searchParams.append('search', newParams);

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
                                    <input className="radio-btn" type="radio" name="trie" id={`flexRadioDefault${index}`} onChange={() => clickHandle(data.id)} checked={active == data?.id} />
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