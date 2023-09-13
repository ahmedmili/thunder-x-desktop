import { Link, Outlet } from 'react-router-dom';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';


import './configPage.scss'
import { useState } from 'react';
import Longue from './Longue/Longue';
import Theme from './Theme/Theme';
import Map from '../../../Location/Location';
import Legale from './Legale/Legale';
import Politiques from './Politiques/Politiques';
import ModifPassword from '../../../Popups/ModifPassword/ModifPassword';

interface Settingsection {
  title: string;
  settingIndex: number;
  actionListener: any;
  className: string;
}

const SettingSection: React.FC<Settingsection> = (props) => {
  const index = props.settingIndex
  const handleClick = () => {
    props.actionListener(index)
  }
  return (
    <>
      <div className={'setting '} onClick={handleClick} >
        <div className={"header " + props.className}>
          <div className="title">{props.title}</div>
          <KeyboardArrowUpOutlinedIcon className='icon' />

        </div>
      </div>

    </>
  )
}

const ConfigPage = () => {

  const [selectedSetting, setSelectedSetting] = useState<number>(0)
  const handleselect = (index: number) => {
    setSelectedSetting(index)
  }
  const closePopup = () =>{
    setSelectedSetting(0)
  }
  return (
    <>
      <div className="config-page">
        <SettingSection settingIndex={1} actionListener={handleselect} title='Modifier le compte' className={`${selectedSetting === 1 ? "active" : ""}`} />
        {
          selectedSetting === 1 &&
          <>
          <ModifPassword close={closePopup}/>
          </>
        }
        <SettingSection settingIndex={2} actionListener={handleselect} title='Mes adresses de livraison' className={`${selectedSetting === 2 ? "active" : ""}`} />
        {
          selectedSetting === 2 &&
          <div className='map-container'>
            <Map className='profile-config-map' />
          </div>
        }
        <SettingSection settingIndex={3} actionListener={handleselect} title='Changer la langue' className={`${selectedSetting === 3 ? "active" : ""}`} />
        {selectedSetting === 3 &&
          <div className='longue-container'>
            <Longue />
          </div>

        }
        <SettingSection settingIndex={4} actionListener={handleselect} title='Mensions légales' className={`${selectedSetting === 4 ? "active" : ""}`} />
        {
          selectedSetting === 4 &&
          <div className='legal-container'>
            <Legale />
          </div>
        }

        <SettingSection settingIndex={5} actionListener={handleselect} title='Politiques de confidentialité' className={`${selectedSetting === 5 ? "active" : ""}`} />
        {
          selectedSetting === 5 &&
          <div className='legal-container'>
            <Politiques />
          </div>
        }
        <SettingSection settingIndex={6} actionListener={handleselect} title='Sélectionner le théme' className={`${selectedSetting === 6 ? "active" : ""}`} />
        {selectedSetting === 6 &&
          <div className='theme-container'>
            <Theme />
          </div>
        }
        {/* <Theme /> */}
        <SettingSection settingIndex={7} actionListener={handleselect} title='Supprimer mon compte' className={`${selectedSetting === 7 ? "active" : ""}`} />
      </div>

    </>
  );
};

export default ConfigPage;
