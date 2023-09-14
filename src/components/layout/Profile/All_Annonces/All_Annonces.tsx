
import './allAnnonces.scss';
import LeftArrow from '../../../../assets/profile/leftArrow.svg';
import RigthArrow from '../../../../assets/profile/rigthArrow.svg';
import { useEffect, useState } from 'react';
import data from './Annonces.json'
import allAnnonces from './Annonces.json';
import { useAppSelector } from '../../../../Redux/store';

interface AnnonceProps {
  title: string,
  bodyText: string,
}


const AnnonceCart: React.FC<AnnonceProps> = ({ title, bodyText }) => {

  return (<>
    <div className="legal-cart">
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
  const allAnnoncesData = useAppSelector(state => state.restaurant.restaurants)

  const handleContent = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedContent = data.slice(startIndex, endIndex)
    setDisplayedContent(displayedContent)
  }
  
  useEffect(() => {
    let totalPages: number = 1;
    totalPages = Math.ceil(allAnnonces.length / itemsPerPage)
    setTotalPages(totalPages)
    console.log(data)
  }, [allAnnonces])

  useEffect(() => {
    handleContent()
  }, [currentPage])

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  }
  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  }

  useEffect(() => {
    let totalPages: number = 1;
    totalPages = Math.ceil(data.length / itemsPerPage)
    setTotalPages(totalPages)
    console.log(data)
  }, [data])

  return (
    <>
      <section className="annonces-section">

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
          {(!(currentPage === totalPages ) && (currentPage +1 <=  totalPages) )&&
            <div className="nav-page-button">
              <button onClick={nextPage}>
                <img src={RigthArrow} alt="prev button" />

              </button>
            </div>
          }

        </div>
      </section>

    </>
  );
};

export default Annonces;
