
import { useEffect, useState } from 'react'
import './commandFeedBack.scss'
import ActiveStar from "../../../../../assets/profile/feedback/command-feedback/active-star.svg"
import EmptyStar from "../../../../../assets/profile/feedback/command-feedback/empty-star.svg"
import SmileTresMauvais from "../../../../../assets/profile/feedback/command-feedback/smile-tres-mauvais.png"
import SmileMauvais from "../../../../../assets/profile/feedback/command-feedback/smile-mauvais.png"
import SmileOk from "../../../../../assets/profile/feedback/command-feedback/smile-ok.png"
import SmileBien from "../../../../../assets/profile/feedback/command-feedback/smile-bien.png"
import SmileIncroyable from "../../../../../assets/profile/feedback/command-feedback/smile-incroyable.png"
import DelivAvis from "./CommandAvis.json";
import { useTranslation } from 'react-i18next'



interface CommandFeedBackProps {
    avis: number,
    handleAvis: any,
    handleCommentsLis: any

}
const CommandFeedBack: React.FC<CommandFeedBackProps> = ({ avis, handleAvis, handleCommentsLis }) => {

    const { t } = useTranslation()

    const [commandProblem, setShowCommandProblem] = useState<boolean>(false)
    const [commentsList, setCommentsList] = useState<Array<{ comment: string }>>([]);

    const [avisList, setAvisList] = useState<string[]>([])
    useEffect(() => {
        avis < 3 ? setShowCommandProblem(true) : setShowCommandProblem(false);

    }, [avis])

    const handleQChange = (comment: string, index: number) => {
        const commentDate = { "comment": comment }
        const existComment = commentsList.some(item => item.comment === commentDate.comment);
        if (!existComment) {
            const newCommentsList = [...commentsList, { comment }];
            setCommentsList(newCommentsList);

        } else {
            const newCommentsList = commentsList.filter((element: any) => element.comment != commentDate.comment);
            setCommentsList(newCommentsList);

        }
    }

    useEffect(() => {
        handleCommentsLis(commentsList)
    }, [commentsList])

    useEffect(() => {
        const language = localStorage.getItem("i18nextLng");

        if (language) {
            const avis = DelivAvis[language as keyof typeof DelivAvis];
            if (avis) {
                setAvisList(avis)
            } else {
                console.error("Language not found in JSON data");
            }
        } else {
            console.error("Language not found in localStorage");
        }
    }, [])

    return (
        <>
            <div className='command-feedback'>

                <div className='command-feedback-graph-container'>

                    <div className='command-avis-container'>
                        <div className='avis-image-container'>
                            <img className={`command-rate-smile ${avis === 1 ? "active" : ""}`} src={SmileTresMauvais} alt=" tres mauvais" onClick={() => handleAvis(1)} />
                        </div>
                        <p className='command-avis-label'>Très mauvais !</p>
                    </div>

                    <div className='command-avis-container'>
                        <div className='avis-image-container'>
                            <img className={`command-rate-smile ${avis === 2 ? "active" : ""}`} src={SmileMauvais} alt="mauvais" onClick={() => handleAvis(2)} />
                        </div>
                        <p className='command-avis-label'>Mauvais !</p>
                    </div>

                    <div className='command-avis-container'>
                        <div className='avis-image-container'>
                            <img className={`command-rate-smile ${avis === 5 ? "active" : ""}`} src={SmileIncroyable} alt="incroyable" onClick={() => handleAvis(5)} />
                        </div>
                        <p className='command-avis-label'>Incroyable !</p>
                    </div>

                    <div className='command-avis-container'>
                        <div className='avis-image-container'>
                            <img className={`command-rate-smile ${avis === 3 ? "active" : ""}`} src={SmileOk} alt="ok" onClick={() => handleAvis(3)} />
                        </div>
                        <p className='command-avis-label'>OK !</p>
                    </div>

                    <div className='command-avis-container'>
                        <div className='avis-image-container'>
                            <img className={`command-rate-smile ${avis === 4 ? "active" : ""}`} src={SmileBien} alt="bien" onClick={() => handleAvis(4)} />
                        </div>
                        <p className='command-avis-label'>Bien !</p>
                    </div>
                </div>

                <div className='command-feedback-star-container'>
                    <div className={`avis-star-img-container ${avis === 1 ? "active-star" : ""}`}>
                        <img src={avis >= 1 ? ActiveStar : EmptyStar} alt="star icon" onClick={() => handleAvis(1)} />
                    </div>

                    <div className={`avis-star-img-container ${avis === 2 ? "active-star" : ""}`}>
                        <img src={avis >= 2 ? ActiveStar : EmptyStar} alt="star icon" onClick={() => handleAvis(2)} />
                    </div>

                    <div className={`avis-star-img-container ${avis === 3 ? "active-star" : ""}`}>
                        <img src={avis >= 3 ? ActiveStar : EmptyStar} alt="star icon" onClick={() => handleAvis(3)} />
                    </div>

                    <div className={`avis-star-img-container ${avis === 4 ? "active-star" : ""}`}>
                        <img src={avis >= 4 ? ActiveStar : EmptyStar} alt="star icon" onClick={() => handleAvis(4)} />
                    </div>

                    <div className={`avis-star-img-container ${avis === 5 ? "active-star" : ""}`}>
                        <img src={avis === 5 ? ActiveStar : EmptyStar} alt="star icon" onClick={() => handleAvis(5)} />
                    </div>
                </div>



            </div>

            {
                commandProblem && avisList && (
                    <div className='delivery-feedback-comment-list-container'>
                        <p className='q-title'>{t('profile.feedback.command.comment.title')}</p>
                        {
                            avisList.map((avis: string, index: number) => {
                                return (
                                    <div key={index} className='avis-q'>
                                        <input type="checkbox" onClick={() => handleQChange(avis, index)} name={"commandAvis" + index} id={"commandAvis" + index} />
                                        <label htmlFor={"commandAvis" + index}>{avis}</label>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
        </>
    )
}

export default CommandFeedBack