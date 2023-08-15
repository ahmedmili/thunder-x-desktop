

import Skeleton from "react-loading-skeleton";
import SupplierCardSkeleton from "../../../components/supplierCard/supplierCardSkeleton/SupplierCardSkeleton";
import "./skeleton.scss"
import { Col, Container, Row } from "react-bootstrap";
import AdsSkeleton from "../../../components/adsCarousel/adsSkeleton/AdsSkeleton";
import { ApplicationAd } from "../../../components/applicationAd/ApplicationAd";

interface SkeletonList {
    type?: string;
}

const SkeletonList: React.FC<SkeletonList> = (props) => {
    return (
        <Container className="home-skeleton-contaner">
            {
                props.type === "1" ? (
                    <div className="text-2-container">
                        <div className="custom-div skeleton"></div>
                        
                    </div>
                ) : (
                    <div className="text-container" >
                        <div className="custom-div skeleton"></div>
                        <div className="custom-div skeleton"></div>
                        <div className="custom-div skeleton"></div>
                    </div>
                )
            }
            <Row className="supplierList">
                <Col>
                    <Row className={`background ${props.type === "1" ? "BG_blue" : ""} `}  >

                    </Row>
                    <Row >
                        <Col className="supplierCard-Skeleton-container">
                            <Row>
                                <Col>
                                    <SupplierCardSkeleton />
                                </Col>
                                <Col>
                                    <SupplierCardSkeleton />
                                </Col>
                                <Col>
                                    <SupplierCardSkeleton />
                                </Col>
                            </Row>
                            <Row >
                                <Col>
                                    <SupplierCardSkeleton />
                                </Col>
                                <Col>
                                    <SupplierCardSkeleton />
                                </Col>
                                <Col>
                                    <SupplierCardSkeleton />
                                </Col>
                            </Row>

                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}


function HomeSkeleton() {
    return (
        <>

            <AdsSkeleton />
            <SkeletonList />
            <ApplicationAd />
            <AdsSkeleton />
            <SkeletonList type="1" />
            <AdsSkeleton />

        </>
    )
}

export default HomeSkeleton