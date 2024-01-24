import { useAppDispatch, useAppSelector } from '../../Redux/store';

import React, { useEffect, useState } from 'react';


import { logout } from "../../Redux/slices/userSlice";


import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setProfilePage } from '../../Redux/slices/home';
import Accueil from '../../assets/profile/Accueil.svg';
import Archive from '../../assets/profile/Archive.svg';
import Config from '../../assets/profile/Config.svg';
import Deconnecter from '../../assets/profile/Deconnecter.svg';
import Discuter from '../../assets/profile/Discuter.svg';
import Espace from '../../assets/profile/Espace.svg';
import Favors from '../../assets/profile/Favors.svg';
import Offres from '../../assets/profile/Offres.svg';
import profile_img from '../../assets/profile/profile_img.png';
import { LocationService } from '../../services/api/Location.api';
import { localStorageService } from '../../services/localStorageService';
import './userCart.scss';
interface CartProps {
  closeButton: any,
  lastName?: string,
  firstName?: string,
}


export const UserCart: React.FC<CartProps> = ({ firstName = "", lastName = "", closeButton }) => {

  const { t } = useTranslation()
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector(state => state.home.profilePage)

  const msg_notifs = useAppSelector((state) => state.messanger.unReadedMessages)
  const logged_in = localStorageService.getUserToken() !== null;

  const userItem = localStorageService.getUser();
  const user = userItem ? JSON.parse(userItem) : null;

  const [discuterNotifActive, setDiscuterNotifActive] = useState<boolean>(msg_notifs > 0 ? true : false)
  const handleSelect = (index: number) => {
    dispatch(setProfilePage(index))
  }

  useEffect(() => {
    logged_in && setDiscuterNotifActive(msg_notifs > 0 ? true : false)
  }, [msg_notifs])


  const inRegion = async (formData: any) => {
    const { status, data } = await LocationService.inRegion(formData)
    return data.data ? true : false
  }

  return (
    <div className={`profile-cart-main`}>
      {
        logged_in &&
        (

          <header>
            <div className='profile-info'>
              <img src={profile_img} alt="profile photo" />
              <p className='welcome-msg'>
                {t('welcome')} !
              </p>
              {
                user && (
                  <p className='full-name'>
                    {firstName} {lastName}
                  </p>

                )
              }
            </div>
            <button onClick={closeButton} className="close-btn">
              X
            </button>
          </header>
        )

      }

      <main>
        {
          logged_in ? (
            <>
              <div className='info-list'>
                <ul>
                  <li>
                    <div className='link-list'>
                      <div className='profile-list-icon' style={{ backgroundImage: `url(${Accueil})` }}></div>
                      <Link onClick={() => handleSelect(1)} to={'/'}>{t("home")}</Link>
                    </div>
                  </li>

                  <li>
                    <div className='link-list'>
                      <div className='profile-list-icon' style={{ backgroundImage: `url(${Offres})` }}></div>
                      <Link onClick={() => handleSelect(2)} to={'/profile/annonces/'}>{t("profile.mesOffres")}</Link>
                    </div>
                  </li>
                  <li>
                    <div className='link-list'>
                      <div className='profile-list-icon' style={{ backgroundImage: `url(${Config})` }}></div>
                      <Link onClick={() => handleSelect(3)} to={'/profile/'}>{t("profile.mesConfig")}</Link>
                    </div>
                  </li>
                  <li>
                    <div className='link-list'>
                      <div className='profile-list-icon' style={{ backgroundImage: `url(${Archive})` }}></div>
                      <Link onClick={() => handleSelect(4)} to={'/profile/archivedCommands/'}>{t("profile.commands")}</Link>
                    </div>
                  </li>
                  <li>

                    <div className='link-list'>
                      <div className='profile-list-icon' style={{ backgroundImage: `url(${Espace})` }}></div>
                      <Link onClick={() => handleSelect(5)} to={'/profile/Fidelite/repas'}>{t("profile.espaceFidel")}</Link>
                    </div>

                  </li>
                  <li>
                    <div className='link-list'>
                      <div className='profile-list-icon' style={{ backgroundImage: `url(${Discuter})` }}></div>
                      <Link onClick={() => handleSelect(6)} to={'/profile/discuter/'}>{t("profile.discuter")}</Link>
                      {
                        discuterNotifActive && (
                          <div className='notif-indicator'>
                          </div>
                        )
                      }
                    </div>
                  </li>
                  <li>
                    <div className='link-list'>
                      <div className='profile-list-icon' style={{ backgroundImage: `url(${Favors})` }}></div>
                      <Link onClick={() => handleSelect(7)} to={'/profile/Favors/'}>{t("profile.favors")}</Link>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="disconnect">
                <div className='link-list'>
                  <div className='profile-list-icon' style={{ backgroundImage: `url(${Deconnecter})` }}></div>
                  <Link to={'/'} onClick={() => dispatch(logout())}>{t("profile.deconnecter")}</Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className='info-list'>
                <ul style={{
                  border: "0",
                  padding: "0",
                  margin: "0",
                }}>
                  <li>
                    <div className='link-list'>
                      <Link to={'/login'}>{t("login")}</Link>
                    </div>
                  </li>
                  <li>
                    <div className='link-list'>
                      <Link to={'/register'}>{t("signup")}</Link>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="disconnect">
                <div className='link-list'>
                  <div className='profile-list-icon' style={{ backgroundImage: `url(${Deconnecter})` }}></div>
                  <Link to={'/'} onClick={() => {
                    dispatch(logout())
                    navigator.geolocation.getCurrentPosition(
                      (position: any) => {
                        const { latitude, longitude } = position.coords;
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
                        // toast.error(error.message)
                      }
                    );

                  }

                  }>{t("profile.deconnecter")}</Link>
                </div>
              </div>
            </>
          )
        }
      </main>
    </div>
  );
};
