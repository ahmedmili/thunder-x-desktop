

import SearchIcon from '@mui/icons-material/Search';
import { debounce } from 'lodash';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { homeRefresh, setRefresh } from "../../../../Redux/slices/home";
import { useAppDispatch } from "../../../../Redux/store";
import { paramsService } from "../../../../utils/params";
import "./produitSearch.scss";

function SearchProduit() {
    const dispatch = useAppDispatch();
    const [active, setActive] = useState("");
    const navigate = useNavigate();
    const refresh = useSelector(homeRefresh)
    const { t } = useTranslation()
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        let params = paramsService.fetchParams(searchParams);
        if (params.filter && params.filter != "") {
            const filter: any = params.filter;
            setActive(filter);
        }
        else {
            setActive("");
        }
    }, []);
    useEffect(() => {
        if (refresh) {
            const searchParams = new URLSearchParams(location.search);
            let params = paramsService.fetchParams(searchParams);
            if (!params.filter || params.filter == "") {
                setActive("");
            }
        }
    }, [refresh]);

    function clickHandle(event: any) {
        setActive(event.target.value);
        handleInputChange(event)
    }
    const handleInputChange = debounce((event) => {
        if (event.target.value != "") {
            const searchParams = new URLSearchParams(location.search);
            let params = searchParams.has("search") ? paramsService.fetchParams(searchParams) : {}
            params = {
                ...params,
                filter: event.target.value
            }
            let newParams = paramsService.handleUriParams(params);
            searchParams.has('search') ? searchParams.set("search", newParams) : searchParams.append('search', newParams);
            navigate(`/search/?${searchParams.toString()}`, {
                replace: false,
            });
        }
        else {
            const searchParams = new URLSearchParams(location.search);
            let params = searchParams.has("search") ? paramsService.fetchParams(searchParams) : {}
            if (params.filter) {
                delete params.filter;
                let newParams = paramsService.handleUriParams(params);
                searchParams.set("search", newParams);
                navigate(`/search/?${searchParams.toString()}`, {
                    replace: false,
                });
            }
        }
        dispatch(setRefresh(true));
    }, 700);

    return (
        <form className="search-filter-container" autoComplete="off">
            <div className="search-filter-container__input">
                <input autoComplete="off" type="search" className="search-input" name="search" id="search" placeholder={`${t('searchPage.question')}`} value={active} onChange={clickHandle} />
                <SearchIcon className="text-search-icon" />
                <span className="search-icon"></span>
            </div>
        </form>
    )
}

export default SearchProduit