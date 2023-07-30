import { ReactNode } from "react";
import styles from "./cardpage.module.scss";
const CardPage = ({
  title,
  icon,
  text,
  image,
  children,
}: {
  title: string;
  icon: ReactNode;
  text: string;
  image: ReactNode;
  children: ReactNode;
}) => {
  return (
    <div className={styles.cardpage}>
      <div className={styles.cardpagetext}>
        <div className={styles.cardpagetextcontent}>
          {icon && <div className={styles.cardIcon}>{icon}</div>}
          <div className={styles.cardHeader}>
            <h1 className={styles.cardtitle}>{title}</h1>
            <p className={styles.cardText}> {text} </p>
          </div>
          {children}
        </div>
      </div>
      <div className={styles.cardpageimage}>
        <div className={styles.cardpageimageContent}>{image}</div>
      </div>
    </div>
  );
};
export default CardPage;
