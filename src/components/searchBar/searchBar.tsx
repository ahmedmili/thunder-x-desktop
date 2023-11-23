
import SearchIcon from '@mui/icons-material/Search';
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  setDistanceFilter,
  setSearchQuery,
  setfilterRestaurants,
} from "../../Redux/slices/restaurantSlice";
import { supplierServices } from "../../services/api/suppliers.api";
import { localStorageService } from "../../services/localStorageService";
import searchStyle from "./searchBar.module.scss";
interface Props {
  placeholder: string;
}

const SearchBar: React.FC<Props> = ({ placeholder }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navLocation = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dfaultDistanceFilter, setDefaultDistanceFilter] = useState<number>(10);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false); // Add state variable for showing/hiding filters
  const location = useLocation()
  const toggleFilters = () => {
    setShowFilters(!showFilters); // Toggle the state of showFilters
  };

  const handleSearchSubmit = useCallback((event: any) => {
    event.preventDefault();
    // TODO Call API to get matching restaurants based on the search query and filters
  }, []);

  const handleFilterSubmit = useCallback((event: any) => {
    event.preventDefault();
    // TODO Call API to get matching restaurants based on the search query and filters
    toggleFilters();
  }, []);


  useEffect(() => {
    const searchMethode = location.pathname.split('/')[2]?.split('=')[0]
    const searchTerm = location.pathname.split('/')[2]?.split('=')[1]
    searchMethode === 'searchTerm' && setSearchTerm(searchTerm)
  }, [])

  const handleRatingFilterChange = (event: any) => {
    setRatingFilter(event.target.value as number);
  };

  const handleDistanceFilterChange = (event: any) => {
    setDefaultDistanceFilter(event.target.value as number);
    dispatch(setDistanceFilter(event.target.value as number))

  };
  function onSubmit(value: any): void {
    if (value.key == "Enter") {
      handleTextSearch();
    }
  }
  function handleTextSearch(): void {
    const location = localStorageService.getCurrentLocation();
    if (location) {
      if (searchTerm.length > 0) {
        const LongLat = JSON.parse(location!).coords;
        const data = {
          "search": searchTerm,
          "lat": LongLat.latitude,
          "long": LongLat.longitude
        }
        try {
          supplierServices.searchSupplierByArticle(data).then((resp) => {
            dispatch(setfilterRestaurants(resp.data.data.suppliers))
            !navLocation.pathname.includes("/search/") && navigate("/search/searchTerm=" + searchTerm);
            navLocation.pathname.includes("/search/") && navigate("/search/searchTerm=" + searchTerm, { replace: true });
          })
        } catch (e) {
          throw e
        }
      } else {
        setErrorMessage("Veuillez compléter la recherche.");
      }
    } else {
      setErrorMessage("choisissez l\'emplacement s\'il vous plaît");
    }

    dispatch(setSearchQuery(searchTerm));
  }

  const deleteSearchText = () => {
    setSearchTerm('')
  }
  function onChangerText(value: string): void {
    setSearchTerm(value);
  }
  return (
    <>
      <div className={searchStyle.searchContainer}>
        <form onSubmit={handleSearchSubmit}>
          <span className={searchStyle.icons}>
            <SearchIcon className={searchStyle.icon} />
            <i className="bi bi-search"></i>
          </span>
          <div className={searchStyle.headerSearchBar}>
            <input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onKeyDown={(event) => onSubmit(event)}
              onChange={(event) => onChangerText(event.target.value)}
              aria-label="Enter recherche term"

            />
            {searchTerm.length > 0 && (
              <span
                className={searchStyle.deleteSearchTextButton}
                onClick={() => deleteSearchText()}
              >X</span>
            )}
          </div>
          <span onClick={handleTextSearch} className={`${searchStyle.icons} ${searchStyle.iconBackgorund}  `}>
          </span>
        </form>
      </div>
      {
        errorMessage.length > 0 && (<p className={searchStyle.ErrorMessage}>{errorMessage}</p>)
      }
    </>
  );
};

export default React.memo(SearchBar);
