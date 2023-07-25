import { ReactNode } from "react";
import styles from "./cardpage.module.scss";
const CardPage = ({
  title,
  src,
  srcM,
  srcL,
  alt,
  children,
}: {
  title: string;
  src: string;
  srcM: string;
  srcL: string;
  alt: string;
  children: ReactNode;
}) => (
  <div className={styles.cardpage}>
    <div className={styles.cardpagetext}>
      <div className={styles.cardpagetextcontent}>
        <h1 className={styles.cardtitle}> {title} </h1>
        {children}
      </div>
    </div>
    <div className={styles.cardpageimage}>
      <picture>
        <source media="(min-width:768px)" srcSet={srcM} />
        <source media="(min-width:992px)" srcSet={srcL} />
        <img src={src} alt={alt} loading="lazy" />
      </picture>
    </div>
  </div>
);
export default CardPage;
