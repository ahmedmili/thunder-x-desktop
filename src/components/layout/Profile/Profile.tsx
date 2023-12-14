import { Outlet } from 'react-router-dom';
import Header from '../../Header/Header';
import SideBar from './ProfileSideBar/SideBar';
import './profile.scss';
import { useAppSelector } from '../../../Redux/store';
import { useEffect, useState } from 'react';
import Messanger from '../../Popups/Messanger/Messanger';
import MessangerBtnIcon from '../../../assets/profile/Discuter/messanger-btn.svg';
import { fetchMessages } from '../../../Redux/slices/messanger';

const Profile = () => {

  // handle messanger
  const unReadMessages = useAppSelector((state) => state.messanger.unReadedMessages)
  const [messangerPopup, setMessangerPopup] = useState<boolean>(false)
  const [unReadedQt, setUnReadedQt] = useState<number>(unReadMessages)
  useEffect(() => {
    setUnReadedQt(unReadMessages)
  }, [unReadMessages])

  const handleMessangerPopup = () => {
    setMessangerPopup(!messangerPopup)
  }
  
  useEffect(() => {
    fetchMessages()
}, [])

  return (
    <>
      <Header />

      <div className={`profile-container`}>
        <SideBar />
        <div className="profile-main">
          <Outlet />
        </div>

        <div className='bulles'>
          <button className='messanger-popup-btn' onClick={handleMessangerPopup} style={{ backgroundImage: `url(${MessangerBtnIcon})` }}>
            {unReadedQt > 0 && (
              <div className='messanger-bull-notif-icon'>
                {unReadedQt}
              </div>
            )}
          </button>
          {/* <button className='phone-popup-btn' onClick={handlePhonePopup} style={{ backgroundImage: `url(${PhoneBtnIcon})` }}></button> */}
        </div>

        {
          messangerPopup && <Messanger className="discuter-messanger-popup" close={handleMessangerPopup} />
        }
      </div>
    </>
  );
};

export default Profile;
