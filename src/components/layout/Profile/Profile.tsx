import { Outlet } from 'react-router-dom';
import Header from '../../Header/Header';
import './profile.scss'
import SideBar from './ProfileSideBar/SideBar';
const Profile = () => {
  return (
    <>
      <Header />

      <div className="profile-container">
        <SideBar/>
        <Outlet />
      </div>
    </>
  );
};

export default Profile;
