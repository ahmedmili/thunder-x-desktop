import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../footer/footer';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MobileMenuContent from '../mobile-menu-content/MobileMenuContent';
import { localStorageService } from '../../services/localStorageService';
import FilterPage from '../../views/filtre/FilterPage';

const Layout = () => {

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate()


  const donwloadApp = () => {
    window.open("https://play.google.com/store/apps/details?id=io.thunder.express.tn&pli=1", "_blank");
  };
  // useEffect(() => {
  //   const location = localStorageService.getCurrentLocation();
  //   if (location) {
  //     // navigate('/search/', { replace: true })
  //     setHasLocation(true)
  //   }
  // }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <div>
      <div className={`desktop-menu ${isMobileMenuOpen ? "menu-open" : ""}`}>
        <Header />
        {/* {
         !hasLocation ?
            <Outlet />
            :
            <FilterPage/>
          } */}
        <Outlet />
        <Footer />
      </div>
      <MobileMenuContent
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        donwloadApp={donwloadApp}
      />
    </div>
  );
};

export default Layout;
