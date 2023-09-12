import { Link} from 'react-router-dom';

import profileImg from "../../../../assets/becon.png"
import phoneIcon from "../../../../assets/profile/phoneIcon.svg"
import lockIcon from "../../../../assets/profile/lockIcon.svg"
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
              <Link to={'/profile'} className={selectedNav == 1 ? "active" : ""} onClick={(e) => handleSelect(e, 1)}   >Accueil</Link>
            </li>


            <li>
              <Link to={'/profile'} className={selectedNav == 2 ? "active" : ""} onClick={(e) => handleSelect(e, 2)}   >Mes offres &annonces</Link>
            </li>
            <li>

              <Link to={'/profile'} className={selectedNav == 3 ? "active" : ""} onClick={(e) => handleSelect(e, 3)}    >Mes configurations</Link>
            </li>
            <li>
              <Link to={'/profile'} className={selectedNav == 4 ? "active" : ""} onClick={(e) => handleSelect(e, 4)}   >Archive commandes</Link>
            </li>
            <li>

              <Link to={'/profile'} className={selectedNav == 5 ? "active" : ""} onClick={(e) => handleSelect(e, 5)}   >Espace de fidelité</Link>
            </li>
            <li>
              <Link to={'/profile'} className={selectedNav == 6 ? "active" : ""} onClick={(e) => handleSelect(e, 6)}  >Discuter avec nous</Link>
            </li>
            <li>
              <Link to={'/profile'} className={selectedNav == 7 ? "active" : ""} onClick={(e) => handleSelect(e, 7)}  >Mes favoris</Link>
            </li>
            <li>
              <Link to={'/profile'} className={`disconnect`} onClick={(e) => e.preventDefault()}   >Se deconnecter</Link>
            </li>
          </ul>
        </nav>

      </div >
    </>
  );
};

export default SideBar;
