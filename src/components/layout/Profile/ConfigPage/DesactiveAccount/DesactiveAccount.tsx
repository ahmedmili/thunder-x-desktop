
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
// import { toast } from 'react-toastify';
import { logout } from '../../../../../Redux/slices/userSlice';
import { useAppDispatch } from '../../../../../Redux/store';
import Cover from '../../../../../assets/profile/desactive-cover.png';
import { LocationService } from '../../../../../services/api/Location.api';
import { userService } from '../../../../../services/api/user.api';
import ConfirmPopup from '../../../../Popups/ConfirmPopup/ConfirmPopup';
import './desactiveAccount.scss';

interface DesactiveAccountProps {
  type: string
}

const DesactiveAccount: React.FC<DesactiveAccountProps> = ({ type }) => {



  const { t } = useTranslation()

  const aviDefault = [
    { checked: false, reason: t('profile.desactive.avi1') },
    { checked: false, reason: t('profile.desactive.avi2') },
    { checked: false, reason: t('profile.desactive.avi3') },
    { checked: false, reason: t('profile.desactive.avi4') }

  ]
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [rate, setRate] = useState<number>(3)
  const [avisList, setAvisList] = useState<any[]>(aviDefault)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleRate = (index: number) => {
    setRate(index);
  }



  const handleAvisList = (index: number) => {

    var avis: any[] = [...avisList];
    avis[index].checked = !avis[index].checked
    setAvisList(avis)
  }

  const handleConfirm = () => {
    setShowConfirm(current => !current)
  }

  const concateTableReason = (t: any[]): string => {
    let result: string[] = [];
    t.forEach((e: any) => {
      result.push(e.reason)
    })
    return result.join(',')
  }

  const desactiveAccount = async () => {
    const checked = avisList.filter((e) => e.checked === true)
    const resultReasons: string = concateTableReason(checked)
    const formData = {
      evaluation: rate,
      reason: resultReasons,
      status_id: "2"
    }

    try {
      const { status, data } = await userService.desactivateAccount(formData)
      if (data.success) {
        let lang = localStorage.getItem('lang');
        localStorage.clear();
        localStorage.setItem('lang', lang!);
        dispatch(logout())
        navigator.geolocation.getCurrentPosition(
          (position: any) => {
            const { latitude, longitude } = position.coords;
            LocationService.geoCode(latitude, longitude).then(data => {
              dispatch({
                type: "SET_LOCATION",
                payload: {
                  ...data
                },
              });
            });
          },
          (error: GeolocationPositionError) => {
            // toast.error(error.message)
          }
        );
        navigate('/')
      }
      else {
        // toast.error('un probléme')
      }
    } catch (error) {
      throw error
    }
  }


  const deleteAccount = async () => {
    const checked = avisList.filter((e) => e.checked === true)
    const resultReasons: string = concateTableReason(checked)
    const formData = {
      evaluation: rate,
      reason: resultReasons,
    }

    try {
      const { status, data } = await userService.deleteAccount(formData)
      if (data.success) {
        let lang = localStorage.getItem('lang');
        localStorage.clear();
        localStorage.setItem('lang', lang!);
        dispatch(logout())
        navigate('/')
      }
      else {
        // toast.error('un probléme')
      }
    } catch (error) {
      throw error
    }
  }

  const handleSubmit = () => {
    switch (type) {
      case 'desactiv':
        desactiveAccount();
        break;
      case 'delete':
        deleteAccount();
        break;
      default: break;
    }
  }


  return (
    <>
      <section className="desactive-account-section">
        <div className='desactive-header-cover' style={{ backgroundImage: `url(${Cover})` }}>

        </div>

        <div className='desactive-body'>
          <h3 className='desactive-title'>
            {t('profile.desactive.title')}
          </h3>
          <p className='desactive-warn'>
            {t('profile.desactive.message')}
          </p>
          <div className='desactive-avis-container'>
            <div className='avi-content'>
              <input type="checkbox" name="avis1" id="avis1" checked={avisList[0].checked} />
              <label htmlFor="avis1" onClick={() => handleAvisList(0)}>
                {avisList[0].reason}
              </label>
            </div>
            <div className='avi-content'>
              <input type="checkbox" name="avis2" id="avis2" checked={avisList[1].checked} />
              <label htmlFor="avis2" onClick={() => handleAvisList(1)} >
                {avisList[1].reason}
              </label>
            </div>
            <div className='avi-content'>
              <input type="checkbox" name="avis3" id="avis3" checked={avisList[2].checked} />

              <label htmlFor="avis3" onClick={() => handleAvisList(2)} >
                {avisList[2].reason}
              </label>
            </div>
            <div className='avi-content'>
              <input type="checkbox" name="avis4" id="avis4" checked={avisList[3].checked} />

              <label htmlFor="avis4" onClick={() => handleAvisList(3)}>
                {avisList[3].reason}
              </label>
            </div>
          </div>

          <div className='desactive-rate-container'>
            <button className={`desactive-rate-btn  ${rate === 1 ? "active" : ""}`} onClick={() => handleRate(1)}>1</button>
            <button className={`desactive-rate-btn  ${rate === 2 ? "active" : ""}`} onClick={() => handleRate(2)}>2</button>
            <button className={`desactive-rate-btn  ${rate === 3 ? "active" : ""}`} onClick={() => handleRate(3)}>3</button>
            <button className={`desactive-rate-btn  ${rate === 4 ? "active" : ""}`} onClick={() => handleRate(4)}>4</button>
            <button className={`desactive-rate-btn  ${rate === 5 ? "active" : ""}`} onClick={() => handleRate(5)}>5</button>
          </div>

          <div className='desactive-buttons'>
            <button className='cancle-btn'>{t('Annuler')}</button>
            <button className='submit-btn' onClick={handleConfirm} >{t('profile.desactive.Desactiveok')}</button>
          </div>

        </div>
      </section>
      {
        showConfirm && <ConfirmPopup accept={handleSubmit} close={handleConfirm} title={type === "desactiv" ? t('profile.desactive.warnMessage') : t('profile.delete.warnMessage')} />
      }
    </>
  );
};

export default DesactiveAccount;
