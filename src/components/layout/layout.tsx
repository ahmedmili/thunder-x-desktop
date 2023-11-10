import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../footer/footer';

const Layout = () => {

  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
