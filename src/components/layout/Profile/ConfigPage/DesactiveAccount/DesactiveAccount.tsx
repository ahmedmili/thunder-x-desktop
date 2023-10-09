
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import './desactiveAccount.scss';
import Cover from '../../../../../assets/profile/desactive-cover.png'

interface DesactiveAccountProps {

}

const DesactiveAccount: React.FC<DesactiveAccountProps> = () => {

  const [rate, setRate] = useState<number>(3)
  const [avisList, setAvisList] = useState<string[]>([])

  const { t } = useTranslation()
  const navigate = useNavigate()
  const handleSubmit = async () => {

  }
  const aviDefault = [
    "L’application n’est pas pratique",
    "L’application est lente",
    "Je ne suis pas satisfait de mon expérience de livraison avec l’application",
    "J’ai trouvé ubne autre alternative à Thunder Express avec des frais de livraison inférieurs aux vôtres"
  ]

  const handleRate = (index: number) => {
    setRate(index);
  }
  const handleAvisList = (index: number) => {
    var avis: string[] = avisList;
    const exist = avis.some((av: string) => av === aviDefault[index])
    !exist ? avis.push(aviDefault[index]) : avis = avis.filter((av: string) => av != aviDefault[index]);
    setAvisList(avis)
  }

  // useEffect(() => {
  //   console.log(rate)
  // }, [rate])


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
              <input type="checkbox" name="avis1" id="avis1" />
              <label htmlFor="avis1" onClick={() => handleAvisList(0)}>
                {aviDefault[0]}
              </label>
            </div>
            <div className='avi-content'>
              <input type="checkbox" name="avis2" id="avis2" />
              <label htmlFor="avis2" onClick={() => handleAvisList(1)} >
                {aviDefault[1]}
              </label>
            </div>
            <div className='avi-content'>
              <input type="checkbox" name="avis3" id="avis3" onClick={() => handleAvisList(2)} />
              <label htmlFor="avis3">
                {aviDefault[2]}
              </label>
            </div>
            <div className='avi-content'>
              <input type="checkbox" name="avis4" id="avis4" />
              <label htmlFor="avis4" onClick={() => handleAvisList(3)}>
                {aviDefault[3]}
              </label>
            </div>
          </div>

          <div className='desactive-rate-container'>
            <button className='desactive-rate-btn' onClick={() => handleRate(1)}>1</button>
            <button className='desactive-rate-btn' onClick={() => handleRate(2)}>2</button>
            <button className='desactive-rate-btn' onClick={() => handleRate(3)}>3</button>
            <button className='desactive-rate-btn' onClick={() => handleRate(4)}>4</button>
            <button className='desactive-rate-btn' onClick={() => handleRate(5)}>5</button>
          </div>

          <div className='desactive-buttons'>
            <button className='cancle-btn'>Annuler</button>
            <button className='submit-btn'>Désactiver mon compte</button>
          </div>

        </div>
      </section>

    </>
  );
};

export default DesactiveAccount;
