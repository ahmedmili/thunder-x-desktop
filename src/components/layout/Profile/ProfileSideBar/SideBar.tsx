import { Link } from 'react-router-dom';

import profileImg from '../../../../assets/profile/profile_img.png'
import phoneIcon from "../../../../assets/profile/phoneIcon.svg"
import lockIcon from "../../../../assets/profile/lockIcon.svg"

// import Accueil from '../../../../assets/profile/Accueil.svg'
// import Offres from '../../../../assets/profile/Offres.svg'
// import Config from '../../../../assets/profile/Config.svg'
// import Archive from '../../../../assets/profile/Archive.svg'
// import Espace from '../../../../assets/profile/Espace.svg'
// import Discuter from '../../../../assets/profile/Discuter.svg'
// import Favors from '../../../../assets/profile/Favors.svg'
// import Deconnecter from '../../../../assets/profile/Deconnecter.svg'

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
import DeconnecterW from '../../../../assets/profile/white/Deconnecter.svg'


import './sideBar.scss'
import { useState } from 'react';
const SideBar = () => {
  const [selectedNav, setSelectedNav] = useState<number>(1)
  const handleSelect = (e: any, index: number) => {
    e.preventDefault()
    setSelectedNav(index)
  }
  return (
    <>

      <div className="side-bar">
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

              <Link to={'/profile'} className={selectedNav == 1 ? "active" : ""} onClick={(e) => handleSelect(e, 1)} >
                <span className='profile-list-icon' style={{ backgroundImage: `url(${selectedNav === 1 ? AccueilW : Accueil})` }}></span>
                Accueil
              </Link>
            </li>

            <li>
              <Link to={'/profile'} className={selectedNav == 2 ? "active" : ""} onClick={(e) => handleSelect(e, 2)}>
                <span className='profile-list-icon' style={{ backgroundImage: `url(${selectedNav === 2 ? OffresW : Offres})` }}></span>
                Mes offres &annonces
              </Link>
            </li>
            <li>
              <Link to={'/profile'} className={selectedNav == 3 ? "active" : ""} onClick={(e) => handleSelect(e, 3)}>
                <span className='profile-list-icon' style={{ backgroundImage: `url(${selectedNav === 3 ? ConfigW : Config})` }}></span>
                Mes configurations
              </Link>
            </li>
            <li>
              <Link to={'/profile'} className={selectedNav == 4 ? "active" : ""} onClick={(e) => handleSelect(e, 4)}>
                <span className='profile-list-icon' style={{ backgroundImage: `url(${selectedNav === 4 ? ArchiveW : Archive})` }}></span>
                Archive commandes
              </Link>
            </li>
            <li>
              <Link to={'/profile'} className={selectedNav == 5 ? "active" : ""} onClick={(e) => handleSelect(e, 5)}>
                <span className='profile-list-icon' style={{ backgroundImage: `url(${selectedNav === 5 ? EspaceW : Espace})` }}></span>
                Espace de fidelité
              </Link>
            </li>
            <li>
              <Link to={'/profile'} className={selectedNav == 6 ? "active" : ""} onClick={(e) => handleSelect(e, 6)}>
                <span className='profile-list-icon' style={{ backgroundImage: `url(${selectedNav === 6 ? DiscuterW : Discuter})` }}></span>
                Discuter avec nous
              </Link>
            </li>
            <li>
              <Link to={'/profile'} className={selectedNav == 7 ? "active" : ""} onClick={(e) => handleSelect(e, 7)}>
                <span className='profile-list-icon' style={{ backgroundImage: `url(${selectedNav === 7 ? FavorsW : Favors})` }}></span>
                Mes favoris
              </Link>
            </li>
            <li>
              <Link to={'/profile'} className={`disconnect`} onClick={(e) => e.preventDefault()}>
                <span className='profile-list-icon' style={{ backgroundImage: `url(${Deconnecter})` }}></span>
                Se deconnecter
              </Link>
            </li>
          </ul>
        </nav>

      </div >
    </>
  );
};

export default SideBar;
