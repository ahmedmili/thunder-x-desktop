import { useEffect, useState } from 'react'
import './favors.scss'
import Cover from '../../../../assets/profile/Discuter/cover.png'
import favorisCover from '../../../../assets/favoris-bg.png'
import { userService } from '../../../../services/api/user.api'
import SupplierCard from '../../../supplierCard/SupplierCard'
import { Restaurant } from '../../../../services/types'
function Favors() {

    const [favorsList, setFavorsList] = useState<Restaurant[]>([])
    const getClientFavors = async () => {
        const { status, data } = await userService.getClientFavorits()
        data.success && setFavorsList(data.data)
    }
    useEffect(() => {
        getClientFavors()
    }, [])
    return (
        <>
            <div className='favors-main-container'>
                <header className='favors-header'>
                    {/* 
                        <div className='cover-img' style={{ backgroundImage: `url(${Cover})` }} >
                        </div>
                    */}
                    <img src={favorisCover} alt="favoris Cover" />
                </header >
                <main className='favors-main'>
                    <div className="favors-main_title-blc">
                        <h1 className="favors-main_title">Votre resto préféré !</h1>
                    </div>
                    <div className="favors-wrapper">
                        <p className="favors-list-desc">
                            Ajouté récemment
                        </p>
                        <div className="favors-list-area">
                            {
                                favorsList.map((favor: Restaurant, index: number) => {
                                    return (
                                        <div className='supplier-card-grid-container'>
                                            <SupplierCard className={'favors-supplier-card'} favors={true} data={favor} key={index} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    
                </main>
            </div >
        </>
    )
}

export default Favors