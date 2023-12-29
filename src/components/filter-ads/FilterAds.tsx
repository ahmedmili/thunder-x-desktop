import Slider from "react-slick";import { useNavigate } from 'react-router-dom'
import VideoPlayer from '../VideoPlayer/VideoPlayer'
import './FilterAds.scss'
import { useEffect, useState } from 'react'
export const FilterAds = (props: any) => {
    const navigate = useNavigate();
    const [ads, setAds] = useState([])
    const handleImageClick = (ad: any) => {
        const supplier_id = ad.supplier ? ad.supplier.id : null;
        const supplier_name = ad.supplier ? ad.supplier.name : null;
        supplier_id ? navigate(`/restaurant/ ${supplier_id}-${supplier_name}/tous`) : () => { return 0 }
    }
    useEffect(() => {
        const filtredAds = props.data.filter((ad: any) => ad.status !== 'cloture')
        setAds(filtredAds)
    }, [props])
    return (
        < div className={`carousel-ads`}>         
            <Slider
            {...{
                "slidesToShow": ads.length < props.slides ? ads.length : props.slides,
                "dots": false,
                "infinite": true,
                "slidesToScroll": 1,
                "arrows": props.arrows ? true : false,
                "autoplay": false,
                "speed": 500,
                "cssEase": "linear",
                "centerMode": props.center ? true : false,
                "centerPadding": props.center ? "40px" : "",
                "nextArrow":  <NextArrow /> ,
                "prevArrow": <PrevArrow /> 
            }}>
                {ads.map(function(ad : any) {
                return (
                    <div key={ad.id} className="carousel-ads__item">
                    {
                        ad.type === 'IMAGE' ? (
                            <>
                                <img className="carousel-ads__image" src={ad.image} alt={`Ad ${ad.id}`} loading='lazy' onClick={() => handleImageClick(ad)} />
                            </>
                        ) :
                        (
                        <VideoPlayer videoSrc={ad.image} cover={ad.cover} />
                        )
                    }
                    </div>
                );
                })}
            </Slider>
        </ div>
    )
}
function PrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className + " prev-ads-arrow"}
      style={{ ...style }}
      onClick={onClick}
    />
  );
}
function NextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className + " next-arrow"}
      style={{ ...style}}
      onClick={onClick}
    />
  );
}

