import { Col, Container, Row } from "react-bootstrap"
import "./filterPage.scss"
import CategoriesCarousel from "../../components/categoriesCarousel/categoriesCarousel"
import { useSelector } from "react-redux";
import { adsHomeSelector, categoriesHomeSelector } from "../../Redux/slices/home";
import Skeleton from "react-loading-skeleton";
import { useEffect, useState } from "react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useAppSelector } from "../../Redux/store";
import SupplierCard from "../../components/supplierCard/SupplierCard";
import { AdsCarousel } from "../../components/adsCarousel/adsCarousel";
import Categories from "./components/categories/Categories";
import Trie from "./components/trie/Trie";
import Cle from "./components/cle/Cle";
import PriceSlide from "./components/priceSlider/PriceSlide";
import SearchProduit from "./components/produitSearch/ProduitSearch";

function FilterPage() {

    const restaurantsList = useAppSelector((state) => state.restaurant.filterRestaurants);
    const homeData = useAppSelector(adsHomeSelector);
    const [currentPage, setCurrentPage] = useState(1);
    const [ads, setAds] = useState<any[]>([]);
    const [allRestaurantsList, setAllRestaurantsList] = useState<any[]>([]);
    const [originCategories, setOriginCategories] = useState<any[]>([]);

    const categories = useSelector(categoriesHomeSelector);
    const itemsPerPage = 8
    const totalPages = Math.ceil(allRestaurantsList.length / itemsPerPage);

    useEffect(() => {
        setOriginCategories(categories)
    }, [categories])

    useEffect(() => {
        setAds(homeData.HOME_1)
    }, [homeData])

    useEffect(() => {

        setAllRestaurantsList(restaurantsList)
    }, [restaurantsList])


    // navigation 
    const handleClick = (page: number) => {
        setCurrentPage(page);
    };
    const handleBackClick = () => {
        if (currentPage != 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const handleNextClick = () => {
        if (currentPage != totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        buttons.push(
            <a onClick={handleBackClick} >
                <ArrowBackIosIcon className="icon" />
            </a>
        );
        for (let i = 1; i <= totalPages; i++) {
            buttons.push(
                <a
                    key={i}
                    onClick={() => handleClick(i)}
                    className={i == currentPage ? 'active' : ''}
                >
                    {i}
                </a>
            );
        }
        buttons.push(
            <a onClick={handleNextClick} >
                <ArrowForwardIosIcon className="icon" />
            </a>
        );
        return buttons;
    };
    useEffect(() => {
        renderItems()
    }, [allRestaurantsList])

    const renderItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const displayedSuppleirs = allRestaurantsList.slice(startIndex, endIndex)
        return <>
            {
                displayedSuppleirs.length > 0 && (
                    <div className="filtred-main" >
                        <div >
                            <SupplierCard data={displayedSuppleirs[0]} />
                        </div>
                        {
                            displayedSuppleirs[1] && (
                                <div >
                                    <SupplierCard data={displayedSuppleirs[1]} />
                                </div>
                            )
                        }
                        {
                            displayedSuppleirs[2] && (
                                <div >
                                    <SupplierCard data={displayedSuppleirs[2]} />
                                </div>
                            )
                        }
                        {
                            displayedSuppleirs[3] && (
                                <div >
                                    <SupplierCard data={displayedSuppleirs[3]} />
                                </div>
                            )
                        }

                        {
                            ads && (
                                <div className="adsCols">
                                    <AdsCarousel data={ads} />
                                </div>
                            )
                        }

                        {
                            displayedSuppleirs[4] && (
                                <div >
                                    <SupplierCard data={displayedSuppleirs[4]} />
                                </div>
                            )
                        }
                        {
                            displayedSuppleirs[5] && (
                                <div >
                                    <SupplierCard data={displayedSuppleirs[5]} />
                                </div>
                            )
                        }
                        {
                            displayedSuppleirs[6] && (
                                <div >
                                    <SupplierCard data={displayedSuppleirs[6]} />
                                </div>
                            )
                        }
                        {
                            displayedSuppleirs[7] && (
                                <div >
                                    <SupplierCard data={displayedSuppleirs[7]} />
                                </div>
                            )
                        }
                    </div>
                )
            }

        </>
    };
    return (
        <>
            <Container className="filter-page-container">
                <Row>
                    {/* categories list */}
                    {originCategories ? (
                        <CategoriesCarousel
                            onCategorySelect={() => { }}
                        />
                    ) : (
                        <div className="skeleton-container">
                            <Skeleton count={12} className="loading-skeleton" />
                            <Skeleton count={12} className="loading-skeleton" />
                            <Skeleton count={12} className="loading-skeleton" />
                        </div>
                    )}
                </Row>
                <Row>
                    <Col className="col-4 filter-side-bar">
                        <div className="filter-categories-container">
                            <Categories />
                        </div>
                        <div className="search-produit-container">
                            <SearchProduit />
                        </div>
                        <div className="price-categories-container">
                            <PriceSlide />
                        </div>
                        <div className="filter-trie-container">
                            <Trie />
                        </div>

                        <div className="cle-trie-container">
                            <Cle />
                        </div>
                    </Col>

                    <Col className="display-main">
                        {
                            allRestaurantsList.length > 0 ? (
                                <>
                                    <div >
                                        {renderItems()}
                                    </div>
                                    <div className="paginationBtnsContainer">

                                        <div className="pagination-btns">{renderPaginationButtons()}</div>
                                    </div>
                                </>
                            ) : (
                                <div className="not-found-container">
                                    <div className="no-data-text">
                                        Aucun résultat.
                                    </div>
                                    <div className="not-found-img">
                                    </div>
                                </div>
                            )
                        }

                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default FilterPage