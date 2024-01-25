



// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
import { Col, Container, Row } from "react-bootstrap"
import "./adsSkeleton.scss"

function AdsSkeleton() {
  return (
    <Container>
      <Row>
        <Col>
          <div className="AdsSkeleton-container-main ">
            <div className="background skeleton">
            </div>
            <div className="background skeleton">
            </div>
          </div>
        </Col >
      </Row>
    </Container>
  );
}

export default AdsSkeleton