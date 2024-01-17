import { Button, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import JoinUsImgOne from './../../assets/joinus-img-1.jpg';
import JoinUsImgTwo from './../../assets/joinus-img-2.jpg';
import './joinUs.scss';

export const JoinUs = () => {
    const { t } = useTranslation()
    const delivUrl = import.meta.env.VITE_THUNDER_X_DELIV_URL;
    const supplierUrl = import.meta.env.VITE_THUNDER_X_SUPPLIER_URL;

    const becomeDeliv = () => {
        window.open(delivUrl, '_blank');
    }
    const becomeSupplier = () => {
        window.open(supplierUrl, '_blank');
    }
    return (
        <div className="joinus-area">
            <Container>
                <h2 className="joinus-title">
                    {t('joinUs')}
                </h2>
                <div className="joinus-blc">
                    <div className="joinus-item">
                        <div className="joinus-description">
                            <h3>{t('beLiv')}</h3>
                            <p>
                                {t('getStableJob')}
                            </p>
                            <Button onClick={becomeDeliv} className="btn-yellow" variant="primary">{t('joinTeam')}</Button>
                        </div>
                        <div className="joinus-img-blc">
                            <img src={JoinUsImgOne} alt="" />
                        </div>
                    </div>
                    <div className="joinus-item">
                        <div className="joinus-img-blc">
                            <img src={JoinUsImgTwo} alt="" />
                        </div>
                        <div className="joinus-description">
                            <h3>{t('bePartnaire')}</h3>
                            <p>
                                {t('partnaireDesc')}
                            </p>
                            <Button onClick={becomeSupplier} className="btn-yellow" variant="primary">{t('join')}</Button>
                        </div>
                    </div>

                </div>
            </Container>
        </div>
    )
}