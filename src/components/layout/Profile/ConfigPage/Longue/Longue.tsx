
import { useTranslation } from 'react-i18next';
import './longue.scss'
import { useEffect, useState } from 'react';

const Longue = () => {
  const [selectedLangue, setSelectedLangue] = useState<number>(0)

  const { t, i18n } = useTranslation();

  const handleChange = (event: any, i: number) => {
    i18n.changeLanguage(event.target.value);
    setSelectedLangue(i)
  };


  useEffect(() => {
    const currentLong = i18n.language;
    switch (currentLong) {
      case 'ar':
        setSelectedLangue(1)
        break;
      case 'fr':
        setSelectedLangue(2)
        break;
      case 'en':
      case 'en-US':
        setSelectedLangue(3)
        break;
      default:
        break;
    }
  }, [selectedLangue])
  return (
    <>
      <section className="long-section">
        <div className='option-container'>
          <input className='form-check-input' value='ar' checked={selectedLangue == 1} onClick={(e) => handleChange(e, 1)} type="radio" name="long" id="Ar" />
          <label htmlFor="Ar">{t('Arabic')}</label>
        </div>
        <div className='option-container'>
          <input className='form-check-input' value='fr' checked={selectedLangue == 2} onClick={(e) => handleChange(e, 2)} type="radio" name="long" id="Fr" />
          <label htmlFor="Fr">{t('French')}</label>
        </div>
        <div className='option-container'>
          <input className='form-check-input' value='en' checked={selectedLangue == 3} onClick={(e) => handleChange(e, 3)} type="radio" name="long" id="En" />
          <label htmlFor="En">{t('English')}</label>
        </div>
      </section>

    </>
  );
};

export default Longue;
