import React, { useState, useEffect, useCallback } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "../../Redux/store";
import { adressService } from "../../services/api/adress.api";
import { useTranslation } from "react-i18next";
import "./Location.scss";


import HomeLocation from '../../assets/home-location.svg'
import EditPen from '../../assets/edit-pen.svg'
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import { localStorageService } from "../../services/localStorageService";
import { LocationService } from "../../services/api/Location.api";
import MapCard from "./mapCard/MapCard";
import SearchIcon from "../../assets/icons/SearchIcon";

declare global {
  interface Window {
    initMap: () => void;
  }
}


interface AdressComponentProps {
  type: string;
  region: string;
  street: string;
  long: number;
  lat: number;
  children?: React.ReactNode;
}

interface MapProps {
  className?: string;

}

const Map: React.FC<MapProps> = ({ className }) => {
  const { t } = useTranslation();
  const [clientAdressTable, setClientAdressTable] = useState([]);
  const dispatch = useAppDispatch();
  const [searchType, setSearchType] = useState("");

  useEffect(() => {
    // Function to disable scrolling
    const disableScroll = (e:any) => {
      e.preventDefault();
    };

    // Add an event listener to the window to prevent scrolling
    window.addEventListener('scroll', disableScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', disableScroll);
    };
  }, []);

  // read client adresses
  useEffect(() => {
    const userItem = localStorageService.getUser();
    const fetchData = async () => {
      let res = await adressService.getAdressByid(JSON.parse(userItem!).id);
      setClientAdressTable(res.data.data);
    };
    userItem != null && fetchData() ;
  }, []);

  const userItem = localStorageService.getUser();
  return (
    <>
      <div className={`location-container ${className ? className : ""}`}>
        <div className="cancel-icon-container">
          <ClearRoundedIcon
            onClick={() => searchType === "" ? dispatch({ type: "SET_SHOW", payload: false }) : setSearchType("")}
            className="cancel-icon"
          ></ClearRoundedIcon>
        </div>

        {
          searchType == '' ? <Options /> : <MapCard />

        }
      </div>
    </>
  )

  function Options() {
    const [selectedOption, setSelectedOption] = useState<number>(1);

    const handleOptionChange = (event: any) => {
      setSelectedOption(parseInt(event.target.value));
    };

    const filtredPositions = clientAdressTable.filter((pos: any) => {
      return pos.type == selectedOption;
    })

    return (
      <>
        <div className="form">
          <h1>Ajouter un adress de livraison</h1>
          {/*  map location button */}
          <button type="button" onClick={() => setSearchType("card")}>
            {t("adress.cartSelect")}{" "}
            <NearMeOutlinedIcon></NearMeOutlinedIcon>
          </button>

          {/*  search location input */}
          <div className="adresses_container">
            <AutocompleteInput />
          </div>
        </div>

        <div style={{ display: userItem ? "inline" : "none" }} className="Text-container">
          <p>{t("adress.message1")}</p>
          <p>{t("adress.message2")}</p>
        </div>

        <div className="location-filtre">
          <div className={`select ${selectedOption == 1 ? "selected" : ""}`}  >
            <input type="radio" value="1" id='domicile' name='type' checked={selectedOption === 1} onChange={handleOptionChange} />
            <label htmlFor="domicile">{t("domicile")}</label>
          </div>
          <div className={`select ${selectedOption == 2 ? "selected" : ""}`}  >
            <input type="radio" value="2" id='travail' name='type' checked={selectedOption === 2} onChange={handleOptionChange} />
            <label htmlFor="travail"> {t("tavail")}</label>
          </div>
          <div className={`select ${selectedOption == 3 ? "selected" : ""}`}  >
            <input type="radio" value="3" id='autre' name='type' checked={selectedOption === 3} onChange={handleOptionChange} />
            <label htmlFor="autre">{t("autre")}</label>
          </div>

        </div>


        {filtredPositions.length > 0 ? (
          <>
            {/* <center>
            </center> */}
            <p className="saved-adresses-title">Lieux enregistré</p>
            <div className="adresses-container">

              {filtredPositions.map((element) => (
                <>
                  <AdressComponent
                    type={element["label"]}
                    street={element["street"]}
                    region={element["region"]}
                    long={element["long"]}
                    lat={element["lat"]}
                  ></AdressComponent>
                </>
              ))}
            </div>
          </>

        ) : (
          <div className="Text-container">

            <h6 style={{ display: userItem ? "inline" : "none" }}>
              no saved adress to display
            </h6>
          </div>
        )

        }
      </>
    )
  }
  function AutocompleteInput() {
    const [inputValue, setInputValue] = useState<string>('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);

    function handleOnClick(suggestion: any) {

      dispatch({
        type: "SET_LOCATION",
        payload: {
          coords: {
            latitude: suggestion.position[0].lat,
            longitude: suggestion.position[0].long,
            label: suggestion.title,
          },
        },
      });
      setSearchType("card")
    }

    useEffect(() => {
      // Simulate an API call for autocomplete suggestions
      const fetchSuggestions = async () => {
        if (inputValue === '') {
          setSuggestions([]);
          return;
        }
        setLoading(true);
        // Replace this with your actual API endpoint for suggestions
        const response = await LocationService.autocomplete(inputValue);
        const { status, data } = response;
        setSuggestions(data.data);
        setLoading(false);
      };

      // Delay the API call to avoid too frequent requests
      const debounceTimeout = setTimeout(fetchSuggestions, 300);

      return () => {
        clearTimeout(debounceTimeout);
      };
    }, [inputValue]);

    const handleInputChange = (event: any) => {
      setInputValue(event.target.value);
    };

    return (
      <div className="location-search-input-container">
        <div className="location-search-inpute">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={`${t("adress.searchWithAdress")} . . .`}
          />
          <span className="icon">
            <SearchIcon className='icon' />
          </span>
        </div>
        {loading && <div>Loading...</div>}
        {
          suggestions.length > 0 && (
            <ul>
              {suggestions.map((suggestion: any, index) => (
                <li key={index} onClick={() => handleOnClick(suggestion)} >
                  {suggestion.title}
                </li>
              ))}
            </ul>
          )
        }
      </div>
    );
  };

  function AdressComponent({
    type,
    street,
    region,
    lat,
    long,
  }: AdressComponentProps) {

    const changeAdress = () => {
      dispatch({
        type: "SET_LOCATION",
        payload: {
          coords: {
            latitude: lat,
            longitude: long,
            label: type,
          },
        },
      });
    };
    return (
      <div onClick={changeAdress} className="adressCompContainer">
        <header>
          <div className="type">
            <div className="label">
              <div className="position-icon" style={{ backgroundImage: `url(${HomeLocation})` }} ></div>
              <span>{type}</span>
            </div>
            <button className="edit-button">
              <div className="edit-icon" style={{ backgroundImage: `url(${EditPen})` }} ></div>
            </button>
          </div>
          <p className="position-name">
            {street}, <br /> {region}
          </p>
        </header>

      </div>
    );
  }
};
export default Map;
