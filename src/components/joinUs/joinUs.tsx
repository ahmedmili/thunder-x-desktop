import './joinUs.scss';
import { Container, Button } from 'react-bootstrap'
import JoinUsImgOne from './../../assets/joinus-img-1.jpg';
import JoinUsImgTwo from './../../assets/joinus-img-2.jpg';

export const JoinUs = () => {
    return (
        <div className="joinus-area">
            <Container>
                <h2 className="joinus-title">
                    REJOIGNEZ-NOUS ET GAGNER DE L’ARGENT FACILEMENT
                </h2>
                <div className="joinus-blc">
                    <div className="joinus-item">
                        <div className="joinus-description">
                            <h3>Devenir livreur de Thunder Express</h3>
                            <p>
                                Choisissez un emploi stable et flexible en rejoignant l’équipe de nos livreurs. 
                            </p>
                            <Button className="btn-yellow" variant="primary">Je rejoins l’équipe</Button>
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
                            <h3>Devenir livreur de Thunder Express</h3>
                            <p>
                                Choisissez un emploi stable et flexible en rejoignant l’équipe de nos livreurs. 
                            </p>
                            <Button className="btn-yellow" variant="primary">Je rejoins l’équipe</Button>
                        </div>
                    </div>
                    
                </div>
            </Container>
        </div>
    )
}