

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
    const [selectedOption, setSelectedOption] = useState<number>();


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
            .typeError("Ce champ doit être un nombre")
            .required("Numéro d'appartement est requis."),
        appEnt: Yup.number()
            .typeError("Ce champ doit être un nombre")
            .required("Nom de l'entreprise ou l'immeuble est requis."),
        codePost: Yup.number()
            .typeError("Ce champ doit être un nombre")
            .required("Code de porte et nom de famille est requis."),
        intitule: Yup.string()
            .required("Intitulé de l'adresse est requis."),
        selectedOption: Yup.number()
            .typeError("Ce champ doit être un nombre")
            .required("Veuillez sélectionner une option."),
    });



    const handleSubmit = async (values: LocationFormValues, { setSubmitting }: FormikHelpers<LocationFormValues>) => {
        setSubmitting(false);
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
                        type: values.selectedOption,
                        primary: primary ? 1 : 0,
                    };
                    const resp = await LocationService.addaddresse(data);
                    toast.success(resp.data.data.message);
                    resp.data.code === 200 && navigate('/')
                }
            )
        } catch (error) {
            setSubmitting(false);
            console.error(error);
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
        // setSelectedOption(parseInt(event.target.value));
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
                                        {/* <div className="position-button-label">
                                           
                                        </div> */}
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
                                    appNum: 0,
                                    appEnt: 0,
                                    codePost: 0,
                                    intitule: "",
                                    selectedOption: 0,
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
                                            <input type="checkbox" value="3" id='default' name='type' checked={primary} onChange={handleDefaultChange} />
                                            <label htmlFor="default"> Adresse par défaut</label>
                                        </div>
                                        <button type="submit" className="submit-cart" >
                                            Sélectionner
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </>
                    )}
                    {logged_in && showForm === false && (
                        <button type="button" className="submit-cart" onClick={() => setShowForm(true)} >
                            Sélectionner
                        </button>
                    )}
                </div>
            </div>
        </div >
    );
}

export default MapCard





