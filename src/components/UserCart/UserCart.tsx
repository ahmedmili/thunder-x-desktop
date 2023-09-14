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
import { setProfilePage } from '../../Redux/slices/home';
interface CartProps {
  closeButton: any,
  lastName: string,
  firstName: string,
}


export const UserCart: React.FC<CartProps> = ({ firstName, lastName, closeButton }) => {

  const { t } = useTranslation()
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector(state => state.home.profilePage)

  const userItem = localStorageService.getUser();
  const user = userItem ? JSON.parse(userItem) : null;

  const handleSelect = (index: number) => {
    dispatch(setProfilePage(index))
  }

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
                <Link onClick={() => handleSelect(1)} to={'/'}>{t("home")}</Link>
              </div>
            </li>

            <li>
              <div className='link-list'>
                <div className='profile-list-icon' style={{ backgroundImage: `url(${Offres})` }}></div>
                <Link onClick={() => handleSelect(2)} to={'/profile/annonces'}>{t("profile.mesOffres")}</Link>
              </div>
            </li>
            <li>
              <div className='link-list'>
                <div className='profile-list-icon' style={{ backgroundImage: `url(${Config})` }}></div>
                <Link onClick={() => handleSelect(3)} to={'/profile'}>{t("profile.mesConfig")}</Link>
              </div>
            </li>
            <li>
              <div className='link-list'>
                <div className='profile-list-icon' style={{ backgroundImage: `url(${Archive})` }}></div>
                <Link onClick={() => handleSelect(4)} to={'/profile/archivedCommands'}>{t("profile.commands")}</Link>
              </div>
            </li>
            <li>

              <div className='link-list'>
                <div className='profile-list-icon' style={{ backgroundImage: `url(${Espace})` }}></div>
                <Link onClick={() => handleSelect(5)} to={'/profile'}>{t("profile.espaceFidel")}</Link>
              </div>

            </li>
            <li>
              <div className='link-list'>
                <div className='profile-list-icon' style={{ backgroundImage: `url(${Discuter})` }}></div>
                <Link onClick={() => handleSelect(6)} to={'/profile'}>{t("profile.discuter")}</Link>
              </div>
            </li>
            <li>
              <div className='link-list'>
                <div className='profile-list-icon' style={{ backgroundImage: `url(${Favors})` }}></div>
                <Link onClick={() => handleSelect(7)} to={'/profile'}>{t("profile.favors")}</Link>
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
      </main>
    </div>
  );
};
