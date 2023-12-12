import { useEffect, useState } from 'react';
import { userService } from '../../../../../services/api/user.api';
import './parainage.scss';
import Childs from './Childs/Childs';
import InviteBanner from './Invitaion/InviteBanner/InviteBanner';
import Parent from './Parent/Parent';
import InvitPage from './Invitaion/InvitPage/InvitPage';
import { useNavigate } from 'react-router-dom';

function Parainage() {

    const [parent, setParent] = useState<any>({})
    const [child, setChildren] = useState<any>({})
    const [page, setPage] = useState<number>(1)


    const navigate = useNavigate()

    useEffect(() => {
        const locationArray = location.pathname.split("/")
        switch (Number(locationArray[4])) {
            case 1:
                setPage(1)
                break;
            case 2:
                setPage(2)
                break;
            default:
                setPage(1)
                break;
        }
    }, [])
    
    useEffect(() => {
        const locationArray = location.pathname.split("/")
        var newUrl = location.pathname

        switch (page) {
            case 1:
                locationArray[4] = "1"
                newUrl = locationArray.join("/")
                break;
            case 2:
                locationArray[4] = "2"
                newUrl = locationArray.join("/")
                break;
            default:
                locationArray[4] = "1"
                newUrl = locationArray.join("/")
                break;
        }
        navigate(newUrl, { replace: true })

    }, [page])

    const pageNavigateInterne = (page: number) => {
        if (page >= 1) setPage(page)
    }

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
            {
                page === 1 && (
                    <>
                        <Parent parent={parent} />
                        <Childs childs={child} />
                        <InviteBanner internNavigation={pageNavigateInterne} />
                    </>
                )
            }
            {
                page === 2 && (
                    <>
                        <InvitPage internNavigation={pageNavigateInterne} />
                    </>
                )
            }
        </div>
    )
}

export default Parainage