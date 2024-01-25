import { useEffect, useState } from "react";
import { Picture1 } from "../../assets/pictures/picture1/Picture1";
import { Picture2 } from "../../assets/pictures/picture2/Picture2";
import { Picture3 } from "../../assets/pictures/picture3/PIcture3";
import { Picture4 } from "../../assets/pictures/picture4/Picture4";
import { Picture5 } from "../../assets/pictures/picture5/Picture5";

const PicturesList = () => {
  //return <Picture5 />;
  const images = [
    <Picture1 />,
    <Picture2 />,
    <Picture3 />,
    <Picture4 />,
    <Picture5 />,
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return images[currentImageIndex];
};
export default PicturesList;
