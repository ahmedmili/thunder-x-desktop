
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LeftArrow from '../../../../assets/profile/leftArrow.svg';
import RigthArrow from '../../../../assets/profile/rigthArrow.svg';
import { cartService } from '../../../../services/api/cart.api';
import { supplierServices } from '../../../../services/api/suppliers.api';
import { Announce, Coupon } from '../../../../services/types';
import Spinner from '../../../spinner/Spinner';
import './allAnnonces.scss';
import moment from "moment";

interface AnnonceProps {
  title: string,
  bodyText: string,
  time?: string,
  startAt?: string
}


const AnnonceCart: React.FC<AnnonceProps> = ({ title, bodyText, time, startAt }) => {


  const [formattedDate, setFormattedDate] = useState("");
  const { t } = useTranslation()
  useEffect(() => {
    if (startAt) {
      const currentDate = moment();
      const daysDifference = currentDate.diff(startAt, "days");
      const monthsDifference = currentDate.diff(startAt, "months");
      const diffWeeks = currentDate.diff(startAt, "weeks");
      let result: string = ""
      if (daysDifference === 0) {
        result = t('today')
      } else if (monthsDifference >= 1) {
        result = t('monthAgo')
      } else if (diffWeeks >= 1) {
        console.log("title", title)
        console.log("diffWeeks", diffWeeks)
        result = `${diffWeeks} ${t("weeksAgo")}`
      } else if (daysDifference === 1) {
        result = t('dayAgo')
      } else {
        result = ` ${daysDifference} ${t('daysAgo')}`
      }
      setFormattedDate(result);
    }
  }, [startAt]);
  return (<>
    <div className={`annonce-cart`} >
      <p className='title'>{title}</p>
      <p className='body' >{bodyText}</p>
      {/* {time && <p className='time' >{time}</p>} */}
      {startAt && <p className='time' >{formattedDate}</p>}
    </div>
  </>)
}


const Annonces = () => {
  const itemsPerPage = 8;

  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayedContent, setDisplayedContent] = useState<(Announce | Coupon)[]>([]);
  const [allAnnoncesData, setAllAnnoncesData] = useState<Announce[]>([])
  const [AllPromoCodes, setAllPromoCodes] = useState<Coupon[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const { t } = useTranslation()

  const handleContent = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const allDataTable = [...AllPromoCodes, ...allAnnoncesData]
    const displayedContent = allDataTable.slice(startIndex, endIndex)
    setDisplayedContent(displayedContent)
  }

  const getAllAnnonces = async () => {
    const { status, data } = await supplierServices.all_annonces()
    if (status === 200) {
      setAllAnnoncesData(data.data)
      setLoading(false);
    }
  }
  const getAllPromoCodes = async () => {
    const { status, data } = await cartService.getAllPromoCodes()
    if (status === 200) {
      setAllPromoCodes(data.data)
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true); // Assuming you want to set loading to true initially
    getAllAnnonces()
    getAllPromoCodes()
  }, [])
  useEffect(() => {
    console.log("loading", loading)
  }, [loading])

  useEffect(() => {
    let totalPages: number = 1;
    totalPages = Math.ceil((allAnnoncesData.length + AllPromoCodes.length) / itemsPerPage)
    setTotalPages(totalPages)
    handleContent()
    console.log('allAnnoncesData', allAnnoncesData)
    console.log('AllPromoCodes', AllPromoCodes)
  }, [allAnnoncesData, AllPromoCodes])

  useEffect(() => {
    handleContent()
  }, [currentPage])

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  }
  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  }


  return (
    <section className="annonces-section">
      <h1>{t('profile.allAnnounces.message')}</h1>

      {
        loading === false ? (
          <>
            <main>
              {
                displayedContent.length > 0 && (
                  displayedContent.map((annonce: any, index: number) => {
                    return (
                      <AnnonceCart
                        key={index}
                        title={annonce.title}
                        bodyText={
                          annonce.description === "Promo_Generic_Desc"
                            ? t('profile.coupon.message')
                            : annonce.description
                        }
                        time={annonce.time ? annonce.time : null}
                        startAt={annonce.updated_at}
                      />
                    )
                  })
                )

              }
            </main>
            <div className='buttons'>
              {/* prev button */}
              {!(currentPage === 1) &&
                <div className="nav-page-button">
                  <button onClick={prevPage}>
                    <img loading="lazy" src={LeftArrow} alt="prev button" />
                  </button>
                </div>
              }
              {/* next */}
              {(!(currentPage === totalPages) && (currentPage + 1 <= totalPages)) &&
                <div className="nav-page-button">
                  <button onClick={nextPage}>
                    <img loading="lazy" src={RigthArrow} alt="prev button" />

                  </button>
                </div>
              }

            </div>
          </>
        ) : (
          <>
            {/* <span className='title'>
                  no announces
                </span> */}
            <Spinner name='' />
          </>
        )
      }

    </section>
  );
};

export default Annonces;
