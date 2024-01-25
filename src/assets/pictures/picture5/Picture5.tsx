import styles from "./picture5.module.scss";
import saumon from "../../saumon.png";
import burger from "../../burger.png";
import cake from "../../cake.png";
import triple from "../../triplecheese.png";
export const Picture5 = () => {
  return (
    <div className={styles.picture}>
      <div className={styles.icons}>
        <img src={cake} alt="cake" loading="lazy" className={styles.icon} />
        <img src={burger} alt="burger" loading="lazy" className={styles.icon} />
        <img src={triple} alt="cheese" loading="lazy" className={styles.icon} />
      </div>
      <div className={styles.assiette}>
        <img src={saumon} alt="assiette" loading="lazy" />
      </div>
    </div>
  );
};
