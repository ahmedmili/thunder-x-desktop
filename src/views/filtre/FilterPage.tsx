import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { adsHomeSelector, categoriesHomeSelector } from "../../Redux/slices/home";
import { useAppSelector } from "../../Redux/store";
import { AdsCarousel } from "../../components/adsCarousel/adsCarousel";
import CategoriesCarousel from "../../components/categoriesCarousel/categoriesCarousel";
import SupplierCard from "../../components/supplierCard/SupplierCard";
import Categories from "./components/categories/Categories";
import Cle from "./components/cle/Cle";
import PriceSlide from "./components/priceSlider/PriceSlide";
import SearchProduit from "./components/produitSearch/ProduitSearch";
import Trie from "./components/trie/Trie";
import "./filterPage.scss";
import { useNavigate } from 'react-router-dom';
import { localStorageService } from '../../services/localStorageService';
import { supplierServices } from '../../services/api/suppliers.api';
import { setSearchQuery, setfilterRestaurants } from '../../Redux/slices/restaurantSlice';
import { useDispatch } from 'react-redux';
import Spinner from '../../components/spinner/Spinner';

function FilterPage() {
    const restaurantsList = useAppSelector((state) => state.restaurant.filterRestaurants);
    const homeData = useAppSelector(adsHomeSelector);
    const [currentPage, setCurrentPage] = useState(1);
    const [ads, setAds] = useState<any[]>([]);
    const [allRestaurantsList, setAllRestaurantsList] = useState<any[]>([]);
    const [originCategories, setOriginCategories] = useState<any[]>([]);

    const [isloading, setIsLoading] = useState<boolean>(false)

    const categories = useSelector(categoriesHomeSelector);
    const itemsPerPage = 8
    const totalPages = Math.ceil(allRestaurantsList.length / itemsPerPage);
    const { t } = useTranslation()
    const navigate = useNavigate();
    const dispatch = useDispatch();


    function handleTextSearch(searchTerm: string): void {
        const currentLocation = localStorageService.getCurrentLocation();
        if (location) {
            if (searchTerm.length > 0) {
                const LongLat = JSON.parse(currentLocation!).coords;
                const data = {
                    "search": searchTerm,
                    "lat": LongLat.latitude,
                    "long": LongLat.longitude
                }
                try {
                    supplierServices.searchSupplierByArticle(data).then((resp) => {
                        dispatch(setfilterRestaurants(resp.data.data.suppliers))
                        setIsLoading(false);

                    })
                } catch (e) {
                    throw e
                }
            } else {
                // setErrorMessage("Veuillez compléter la recherche.");
            }
        } else {
            // setErrorMessage("choisissez l\'emplacement s\'il vous plaît");
        }

        dispatch(setSearchQuery(searchTerm));
    }



    function findProductIdByName(productName: string) {
        for (const category of categories) {
            if (category.name === productName) {
                return category.id;
            }

            for (const product of category.children) {
                if (product.name === productName) {
                    return product.id;
                }
            }
        }
        return null; // Product not found
    }


    const handleCategorySearch = (categoryName: string) => {
        const currentLocation = JSON.parse(localStorageService.getCurrentLocation()!).coords
        const cat_id = findProductIdByName(categoryName)
        const requestData = {
            category_id: cat_id,
            lat: currentLocation!.latitude,
            long: currentLocation!.longitude
        }
        supplierServices.searchSupplierBySubArticle(requestData).then((res: any) => {
            dispatch(setfilterRestaurants(res.data.data.suppliers))
            setIsLoading(false);
        })
    }

    useEffect(() => {
        setOriginCategories(categories)
        categories && searchByUrl()
    }, [categories])

    useEffect(() => {
        setAds(homeData.HOME_1)
    }, [homeData])

    const searchByUrl = () => {
        setIsLoading(true);
        let locationArray = location.pathname.split('/')
        locationArray.length < 3 && navigate("/");
        const searchTypeArray = locationArray[2].length > 0 && locationArray[2].includes("=") ? locationArray[2].split("=") : null
        if (searchTypeArray) {
            switch (searchTypeArray[0]) {
                case "searchTerm":
                    searchTypeArray[1] && handleTextSearch(searchTypeArray[1]);
                    break;
                case "category":
                    searchTypeArray[1] && handleCategorySearch(searchTypeArray[1]);
                    break;
                default:
                    navigate("/")
                    break;
            }
        } else {
            setIsLoading(false)
        }
    }



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
            <a key={'01'} onClick={handleBackClick} >
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
            <a key={0} onClick={handleNextClick} >
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
                        <div className="sup-card-container" >
                            <SupplierCard data={displayedSuppleirs[0]} />
                        </div>
                        {
                            displayedSuppleirs[1] && (
                                <div className="sup-card-container" >
                                    <SupplierCard data={displayedSuppleirs[1]} />
                                </div>
                            )
                        }
                        {
                            displayedSuppleirs[2] && (
                                <div className="sup-card-container" >
                                    <SupplierCard data={displayedSuppleirs[2]} />
                                </div>
                            )
                        }
                        {
                            displayedSuppleirs[3] && (
                                <div className="sup-card-container" >
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
                                <div className="sup-card-container" >
                                    <SupplierCard data={displayedSuppleirs[4]} />
                                </div>
                            )
                        }
                        {
                            displayedSuppleirs[5] && (
                                <div className="sup-card-container" >
                                    <SupplierCard data={displayedSuppleirs[5]} />
                                </div>
                            )
                        }
                        {
                            displayedSuppleirs[6] && (
                                <div className="sup-card-container">
                                    <SupplierCard data={displayedSuppleirs[6]} />
                                </div>
                            )
                        }
                        {
                            displayedSuppleirs[7] && (
                                <div className="sup-card-container">
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
            <Container fluid className="filter-page-container">
                {/* <Row> */}
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
                {/* </Row> */}
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
                            allRestaurantsList.length > 0 && !isloading ? (
                                <>
                                    <div >
                                        {renderItems()}
                                    </div>
                                    <div className="paginationBtnsContainer">

                                        <div className="pagination-btns">{renderPaginationButtons()}</div>
                                    </div>
                                </>
                            ) : isloading ?
                                (<Spinner name="loading" />)
                                : (
                                    <div className="not-found-container">
                                        <div className="no-data-text">
                                            {t('noResult')}.
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