import React, { useEffect, useState } from 'react'

import "./repasList.scss"
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../../../../services/api/user.api';
import TemponsGrid from '../Tompons/Tampons';

interface RepasListProps {
}

const RepasList: React.FC<RepasListProps> = () => {



    const [gifts, setGifts] = useState<any>([])
    const [selectedCommand, setSelectedCommand] = useState<number>(-1)

    const handleSelectCommand = (i: number) => {
        i === selectedCommand ? setSelectedCommand(-1) : setSelectedCommand(i)
    }
    const getGifts = async () => {
        const { status, data } = await userService.gifts()
        data.success && setGifts(data.data.gifts)
        data.success && console.log('data !!', data.data)
    }
    useEffect(() => {
        getGifts()
    }, [])


    return (

        <>
            <section className='repas-List' >
                {gifts.length > 0 && gifts.map((gift: any, index: number) => {
                    const supplier = gift.supplier;
                    return (
                        <>
                            <div className={`repas-header  ${selectedCommand === index ? "active-header" : ""}`} key={index} onClick={() => handleSelectCommand(index)}>
                                <img src={supplier.images[0].path} alt="suppier image" />
                                <span >
                                    {supplier.name}
                                </span>
                                <KeyboardArrowUpOutlinedIcon className={` icon ${selectedCommand === index ? 'active' : ""}`} />
                            </div>
                            {(selectedCommand === index) && <TemponsGrid ammount={gifts.ammount} />}
                        </>
                    )
                })}
            </section>
        </>
    )
}

export default RepasList