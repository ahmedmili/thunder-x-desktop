import { NavLink } from "react-router-dom";
import CardPage from "../components/card-page/CardPage";
import PicturesList from "../components/picture-list/PicturesList";
import Validate from "../assets/icons/Validate";
import ButtonPrimary from "../components/button-primary/ButtonPrimary";
const WelcomePage = () => {
  return (
    <CardPage
      icon={<Validate />}
      title="Bienvenue"
      text=""
      image={<PicturesList />}
    >
      <NavLink to={"/login"} style={{ margin: "2rem 0" }}>
        <ButtonPrimary name="btn" type="button">
          Se connecter
        </ButtonPrimary>
      </NavLink>
    </CardPage>
  );
};

export default WelcomePage;
