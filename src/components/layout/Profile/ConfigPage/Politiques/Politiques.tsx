
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import thunderLogo from '../../../../../assets/icon.png';
import LeftArrow from '../../../../../assets/profile/leftArrow.svg';
import RigthArrow from '../../../../../assets/profile/rigthArrow.svg';
import Header from '../../../../Header/Header';
import Footer from '../../../../footer/footer';
import legalsData from './Politiques.json';
import './politiques.scss';
import { localStorageService } from '../../../../../services/localStorageService';

interface legalProps {
  bodyText: string[],
}
// Define a type for your data structure
type LegalsData = {
  [key: string]: { body: string[] }[];
};

const LegalCart: React.FC<legalProps> = ({ bodyText }) => {

  return (<>
    <div className="legal-cart">
      <p className='body' >{bodyText}</p>
    </div>
  </>)
}


const Politiques = () => {
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
      <section className="Politique-section">
        <button className="btn-back" onClick={goBack}>{t('profile.mesConfig.politiques')}</button>

        <div className="logo-container">
          <div className="logo-wrapper" style={{ backgroundImage: `url(${thunderLogo})` }}>
          </div>
        </div>
        <main>
          {
            displayedContent.length > 0 && (
              displayedContent.map((legal: any, index: number) => {
                return <LegalCart key={index} bodyText={legal.body} />
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
          {!(currentPage === totalPages) &&
            <div className="nav-page-button">
              <button onClick={nextPage}>
                <img loading="lazy" src={RigthArrow} alt="prev button" />

              </button>
            </div>
          }
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Politiques;