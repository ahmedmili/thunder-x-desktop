import { Link } from "react-router-dom";
import styles from "./linkconnect.module.scss";
interface LinkPorps {
  to: string;
  label: string;
  clickTitle: string;
}
const LinkConnect: React.FC<LinkPorps> = ({ to, label, clickTitle }) => {
  return (
    <div className={styles.linkconnect}>
      <p className={styles.text}>{label}</p>
      <Link to={to} className={styles.link}>
        {clickTitle}
      </Link>
    </div>
  );
};
export default LinkConnect;
