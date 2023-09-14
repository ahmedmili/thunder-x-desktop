import { useAppDispatch, useAppSelector } from '../../Redux/store';

import { FoodItem, User } from '../../services/types';
import React, { useEffect, useState } from 'react';


import { logout } from "../../Redux/slices/userSlice";


import profile_img from '../../assets/profile/profile_img.png'
import Accueil from '../../assets/profile/Accueil.svg'
import Offres from '../../assets/profile/Offres.svg'
import Config from '../../assets/profile/Config.svg'
import Archive from '../../assets/profile/Archive.svg'
import Espace from '../../assets/profile/Espace.svg'
import Discuter from '../../assets/profile/Discuter.svg'
import Favors from '../../assets/profile/Favors.svg'
import Deconnecter from '../../assets/profile/Deconnecter.svg'
import './userCart.scss'
import { RootState } from '../../Redux/slices';
import { localStorageService } from '../../services/localStorageService';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
interface CartProps {
  closeButton: any,
  lastName: string,
  firstName: string,
}


export const UserCart: React.FC<CartProps> = ({ firstName, lastName, closeButton }) => {
  const { t } = useTranslation()
  // const user = JSON.parse(localStorageService.getUser()!);
  const userItem = localStorageService.getUser();
  const user = userItem ? JSON.parse(userItem) : null;

  const dispatch = useAppDispatch();

  return (
    <div className="profile-cart-main">
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

      <main>
        <div className='info-list'>
          <ul>
            <li>
              <div className='link-list'>
                <div className='profile-list-icon' style={{ backgroundImage: `url(${Accueil})` }}></div>
                <Link to={'/'}>{t("home")}</Link>
              </div>
            </li>

            <li>
              <div className='link-list'>
                <div className='profile-list-icon' style={{ backgroundImage: `url(${Offres})` }}></div>
                <Link to={'/'}>{t("profile.mesOffres")}</Link>
              </div>
            </li>
            <li>
              <div className='link-list'>
                <div className='profile-list-icon' style={{ backgroundImage: `url(${Config})` }}></div>
                <Link to={'/profile/'}>{t("profile.mesConfig")}</Link>
              </div>
            </li>
            <li>
              <div className='link-list'>
                <div className='profile-list-icon' style={{ backgroundImage: `url(${Archive})` }}></div>
                <Link to={'/'}>{t("profile.commands")}</Link>
              </div>
            </li>
            <li>

              <div className='link-list'>
                <div className='profile-list-icon' style={{ backgroundImage: `url(${Espace})` }}></div>
                <Link to={'/'}>{t("profile.espaceFidel")}</Link>
              </div>

            </li>
            <li>
              <div className='link-list'>
                <div className='profile-list-icon' style={{ backgroundImage: `url(${Discuter})` }}></div>
                <Link to={'/'}>{t("profile.discuter")}</Link>
              </div>
            </li>
            <li>
              <div className='link-list'>
                <div className='profile-list-icon' style={{ backgroundImage: `url(${Favors})` }}></div>
                <Link to={'/'}>{t("profile.favors")}</Link>
              </div>
            </li>
          </ul>
        </div>
        <div className="disconnect">
          <div className='link-list'>
            <div className='profile-list-icon' style={{ backgroundImage: `url(${Deconnecter})` }}></div>
            <Link to={'login'} onClick={() => dispatch(logout())}>{t("profile.deconnecter")}</Link>
          </div>
        </div>
      </main>
    </div>
  );
};
