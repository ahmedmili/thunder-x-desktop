import React, { useEffect, useState } from 'react'

import "./tampons.scss"

import ThunderTompon from '../../../../../../assets/Thunder-Tompon.png'

import { useTranslation } from 'react-i18next';
interface TemponsListProps {
    ammount: number
}

const TemponsGrid: React.FC<TemponsListProps> = ({ ammount }) => {

    const { t } = useTranslation()

    const [tampArrays, setTampons] = useState<number[]>([])

    useEffect(() => {
        let tampArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (let index = 0; index < 4; index++) {
            tampArray[index] = 1;
        }
        setTampons(tampArray)
    }, [ammount])
    return (

        <>
            <div className="tompons-container">
                <p className='tompon-title'>{t('profile.fidelite.tompons.title')}</p>

                <div className='tompons-grid'>

                    {
                        tampArrays.map((tomp: number, i: number) => {
                            return (
                                <div className='tompon' style={{ backgroundImage: `url(${tomp === 1 ? ThunderTompon : ''})` }}></div>
                            )
                        })
                    }
                </div>
            </div >
        </>

    )
}



export default TemponsGrid;