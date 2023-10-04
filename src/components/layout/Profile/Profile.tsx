import { Outlet } from 'react-router-dom';
import Header from '../../Header/Header';
import './profile.scss'
import SideBar from './ProfileSideBar/SideBar';
import { useAppSelector } from '../../../Redux/store';
import { useEffect, useState } from 'react';

const Profile = () => {
  const theme = useAppSelector((state) => state.home.theme)
  const [template, setTemplate] = useState<number>(theme)
  useEffect(() => {
    setTemplate(theme)
  },[theme])
  return (
    <>
      <Header />

      <div className={`profile-container ${template === 1 ? 'dark-background' : ''}`}>
        <SideBar />
        <Outlet />
      </div>
    </>
  );
};

export default Profile;
