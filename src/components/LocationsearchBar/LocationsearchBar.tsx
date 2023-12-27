
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../Redux/store";
import AutocompleteInput from "../Location/AutocompleteInput/AutocompleteInput";
import searchStyle from "./locationSearchBar.module.scss";

interface Props {
  placeholder: string;
}

const LocationSearchBar: React.FC<Props> = ({ placeholder }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userLocation = useAppSelector((state) => state.location.position)

  const { t } = useTranslation()

  const handleSearch = () => {
    if (userLocation) {
      navigate('/search')
    } else {
      dispatch({ type: "SET_SHOW", payload: true })
    }
  }
  return (
    <>
      <div className={searchStyle.searchContainer}>
        <form >

          <AutocompleteInput initLocation={false} />

          <button className={searchStyle.btnHandleSearch} onClick={handleSearch}>
            {t('searchButton')}
          </button>
        </form>
      </div>
    </>
  );
};

export default React.memo(LocationSearchBar);
