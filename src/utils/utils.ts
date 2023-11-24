import pointInPolygon from "point-in-polygon";



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
        }
        return coupon.regionsPromo.some((region: any) => {
            const polygonCoordinates = parseCoordinates(region.point);
            return pointInPolygon([lat, lng], polygonCoordinates);
        });
    });
}