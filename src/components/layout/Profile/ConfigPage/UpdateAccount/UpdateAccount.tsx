
import { useEffect, useState } from 'react';
import './updateAccount.scss'
import { userService } from '../../../../../services/api/user.api';
import * as yup from 'yup';
import { localStorageService } from '../../../../../services/localStorageService';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../../Redux/store';


interface updateProps {
  showPassword: any
  showPhone: any
}

const UpdateAccount: React.FC<updateProps> = ({ showPassword, showPhone }) => {

  const { t } = useTranslation()
  const theme = useAppSelector((state) => state.home.theme)
  const [template, setTemplate] = useState<number>(theme)

  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [valid, setValid] = useState<boolean>(false);
  const [eroorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate()
  const schema = yup.object().shape({
    firstname: yup.string().required('First Name is required'),
    lastname: yup.string().required('Last Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    tel: yup.string().min(8, 'Invalid phone number').required('Phone is required'),
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const userData = {
      email: email,
      firstname: firstName,
      lastname: lastName,
      tel: phone,
    }

    schema
      .isValid(userData)
      .then((isValid) => {
        setValid(isValid)
        if (!isValid) {
          schema.validate(userData)
            .catch((err) => {
              setErrorMessage(err.errors[0]);
            });
        } else {
          setErrorMessage('');
        }
      });

    try {
      if (valid) {
        const { status, data } = await userService.updateAccount(userData)
        if (data.success === true) {
          const user = localStorageService.getUser()
          if (user) {
            const savedData = JSON.parse(user);
            savedData.email = userData.email
            savedData.firstname = userData.firstname
            savedData.lastname = userData.lastname
            savedData.tel = userData.tel
            localStorageService.setUser(savedData)
          }
          navigate('/')
        }
      }

    } catch (error) {
      throw error
    }
  }
  // fetch user local saved data
  useEffect(() => {
    const user = localStorageService.getUser();
    if (user) {
      const { firstname, lastname, email, tel } = JSON.parse(user)
      setFirstName(firstname)
      setLastName(lastname)
      setEmail(email)
      setPhone(tel)
    }
  }, [])
  useEffect(() => {
    setTemplate(theme)
  }, [theme])
  return (
    <>
      <section className="update-section">
        <form onSubmit={(e) => handleSubmit(e)} >

          <div className="grid">
            <div className="input-container">
              <label htmlFor="firstName">{t("lastName")}</label>
              <div className="input">
                <input className="update-input" value={firstName} type="text" name="firstName" placeholder="Entrer ici" onChange={(e) => setFirstName(e.target.value)} />
              </div>
            </div>
            <div className="input-container">
              <label htmlFor="lastName">{t("firstName")}</label>
              <div className="input">
                <input className="update-input" value={lastName} type="text" name="lastName" placeholder="Entrer ici" onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="grid">
            <div className="input-container">
              <label htmlFor="email">{t("emailAddress")}</label>
              <div className="input">
                <input className="update-input" value={email} type="text" name="email" placeholder="Entrer ici" onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="input-container">
              <label htmlFor="password">{t("password")}</label>
              <div className="input">
                <input readOnly className="update-input" type="password" name="password" placeholder="Entrer ici" />
                <button onClick={showPassword} className='verif' >{t('Verifier')}</button>
              </div>
            </div>
          </div>

          <div className="input-container">
            <label htmlFor="phone">{t("cartPage.phoneNumber")}</label>
            <div className="input">
              <input className="update-input" value={phone} type="text" name="phone" placeholder="Entrer ici" onChange={(e) => setPhone(e.target.value)} />
              <button onClick={showPhone} className='verif' >{t('Verifier')}</button>

            </div>
          </div>
          {!valid && <p className={`error-message ${!valid ? "visible" : ""}`} >{eroorMessage}</p>}
          <div className="buttons">
            <button className="annule" type='reset'>{t("Annuler")}</button>
            <button className="submit" type="submit">{t("Enregistrer")}</button>
          </div>
        </form>
      </section>

    </>
  );
};

export default UpdateAccount;
