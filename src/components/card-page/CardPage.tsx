import { ReactNode } from "react";
import styles from "./cardpage.module.scss";
import InscriptionPicture from "../../assets/icons/pictures/inscription/InscriptionPicture";
const CardPage = ({
  title,
  children,
}: {
  title: string;
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
        <div className={styles.cardpageimageContent}>
          <InscriptionPicture />
        </div>
      </div>
    </div>
  );
};
export default CardPage;
