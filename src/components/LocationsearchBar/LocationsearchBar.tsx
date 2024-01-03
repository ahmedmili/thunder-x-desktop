
import React, { useEffect, useState } from "react";
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
  const [suggestions, setSuggestions] = useState<any>(null);

  const { t } = useTranslation()

  const handleSearch = () => {
    if (suggestions) {
      dispatch({
        type: "SET_LOCATION",
        payload: {
          coords: {
            latitude: suggestions.position[0].lat,
            longitude: suggestions.position[0].long,
            label: suggestions.title,
          },
        },
      });
      // navigate('/search')
    } else {
      dispatch({ type: "SET_SHOW", payload: true })
    }
  }

  return (
    <>
      <div className={searchStyle.searchContainer}>
        <form>

          <AutocompleteInput initLocation={false} returnSuggestions={setSuggestions} />

          <button className={searchStyle.btnHandleSearch} onClick={handleSearch}>
            {t('searchButton')}
          </button>
        </form>
      </div>
    </>
  );
};

export default React.memo(LocationSearchBar);
