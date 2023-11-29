import { useEffect, useState } from 'react';
import { userService } from '../../../../../services/api/user.api';
import './parainage.scss';
// import TransferBonus from './TransferBonus/TransferBonus';
import Childs from './Childs/Childs';
import Invitaion from './Invitaion/Invitaion';
import Parent from './Parent/Parent';

function Parainage() {

    const [parent, setParent] = useState<any>({})
    const [child, setChildren] = useState<any>({})

    const getSponsorshipListParent = async () => {
        const { status, data } = await userService.getSponsorshipListParent()
        if (data.success) {
            setParent(data.data)
        }
    }
    const getSponsorshipListChildren = async () => {
        const { status, data } = await userService.getSponsorshipListChildren()
        if (data.success) {
            setChildren(data.data)
        }
    }

    useEffect(() => {
        getSponsorshipListParent();
        getSponsorshipListChildren();
    }, [])

    return (
        <div className='parainage-container'>
            <Parent parent={parent} />
            <Childs childs={child} />
            <Invitaion />
        </div>
    )
}

export default Parainage