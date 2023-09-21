import { CarouselProvider, Slider, Slide } from 'pure-react-carousel'
import './adsCarousel.scss'
import { useAppSelector } from '../../Redux/store'
import { useEffect, useState } from 'react'
export const AdsCarousel = (props: any) => {
    const theme = useAppSelector(state => state.home.theme)
    const [template, setTemplate] = useState<number>(theme)

    useEffect(() => {
        setTemplate(theme)
    }, [theme])
    return (
        <div className={`carousal-ads-container ${template === 1 && 'dark-background2'}`}>
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

                <Slider className={`carousol-ads-slider ${template === 1 && 'dark-background2'}`}>
                    {props.data.map((ad: any) => (
                        <Slide key={ad.id} index={ad.id}>
                            <img src={ad.image} alt={`Ad ${ad.id}`} loading='lazy'
                            />
                        </Slide>
                    ))}
                </Slider>
            </CarouselProvider>
        </div>


    )
}
