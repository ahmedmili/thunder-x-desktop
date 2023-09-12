
import { useTranslation } from 'react-i18next';
import './theme.scss'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  setTheme
} from "../../../../../Redux/slices/home";
import { useAppSelector } from '../../../../../Redux/store';


const Theme = () => {

  const theme = useAppSelector((state) => state.home.theme)
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleChange = (event: any, i: number) => {
    const currentTheme = event.target.value == "ligth" ? 0 : 1
    dispatch(setTheme(currentTheme))
  };


  useEffect(() => {
    switch (theme) {
      case 0:
        break;
      case 1:
        break;
      default:
        break;
    }
    console.log(theme)
  }, [theme])
  return (
    <>
      <section className="theme-section">
        <div className='option-container'>
          <input className='form-check-input' value='ligth' onChange={(e) => handleChange(e, 1)} checked={theme == 0} type="radio" name="theme" id="ligth" />
          <label htmlFor="ligth">{t('Clair')}</label>
        </div>
        <div className='option-container'>
          <input className='form-check-input' value='dark' onChange={(e) => handleChange(e, 1)}  checked={theme == 1}  type="radio" name="theme" id="dark" />
          <label htmlFor="dark">{t('Sombre')}</label>
        </div>
      </section>

    </>
  );
};

export default Theme;
