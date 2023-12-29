import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
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
import { useNavigate } from "react-router-dom";
import { localStorageService } from "../../services/localStorageService";
import { supplierServices } from "../../services/api/suppliers.api";
import {
  setSearchQuery,
  setfilterRestaurants,
} from "../../Redux/slices/restaurantSlice";
import { useDispatch } from "react-redux";
import Spinner from "../../components/spinner/Spinner";
import Messanger from "../../components/Popups/Messanger/Messanger";
import MessangerBtnIcon from "../../assets/profile/Discuter/messanger-btn.svg";
import { fetchMessages } from "../../Redux/slices/messanger";
import {
  adsHomeSelector,
  categoriesHomeSelector,
  homeLoadingSelector,
  popularHomeSelector,
  recommendedHomeSelector,
  homeRefresh,
  setRefresh,
} from "../../Redux/slices/home";
import OffersList from "../../components/offersList/OffersList";
import RecommandedList from "../../components/recommanded-list/RecommandedList";
import { FilterAds } from "../../components/filter-ads/FilterAds";
import PopularList from "../../components/popular-list/PopularList";
import FilterCategories from "../../components/filter-categories/FilterCategories";
import SupplierWhiteCard from "../../components/supplier-white-card/SupplierWhiteCard";
import BtnReset from "./components/btn-reset/BtnReset";

function FilterPage() {
  const restaurantsList = useAppSelector(
    (state) => state.restaurant.filterRestaurants
  );
  const isDeliv = useAppSelector((state) => state.homeData.isDelivery);
  const homeData = useAppSelector(adsHomeSelector);
  const [currentPage, setCurrentPage] = useState(1);
  const [ads, setAds] = useState<any[]>([]);
  const [ads2, setAds2] = useState<any[]>([]);
  const [ads3, setAds3] = useState<any[]>([]);
  const [allRestaurantsList, setAllRestaurantsList] = useState<any[]>([]);
  const [originCategories, setOriginCategories] = useState<any[]>([]);

  const recommanded = useSelector(recommendedHomeSelector);
  const popular = useSelector(popularHomeSelector);
  const isLoading = useSelector(homeLoadingSelector);
  const refresh = useSelector(homeRefresh);
  const [isload, setIsLoading] = useState<boolean>(false);
  const [isloadFilter, setIsLoadFilter] = useState<boolean>(false);
  const [hasFilter, setHasFilter] = useState<boolean>(false);
  const categories = useSelector(categoriesHomeSelector);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(allRestaurantsList.length / itemsPerPage);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const suppliersListRef = useRef(null);
  const [searchSuppliersList, setSearchSuppliersList] = useState<any>();
  useEffect(() => {
    searchSupplier();
  }, []);
  useEffect(() => {
    if (refresh) {
      dispatch(setRefresh(false));
      if (!isloadFilter) {
        searchSupplier();
      }
    }
  }, [refresh]);
  const searchSupplier = () => {
    const searchParams = new URLSearchParams(location.search);
    if (isEmptySearchParams(searchParams)) {
      setSearchSuppliersList("");
      setHasFilter(false);
    } else {
      setHasFilter(true);
      const currentLocation = JSON.parse(
        localStorageService.getCurrentLocation()!
      ).coords;
      const payload = {
        order_by: "popular",
        max_price: 1000,
        min_price: 0,
        lat: currentLocation!.latitude,
        long: currentLocation!.longitude,
        category_id: "",
        delivery_price: 0,
        filter: "",
      };
      if (searchParams.has("category")) {
        payload.category_id = searchParams.get("category") as string;
      }
      if (searchParams.has("order")) {
        payload.order_by = searchParams.get("order") as string;
      }
      if (searchParams.has("min_price")) {
        payload.min_price = Number(searchParams.get("min_price"));
      }
      if (searchParams.has("max_price")) {
        payload.max_price = Number(searchParams.get("max_price"));
      }
      if (searchParams.has("filter")) {
        payload.filter = searchParams.get("filter") as string;
      }
      setIsLoadFilter(true);
      supplierServices
        .getSuppliersByFilters(payload)
        .then((res: any) => {
          setSearchSuppliersList(res.data.data.suppliers);
          setIsLoadFilter(false);
        })
        .catch((error) => {
          setIsLoadFilter(false);
        });
    }
  };
  const isEmptySearchParams = (searchParams: any) => {
    const iterator = searchParams.entries();
    return iterator.next().done;
  };
  useEffect(() => {
    setAds(homeData.HOME_1);
    setAds2(homeData.HOME_2);
    setAds3(homeData.HOME_3);
  }, [homeData]);
  const renderItems = () => {
    return (
      <>
        {
          <div className="main-content">
            {ads && (
              <div className="main-content__col-ads">
                <FilterAds data={ads} slides={3} />
              </div>
            )}
            <div className="main-content__col-offers">
              <h3 className="main-content__col-offers__title">
                Offres du jour
              </h3>
              <OffersList listType="discount" restaurants={recommanded} />
            </div>
            <div className="main-content__col-offers">
              <h3 className="main-content__col-offers__title">
                Recommandé pour vous
              </h3>
              <RecommandedList
                listType="recommanded"
                restaurants={recommanded}
              ></RecommandedList>
            </div>
            {ads2 && (
              <div className="main-content__col-ads">
                <FilterAds data={ads2} slides={1} />
              </div>
            )}
            <div className="main-content__col-offers">
              <h3 className="main-content__col-offers__title">
                Marques populaires
              </h3>
              <PopularList listType="popular" restaurants={popular} />
            </div>
            {ads3 && (
              <div className="main-content__col-ads">
                <FilterAds data={ads3} slides={2} center={true} arrows={true} />
              </div>
            )}           
          </div>
        }
      </>
    );
  };
  return (
    <>
      {!isLoading ? (
        <>
          <div className="category-bar">
            {originCategories ? (
              <FilterCategories onCategorySelect={searchSupplier} />
            ) : (
              ""
            )}
          </div>
          <div className="content container-fluid">
            <Row className="content__row">
              <Col className="col-3 content__column content__column--first">
                <div className="content__column content__scroll-content">
                  <div className="content__column__filter">
                    <Trie />
                  </div>
                  <div className="content__column__filter">
                    <PriceSlide />
                  </div>
                  <div className="content__column__filter">
                    <Categories onCategorySelect={searchSupplier} />
                  </div>
                  <div className="content__column__filter">
                    <Cle />
                  </div>
                </div>
              </Col>
              <Col className="col-9 content__column content__column--second">
                <div className="content__column__search-bar">
                  <SearchProduit />
                </div>
                {hasFilter && !isloadFilter ? <BtnReset></BtnReset> : ""}
                {searchSuppliersList?.length && !isloadFilter ? (
                  <div className="row">
                    {searchSuppliersList.map(function (supp: any) {
                      return (
                        <div key={supp.id} className="col-3">
                          <SupplierWhiteCard data={supp} className="mb-32" />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  ""
                )}
                {isloadFilter ? (
                  <>
                    <div className="row">
                      <div className="col-3">
                        <Skeleton
                          variant="rectangular"
                          width={"100%"}
                          height={118}
                        />
                        <Box sx={{ pt: 0.5 }} className="mt-4">
                          <Skeleton height={20} />
                          <Skeleton width="60%" className="mt-2" height={20} />
                        </Box>
                      </div>
                      <div className="col-3">
                        <Skeleton
                          variant="rectangular"
                          width={"100%"}
                          height={118}
                        />
                        <Box sx={{ pt: 0.5 }} className="mt-4">
                          <Skeleton height={20} />
                          <Skeleton width="60%" className="mt-2" height={20} />
                        </Box>
                      </div>
                      <div className="col-3">
                        <Skeleton
                          variant="rectangular"
                          width={"100%"}
                          height={118}
                        />
                        <Box sx={{ pt: 0.5 }} className="mt-4">
                          <Skeleton height={20} />
                          <Skeleton width="60%" className="mt-2" height={20} />
                        </Box>
                      </div>
                      <div className="col-3">
                        <Skeleton
                          variant="rectangular"
                          width={"100%"}
                          height={118}
                        />
                        <Box sx={{ pt: 0.5 }} className="mt-4">
                          <Skeleton height={20} />
                          <Skeleton width="60%" className="mt-2" height={20} />
                        </Box>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-3">
                        <Skeleton
                          variant="rectangular"
                          width={"100%"}
                          height={118}
                        />
                        <Box sx={{ pt: 0.5 }} className="mt-4">
                          <Skeleton height={20} />
                          <Skeleton width="60%" className="mt-2" height={20} />
                        </Box>
                      </div>
                      <div className="col-3">
                        <Skeleton
                          variant="rectangular"
                          width={"100%"}
                          height={118}
                        />
                        <Box sx={{ pt: 0.5 }} className="mt-4">
                          <Skeleton height={20} />
                          <Skeleton width="60%" className="mt-2" height={20} />
                        </Box>
                      </div>
                      <div className="col-3">
                        <Skeleton
                          variant="rectangular"
                          width={"100%"}
                          height={118}
                        />
                        <Box sx={{ pt: 0.5 }} className="mt-4">
                          <Skeleton height={20} />
                          <Skeleton width="60%" className="mt-2" height={20} />
                        </Box>
                      </div>
                      <div className="col-3">
                        <Skeleton
                          variant="rectangular"
                          width={"100%"}
                          height={118}
                        />
                        <Box sx={{ pt: 0.5 }} className="mt-4">
                          <Skeleton height={20} />
                          <Skeleton width="60%" className="mt-2" height={20} />
                        </Box>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
                {recommanded.length &&
                !searchSuppliersList?.length &&
                !isloadFilter &&
                !hasFilter ? (
                  <div>
                    <div>{renderItems()}</div>
                  </div>
                ) : (
                  ""
                )}
                {hasFilter && !isloadFilter && !searchSuppliersList?.length ? (
                  <>
                    <div className="result-not-found">
                      <div className="result-not-found__title">Oups !</div>
                      <div className="result-not-found__text">
                        Aucun résultat correspondant à vos critères de recherche{" "}
                      </div>
                      <div className="result-not-found__icon"></div>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default FilterPage;
