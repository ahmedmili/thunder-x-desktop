import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "../../Redux/store";
import { adressService } from "../../services/api/adress.api";
import { useTranslation } from "react-i18next";
import "./Location.scss";

import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MenuIcon from "@mui/icons-material/Menu";
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

const googleMapKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface AdressComponentProps {
  type: string;
  region: string;
  street: string;
  long: number;
  lat: number;
  children?: React.ReactNode;
}

const AdressComponent: React.FC<AdressComponentProps> = ({ type, street, region, lat, long, }) => {

  const dispatch = useAppDispatch();

  const changeAdress = () => {
    dispatch({
      type: "SET_LOCATION",
      payload: {
        coords: {
          latitude: lat,
          longitude: long,
          label: street + region,
        },
      },
    });
  };
  return (
    <div onClick={() => changeAdress()} className="adressCompContainer">
      <header>
        <div className="type">
          <HomeRoundedIcon className="home-icon"></HomeRoundedIcon>
          {type}
        </div>
        <MenuIcon></MenuIcon>
      </header>
      <div className="labels">
        <p>
          {street}, <br /> {region}
        </p>
      </div>
    </div>
  );
};

const Map = () => {
  const { t } = useTranslation();
  const [userInput, setUserInput] = useState<string>("");
  const [clientAdressTable, setClientAdressTable] = useState([]);
  const dispatch = useAppDispatch();
  const [searchType, setSearchType] = useState("");

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  // read client adresses
  useEffect(() => {
    const userItem = localStorageService.getUser();
    const fetchData = async () => {
      let res = await adressService.getAdressByid(JSON.parse(userItem!).id);
      setClientAdressTable(res.data.data);
    };
    userItem != null ? fetchData() : console.log("no user connected");
  }, []);

  const handleUserInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserInput(event.target.value);
    },
    []
  );

  const handleSubmit = () => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${userInput}&key=${googleMapKey}`
    )
      .then((response) => response.json())
      .then(async (data) => {
        if (data.status === "OK") {
          const { lat, lng } = data.results[0].geometry.location;
          LocationService.geoCode(lat, lng).then(data => {
            dispatch({
              type: "SET_LOCATION",
              payload: {
                ...data
              },
            });
          });

        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      handleSubmit();
    }
  };

  const userItem = localStorageService.getUser();
  return (
    <>
      <div className="location-container">
        <div className="cancel-icon-container">
          <ClearRoundedIcon
            onClick={() => setSearchType("")}
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
          <AutocompleteInput />
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
          <div className="adresses-container">
            {clientAdressTable.map((element) => (
              <AdressComponent
                type={element["label"]}
                street={element["street"]}
                region={element["region"]}
                long={element["long"]}
                lat={element["lat"]}
              ></AdressComponent>
            ))}
          </div>
        ) : (
          <h6 style={{ display: userItem ? "inline" : "none" }}>
            no saved adress to display
          </h6>
        )}
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
            placeholder={`${t("searchButton")} ...`}
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
};
export default Map;
