import { CarouselProvider, Slide, Slider } from 'pure-react-carousel'
import { useNavigate } from 'react-router-dom'
import VideoPlayer from '../VideoPlayer/VideoPlayer'
import './adsCarousel.scss'
import { useEffect, useState } from 'react'
export const AdsCarousel = (props: any) => {

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
        console.log("filtredAds : ", filtredAds)
    }, [props])


    return (

        < div className={`container carousal-ads-container`}>
            <CarouselProvider className='carousel-ads'
                naturalSlideWidth={350}
                naturalSlideHeight={250}
                totalSlides={
                    props.data.length
                }
                visibleSlides={2}
                step={1}
                infinite={true}
                isPlaying={true}
                lockOnWindowScroll={true}

            >

                <Slider className={`carousol-ads-slider`}>
                    {ads.map((ad: any) => (
                        <Slide key={ad.id} index={ad.id} >
                            {
                                ad.type === 'IMAGE' ? (
                                    <>
                                        <img src={ad.image} alt={`Ad ${ad.id}`} loading='lazy' onClick={() => handleImageClick(ad)} />
                                    </>
                                ) :
                                    (
                                        <VideoPlayer videoSrc={ad.image} cover={ad.cover} />
                                    )
                            }
                        </Slide>
                    ))}
                </Slider>
            </CarouselProvider>
        </ div>


    )
}
