
import React, { useState, useCallback } from "react";
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import searchStyle from "./searchBar.module.scss";
import { localStorageService } from "../../services/localStorageService"
import { supplierServices } from "../../services/api/suppliers.api"
import {
  setDistanceFilter,
  setSearchQuery,
  setfilterRestaurants,
} from "../../Redux/slices/restaurantSlice";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom"
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
            setSearchTerm("")
            navLocation.pathname != "/search" && navigate(`/search`);
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
              // (keydown)="onKeyPress($event)
              onKeyDown={(event) => onSubmit(event)}
              onChange={(event) => onChangerText(event.target.value)}
              aria-label="Enter recherche term"
            />
          </div>
          <span className={`${searchStyle.icons} ${searchStyle.iconBackgorund}  `}>
            <ArrowForwardIcon className={searchStyle.icon} />
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
