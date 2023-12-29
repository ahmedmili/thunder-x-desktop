import SendIcon from '@mui/icons-material/Send';
import React, { useEffect, useState } from "react";
import { Badge, Stack } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { homeLoadingSelector, regionHomeSelector } from "../../../Redux/slices/home";
import { useAppSelector } from "../../../Redux/store";
import CloseIcon from "../../../assets/icons/closeIcon";
import { LocationService } from "../../../services/api/Location.api";
import Spinner from "../../spinner/Spinner";
import './autocompleteInput.scss';

interface AutocompleteInputProps {
    initLocation: boolean;
    returnSuggestions?: (sugg: any) => void
}

type Position = {
    coords: {
        latitude: number;
        longitude: number;
    };
};


const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ initLocation, returnSuggestions }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selected, setSelected] = useState<boolean>(false);

    const location: any = useAppSelector((state) => state.location.position);
    const region = useSelector(regionHomeSelector);
    const isLoading = useSelector(homeLoadingSelector);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const getPosition = () => {

        navigator.geolocation.getCurrentPosition(
            (position: Position) => {
                let pos = position.coords
                const { latitude, longitude } = pos;
                LocationService.geoCode(latitude, longitude).then(data => {
                    // console.log('current location : ', data)
                    dispatch({
                        type: "SET_LOCATION",
                        payload: {
                            ...data
                        },
                    });
                });
            },
            (error: GeolocationPositionError) => {
                // console.error(error)
            }
        );
    };

    function handleOnClick(suggestion: any) {
        if (initLocation) {
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
        } else {
            (returnSuggestions != undefined) && returnSuggestions(suggestion)
        }
        setInputValue(suggestion.title)
        setSelected(true)
        setSuggestions([])
    }

    // Simulate an API call for autocomplete suggestions
    const fetchSuggestions = async () => {
        if (inputValue === '') {
            clearInput()
            setSelected(false)
            return;
        } else if (selected) {
            return
        } else {
            setLoading(true);
            // Replace this with your actual API endpoint for suggestions
            const response = await LocationService.autocomplete(inputValue);
            const { status, data } = response;
            data.data && setSuggestions(data.data);
            !data.data && setSuggestions([])
            setLoading(false);
        }

    };

    useEffect(() => {
        fetchSuggestions()
        // Delay the API call to avoid too frequent requests
        const debounceTimeout = setTimeout(fetchSuggestions, 300);

        return () => {
            clearTimeout(debounceTimeout);
        };
    }, [inputValue]);

    const handleInputChange = (event: any) => {
        setSelected(false)
        setInputValue(event.target.value);
    };

    const clearInput = () => {
        (returnSuggestions != undefined) && returnSuggestions(null)
        setSuggestions([]);
        setInputValue("");
        setSelected(false)
    }

    return (
        <div className="location-search-input-container">
            {
                !initLocation && (
                    <button className="current-location-btn" onClick={getPosition}>
                        <SendIcon className="current-location-icon" />
                    </button>
                )

            }
            <div className={`location-search-inpute ${!initLocation ? "location-search-input" : ""} `}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={`${t("adress.searchWithAdress")} . . .`}
                />
                <span className="icon" onClick={clearInput}>
                    {
                        (loading || isLoading) ? <Spinner name="" /> :

                            inputValue && <CloseIcon className='icon' />}
                </span>
            </div>
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
                !loading && !suggestions.length && location && !region && !isLoading && (
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
                                <Badge pill className="store-badge">Sousse</Badge>
                                <Badge pill className="store-badge">Monastir</Badge>
                                <Badge pill className="store-badge">Mahdia</Badge>
                            </Stack>
                        </div>
                    </>
                )
            }
        </div>
    );
};

export default React.memo(AutocompleteInput);