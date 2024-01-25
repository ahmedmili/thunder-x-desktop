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


    const inRegion = async (formData: any) => {
        const { status, data } = await LocationService.inRegion(formData)
        return data.data ? true : false
    }

    const getPosition = () => {

        navigator.geolocation.getCurrentPosition(
            (position: Position) => {
                let pos = position.coords
                const { latitude, longitude } = pos;
                LocationService.geoCode(latitude, longitude).then(data => {
                    let formData = {
                        lat: latitude,
                        long: longitude,
                    }
                    inRegion(formData).then((validateRegion) => {
                        if (validateRegion) {
                            dispatch({
                                type: "SET_LOCATION",
                                payload: {
                                    ...data
                                },
                            });
                            dispatch({ type: "SHOW_REGION_ERROR", payload: false })

                        } else {
                            dispatch({ type: "SHOW_REGION_ERROR", payload: true })
                        }
                    })
                });
            },
            (error: GeolocationPositionError) => {
                // console.error(error)
            }
        );
    };

    function handleOnClick(suggestion: any) {
        if (initLocation) {
            let formData = {
                lat: suggestion.position[0].lat,
                long: suggestion.position[0].long,
            }
            inRegion(formData).then((validateRegion) => {
                if (validateRegion) {
                    dispatch({
                        type: "SET_LOCATION",
                        payload: {
                            coords: {
                                latitude: formData.lat,
                                longitude: formData.long,
                                label: suggestion.title,
                            },
                        },
                    });
                }
            })
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

        </div>
    );
};

export default React.memo(AutocompleteInput);