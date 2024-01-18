import { Outlet } from 'react-router-dom';
import Header from '../../Header/Header';
import SideBar from './ProfileSideBar/SideBar';
import './profile.scss';
import { useAppSelector } from '../../../Redux/store';
import { useEffect, useState } from 'react';
import Messanger from '../../Popups/Messanger/Messanger';
import MessangerBtnIcon from '../../../assets/profile/Discuter/messanger-btn.svg';
import { fetchMessages, handleMessanger } from '../../../Redux/slices/messanger';
import { useDispatch } from 'react-redux';

const Profile = () => {

  const dispatch = useDispatch()
  // handle messanger
  const unReadMessages = useAppSelector((state) => state.messanger.unReadedMessages)
  const isMessagesOpen = useAppSelector((state) => state.messanger.isOpen)

  const [unReadedQt, setUnReadedQt] = useState<number>(unReadMessages)
  useEffect(() => {
    setUnReadedQt(unReadMessages)
  }, [unReadMessages])

  const handleMessangerPopup = () => {
    dispatch(handleMessanger())
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
        </div>

        {
          isMessagesOpen && <Messanger className="discuter-messanger-popup" close={handleMessangerPopup} />
        }
      </div>
    </>
  );
};

export default Profile;
