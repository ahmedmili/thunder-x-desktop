import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { useNavigate } from 'react-router-dom';


import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logout } from '../../../../Redux/slices/userSlice';
import { useAppSelector } from '../../../../Redux/store';
import { userService } from '../../../../services/api/user.api';
import Map from '../../../Location/Location';
import ModifPassword from '../../../Popups/ModifPassword/ModifPassword';
import PhoneNumberInput from '../../../Popups/PhoneNumberInput/PhoneNumberInput';
import Legale from './Legale/Legale';
import Longue from './Longue/Longue';
import Politiques from './Politiques/Politiques';
import UpdateAccount from './UpdateAccount/UpdateAccount';
import './configPage.scss';
import DesactiveAccount from './DesactiveAccount/DesactiveAccount';

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
  const { t } = useTranslation()
  const theme = useAppSelector((state) => state.home.theme)

  const [selectedSetting, setSelectedSetting] = useState<number>(0)
  const [showPWPopup, setShowPWPopup] = useState<boolean>(false)
  const [showPhoneInputPopup, setShowPhoneInputPopup] = useState<boolean>(false)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleselect = (index: number) => {
    index === selectedSetting ? setSelectedSetting(0) : setSelectedSetting(index);
  }
  const closePopup = () => {
    setSelectedSetting(0)
  }

  const deleteAccount = async () => {
    const { status, data } = await userService.deleteAccount()
    if (data.success) {
      let lang = localStorage.getItem('lang');
      localStorage.clear();
      localStorage.setItem('lang', lang!);
      dispatch(logout())
      navigate('/')
    }
    else {
      toast.error('un probléme')
    }
  }

  // const desactiveAccount = async () => {
  //   const { status, data } = await userService.desactivateAccount()
  //   if (data.success) {
  //     let lang = localStorage.getItem('lang');
  //     localStorage.clear();
  //     localStorage.setItem('lang', lang!);
  //     dispatch(logout())
  //     navigate('/')
  //   }
  //   else {
  //     toast.error('un probléme')
  //   }
  // }

  const showPasswordPopup = () => {
    setShowPWPopup(!showPWPopup)
  }
  const handlePhonePopup = () => {
    setShowPhoneInputPopup(!showPhoneInputPopup)
  }

  return (
    <>
      <div className={`config-page `}>
        <SettingSection settingIndex={1} actionListener={handleselect} title={t('profile.mesConfig.modifAccount')} className={`${selectedSetting === 1 ? "active" : ""}`} />
        {
          selectedSetting === 1 &&
          <>
            <UpdateAccount showPassword={showPasswordPopup} showPhone={handlePhonePopup} />
          </>
        }
        {
          showPWPopup &&
          <>
            {/* <UpdateAccount /> */}
            <ModifPassword close={showPasswordPopup} />
          </>
        }
        {
          showPhoneInputPopup &&
          <>
            {/* <updatePhone /> */}
            <PhoneNumberInput close={handlePhonePopup} />
          </>
        }
        <SettingSection settingIndex={2} actionListener={handleselect} title={t('profile.mesConfig.delivAdress')} className={`${selectedSetting === 2 ? "active" : ""}`} />
        {
          selectedSetting === 2 &&
          <div className='map-container'>
            <Map className='profile-config-map' />
          </div>
        }
        <SettingSection settingIndex={3} actionListener={handleselect} title={t('profile.mesConfig.modifLong')} className={`${selectedSetting === 3 ? "active" : ""}`} />
        {selectedSetting === 3 &&
          <div className='longue-container'>
            <Longue />
          </div>

        }
        <SettingSection settingIndex={4} actionListener={handleselect} title={t('profile.mesConfig.legales')} className={`${selectedSetting === 4 ? "active" : ""}`} />
        {
          selectedSetting === 4 &&
          <div className='legal-container'>
            <Legale />
          </div>
        }

        <SettingSection settingIndex={5} actionListener={handleselect} title={t('profile.mesConfig.politiques')} className={`${selectedSetting === 5 ? "active" : ""}`} />
        {
          selectedSetting === 5 &&
          <div className='legal-container'>
            <Politiques />
          </div>
        }
        <SettingSection settingIndex={6} actionListener={handleselect} title='Désactiver mon compte' className={`${selectedSetting === 6 ? "active" : ""}`} />
        {
          selectedSetting === 6 &&
          <div className='desactive-container'>
            <DesactiveAccount />
          </div>
        }
        <SettingSection settingIndex={7} actionListener={deleteAccount} title={t('profile.mesConfig.deleteAccount')} className={`${selectedSetting === 7 ? "active" : ""}`} />
      </div>

    </>
  );
};

export default ConfigPage;
