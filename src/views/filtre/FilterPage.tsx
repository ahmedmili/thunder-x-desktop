import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  adsHomeSelector,
  categoriesHomeSelector,
  homeLoadingSelector,
  homeRefresh,
  popularHomeSelector,
  recommendedHomeSelector,
  setRefresh,
} from "../../Redux/slices/home";
import { useAppSelector } from "../../Redux/store";
import MessangerBtnIcon from "../../assets/profile/Discuter/messanger-btn.svg";
import Map from "../../components/Location/Location";
import Messanger from "../../components/Popups/Messanger/Messanger";
import { FilterAds } from "../../components/filter-ads/FilterAds";
import FilterCategories from "../../components/filter-categories/FilterCategories";
import OffersList from "../../components/offersList/OffersList";
import PopularList from "../../components/popular-list/PopularList";
import RecommandedList from "../../components/recommanded-list/RecommandedList";
import SupplierWhiteCard from "../../components/supplier-white-card/SupplierWhiteCard";
import { supplierServices } from "../../services/api/suppliers.api";
import { localStorageService } from "../../services/localStorageService";
import { checkSsr } from "../../utils/utils";
import BtnReset from "./components/btn-reset/BtnReset";
import Categories from "./components/categories/Categories";
import Cle from "./components/cle/Cle";
import PriceSlide from "./components/priceSlider/PriceSlide";
import SearchProduit from "./components/produitSearch/ProduitSearch";
import Trie from "./components/trie/Trie";
import "./filterPage.scss";

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
  const [newSuppliers, setNewuppliers] = useState<any>(false);
  const [bestRatedSuppliers, setBestRatedSuppliers] = useState<any>(false);

  const [searchSuppliersList, setSearchSuppliersList] = useState<any>();
  const [ssrLoading, setSsrLoading] = useState<boolean>(true)

  const [messangerPopup, setMessangerPopup] = useState<boolean>(false)

  const showMapState = useAppSelector((state) => state.location.showMap);

  const unReadMessages = useAppSelector((state) => state.messanger.unReadedMessages)
  const [unReadedQt, setUnReadedQt] = useState<number>(unReadMessages)

  const navLocation = useLocation()


  const handleSsr = () => {
    let isSsr = checkSsr()
    isSsr ? setSsrLoading(true) : setSsrLoading(false)
    setSsrLoading(isSsr)
    setTimeout(() => {
      let currentLocation = localStorageService.getCurrentLocation()
      let isSsr = checkSsr()
      if (isSsr) {
        setSsrLoading(true)

      } else {
        const searchParams = new URLSearchParams(location.search);
        if (!(isEmptySearchParams(searchParams))) {
          let lat = searchParams.has('lat') ? searchParams.get('lat') as string : null
          let lng = searchParams.has('lng') ? searchParams.get('lng') as string : null
          if ((lng && lat) || currentLocation) {
            const { pathname } = navLocation;
            let coords = (lng && lat) ? {
              latitude: lat,
              longitude: lng
            } : currentLocation && JSON.parse(currentLocation
            ).coords;
            searchParams.set('lat', coords.latitude.toString());
            searchParams.set('lng', coords.longitude.toString());
            searchSupplier()
            const newURL = pathname != '/' ? `${pathname}?${searchParams.toString()}` : `/search/?${searchParams.toString()}`;
            navigate(newURL, { replace: true })

          } else {
            dispatch({ type: "SET_SHOW", payload: true })
          }
        } else {
          navigateToHome()
        }

      }
    }, 1000 * 3)
  }

  useEffect(() => {
    handleSsr()
  }, [])

  const navigateToHome = () => {
    const currenLocation = localStorageService.getCurrentLocation()
    let path = '';
    currenLocation ? path = '/search' : path = '/'
    navigate(path, { replace: true })
  }

  useEffect(() => {
    if (recommanded.length) {
      const news = sort(recommanded, 'created_at', 10);
      let bestRated = recommanded.filter((s: any) => s.star);
      bestRated = sort(bestRated, 'star', 10);
      setNewuppliers(news)
      setBestRatedSuppliers(bestRated)
    }
  }, [recommanded]);

  const handleMessangerPopup = () => {
    setMessangerPopup(!messangerPopup)
  }
  useEffect(() => {
    setUnReadedQt(unReadMessages)
  }, [unReadMessages])

  useEffect(() => {
    if (refresh) {
      dispatch(setRefresh(false));
      searchSupplier();
    }
  }, [refresh]);
  const searchSupplier = () => {
    const searchParams = new URLSearchParams(location.search);
    if (isEmptySearchParams(searchParams)) {
      setSearchSuppliersList("");
      setHasFilter(false);
      setIsLoadFilter(false);
    } else {
      setHasFilter(true);
      const current_location = localStorageService.getCurrentLocation()
      var currentLocation: any;

      if (current_location) {
        currentLocation = JSON.parse(current_location
        ).coords;
      } else {
        let lat = searchParams.has("lat") ? searchParams.get("lat") as string : null;
        let lng = searchParams.has("lng") ? searchParams.get("lng") as string : null;
        if (lat && lng) {
          currentLocation = {
            latitude: lat,
            longitude: lng
          }
        } else {
          currentLocation = {
            latitude: 0,
            longitude: 0
          }
          dispatch({ type: "SET_SHOW", payload: true })
        }
      }
      const payload = {
        order_by: "popular",
        max_price: 100,
        min_price: 0,
        lat: currentLocation!.latitude,
        long: currentLocation!.longitude,
        category_id: "",
        delivery_price: 0,
        filter: "",
      };

      searchParams.has("category") && (payload.category_id = searchParams.get("category") as string);
      searchParams.has("order") && (payload.order_by = searchParams.get("order") as string);
      searchParams.has("min_price") && (payload.min_price = Number(searchParams.get("min_price")));
      searchParams.has("max_price") && (payload.max_price = Number(searchParams.get("max_price")));
      searchParams.has("filter") && (payload.filter = searchParams.get("filter") as string);
      setIsLoadFilter(true);
      supplierServices
        .getSuppliersByFilters(payload)
        .then((res: any) => {
          if (payload.filter && payload.filter != "") {
            const filtredList = res.data.data.suppliers.filter((item: any) => item.name.toUpperCase().includes(payload.filter.toUpperCase()));
            setSearchSuppliersList(filtredList);
          }
          else {
            setSearchSuppliersList(res.data.data.suppliers);
          }
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

  function isAtLeastSevenDaysAgo(dateString: any) {
    var dateObject: any = new Date(dateString);
    var today: any = new Date();
    var timeDifference: any = today - dateObject;
    var daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    return daysDifference >= 7;
  }
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
            {bestRatedSuppliers.length ? <div className="main-content__col-offers">
              <h3 className="main-content__col-offers__title">
                Les mieux notés
              </h3>
              <OffersList listType="recommanded" restaurants={bestRatedSuppliers} />
            </div> : ''}
            {newSuppliers.length ? <div className="main-content__col-offers">
              <h3 className="main-content__col-offers__title">
                Nouveau sur Thunder
              </h3>
              <OffersList listType="recommanded" restaurants={newSuppliers} />
            </div> : ''}
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

  // skeletopn compnent
  const SkeletonEffect: React.FC = () => {
    return (
      <>
        <div className="cat-carousel" style={{
          paddingTop: '70px'
        }} >

          <Skeleton height={268} style={{
            flex: '1'
          }} />
          <Skeleton height={268} style={{
            flex: '1'
          }} />
          <Skeleton height={268} style={{
            flex: '1'
          }} />
          <Skeleton height={268} style={{
            flex: '1'
          }} />
          <Skeleton height={268} style={{
            flex: '1'
          }} />


        </div>

        <div className="filter-page-skeleton">


          <div className="left-side" >
            <Skeleton height={1275} width={361} />

          </div>

          < div className="right-side" >


            <div className="search-bar" >
              <Skeleton height={75} style={{
                flex: 3,
                backgroundColor: "#B2E9F0"
              }}
              />
              <Skeleton height={75} style={{
                flex: '1',
                backgroundColor: "##1F94A4"
              }} />
            </div>

            <div className="ads" >
              <Skeleton height={230} style={{
                flex: 1,
              }}
              />
              <Skeleton height={230} style={{
                flex: 1,
              }}
              />
              <Skeleton height={230} style={{
                flex: 1,
              }}
              />

            </div>
            <div className="main-content">
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
            </div>

          </div >
        </div>
      </>

    )
  }


  function sort(array: any, property: any, n: any) {
    const sortedArray = array.slice().sort((a: any, b: any) => a[property] - b[property]);
    return sortedArray.slice(0, n);
  }

  return (
    <Suspense fallback={
      <SkeletonEffect />
    } >

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
                    {hasFilter && !isloadFilter ? <BtnReset></BtnReset> : ""}
                  </div>
                  {searchSuppliersList?.length && !isloadFilter && hasFilter ? (
                    <div className="row search-list">
                      {searchSuppliersList.map(function (supp: any) {
                        return (
                          <div key={supp.id} className="col-3 search-list__column px-0">
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
            <div className={'bulles'}>
              <button className={'messangerPopupBtn'} onClick={handleMessangerPopup} style={{ backgroundImage: `url(${MessangerBtnIcon})` }}>
                {unReadedQt > 0 && (
                  <div className={'messangerBullNotifIcon'}>
                    {unReadedQt}
                  </div>
                )}
              </button>
            </div>
            {
              messangerPopup &&
              <Messanger className='discuterMessangerPopup' close={handleMessangerPopup} />
            }
            {showMapState && (
              <div
                className="mapOverPlay">
                <div
                  onClick={(e) => e.stopPropagation()}>
                  <Map forced={true} />
                </div>
              </div>
            )}
          </>
        ) : (
          <SkeletonEffect />

        )}
      </>
    </Suspense>

  );
}

export default FilterPage;
