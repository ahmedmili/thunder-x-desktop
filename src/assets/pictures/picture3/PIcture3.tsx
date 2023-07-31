import styles from "./picture3.module.scss";
import pizza from "../../pizza.png";
import cake from "../../cake.png";
import steck from "../../steck.png";
import burger from "../../burger.png";
interface PictureProps {
  icon1: string;
  icon2: string;
  icon3: string;
  img: string;
}

const Picture = ({ icon1, icon2, icon3, img }: PictureProps) => (
  <div className={styles.picture}>
    <div className={styles.icons}>
      <img src={icon1} alt="cake" loading="lazy" className={styles.icon} />
      <img src={icon3} alt="burger" loading="lazy" className={styles.icon} />
      <img src={icon2} alt="glass" loading="lazy" className={styles.icon} />
    </div>
    <div className={styles.assiette}>
      <img src={img} alt="assiette" loading="lazy" />
    </div>
  </div>
);
export const Picture3 = () => {
  return <Picture icon1={cake} icon2={burger} icon3={steck} img={pizza} />;
};
