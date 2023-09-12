import { Link, Outlet } from 'react-router-dom';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';


import './configPage.scss'
import { useState } from 'react';
import Longue from './Longue/Longue';

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
    console.log(index)
    setSelectedSetting(index)
  }
  return (
    <>
      <div className="config-page">
        <SettingSection settingIndex={1} actionListener={handleselect} title='Modifier le compte' className={`${selectedSetting === 1 ? "active" : ""}`} />
        {
          selectedSetting === 1 &&
          <>
          </>
        }
        <SettingSection settingIndex={2} actionListener={handleselect} title='Mes adresses de livraison' className={`${selectedSetting === 2 ? "active" : ""}`} />
        <SettingSection settingIndex={3} actionListener={handleselect} title='Changer la langue' className={`${selectedSetting === 3 ? "active" : ""}`} />
        {selectedSetting === 3 &&
          <div className='option-container'>
            <Longue />
          </div>

        }
        {/* <Longue /> */}
        <SettingSection settingIndex={4} actionListener={handleselect} title='Mensions légales' className={`${selectedSetting === 4 ? "active" : ""}`} />
        <SettingSection settingIndex={5} actionListener={handleselect} title='Politiques de confidentialité' className={`${selectedSetting === 5 ? "active" : ""}`} />
        <SettingSection settingIndex={6} actionListener={handleselect} title='Sélectionner le théme' className={`${selectedSetting === 6 ? "active" : ""}`} />
        <SettingSection settingIndex={7} actionListener={handleselect} title='Supprimer mon compte' className={`${selectedSetting === 7 ? "active" : ""}`} />
      </div>

    </>
  );
};

export default ConfigPage;
