
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import Cover from '../../../../../assets/profile/desactive-cover.png';
import ConfirmPopup from '../../../../Popups/ConfirmPopup/ConfirmPopup';
import './desactiveAccount.scss';
import { useAppDispatch } from '../../../../../Redux/store';
import { userService } from '../../../../../services/api/user.api';
import { logout } from '../../../../../Redux/slices/userSlice';
import { toast } from 'react-toastify';

interface DesactiveAccountProps {

}

const DesactiveAccount: React.FC<DesactiveAccountProps> = () => {



  const { t } = useTranslation()
  
  const aviDefault = [
    { checked: false, reason: "L’application n’est pas pratique" },
    { checked: false, reason: "L’application est lente" },
    { checked: false, reason: "Je ne suis pas satisfait de mon expérience de livraison avec l’application" },
    { checked: false, reason: "J’ai trouvé ubne autre alternative à Thunder Express avec des frais de livraison inférieurs aux vôtres" }

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
    var avis: any[] = aviDefault;
    avis[index].checked = !avis[index].checked
    setAvisList(avis)
  }

  const handleConfirm = () => {
    setShowConfirm(current => !current)
  }

  const desactiveAccount = async () => {
    const checked = avisList.filter((e) => e.checked === true)
    const formData = {
      evaluation: rate,
      reason: checked.length > 0 ? checked[0].reason : "",
      status_id: "2"
    }
    try {
      const { status, data } = await userService.desactivateAccount(formData)
      if (data.success) {
        let lang = localStorage.getItem('lang');
        localStorage.clear();
        localStorage.setItem('lang', lang!);
        dispatch(logout())
        navigate('/')
      }
      else {
        toast.error('un probléme')
      }
    } catch (error) {
      throw error
    }
  }


  return (
    <>
      <section className="desactive-account-section">
        <div className='desactive-header-cover' style={{ backgroundImage: `url(${Cover})` }}>

        </div>

        <div className='desactive-body'>
          <h3 className='desactive-title'>
            Pour quelles raisons vous voulez désactiver / supprimer votre compte ?
          </h3>
          <p className='desactive-warn'>
            Si vous désactivez temporairement votre compte, vous pourrez à tout moment le restaurer en utilisant votre nom d’utilisateur et votre mot de passe
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
              <input type="checkbox" name="avis3" id="avis3" onClick={() => handleAvisList(2)} checked={avisList[2].checked} />

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
            <button className='cancle-btn'>Annuler</button>
            <button className='submit-btn' onClick={handleConfirm} >Désactiver mon compte</button>
          </div>

        </div>
      </section>
      {
        showConfirm && <ConfirmPopup accept={desactiveAccount} close={handleConfirm} title='Etes vous sure de vouloir désactiver temporairement votre compte ?' />
      }
    </>
  );
};

export default DesactiveAccount;
