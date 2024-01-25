import burger from "../../burger.png";
import glass from "../../glass.png";
import cake from "../../cake.png";
import salade from "../../salade.png";
import styles from "./picture1.module.scss";
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

export const Picture1 = () => (
  <Picture icon1={cake} icon2={glass} icon3={burger} img={salade} />
);
/* export const Picture22 = () => (
  <Picture icon1={glass} icon2={cheese} icon3={fraise} img={assiette1} />
); */
