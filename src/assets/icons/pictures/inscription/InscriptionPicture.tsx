import styles from "./inscriptionpicture.module.scss";
import cake from "./cake.png";
import burger from "./burger.png";
import glass from "./glass.png";
import steck from "./steck.png";
import assiette from "./inscription.png";

const InscriptionPicture = () => {
  return (
    <div className={styles.picture}>
      <img src={cake} alt="cake" loading="lazy" />
      <img src={glass} alt="glass" loading="lazy" />
      <img src={burger} alt="burger" loading="lazy" />
      <img src={assiette} alt="assiette" loading="lazy" />
      <img src={steck} alt="steck" loading="lazy" />
    </div>
  );
};
export default InscriptionPicture;
