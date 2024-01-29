import Pagination from '@mui/material/Pagination';
import Skeleton from "@mui/material/Skeleton";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import {
  adsHomeSelector,
  homeLoadingSelector,
  homeRefresh,
  popularHomeSelector,
  recommendedHomeSelector,
  setRefresh
} from "../../Redux/slices/home";

import { handleMessanger } from "../../Redux/slices/messanger";
import { useAppSelector } from "../../Redux/store";
import MessangerBtnIcon from "../../assets/profile/Discuter/messanger-btn.svg";
import AdsSkeletons from "../../components/Skeletons/FilterPage/AdsSkeletons/AdsSkeletons";
import ProductsSkeletons from "../../components/Skeletons/FilterPage/ProductsSkeletons/ProductsSkeletons";
import SearchSkeletons from "../../components/Skeletons/FilterPage/SearchSkeleton/SearchSkeletons";
import { FilterAds } from "../../components/filter-ads/FilterAds";
import BtnReset from "./components/btn-reset/BtnReset";
import Categories from "./components/categories/Categories";
import PriceSlide from "./components/priceSlider/PriceSlide";
import SearchProduit from "./components/produitSearch/ProduitSearch";
import Trie from "./components/trie/Trie";

const Messanger = lazy(() => import("../../components/Popups/Messanger/Messanger"));
const SideBar = lazy(() => import("../../components/Skeletons/FilterPage/SideBar/SideBar"));
const FilterCategories = lazy(() => import("../../components/filter-categories/FilterCategories"));
const OffersList = lazy(() => import("../../components/offersList/OffersList"));
const PopularList = lazy(() => import("../../components/popular-list/PopularList"));
const RecommandedList = lazy(() => import("../../components/recommanded-list/RecommandedList"));
const SupplierWhiteCard = lazy(() => import("../../components/supplier-white-card/SupplierWhiteCard"));


import { supplierServices } from "../../services/api/suppliers.api";
import { localStorageService } from "../../services/localStorageService";
import { AppProps } from "../../services/types";
import { paramsService } from "../../utils/params";
import { checkSsr, scrollToTop } from "../../utils/utils";

import "./filterPage.scss";

function FilterPage({ initialData }: AppProps) {

  const homeData = useAppSelector(adsHomeSelector);
  const [ads, setAds] = useState<any[]>([]);
  const [ads2, setAds2] = useState<any[]>([]);
  const [ads3, setAds3] = useState<any[]>([]);

  const recommanded = useSelector(recommendedHomeSelector);
  const popular = useSelector(popularHomeSelector);
  const isLoading = initialData ? false : useSelector(homeLoadingSelector);
  const refresh = useSelector(homeRefresh);
  const [isloadFilter, setIsLoadFilter] = useState<boolean>(false);
  const [hasFilter, setHasFilter] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(9);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [newSuppliers, setNewuppliers] = useState<any>(false);
  const [bestRatedSuppliers, setBestRatedSuppliers] = useState<any>(false);

  const [searchSuppliersList, setSearchSuppliersList] = useState<Array<any>>(initialData ? initialData.data.suppliers : []);
  const [ssrLoading, setSsrLoading] = useState<boolean>(true)
  const [pageReadry, setPageReadry] = useState<boolean>(false)

  const isConnected = localStorageService.getUserToken()

  const unReadMessages = useAppSelector((state) => state.messanger.unReadedMessages)
  const isMessagesOpen = useAppSelector((state) => state.messanger.isOpen)
  const [unReadedQt, setUnReadedQt] = useState<number>(unReadMessages)

  const { t } = useTranslation()

  const navLocation = useLocation()

  const handleLocations = () => {
    let currentLocation = localStorageService.getCurrentLocation()
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has('search')) {
      // fetch lat and long from params
      let resultObject = paramsService.fetchParams(searchParams)
      let lat = resultObject.lat ? resultObject.lat : null
      let lng = resultObject.lng ? resultObject.lng : null
      if (!(lng && lat)) {
        if (currentLocation) {
          let coords = JSON.parse(currentLocation
          ).coords;
          resultObject = {
            ...resultObject,
            lat: coords.latitude.toString(),
            lng: coords.longitude.toString(),
          }
          const newCryptedParams = paramsService.handleUriParams(resultObject)
          searchParams.set('search', newCryptedParams)
          const { pathname } = navLocation;
          const newURL = pathname !== '/' ? `${pathname}?${searchParams.toString()}` : `/search/?${searchParams.toString()}`;
          navigate(newURL);
          setPageReadry(true)
          searchSupplier()
        } else {
          dispatch({ type: "SET_SHOW", payload: true })
        }
      } else {
        setPageReadry(true)

        searchSupplier()
      }

    } else {
      if (currentLocation) {
        let coords = JSON.parse(currentLocation
        ).coords;
        let resultObject = {
          lat: coords.latitude.toString(),
          lng: coords.longitude.toString(),
        }
        const newCryptedParams = paramsService.handleUriParams(resultObject)
        searchParams.append('search', newCryptedParams)
        const { pathname } = navLocation;
        const newURL = pathname !== '/' ? `${pathname}?${searchParams.toString()}` : `/search/?${searchParams.toString()}`;
        navigate(newURL);
        searchSupplier()
        setPageReadry(true)
      } else {
        navigateToHome()
      }

    }
  }

  const handleSsr = () => {
    let isSsr = checkSsr()
    isSsr ? setSsrLoading(true) : setSsrLoading(false)
    setSsrLoading(isSsr)
    setTimeout(() => {
      let isSsr = checkSsr()
      if (isSsr) {
        setSsrLoading(true)

      } else {
        handleLocations()
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
    dispatch(handleMessanger())
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
      setSearchSuppliersList([]);
      setHasFilter(false);
      setIsLoadFilter(false);
    } else {
      const expectedKeys = ['lat', 'lng'];
      let resultObject = paramsService.fetchParams(searchParams)
      const hasUnexpectedKeys = Object.keys(resultObject).some(key => !expectedKeys.includes(key));
      setHasFilter(hasUnexpectedKeys);
      const current_location = localStorageService.getCurrentLocation()
      var currentLocation: any;

      if (current_location) {
        currentLocation = JSON.parse(current_location
        ).coords;
      } else {
        if (searchParams.has('search')) {
          let params = paramsService.fetchParams(searchParams)
          let lat = params.lat ? params.lat : null;
          let lng = params.lng ? params.lng : null;
          if (lat && lng) {
            currentLocation = {
              latitude: lat,
              longitude: lng
            }
          }
        } else {
          currentLocation = {
            latitude: 0,
            longitude: 0
          }
          // dispatch({ type: "SET_SHOW", payload: true })
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
        paginate: 1,
        page: currentPage ? currentPage : 1,
        per_page: 9,
      };
      let params = paramsService.fetchParams(searchParams)

      params.category && (payload.category_id = params.category);
      params.order_by ? (payload.order_by = params.order_by) : '';
      params.min_price && (payload.min_price = Number(params.min_price));
      params.max_price && (payload.max_price = Number(params.max_price));
      params.page && (payload.page = Number(params.page));

      params.filter && (payload.filter = params.filter.split('+').join(' '));
      (payload.filter != "") ? (payload.paginate = 0) : (payload.paginate = 1);
      setIsLoadFilter(true);
      supplierServices
        .getSuppliersByFiltersWithPagination(payload)
        .then((res: any) => {
          const totalPages = res.data.data.suppliers.total
          const currentPage = res.data.data.suppliers.current_page
          const lastPage = res.data.data.suppliers.last_page
          const perPage = res.data.data.suppliers.per_page
          setTotalPages(totalPages)
          setPerPage(perPage)
          setLastPage(lastPage)
          if (payload.filter != "") {
            const data = res.data.data.suppliers
            const filtredList = data.filter((item: any) => item.name.toUpperCase().includes(payload.filter.toUpperCase()));
            setSearchSuppliersList(filtredList);
          }
          else {
            const data = res.data.data.suppliers.data
            setSearchSuppliersList(data);
          }
          setIsLoadFilter(false);
        })
        .catch((error) => {
          setIsLoadFilter(false);
        });

    }
  };

  const textSearch = () => {
    const searchParams = new URLSearchParams(location.search);
    if (isEmptySearchParams(searchParams)) {
      setSearchSuppliersList([]);
      setHasFilter(false);
      setIsLoadFilter(false);
    } else {
      const expectedKeys = ['lat', 'lng'];
      let resultObject = paramsService.fetchParams(searchParams)
      const hasUnexpectedKeys = Object.keys(resultObject).some(key => !expectedKeys.includes(key));
      setHasFilter(hasUnexpectedKeys);
      const current_location = localStorageService.getCurrentLocation()
      var currentLocation: any;

      if (current_location) {
        currentLocation = JSON.parse(current_location
        ).coords;
      } else {
        if (searchParams.has('search')) {
          let params = paramsService.fetchParams(searchParams)
          let lat = params.lat ? params.lat : null;
          let lng = params.lng ? params.lng : null;
          if (lat && lng) {
            currentLocation = {
              latitude: lat,
              longitude: lng
            }
          }
        } else {
          currentLocation = {
            latitude: 0,
            longitude: 0
          }
          // dispatch({ type: "SET_SHOW", payload: true })
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
        paginate: 0,
        // page: currentPage,
        // per_page: 9,
      };
      let params = paramsService.fetchParams(searchParams)

      params.category && (payload.category_id = params.category);
      params.order_by ? (payload.order_by = params.order_by) : '';
      params.min_price && (payload.min_price = Number(params.min_price));
      params.max_price && (payload.max_price = Number(params.max_price));
      // params.page && (payload.page = Number(params.page));

      params.filter && (payload.filter = params.filter);
      setIsLoadFilter(true);
      supplierServices
        .getSuppliersByFiltersWithPagination(payload)
        .then((res: any) => {
          const totalPages = res.data.data.suppliers.total
          const currentPage = res.data.data.suppliers.current_page
          const lastPage = res.data.data.suppliers.last_page
          const perPage = res.data.data.suppliers.per_page
          const data = res.data.data.suppliers.data
          setTotalPages(totalPages)
          setPerPage(perPage)
          setLastPage(lastPage)
          if (payload.filter && payload.filter != "") {
            // const filtredList = res.data.data.suppliers.filter((item: any) => item.name.toUpperCase().includes(payload.filter.toUpperCase()));
            const filtredList = data.filter((item: any) => item.name.toUpperCase().includes(payload.filter.toUpperCase()));
            setSearchSuppliersList(filtredList);
          }
          else {

            setSearchSuppliersList(data);

          }
          setIsLoadFilter(false);
        })
        .catch((error) => {
          setIsLoadFilter(false);
        });

    }
  };



  const isEmptySearchParams = (searchParams: any) => {
    const expectedKeys = ['lat', 'lng'];
    let resultObject = paramsService.fetchParams(searchParams)
    const hasUnexpectedKeys = Object.keys(resultObject).some(key => !expectedKeys.includes(key));
    return !hasUnexpectedKeys
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

        <div className="main-content">
          {ads && (
            <div className="main-content__col-ads">
              <FilterAds data={ads} slides={3} />
            </div>
          )}
          <div className="main-content__col-offers">
            <h3 className="main-content__col-offers__title">
              {t('searchPage.todayOffre')}
            </h3>
            <OffersList listType="discount" restaurants={recommanded} />
          </div>
          <div className="main-content__col-offers">
            <h3 className="main-content__col-offers__title">
              {t('recommendedForYou')}
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
              {t('searchPage.mieux')}
            </h3>
            <OffersList listType="recommanded" restaurants={bestRatedSuppliers} />
          </div> : <></>}
          {newSuppliers.length ? <div className="main-content__col-offers">
            <h3 className="main-content__col-offers__title">
              {t('searchPage.created_at')}
            </h3>
            <OffersList listType="recommanded" restaurants={newSuppliers} />
          </div> : <></>}
          <div className="main-content__col-offers">
            <h3 className="main-content__col-offers__title">
              {t('searchPage.popularMarks')}
            </h3>
            <PopularList listType="popular" restaurants={popular} />
          </div>
          {ads3 && (
            <div className="main-content__col-ads">
              <FilterAds data={ads3} slides={2} center={true} arrows={true} />
            </div>
          )}
        </div>

      </>
    );
  };


  // skeletopn compnent
  const SkeletonEffect: React.FC = () => {
    return (
      <>
        <div className="cat-carousel" >

          <Skeleton variant="rectangular" height={189} style={{
            borderRadius: "15px",
            minWidth: '173px'
          }} />
          <Skeleton variant="rectangular" height={189} style={{
            borderRadius: "15px",
            minWidth: '173px'
          }} />
          <Skeleton variant="rectangular" height={189} style={{
            borderRadius: "15px",
            minWidth: '173px'
          }} />
          <Skeleton variant="rectangular" height={189} style={{
            borderRadius: "15px",
            minWidth: '173px'
          }} />
          <Skeleton variant="rectangular" height={189} style={{
            borderRadius: "15px",
            minWidth: '173px'
          }} />
          <Skeleton variant="rectangular" height={189} style={{
            borderRadius: "15px",
            minWidth: '173px'
          }} />
          <Skeleton variant="rectangular" height={189} style={{
            borderRadius: "15px",
            minWidth: '173px'
          }} />
          <Skeleton variant="rectangular" height={189} style={{
            borderRadius: "15px",
            minWidth: '173px'
          }} />
          <Skeleton variant="rectangular" height={189} style={{
            borderRadius: "15px",
            minWidth: '173px'
          }} />
          <Skeleton variant="rectangular" height={189} style={{
            borderRadius: "15px",
            minWidth: '173px'
          }} />
          <Skeleton variant="rectangular" height={189} style={{
            borderRadius: "15px",
            minWidth: '173px'
          }} />



        </div>

        <div className="filter-page-skeleton">

          <SideBar />

          < div className="right-side" >
            <SearchSkeletons />
            <AdsSkeletons />

            <div className="main-content">
              <ProductsSkeletons />
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

  //  init default current page
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    let resultObject = paramsService.fetchParams(searchParams)
    setCurrentPage(Number(resultObject.page))
  }, []);


  const handlePaginationSearch = (event: React.ChangeEvent<unknown>, value: number) => {
    const searchParams = new URLSearchParams(location.search);
    let resultObject = paramsService.fetchParams(searchParams)
    resultObject = {
      ...resultObject,
      page: value.toString(),
    }
    const newCryptedParams = paramsService.handleUriParams(resultObject)
    if (searchParams.has('search')) {
      searchParams.set('search', newCryptedParams)
    } else {
      searchParams.append('search', newCryptedParams)
    }
    const { pathname } = navLocation;
    const newURL = pathname !== '/' ? `${pathname}?${searchParams.toString()}` : `/search/?${searchParams.toString()}`;
    navigate(newURL);
    setCurrentPage(value)
    searchSupplier()
    scrollToTop()
  }

  return (
    <Suspense fallback={
      <SkeletonEffect />
    } >

      <>
        {(!isLoading && pageReadry) ? (
          <>
            <div className="category-bar">
              <FilterCategories onCategorySelect={searchSupplier} />
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
                  </div>
                </Col>
                <Col className="col-9 content__column content__column--second">
                  <div className="content__column__search-bar">
                    <SearchProduit />
                    {hasFilter && !isloadFilter ? <BtnReset></BtnReset> : ""}
                  </div>
                  {(searchSuppliersList?.length && !isloadFilter && hasFilter) || (initialData) ? (
                    <div className='search-list-container'>
                      <div className="row search-list">
                        {searchSuppliersList.map(function (supp: any) {
                          return (
                            <div key={supp.id} className="col-3 search-list__column px-0">
                              <SupplierWhiteCard data={supp} className="mb-32" />
                            </div>
                          );
                        })}
                      </div>
                      <div className='pagination-container'>
                        <Pagination
                          count={lastPage}
                          shape="rounded"
                          // size="small"
                          size="large"
                          showFirstButton
                          showLastButton
                          defaultPage={currentPage}
                          onChange={handlePaginationSearch}
                        />
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  {isloadFilter ? (
                    <>
                      <AdsSkeletons />
                      <div className="main-content">
                        <ProductsSkeletons />
                      </div>
                      <ProductsSkeletons />
                    </>
                  ) : (recommanded.length &&
                    !isloadFilter &&
                    !hasFilter) && (
                    <div>
                      <div>{renderItems()}</div>
                    </div>
                  )}
                  {hasFilter && !isloadFilter && !searchSuppliersList?.length ? (
                    <>
                      <div className="result-not-found">
                        <div className="result-not-found__title">Oups !</div>
                        <div className="result-not-found__text">
                          {t('searchPage.noResult')}
                        </div >
                        <div className="result-not-found__icon"></div>
                      </div >
                    </>
                  ) : (
                    <></>
                  )
                  }
                </Col >
              </Row >
            </div >
            {
              (isConnected) && (

                <div className={'bulles'}>
                  <button className={'messangerPopupBtn'} onClick={handleMessangerPopup} style={{ backgroundImage: `url(${MessangerBtnIcon})` }}>
                    {unReadedQt > 0 && (
                      <div className={'messangerBullNotifIcon'}>
                        {unReadedQt}
                      </div>
                    )}
                  </button>
                </div>
              )
            }
            {
              (isMessagesOpen) &&
              <Messanger className='discuterMessangerPopup' close={handleMessangerPopup} />
            }
          </>
        ) : (
          <SkeletonEffect />

        )}
      </>
    </Suspense >

  );
}

export default FilterPage;
