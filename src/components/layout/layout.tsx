import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../footer/footer';
import { useAppSelector } from '../../Redux/store';
import { useEffect, useState } from 'react';

const Layout = () => {
  const theme = useAppSelector((state) => state.home.theme)
  const [template, setTemplate] = useState<number>(theme)
  useEffect(() => {
    setTemplate(theme)
  }, [theme])
  return (
    <div className={`${template === 1 && "dark-background"}`}>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
