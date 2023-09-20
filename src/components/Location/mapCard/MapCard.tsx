

import { useEffect, useRef, useState } from 'react';
import './mapCard.scss'
import { LocationService } from '../../../services/api/Location.api';
import { useAppDispatch, useAppSelector } from '../../../Redux/store';
import { toast } from 'react-toastify';

import { localStorageService } from '../../../services/localStorageService';
import { useNavigate } from "react-router-dom"
import { useTranslation } from 'react-i18next';
import { LocationFormValues, generateForm } from "../../../utils/formUtils";


import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';

type Position = {
    coords: {
        latitude: number;
        longitude: number;
    };
};

function MapCard() {
    const [primary, setPrimary] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<number>(1);


    const [showForm, setShowForm] = useState<boolean>(false);

    const [marker, setMarker] = useState<google.maps.Marker | null>(null);

    const mapRef = useRef<google.maps.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    const userPosition = useAppSelector((state) => state.location.position);
    const { t } = useTranslation();
    const logged_in = localStorageService.getUserToken();


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
            toast.warn(t('adress.intitule_message'))
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
                        toast.success(message);
                        console.log(message);
                        resp.data.code === 200 && dispatch({ type: "SET_SHOW", payload: false })

                    }
                )
            } catch (error) {
                setSubmitting(false);
                console.error(error);
            }
        }

    };

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        // Change state position
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

    useEffect(() => {
        const mapContainer = mapContainerRef.current;
        if (!mapContainer) {
            console.error("Map container not found.");
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
                title: "Initial Location",
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
                toast.error(error.message);
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
                        showForm == false && (
                            <>
                                <p>Indique votre adress sur la carte</p>

                                <div className='map-and-button'>
                                    <div id="map" ref={mapContainerRef}></div>
                                    <div className="location-indicator">
                                        <h1>{userPosition?.coords.label}</h1>
                                    </div>
                                    <div className='buttons'>
                                        <button type="button" onClick={getPosition}>
                                            <div className="icon"></div>
                                            <p>Position actuelle</p>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )
                    }
                    {logged_in && showForm && (
                        <>
                            <div className="location-form-title">
                                <h1>{userPosition?.coords.label}</h1>
                            </div>
                            <h2>Ajouter une adresse de livraison</h2>

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
                                            <Field type="text" id="app_num" name="appNum" placeholder="Numéro d’appartement, porte, étage..." />

                                        </div>
                                        <ErrorMessage name="appNum" component="div" className="error-message" />
                                        <div className="input">
                                            <Field type="text" id="app_ent" name="appEnt" placeholder="Nom de l’entreprise ou l’immeuble" />
                                        </div>
                                        <ErrorMessage name="appEnt" component="div" className="error-message" />
                                        <div className="input">
                                            <Field type="text" id="code_post" name="codePost" placeholder="Code de porte et nom de famille" />
                                        </div>
                                        <ErrorMessage name="codePost" component="div" className="error-message" />
                                        <div className="input">
                                            <Field type="text" id="intitule" name="intitule" placeholder="Intitulé de l’adresse" />
                                        </div>
                                        <ErrorMessage name="intitule" component="div" className="error-message" />

                                        <div className="select-group">
                                            <div className={`select ${selectedOption == 1 ? "selected" : ""}`}  >
                                                <input type="radio" value="1" id='domicile' name='type' checked={selectedOption === 1} onChange={handleOptionChange} />
                                                <label htmlFor="domicile"> Domicile</label>
                                            </div>
                                            <div className={`select ${selectedOption == 2 ? "selected" : ""}`}  >
                                                <input type="radio" value="2" id='travail' name='type' checked={selectedOption === 2} onChange={handleOptionChange} />
                                                <label htmlFor="travail"> Travail</label>
                                            </div>
                                            <div className={`select ${selectedOption == 3 ? "selected" : ""}`}  >
                                                <input type="radio" value="3" id='autre' name='type' checked={selectedOption === 3} onChange={handleOptionChange} />
                                                <label htmlFor="autre"> Autre</label>
                                            </div>

                                        </div>
                                        <div className="default">
                                            <label className='custom-checkbox' htmlFor="default">
                                                <input type="checkbox" value="3" id='default' name='type' checked={primary} onChange={handleDefaultChange} />
                                                <span className="checkmark"></span>
                                                Adresse par défaut
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
                    {logged_in && showForm === false && (
                        <div className='map-continue-btn'>
                            <button type="button" className="submit-cart" onClick={() => setShowForm(true)} >
                                {t("continuer")}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}

export default MapCard





