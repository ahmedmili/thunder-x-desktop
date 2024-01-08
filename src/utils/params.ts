import { cryptoData } from "./cyrupto";
import { arrayToObject } from "./utils";

const handleUriParams = (data: any): string => {
    const searchParams = new URLSearchParams(location.search);
    data.order_by && searchParams.set('order', data.order_by);
    data.category && searchParams.set('category', data.category);
    data.min_price && searchParams.set('min_price', data.min_price);
    data.max_price && searchParams.set('max_price', data.max_price);
    data.filter && searchParams.set('filter', data.filter);
    data.lat && searchParams.set('lat', data.lat);
    data.lng && searchParams.set('lng', data.lng);
    searchParams.has('search') && searchParams.delete('search');
    const cryptedParams = cryptoData.hashData(searchParams.toString());
    return cryptedParams;
}

const clearSearchParams = (searchParams: URLSearchParams): void => {
    searchParams.forEach((value, key) => {
        searchParams.delete(key);
    });
};

const fetchParams = (searchParam: URLSearchParams): Record<string, string> => {
    let searchParams = searchParam.get('search')
    let realDataString = cryptoData.unHashData(`${searchParams}`)
    let dataTable = realDataString.replaceAll('=', ":").split("&")
    let resultObject: Record<string, string> = arrayToObject(dataTable);
    return resultObject
}

export const paramsService = {
    handleUriParams,
    clearSearchParams,
    fetchParams,
}
