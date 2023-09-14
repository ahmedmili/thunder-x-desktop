import { Link } from 'react-router-dom';

import profileImg from '../../../../assets/profile/profile_img.png'
import phoneIcon from "../../../../assets/profile/phoneIcon.svg"
import lockIcon from "../../../../assets/profile/lockIcon.svg"

import Accueil from '../../../../assets/profile/blue/Accueil.svg'
import Offres from '../../../../assets/profile/blue/Offres.svg'
import Config from '../../../../assets/profile/blue/Config.svg'
import Archive from '../../../../assets/profile/blue/Archive.svg'
import Espace from '../../../../assets/profile/blue/Espace.svg'
import Discuter from '../../../../assets/profile/blue/Discuter.svg'
import Favors from '../../../../assets/profile/blue/Favors.svg'
import Deconnecter from '../../../../assets/profile/blue/Deconnecter.svg'

import AccueilW from '../../../../assets/profile/white/Accueil.svg'
import OffresW from '../../../../assets/profile/white/Offres.svg'
import ConfigW from '../../../../assets/profile/white/Config.svg'
import ArchiveW from '../../../../assets/profile/white/Archive.svg'
import EspaceW from '../../../../assets/profile/white/Espace.svg'
import DiscuterW from '../../../../assets/profile/white/Discuter.svg'
import FavorsW from '../../../../assets/profile/white/Favors.svg'

import './sideBar.scss'
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../../Redux/store';
import { logout } from '../../../../Redux/slices/userSlice';
import { useTranslation } from 'react-i18next';

const SideBar = () => {
  const [selectedNav, setSelectedNav] = useState<number>(0)
  const handleSelect = (e: any, index: number) => {
    setSelectedNav(index)
  }

  const [isDivVisible, setIsDivVisible] = useState(true);

  const dispatch = useAppDispatch();
  const { t } = useTranslation()
  useEffect(() => {
    // Function to handle window resize events
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setIsDivVisible(false);
      } else {
        setIsDivVisible(true);
      }
    };

    // Attach the event listener when the component mounts
    window.addEventListener('resize', handleResize);

    // Initial check for visibility
    handleResize();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div className={`side-bar ${isDivVisible ? "visible-bar" : ""} `}>
        <header className='sideBar-header'>
          <div className="image" style={{ backgroundImage: `url(${profileImg})` }}></div>
          <div className='info'>
            <div className="name">Toumi Marwa</div>
            <div className="icons">
              <div className="icon" style={{ backgroundImage: `url(${phoneIcon})` }}></div>
              <div className="icon" style={{ backgroundImage: `url(${lockIcon})` }}></div>
            </div>
          </div>
        </header>

        <nav className='sideBar-nav'>
          <ul>
            <li>

              <Link to={'/'} className={selectedNav == 1 ? "active" : ""} onClick={(e) => handleSelect(e, 1)} >
                <span className='profile-list-icon' style={{ backgroundImage: `url(${selectedNav === 1 ? AccueilW : Accueil})` }}></span>
                {t('home')}
              </Link>
            </li>

            <li>
              <Link to={'/profile/annonces'} className={selectedNav == 2 ? "active" : ""} onClick={(e) => handleSelect(e, 2)}>
                <span className='profile-list-icon' style={{ backgroundImage: `url(${selectedNav === 2 ? OffresW : Offres})` }}></span>
                {t('profile.mesOffres')}
              </Link>
            </li>
            <li>
              <Link to={'/profile'} className={selectedNav == 3 ? "active" : ""} onClick={(e) => handleSelect(e, 3)}>
                <span className='profile-list-icon' style={{ backgroundImage: `url(${selectedNav === 3 ? ConfigW : Config})` }}></span>
                {t('profile.mesConfig')}
              </Link>
            </li>
            <li>
              <Link to={'/profile/archivedCommands'} className={selectedNav == 4 ? "active" : ""} onClick={(e) => handleSelect(e, 4)}>
                <span className='profile-list-icon' style={{ backgroundImage: `url(${selectedNav === 4 ? ArchiveW : Archive})` }}></span>
                {t('profile.commands')}
              </Link>
            </li>
            <li>
              <Link to={'/profile'} className={selectedNav == 5 ? "active" : ""} onClick={(e) => handleSelect(e, 5)}>
                <span className='profile-list-icon' style={{ backgroundImage: `url(${selectedNav === 5 ? EspaceW : Espace})` }}></span>
                {t('profile.espaceFidel')}
              </Link>
            </li>
            <li>
              <Link to={'/profile'} className={selectedNav == 6 ? "active" : ""} onClick={(e) => handleSelect(e, 6)}>
                <span className='profile-list-icon' style={{ backgroundImage: `url(${selectedNav === 6 ? DiscuterW : Discuter})` }}></span>
                {t('profile.discuter')}
              </Link>
            </li>
            <li>
              <Link to={'/profile'} className={selectedNav == 7 ? "active" : ""} onClick={(e) => handleSelect(e, 7)}>
                <span className='profile-list-icon' style={{ backgroundImage: `url(${selectedNav === 7 ? FavorsW : Favors})` }}></span>
                {t('profile.favors')}
              </Link>
            </li>
            <li>
              <Link to={'/profile'} className={`disconnect`} onClick={(e) => {
                e.preventDefault()
                dispatch(logout())
              }}>
                <span className='profile-list-icon' style={{ backgroundImage: `url(${Deconnecter})` }}></span>
                {t('profile.deconnecter')}
              </Link>
            </li>
          </ul>
        </nav>



      </div >

      <button onClick={() => setIsDivVisible(!isDivVisible)} className={`visibility-button ${isDivVisible ? "visible-bar" : ""}`}>
        ...
      </button >
    </>
  );
};

export default SideBar;
