import React, { useState, useEffect, useCallback } from "react";
import { Col, Container, Row, Badge, Stack } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { adressService } from "../../services/api/adress.api";
import { useTranslation } from "react-i18next";
import "./Location.scss";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from '../../Redux/store';


import HomeLocation from '../../assets/home-location.svg'
import EditPen from '../../assets/edit-pen.svg'
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import { localStorageService } from "../../services/localStorageService";
import { LocationService } from "../../services/api/Location.api";
import MapCard from "./mapCard/MapCard";
import CloseIcon from "../../assets/icons/closeIcon";
import { CancelPresentation } from "@mui/icons-material";
import {
  regionHomeSelector,
  homeLoadingSelector
} from "../../Redux/slices/home";

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
  const region = useSelector(regionHomeSelector);
  const location = localStorageService.getCurrentLocation()
  const isLoading = useSelector(homeLoadingSelector);
  

  useEffect(() => {
    // Function to disable scrolling
    const disableScroll = (e: any) => {
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
    userItem != null && fetchData();
  }, []);

  const userItem = localStorageService.getUser();
  const cancel = () => {   
    if (searchType === "") {
      const location = localStorageService.getCurrentLocation()
      if (location) {        
        if (region) {
          dispatch({ type: "SET_SHOW", payload: false })
        }
        else {
          console.log("zone not available");
        }
      }      
      else {
        console.log("you dont have location");
      }
    }
    else{
      setSearchType("")
    }
  };
  return (
    <>
      <div className={`location-container ${className ? className : ""}`}>
        <div className="cancel-icon-container">
          <ClearRoundedIcon
            onClick={cancel}
            className="cancel-icon"
          ></ClearRoundedIcon>
        </div>        
        <Options />         
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
      <Container>
         <h1 className="text-center">{t('adress.add')}</h1>
        <Row>
          <Col className='col-5'>
            <div className="form">             
              {/*  map location button */}
              {/* <button type="button" onClick={() => setSearchType("card")}>
                {t("adress.cartSelect")}{" "}
                <NearMeOutlinedIcon></NearMeOutlinedIcon>
              </button> */}
              {/*  search location input */}
              <label>Adresse de livraison</label>
              <div className="adresses_container">
                <AutocompleteInput />
              </div>
            </div>
            {/* <div style={{ display: userItem ? "inline" : "none" }} className="Text-container">
              <p>{t("adress.message1")}</p>
              <p>{t("adress.message2")}</p>
            </div> */}            
            {clientAdressTable.length > 0 &&
              <>
                <p className="saved-adresses-title">{t('adress.savedAdress')}</p>
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
              </>
            }
            {filtredPositions.length > 0 ? (
              <>
                {/* <center>
                </center> */}                
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
                  {t('adress.noAdress')}
                </h6>
              </div>
            )
                }
          </Col>
          <Col className='col-7'>
            <MapCard cancel={cancel}/>
          </Col>
        </Row>
      </Container>
    )
  }
  function AutocompleteInput() {
    const [inputValue, setInputValue] = useState<string>('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const location :any = useAppSelector((state) => state.location.position);

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
      // setSearchType("card")
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
    const clearInput = () => {
      setInputValue("");
    }

    return (
      <div className="location-search-input-container">
        <div className="location-search-inpute">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={`${t("adress.searchWithAdress")} . . .`}
          />
          <span className="icon" onClick={clearInput}>
            { inputValue && <CloseIcon className='icon'/>}
          </span>
        </div>
        {(loading || isLoading) && <div>{t('loading')}...</div>}
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
        {
          !loading && !suggestions.length && location && !region && !isLoading &&  (
            <div className="error">
              {location?.coords.label}, n'est malheureusement pas incluse dans notre
              zone de livraison. Veuillez sélectionner une autre adresse
            </div>
          )
        }
        {
          location && !region && !isLoading &&
          (
          <>
            <div className="store-img"></div>
            <div className="stores-container">
                <h2>Disponible à :</h2>
                <Stack direction="horizontal" gap={2}>
                  <Badge pill  className="store-badge">Sousse</Badge>
                  <Badge pill   className="store-badge">Monastir</Badge>
                  <Badge pill  className="store-badge">Mahdia</Badge>
                </Stack>
            </div>
          </>          
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
            {/* <button className="edit-button">
              <div className="edit-icon" style={{ backgroundImage: `url(${EditPen})` }} ></div>
            </button> */}
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
