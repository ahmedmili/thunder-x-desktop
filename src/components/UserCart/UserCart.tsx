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
interface CartProps {
  closeButton: any,
  lastName: string,
  firstName: string,
}


export const UserCart: React.FC<CartProps> = ({ firstName, lastName, closeButton }) => {

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
            Bienvenu !
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
                {/* <div className='profile-list-icon' style={{ backgroundImage: Accueil }}></div>*/}
                <div className='profile-list-icon' style={{ backgroundImage: `url(${Accueil})` }}></div>
                <Link to={'/'}>Accueil</Link>
              </div>
            </li>

            <li>
              <div className='link-list'>
                <div className='profile-list-icon' style={{ backgroundImage: `url(${Offres})` }}></div>
                <Link to={'/'}>Mes offres &annonces</Link>
              </div>
            </li>
            <li>
              <div className='link-list'>
                <div className='profile-list-icon' style={{ backgroundImage: `url(${Config})` }}></div>
                <Link to={'/'}>Mes configurations</Link>
              </div>
            </li>
            <li>
              <div className='link-list'>
                <div className='profile-list-icon' style={{ backgroundImage: `url(${Archive})` }}></div>
                <Link to={'/'}>Archive commandes</Link>
              </div>
            </li>
            <li>

              <div className='link-list'>
                <div className='profile-list-icon' style={{ backgroundImage: `url(${Espace})` }}></div>
                <Link to={'/'}>Espace de fidelité</Link>
              </div>

            </li>
            <li>
              <div className='link-list'>
                <div className='profile-list-icon' style={{ backgroundImage: `url(${Discuter})` }}></div>
                <Link to={'/'}>Discuter avec nous</Link>
              </div>
            </li>
            <li>
              <div className='link-list'>
                <div className='profile-list-icon' style={{ backgroundImage: `url(${Favors})` }}></div>
                <Link to={'/'}>Mes favoris</Link>
              </div>
            </li>
          </ul>
        </div>
        <div className="disconnect">
          <div className='link-list'>
            <div className='profile-list-icon' style={{ backgroundImage: `url(${Deconnecter})` }}></div>
            <Link to={'login'} onClick={() => dispatch(logout())}>Se deconnecter</Link>
          </div>
        </div>
      </main>
    </div>
  );
};
