import React from 'react'
import { localStorageService } from './localStorageService';

export const distance = (lat1: number, lon1: number) => {

        let location = JSON.parse(localStorageService.getCurrentLocation()!);
        let ClientLat = location.coords.latitude
        let clinetLong = location.coords.longitude
    
        const radlat1 = Math.PI * lat1 / 180;
        const radlat2 = Math.PI * ClientLat / 180;
        const theta = lon1 - ClientLat;
        const radtheta = Math.PI * theta / 180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 60 * 1.1515;
        // if (unit == 'km') {
        dist = dist * 1.609344;
        // } elseif (unit == 'm') {
        //   dist = dist * 1609.344;
        // }
        return dist;
      
}
