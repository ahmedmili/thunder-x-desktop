import { CarouselProvider, Slider, Slide } from 'pure-react-carousel'
import './adsCarousel.scss'
export const AdsCarousel = (props: any) => {
    
    return (

        <CarouselProvider className='carousel-ads'
            naturalSlideWidth={250}
            naturalSlideHeight={150}
            totalSlides={
                props.data.length
            }
            visibleSlides={2}
            step={1}
            infinite={true}
            isPlaying={true}
            lockOnWindowScroll={true}
            
        >

            <Slider className='carousol-ads-slider'>
                {props.data.map((ad: any) => (
                    <Slide key={ad.id} index={ad.id}>
                        <img src={ad.image} alt={`Ad ${ad.id}`} loading='lazy'
                        />
                    </Slide>
                ))}
            </Slider>
        </CarouselProvider>

    )
}
