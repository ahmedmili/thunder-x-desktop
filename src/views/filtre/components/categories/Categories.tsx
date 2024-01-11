import { useEffect, useRef, useState } from "react";
import "./categories.scss";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../../../Redux/store';
import { homeRefresh, setRefresh } from "../../../../Redux/slices/home";
import { useSelector } from "react-redux";
import { paramsService } from "../../../../utils/params";
import { useTranslation } from "react-i18next";
interface FilterCategoriesProps {
  onCategorySelect: () => void;
  ssrCategories?: any;
}
const Categories: React.FC<FilterCategoriesProps> = ({
  onCategorySelect,
  ssrCategories,
}) => {
  const [active, setActive] = useState("");
  const [collpased, setCollapse] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef: any = useRef(null);
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState();
  const dispatch = useAppDispatch();
  const refresh = useSelector(homeRefresh)
  const { t } = useTranslation()
  
  useEffect(() => {
    if (refresh) {
      checkSelectedCategory()
    }
  }, [refresh]);

  var cats = ssrCategories
    ? ssrCategories
    : useAppSelector((state) => state.home.data.categories);
  const [datas, setData]: any = useState();

  useEffect(() => {
    setContentHeight(contentRef?.current?.scrollHeight);
    setTimeout(() => {
      setContentHeight(contentRef?.current?.scrollHeight);
    }, 300);
  }, [collpased, datas]);

  useEffect(() => {
    if (cats && cats?.length > 0) {
      let all: any = cats.filter(
        (category: any) => category.description !== "Promo"
      );
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.has("search")) {
        let params = paramsService.fetchParams(searchParams)

        if (params.category) {
          const categoryId: any = parseInt(
            params.category as string
          );
          all = all.map((item: any) => ({
            ...item,
            show:
              item.id == categoryId ||
                item.children.find((c: any) => c.id == categoryId)
                ? true
                : false,
          }));
        }
      }
      setData(all);
    }
  }, [cats]);

  useEffect(() => {
    if (!loaded && datas?.length) {
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.has("search")) {
        let params = paramsService.fetchParams(searchParams)
        if (params.category) {
          const categoryId: any = parseInt(
            params.category as string
          );
          setSelected(categoryId);
        }
        setLoaded(true);
      }
    }
  }, [datas]);

  const checkSelectedCategory = () => {
    const searchParams = new URLSearchParams(location.search);
    let params = paramsService.fetchParams(searchParams)

    const cat: any = params.category;
    if (Number(selected) !== Number(cat)) {
      setSelected(Number(cat) as any);
      let all: any = cats.filter(
        (category: any) => category.description !== "Promo"
      );
      all = all.map((item: any) => ({
        ...item,
        show:
          Number(item.id) == Number(cat) ||
            item.children.find((c: any) => Number(c.id) == Number(cat))
            ? true
            : false,
      }));
      setData(all);
    }
  }

  const toggleCategorie = (event: any, index: any) => {
    setData((prevData: any) => {
      const newData: any = [];
      prevData.map((item: any, i: any) => {
        let newVal;
        if (i == index) {
          newVal = {
            ...item,
            show: !item.show,
          };
        } else {
          newVal = {
            ...item,
          };
        }
        newData.push(newVal);
      });
      return newData;
    });
  };
  const toggleCollapse = () => {
    setCollapse(!collpased);
  };
  const handleRadioChange = (categoryId: any) => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has("search")) {
      let params = paramsService.fetchParams(searchParams)
      params = {
        ...params,
        category: categoryId
      }
      let newParams = paramsService.handleUriParams(params)
      searchParams.has('search') ? searchParams.set("search", newParams) : searchParams.append('search', newParams);

      navigate(`/search/?${searchParams.toString()}`, {
        replace: false,
      });
    }
    navigate(`/search/?${searchParams.toString()}`, {
      replace: false,
    });
    setSelected(categoryId);
    dispatch(setRefresh(true));
  };
  if (datas?.length) {
    return (
      <div className="categories-filter-container">
        <h1
          className={`categories-filter-container__title  ${collpased ? "collapsed" : ""
            }`}
        >
          {t('searchPage.Categories')}
        </h1>
        <ChevronRightIcon
          className={`categories-filter-container__collapse-icon  ${collpased ? "close" : "open"
            }`}
          onClick={toggleCollapse}
        ></ChevronRightIcon>
        <ul
          className={`categories-filter-container__list  ${collpased ? "hide" : "show"
            }`}
          ref={contentRef}
          style={{ maxHeight: collpased ? "0px" : `${contentHeight}px` }}
        >
          {datas?.map((data: any, index: any) => {
            return (
              <li key={index} className="categories-filter-container__list__item">
                <div className="form-check">
                  <input
                    className="radio-btn test"
                    type="radio"
                    name="categorie"
                    id={`category-check-${index}`}
                    onChange={() => handleRadioChange(data.id)}
                    checked={selected === data.id}
                  />
                  <label
                    className={`form-label`}
                    htmlFor={`category-check-${index}`}
                  >
                    {data.name}
                  </label>
                  {data.children?.length ? (
                    <ChevronRightIcon
                      className={`toggle-icon  ${data.show == true ? "open" : "close"
                        }`}
                      onClick={() => toggleCategorie(event, index)}
                    ></ChevronRightIcon>
                  ) : ''}
                </div>
                {data.children?.length ? (
                  <ul
                    className={`categories-filter-container__list categories-filter-container__list--sub ${data.show ? "show" : "hide"
                      }`}
                    style={{
                      height: `${data.show ? data?.children?.length * 39 : 0}px`,
                    }}
                  >
                    {data.children?.map((c: any, i: any) => {
                      return (
                        <li
                          key={index + "-" + i}
                          className="categories-filter-container__list__item categories-filter-container__list__item--sub"
                        >
                          <div className="form-check">
                            <input
                              className="radio-btn"
                              type="radio"
                              name="categorie"
                              id={`child-${index}-${i}`}
                              onChange={() => handleRadioChange(c.id)}
                              checked={selected === c.id}
                            />
                            <label
                              className={`form-label`}
                              htmlFor={`child-${index}-${i}`}
                            >
                              {c.name}
                            </label>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : ''}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  else {
    return ("")
  }
};

export default Categories;
