import axios, { AxiosResponse } from 'axios';
import { Reservation, Timetable } from '../interfaces';

export class RoomService {

    constructor() {
    }

    async get (url: string): Promise<AxiosResponse> {
        const response = await axios.get(url);
        return response.data;
    };
    
    async apiFetch(date: string, resourceId: number): Promise<any> {
        try {
            const reservations = await this.get(`http://localhost:8080/reservations?date=${date}&resourceId=${resourceId}`);
            //console.log(reservations);
            const openingTime = await this.get(`http://localhost:8080/timetables?date=${date}&resourceId=${resourceId}`);
            //console.log(openingTime);
        
            const newData = { ...reservations, ...openingTime };
            return newData;
        } catch (error : unknown) {
            return null;
        }
    };

    async isRoomAvailable(date: string, resourceId: number): Promise<any> {
        try {
            const { reservations, timetables } = await this.apiFetch(date.split("T")[0], resourceId);

            // Parse the requested date
            const requestedDate = new Date(date);

            // Check if the resource is open at the requested time
            const isOpen = timetables.some(({ opening, closing }: Timetable) => {
                const openingDate = new Date(opening);
                const closingDate = new Date(closing);
                return requestedDate >= openingDate && requestedDate <= closingDate;
            });

            if (!isOpen) {
                return false;
            }

            // Check if there is a reservation at the requested time
            const isReserved = reservations.some(({ reservationStart, reservationEnd }: Reservation) => {
                const reservationStartDate = new Date(reservationStart);
                const reservationEndDate = new Date(reservationEnd);
                return requestedDate >= reservationStartDate && requestedDate <= reservationEndDate;
            });

            if (isReserved) {
                return false;
            }

            return true;
        } catch (error : unknown) {
            return null;
        }
    };
     

}