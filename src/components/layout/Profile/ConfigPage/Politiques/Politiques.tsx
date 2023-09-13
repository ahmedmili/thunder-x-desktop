
import './Politiques.scss';
import thunderLogo from '../../../../../assets/icon.png';
import LeftArrow from '../../../../../assets/profile/leftArrow.svg';
import RigthArrow from '../../../../../assets/profile/rigthArrow.svg';
import legalsData from './Politiques.json';
import { useEffect, useState } from 'react';

import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

interface legalProps {
  title: string,
  bodyText: string,
}


const LegalCart: React.FC<legalProps> = ({ title, bodyText }) => {

  return (<>
    <div className="legal-cart">
      <p className='title'>{title}</p>
      <p className='body' >{bodyText}</p>
    </div>
  </>)
}


const Politiques = () => {
  const itemsPerPage = 6;

  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayedContent, setDisplayedContent] = useState<any[]>([]);

  const handleContent = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedContent = legalsData.slice(startIndex, endIndex)
    setDisplayedContent(displayedContent)
  }

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
    totalPages = Math.ceil(legalsData.length / itemsPerPage)
    setTotalPages(totalPages)
  }, [legalsData])



  return (
    <>
      <section className="Lgale-section">
        <h1>Conditions générales d’utilisation de l’application Thunder Express</h1>
        <div className="logo-container">

          <div className="logo-wrapper" style={{ backgroundImage: `url(${thunderLogo})` }}>
          </div>
        </div>
        <main>
          {
            displayedContent.length > 0 && (
              displayedContent.map((legal: any, index: number) => {
                return <LegalCart key={index} title={legal.title} bodyText={legal.body} />
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
          {!(currentPage === totalPages) &&
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

export default Politiques;
