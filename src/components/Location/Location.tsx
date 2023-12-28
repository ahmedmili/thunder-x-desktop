import React, { useEffect, useState } from "react";
import { Badge, Col, Container, Row, Stack } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { adressService } from "../../services/api/adress.api";
import "./Location.scss";


import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import HomeLocation from '../../assets/home-location.svg';

import {
  homeLoadingSelector,
  regionHomeSelector
} from "../../Redux/slices/home";
import { LocationService } from "../../services/api/Location.api";
import { localStorageService } from "../../services/localStorageService";
import MapCard from "./mapCard/MapCard";
import AutocompleteInput from "./AutocompleteInput/AutocompleteInput";

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
    else {
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

              {/*  search location input */}
              <label>{t('adress.delivAddress')}</label>
              <div className="adresses_container">
                <AutocompleteInput initLocation={true} />
              </div>
            </div>
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
            <MapCard cancel={cancel} />
          </Col>
        </Row>
      </Container>
    )
  }

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
