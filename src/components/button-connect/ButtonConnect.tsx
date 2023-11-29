import { ReactNode } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setUser } from "../../Redux/slices/userSlice";
import { userService } from "../../services/api/user.api";
import { localStorageService } from "../../services/localStorageService";
import styles from "./buttonconnect.module.scss";
type ButtonConnectProps = {
  icon?: ReactNode;
  text: string;
  provider: string;
};


const ButtonConnect = ({ icon, text, provider }: ButtonConnectProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const login = (token: string, user: any) => {
    localStorageService.setUserCredentials(user, token);
    dispatch(setUser(user));
    navigate("/"); // Redirect to the home page
  }
  const firebaseLogin = async () => {

    switch (provider) {
      case 'google':
        userService.signInWithGoogle().then((res) => {
          const token = res?.data.data.token
          const user = res?.data.data.user
          token && login(token, user)
        }).catch((e) => {
          console.log(e)
        });
        break;
      case 'fcb':
        userService.signInWithFacebook().then((res) => {
          const token = res?.data.data.token
          const user = res?.data.data.user
          token && login(token, user)
        }).catch((e) => {
          console.log(e)
        });;
        break;
      default:
        userService.firebaseSignOut();
        break;
    }
  }
  return (
    <button className={styles.btn}>
      <div className={styles.btnContent} onClick={firebaseLogin}>
        <div className={styles.icon}>{icon}</div>
        <span className={styles.text}> {text} </span>
      </div>
    </button>
  );
};
export default ButtonConnect;
