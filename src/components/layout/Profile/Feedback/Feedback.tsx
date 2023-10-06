import React, { useEffect, useState } from 'react'
import './feedback.scss'
import { useNavigate, useParams } from 'react-router-dom';
import DelivFeedBack from './DelivFeedBack/DelivFeedBack';
import CommandFeedBack from './CommandFeedBack/CommandFeedBack';

import FeedBackBanner from '../../../../assets/profile/feedback/banner.png'
import { userService } from '../../../../services/api/user.api';

function Feedback() {
    const navigate = useNavigate()

    const { command_id } = useParams();

    const [delivAvis, setDelivAvis] = useState<number>(5)
    const [commandAvis, setCommandAvis] = useState<number>(5)
    const [satis, setSatis] = useState<number>(1)

    const [commandComments, setCommandComments] = useState<[]>([])
    const [delivComments, setDelivComments] = useState<[]>([])

    const handleDelivCommentsList = (array: []) => {
        setDelivComments(array)
    }

    const handleCommandCommentsList = (array: []) => {
        setCommandComments(array)
    }
    const handleDelivAvis = (avis: number) => {
        setDelivAvis(avis)
    }
    const handleCommandAvis = (avis: number) => {
        setCommandAvis(avis)
    }

    interface Rating {
        command_id: number,
        command_rating: number,
        delivery_rating: number
        delivery_comment: [
            {
                comment: string
            }
        ] | [],
        command_comment: [
            {
                comment: string
            }
        ] | [],
    }

    const handleSubmit = async () => {
        const formData: Rating = {
            command_id: Number(command_id),
            command_rating: commandAvis,
            delivery_rating: delivAvis,
            delivery_comment: delivComments,
            command_comment: commandComments,
        }
        try {
            const { status, data } = await userService.createDeliveryRating(formData)
            if (data.success) {
                navigate('/profile/archivedCommands')
            }
        } catch (error) {
            throw error
        }
    }

    return (
        <div className='feedback-page-main-container'>
            <p className='feedback-page-title' >Donner votre feedback</p>
            <div className='images-header' >
                <img className='feedback-banner' src={FeedBackBanner} alt="feedback banner" />
                <div className='feedback-satifait'>
                    <p className='feedback-question'>Est ce que vous étiez satisfait de votre commande ?</p>
                    <div className='question-option' onClick={() => setSatis(1)}>
                        <label className='form-check-label ' htmlFor="oui">Oui</label>
                        <input className='feedback-option-radio' type="radio" name="option" id="oui" />
                    </div>
                    <div className='question-option' onClick={() => setSatis(2)}>
                        <label className='form-check-label ' htmlFor="non">Non</label>
                        <input className='feedback-option-radio' type="radio" name="option" id="non" />
                    </div>
                </div>
            </div>
            <CommandFeedBack handleCommentsLis={handleCommandCommentsList} avis={commandAvis} handleAvis={handleCommandAvis} />
            <div>

            </div>
            <DelivFeedBack handleCommentsLis={handleDelivCommentsList} avis={delivAvis} handleAvis={handleDelivAvis} />
            <button className='submit-avis' onClick={handleSubmit}>Terminer</button>
        </div>
    )
}

export default Feedback