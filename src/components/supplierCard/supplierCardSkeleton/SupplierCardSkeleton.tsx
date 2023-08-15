



// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
import { Container } from "react-bootstrap"
import "./supplierCardSkeleton.scss"

function SupplierCardSkeleton() {
    return (
        <div className="SupplierCardSkeleton-container-main">
            <div className="header">
                <div className="promotion skeleton"></div>
                <div className="image skeleton"></div>
            </div>
            <div className="body">
                <div className="leftSide">
                    <div className="title skeleton"></div>
                    <div className="options skeleton"></div>
                    <div className="price skeleton"></div>
                </div>
                <div className="rightSide">
                    <div className="stars skeleton"></div>
                    <div className="time skeleton"></div>
                </div>
            </div>
        </div>
    );
}

export default SupplierCardSkeleton