
import { useEffect, useState } from 'react';
import thunderLogo from '../../../../../assets/icon.png';
import './legale.scss';
import legalsData from './legals.json';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import Header from '../../../../Header/Header';
import Footer from '../../../../footer/footer';
import { localStorageService } from '../../../../../services/localStorageService';

interface legalProps {
  title: string,
  bodyText: string[],
}

// Define a type for your data structure
type LegalsData = {
  [key: string]: { body: string[] }[];
};

const LegalCart: React.FC<legalProps> = ({ title, bodyText }) => {

  return (<>
    <div className="legal-cart">
      <h3 className='title'>{title}</h3>
      <p className="">
        {
          bodyText.map((text: string, index: number) => <p key={index} className='body' >{text}</p>)
        }
      </p>
    </div>
  </>)
}


const Legale = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const itemsPerPage = 6;

  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayedContent, setDisplayedContent] = useState<any[]>([]);
  const handleContent = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const language = localStorageService.getLanguage() || 'fr'
    const legalsDataJson: LegalsData = legalsData;
    const selectedLanguageObject = legalsDataJson[language];
    const displayedContent = selectedLanguageObject.slice(startIndex, endIndex)
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
    const language = localStorageService.getLanguage() || 'fr'
    const legalsDataJson: LegalsData = legalsData;
    const selectedLanguageObject = legalsDataJson[language];
    totalPages = Math.ceil(selectedLanguageObject.length / itemsPerPage)
    setTotalPages(totalPages)
  }, [legalsData])

  const goBack = () => {
    navigate('/profile/');
  };
  return (
    <>
      <Header />
      <section className="Lgale-section">
        <button className="btn-back" onClick={goBack}>{t('profile.mesConfig.legales')}</button>
        <div className="logo-container">

          <div className="logo-wrapper" style={{ backgroundImage: `url(${thunderLogo})` }}>
          </div>
        </div>
        <main>
          {
            (displayedContent && displayedContent.length > 0) && (
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
              <button className="nav-page-button-item left" onClick={prevPage}></button>
            </div>
          }
          {/* next */}
          {!(currentPage === totalPages) &&
            <div className="nav-page-button">
              <button className="nav-page-button-item right" onClick={nextPage}></button>
            </div>
          }
        </div>
      </section >
      <Footer />
    </>

  );
};

export default Legale;
