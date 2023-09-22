
import './allAnnonces.scss';
import LeftArrow from '../../../../assets/profile/leftArrow.svg';
import RigthArrow from '../../../../assets/profile/rigthArrow.svg';
import { useEffect, useState } from 'react';
import { supplierServices } from '../../../../services/api/suppliers.api';
import { useAppSelector } from '../../../../Redux/store';

interface AnnonceProps {
  title: string,
  bodyText: string,
}


const AnnonceCart: React.FC<AnnonceProps> = ({ title, bodyText }) => {
  const theme = useAppSelector((state) => state.home.theme)
  const [template, setTemplate] = useState<number>(theme)
  useEffect(() => {
    setTemplate(theme)
  }, [theme])
  return (<>
    <div className={`annonce-cart ${template === 1 && "dark-background2"}  `} >
      <p className='title'>{title}</p>
      <p className='body' >{bodyText}</p>
    </div>
  </>)
}


const Annonces = () => {
  const itemsPerPage = 8;

  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayedContent, setDisplayedContent] = useState<any[]>([]);
  const [allAnnoncesData, setAllAnnoncesData] = useState<any[]>([])

  const handleContent = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedContent = allAnnoncesData.slice(startIndex, endIndex)
    setDisplayedContent(displayedContent)
  }

  const getAllAnnonces = async () => {
    const { status, data } = await supplierServices.all_annonces()
    setAllAnnoncesData(data.data)
  }

  useEffect(() => {
    getAllAnnonces()
  }, [])

  useEffect(() => {
    let totalPages: number = 1;
    totalPages = Math.ceil(allAnnoncesData.length / itemsPerPage)
    setTotalPages(totalPages)
    handleContent()
  }, [allAnnoncesData])

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
    <>
      <section className="annonces-section">
        {
          allAnnoncesData.length > 0 ? (
            <>
              <main>
                {
                  displayedContent.length > 0 && (
                    displayedContent.map((annonce: any, index: number) => {
                      return <AnnonceCart key={index} title={annonce.title} bodyText={annonce.description} />
                    })
                  )

                }
              </main>
              <div className='buttons'>
                {/* prev button */}
                {!(currentPage === 1) &&
                  <div className="nav-page-button">
                    <button onClick={prevPage}>
                      <img src={LeftArrow} alt="prev button" />
                    </button>
                  </div>
                }
                {/* next */}
                {(!(currentPage === totalPages) && (currentPage + 1 <= totalPages)) &&
                  <div className="nav-page-button">
                    <button onClick={nextPage}>
                      <img src={RigthArrow} alt="prev button" />

                    </button>
                  </div>
                }

              </div>
            </>
          ) : (
            <>
              <center>
                <span className='title'>
                  no announces
                </span>
              </center>
            </>
          )
        }

      </section>

    </>
  );
};

export default Annonces;
