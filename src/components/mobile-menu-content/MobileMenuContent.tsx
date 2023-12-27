import React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import close from '../../assets/close-m.png';
import logo from '../../assets/icon-old.png';
import './MobileMenuContent.scss';

interface MobileMenuContentProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  donwloadApp: () => void;
}

const MobileMenuContent = ({ isMobileMenuOpen, toggleMobileMenu, donwloadApp }: MobileMenuContentProps) => {
  const { t } = useTranslation();
  const [backgroundClass, setBackgroundClass] = useState("");
  useEffect(() => {
    const classes = ["bg-1", "bg-2", "bg-3"];
    const randomClass = classes[Math.floor(Math.random() * classes.length)];
    setBackgroundClass(randomClass);
  }, []);

  return (
    <div className={`mobile-menu ${backgroundClass} ${isMobileMenuOpen ? "menu-close hidden" : ""}`}>
      <div className="close-menu" onClick={toggleMobileMenu}>
        <img src={close} alt="logo" loading="lazy" className="img-logo" />
      </div>
      <div className={`mobile-menu-content`}>
        <div className='logo-text-container'>
          <div className="logo-container">
            <img src={logo} alt="logo" loading="lazy" className="img-logo" />
          </div>
          <p className="logo-content-container">{"thunder exspress".toUpperCase()}</p>
        </div>
        <h2 className="title-content-container">{t("mobile.menu.title").toUpperCase()}</h2>
        <p className="desc-content-container">{t("mobile.menu.description").toUpperCase()}</p>
        <div className="btn-block-container">
          <button className="yellow-button" onClick={donwloadApp}>
            {t("mobile.menu.download_button")}
          </button>
          <button className="transparent-button" onClick={toggleMobileMenu}>
            {t("mobile.menu.web_button")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenuContent;
