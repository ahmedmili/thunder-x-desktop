import pointInPolygon from "point-in-polygon";
import { localStorageService } from "../services/localStorageService";
import { format } from "date-fns";



export const scrollToTop = () => {
    // Check if the scroll position is not at the top
    if (window.scrollY > 0) {
        // Scroll to the top with smooth behavior
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

export function parseCoordinates(coordinates: any): Array<any> {
    try {
        const result = [];
        for (const coord of coordinates) {
            if (coord.lat && coord.lng) {
                result.push([parseFloat(coord.lat), parseFloat(coord.lng)]);
            }
        }
        return result;
    } catch (error) {
        console.error("Error parsing coordinates:", error);
        return [];
    }
}

export const isInsideRegions = (coupons: any[], lat: number, lng: number): any[] => {
    return coupons.filter((coupon) => {
        if (coupon.regionsPromo.length === 0) {
            return true;
        } else {
            return coupon.regionsPromo.some((region: any) => {
                const polygonCoordinates = parseCoordinates(region.point);
                const coordsInPolygon = pointInPolygon([lat, lng], polygonCoordinates)
                return coordsInPolygon;
            });
        }
    });
}

export const checkSsr = (): boolean => {
    let isSsr = typeof window === undefined;
    return isSsr
}

export const arrayToObject = (array: string[]): Record<string, string> => {
    const resultObject: Record<string, string> = {};
    array.forEach((item: string) => {
        const [key, value] = item.split(':');
        resultObject[key] = value;
    });
    return resultObject
}

export const formatDate = (date: Date): string => {
    if (date) {
        const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const name = days[date.getDay()];
        const str = format(date, "dd/MM 'à' HH:mm");
        return 'le ' + name + ' ' + str
    }
    return ''
}

export const getHoursAndMinutes = (time: string) => {
    const [hours, minutes] = time.split(':');
    return { hours: parseInt(hours, 10), minutes: parseInt(minutes, 10) };
  };



