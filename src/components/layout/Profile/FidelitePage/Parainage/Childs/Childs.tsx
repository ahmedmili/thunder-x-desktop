import { useTranslation } from 'react-i18next';
import './childs.scss';

import logo from '../../../../../../assets/profile/profile_img.png';

import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { toNumber } from 'lodash';
import { useState } from 'react';


interface ListItemProps {
    firstName: string,
    lastName: string,
    points: string
}

interface ListProps {
    childs: any
}

const ListItem = ({ firstName, lastName, points }: ListItemProps) => {

    return (
        <div className='list-item-container'>
            <div className='child-info'>
                <span className='child-logo' style={{ backgroundImage: `url(${logo})` }}></span>
                <p className='child-full-name'>{`${firstName} ${lastName}`}</p>
            </div>
            <span className='child-points'>{toNumber(points)} points</span>

        </div>
    )
}


function Childs({ childs }: ListProps) {
    const { t } = useTranslation()
    const [show, setShow] = useState<boolean>(false)

    const showContent = () => {
        setShow(!show)
    }

    return (
        <main className='parainage-code-container'>
            <header className='parainage-header' onClick={showContent}>
                <p>{t('profile.fidelite.ListeParrainage')}</p>
                <KeyboardArrowUpOutlinedIcon className={` icon ${show ? 'active' : ''} `} />
            </header>
            {show && childs && childs.length > 0 &&
                childs.map((child: any, index: number) => {
                    return (
                        <ListItem key={index} firstName={child.child.firstname} lastName={child.child.lastname} points={child.bonus} />
                    )
                })
            }
        </main>

    )
}

export default Childs