
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SmileBien from "../../../../../assets/profile/feedback/deliv-feedback/smile-bien.svg"
import SmileIncroyable from "../../../../../assets/profile/feedback/deliv-feedback/smile-incroyable.svg"
import mauvais from "../../../../../assets/profile/feedback/deliv-feedback/smile-mauvais.svg"
import SmileOk from "../../../../../assets/profile/feedback/deliv-feedback/smile-ok.svg"
import SmileTresMauvais from "../../../../../assets/profile/feedback/deliv-feedback/smile-tres-mauvais.svg"
import DelivAvis from "./DelivAvis.json"
import './delivFeedBack.scss'
interface DelivFeedBackProps {
    avis: number
    handleAvis: any,
    handleCommentsLis: any
}

const DelivFeedBack: React.FC<DelivFeedBackProps> = ({ avis, handleAvis, handleCommentsLis }) => {

    const { t } = useTranslation()
    const [delivProblem, setShowDelivProblem] = useState<boolean>(false)
    const [commentsList, setCommentsList] = useState<Array<{ comment: string }>>([]);
    const [avisList, setAvisList] = useState<string[]>([])

    useEffect(() => {
        avis < 3 ? setShowDelivProblem(true) : setShowDelivProblem(false);

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
            <div className='delivery-feedback'>
                <p>
                    {t('profile.feedback.deliv.title')}
                </p>

                <div className='delivery-feedback-graph-container'>
                    <div className='line'> </div>
                    <img loading="lazy" className={`deliv-rate-smile ${avis === 1 ? "active" : ""}`} src={SmileTresMauvais} alt=" tres mauvais" onClick={() => handleAvis(1)} />
                    <img loading="lazy" className={`deliv-rate-smile ${avis === 2 ? "active" : ""}`} src={mauvais} alt="mauvais" onClick={() => handleAvis(2)} />
                    <img loading="lazy" className={`deliv-rate-smile ${avis === 5 ? "active" : ""}`} src={SmileIncroyable} alt="incroyable" onClick={() => handleAvis(5)} />
                    <img loading="lazy" className={`deliv-rate-smile ${avis === 3 ? "active" : ""}`} src={SmileOk} alt="ok" onClick={() => handleAvis(3)} />
                    <img loading="lazy" className={`deliv-rate-smile ${avis === 4 ? "active" : ""}`} src={SmileBien} alt="bien" onClick={() => handleAvis(4)} />
                </div>

            </div>
            {
                delivProblem && avisList && (
                    <div className='delivery-feedback-comment-list-container'>
                        <p className='q-title'>{t('profile.feedback.deliv.comment.title')}</p>
                        {
                            avisList.map((avis: string, index: number) => {
                                return (
                                    <div className='avis-q' key={index}>
                                        <input type="checkbox" onClick={() => handleQChange(avis, index)} name={"delivAvis" + index} id={"delivAvis" + index} />
                                        <label htmlFor={"delivAvis" + index}>{avis}</label>
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

export default DelivFeedBack