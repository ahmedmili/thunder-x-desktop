import styles from "./cardpageimage.module.scss";

interface CardPageImageProps {
  src: string;
  alt: string;
}
const CardPageImage = ({ src, alt }: CardPageImageProps) => (
  <div className={styles.cardpageimage}>
    <img src={src} alt={alt} />
  </div>
);
export default CardPageImage;
