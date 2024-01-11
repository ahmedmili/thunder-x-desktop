

import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../Redux/store';
import { LocationService } from '../../../services/api/Location.api';
// import { toast } from 'react-toastify';
import './mapCard.scss';
import EditPen from '../../../assets/edit-pen.svg'

import { useTranslation } from 'react-i18next';
import { localStorageService } from '../../../services/localStorageService';
import { LocationFormValues } from "../../../utils/formUtils";


import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import {
  regionHomeSelector,
  homeLoadingSelector
} from "../../../Redux/slices/home";


type Position = {
    coords: {
        latitude: number;
        longitude: number;
    };
};

function MapCard(props: { cancel: MouseEventHandler<HTMLButtonElement> | undefined; }) {
    const [primary, setPrimary] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<number>(1);

    const [locationChanged, setLocationChanger] = useState<boolean>(false)
    const [showForm, setShowForm] = useState<boolean>(false);

    const [marker, setMarker] = useState<google.maps.Marker | null>(null);

    const mapRef = useRef<google.maps.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [mapDisabled, setMapState] = useState<boolean>(false);


    const dispatch = useAppDispatch();
    const userPosition = useAppSelector((state) => state.location.position);
    const { t } = useTranslation();
    const logged_in = localStorageService.getUserToken();
    const region = useSelector(regionHomeSelector);
    const isLoading = useSelector(homeLoadingSelector);
    const validationSchema = Yup.object().shape({
        appNum: Yup.number()
            .typeError("Ce champ doit être un nombre"),
        appEnt: Yup.string()
            .typeError("Ce champ doit être un nombre"),
        codePost: Yup.string()
            .typeError("Ce champ doit être un nombre"),
        intitule: Yup.string(),
    });



    const handleSubmit = async (values: LocationFormValues, { setSubmitting }: FormikHelpers<LocationFormValues>) => {
        setSubmitting(false);
        let emptyIntitule = values.intitule === "";
        if (emptyIntitule) {
            // toast.warn(t('adress.intitule_message'))
            dispatch({ type: "SET_SHOW", payload: false })
        } else {
            try {
                await validationSchema.validate(values).then(
                    async () => {

                        const data = {
                            long: userPosition?.coords.longitude,
                            lat: userPosition?.coords.latitude,
                            appartement: values.appEnt,
                            door: values.codePost,
                            flat: values.appNum,
                            label: values.intitule,
                            type: selectedOption,
                            primary: primary ? 1 : 0,
                        };
                        const resp = await LocationService.addaddresse(data);
                        let message = resp.data.message;
                        // toast.success(message);
                        resp.data.code === 200 && dispatch({ type: "SET_SHOW", payload: false })

                    }
                )
            } catch (error) {
                setSubmitting(false);
            }
        }

    };

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        // Change state position
        !locationChanged && setLocationChanger(true)

        const latLng = event.latLng;
        LocationService.geoCode(latLng?.lat(), latLng?.lng()).then(data => {
            dispatch({
                type: "SET_LOCATION",
                payload: {
                    ...data
                },
            });
        });
    };
    const handleMapState = (value: any) => {
        setMapState(value)
    }

    useEffect(() => {
        const mapContainer = mapContainerRef.current;
        if (!mapContainer) {
            return;
        }
        if (!mapRef.current) {
            var latLng = new google.maps.LatLng({ lat: 35.8288, lng: 10.6401 });

            if (userPosition) {
                const { latitude, longitude } = userPosition.coords;
                latLng = new google.maps.LatLng(latitude, longitude);
            }
            mapRef.current = new google.maps.Map(mapContainer, {
                zoom: 12,
                center: latLng, // Initial center in Sousse, Tunisia
            });
            // Set initial marker
            const initialMarker = new google.maps.Marker({
                position: latLng, // Initial position in Sousse, Tunisia
                map: mapRef.current,
                title: t('adress.initLocation').toString()
            });
            setMarker(initialMarker);

            google.maps.event.addListener(mapRef.current, "click", handleMapClick);
        }
        if (userPosition && marker) {
            const { latitude, longitude } = userPosition.coords;
            const latLng = new google.maps.LatLng(latitude, longitude);
            mapRef.current?.setCenter(latLng);
            marker.setPosition(latLng);
        }
    }, [userPosition]);


    const getPosition = () => {
        navigator.geolocation.getCurrentPosition(
            (position: Position) => {
                handleMapState(false);
                let pos = position.coords
                const { latitude, longitude } = pos;
                LocationService.geoCode(latitude, longitude).then(data => {
                    dispatch({
                        type: "SET_LOCATION",
                        payload: {
                            ...data
                        },
                    });
                });
            },
            (error: GeolocationPositionError) => {
                handleMapState(true);
                setTimeout(() => {
                    handleMapState(false);
                }, 2000);
            }
        );
    };

    const handleOptionChange = (event: any) => {
        setSelectedOption(parseInt(event.target.value));
    };
    const handleDefaultChange = () => {
        setPrimary(!primary)
    };

    return (
        <div>
            <div className="container-map container-card">
                <div className="map-container">
                    {

                        <div className={`${showForm == true ? 'd-none' : ''}`}>
                            <div className='map-and-button'>
                                <div id="map" ref={mapContainerRef}></div>
                                <div className="location-indicator">
                                    {!locationChanged && <h1>{t("adress.adressDetected")}</h1>}
                                    {locationChanged && <h1>{t("adress.adressSelected")}</h1>}
                                    <h1>{userPosition?.coords.label}</h1>
                                </div>
                                {/* <div className='buttons'>
                                    <button type="button" onClick={getPosition}>
                                        <div className="icon"></div>
                                        <p>{t('adress.currentPos')}</p>
                                    </button>
                                </div> */}
                            </div>
                            {mapDisabled && (
                                <div className='error'>Veuillez autoriser l'accès à votre position</div>
                            )}
                        </div>

                    }
                    {logged_in && showForm && (
                        <>
                            <div className="location-form-title">
                                <h1>{userPosition?.coords.label}</h1>
                                <button className="edit-button" onClick={() => setShowForm(false)}>
                                    <div className="edit-icon"></div>
                                </button>
                            </div>
                            <Formik
                                initialValues={{
                                    appNum: "",
                                    appEnt: "",
                                    codePost: "",
                                    intitule: "",
                                    selectedOption: 1,
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ values, setFieldValue }) => (

                                    <Form >
                                        <div className="input">
                                            <Field type="text" id="app_num" name="appNum" placeholder={t('adress.input1')} />

                                        </div>
                                        <ErrorMessage name="appNum" component="div" className="error-message" />
                                        <div className="input">
                                            <Field type="text" id="app_ent" name="appEnt" placeholder={t('adress.input2')} />
                                        </div>
                                        <ErrorMessage name="appEnt" component="div" className="error-message" />
                                        <div className="input">
                                            <Field type="text" id="code_post" name="codePost" placeholder={t('adress.input3')} />
                                        </div>
                                        <ErrorMessage name="codePost" component="div" className="error-message" />
                                        <div className="input">
                                            <Field type="text" id="intitule" name="intitule" placeholder={t('adress.input4')} />
                                        </div>
                                        <ErrorMessage name="intitule" component="div" className="error-message" />

                                        <div className="select-group">
                                            <div className={`select ${selectedOption == 1 ? "selected" : ""}`}  >
                                                <input type="radio" value="1" id='domicile2' name='type' checked={selectedOption === 1} onChange={handleOptionChange} />
                                                <label htmlFor="domicile2"> {t('home2')}</label>
                                            </div>
                                            <div className={`select ${selectedOption == 2 ? "selected" : ""}`}  >
                                                <input type="radio" value="2" id='travail2' name='type' checked={selectedOption === 2} onChange={handleOptionChange} />
                                                <label htmlFor="travail2"> {t('travail')}</label>
                                            </div>
                                            <div className={`select ${selectedOption == 3 ? "selected" : ""}`}  >
                                                <input type="radio" value="3" id='autre2' name='type' checked={selectedOption === 3} onChange={handleOptionChange} />
                                                <label htmlFor="autre2"> {t('autre')}</label>
                                            </div>

                                        </div>
                                        <div className="default">
                                            <label className='custom-checkbox' htmlFor="default">
                                                <input type="checkbox" value="3" id='default' name='type' checked={primary} onChange={handleDefaultChange} />
                                                <span className="checkmark"></span>
                                                {t('adress.default_adress')}
                                            </label>
                                        </div>
                                        <div className='map-continue-btn'>
                                            <button type="submit" className="submit-cart" >
                                                {t("select")}
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </>
                    )}
                    <div className='map-continue-btn'>
                        {logged_in && !showForm && region && !isLoading && (
                            <button type="button" className="submit-cart" onClick={() => setShowForm(true)} >
                                {t("continuer")}
                            </button>
                        )}
                        {!logged_in && showForm === false && userPosition?.coords.label && region && !isLoading && (
                            <button type="button" className="submit-cart close" onClick={props.cancel}>
                                {t("fermer")}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}

export default MapCard





