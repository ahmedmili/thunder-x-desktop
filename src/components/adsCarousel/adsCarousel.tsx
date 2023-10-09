import { CarouselProvider, Slide, Slider } from 'pure-react-carousel'
import { useNavigate } from 'react-router-dom'
import VideoPlayer from '../VideoPlayer/VideoPlayer'
import './adsCarousel.scss'
export const AdsCarousel = (props: any) => {

    const navigate = useNavigate();

    const handleImageClick = (ad: any) => {
        const supplier_id = ad.supplier ? ad.supplier.id : null;
        supplier_id ? navigate("/supplier-store/" + supplier_id) : console.log('no supplier for this pub ')
    }

    return (
        <div className={`carousal-ads-container`}>
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
                    {props.data.map((ad: any) => (
                        <Slide key={ad.id} index={ad.id} >
                            {
                                ad.type === 'IMAGE' ? (
                                    <>
                                        <img src={ad.image} alt={`Ad ${ad.id}`} loading='lazy' onClick={() => handleImageClick(ad)} />
                                    </>
                                ) :
                                    (
                                        // <video aria-expanded autoPlay width={400} height={300}>
                                        //     <source src={ad.image} type="video/mp4" />
                                        //     Your browser does not support the video tag.
                                        // </video>
                                        <VideoPlayer videoSrc={ad.image} cover={ad.cover} />
                                    )
                            }
                        </Slide>
                    ))}
                </Slider>
            </CarouselProvider>
        </div>


    )
}
