import { ReactNode } from "react";
import styles from "./cardpage.module.scss";
const CardPage = ({
  title,
  image,
  children,
}: {
  title: string;
  image: ReactNode;
  children: ReactNode;
}) => {
  return (
    <div className={styles.cardpage}>
      <div className={styles.cardpagetext}>
        <div className={styles.cardpagetextcontent}>
          <h1 className={styles.cardtitle}> {title} </h1>
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
