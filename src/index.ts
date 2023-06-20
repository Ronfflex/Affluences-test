import express from "express";
import moment from "moment";

const app = express();
const port = 3000;
const VALID_RESOURCE_ID = 1337;


/*
*
*
*
*/

app.get("/reservations", (req, res) => {
    var date : any = req.query.date;
    var resourceId : any = req.query.resourceId;

    if (!moment(date, moment.ISO_8601, true).isValid()) {
        res.status(400).json({ "error": "wrong format for param startDatetime" });
        return;
    }
    if (resourceId != 1337) {
        res.status(404).json({ "error": "resource not found" });
        return;
    }

    if (moment().isSame(moment(date), 'day')) {
        res.json({ "reservations": [
                { "reservationStart": moment().set({ 'hour': 8, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss"), "reservationEnd": moment().set({ 'hour': 9, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss") },
                { "reservationStart": moment().set({ 'hour': 10, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss"), "reservationEnd": moment().set({ 'hour': 11, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss") },
                { "reservationStart": moment().set({ 'hour': 15, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss"), "reservationEnd": moment().set({ 'hour': 16, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss") }
            ] });
    }
    else {
        res.json({ "reservations": null });
    }
});

app.get("/timetables", (req, res) => {
    var date : any = req.query.date;
    var resourceId : any = req.query.resourceId;

    if (!moment(date, moment.ISO_8601, true).isValid()) {
        res.status(400).json({ "error": "wrong format for param startDatetime" });
        return;
    }
    if (resourceId != 1337) {
        res.status(404).json({ "error": "resource not found" });
        return;
    }

    if (moment().isSame(moment(date), 'day')) {
        res.json({ "open": true,
            "timetables": [
                { "opening": moment().set({ 'hour': 8, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss"), "closing": moment().set({ 'hour': 12, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss") },
                { "opening": moment().set({ 'hour': 14, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss"), "closing": moment().set({ 'hour': 18, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss") }
            ] });
    }
    else {
        res.json({ "open": false, timetables: null });
    }
});


/*
*
*
*
*/


app.get("/availability", (req, res) => {
    var date : any = req.query.date;
    var resourceId : any = req.query.resourceId;

    if (typeof date !== 'string' || !moment(date, moment.ISO_8601, true).isValid()) {
        res.status(422).json({ "error": "Invalid or missing date parameter" });
        return;
    }
    if (typeof resourceId !== 'string' || parseInt(resourceId) !== VALID_RESOURCE_ID) {
        res.status(404).json({ "error": "resource not found" });
        return;
    }

    if (moment().isSame(moment(date), 'day')) {
        const reservations = [
            { "reservationStart": moment().set({ 'hour': 8, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss"), "reservationEnd": moment().set({ 'hour': 9, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss") },
            { "reservationStart": moment().set({ 'hour': 10, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss"), "reservationEnd": moment().set({ 'hour': 11, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss") },
            { "reservationStart": moment().set({ 'hour': 15, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss"), "reservationEnd": moment().set({ 'hour': 16, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss") }
        ];

        const timetables = [
            { "opening": moment().set({ 'hour': 8, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss"), "closing": moment().set({ 'hour': 12, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss") },
            { "opening": moment().set({ 'hour': 14, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss"), "closing": moment().set({ 'hour': 18, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss") }
        ];

        const availability = checkAvailability(date, reservations, timetables);
        
        res.json({ "available": availability });
    }
    else {
        res.json({ "available": false });
    }
});


function checkAvailability(date: string, reservations: any[], timetables: any[]): boolean {
    let isAvailable = false;

    const dateMoment = moment(date);
    
    for (const timetable of timetables) {
        const openingMoment = moment(timetable.opening);
        const closingMoment = moment(timetable.closing);
        
        if (dateMoment.isBetween(openingMoment, closingMoment)) {
            isAvailable = true;
            
            for (const reservation of reservations) {
                const reservationStartMoment = moment(reservation.reservationStart);
                const reservationEndMoment = moment(reservation.reservationEnd);
                
                if (dateMoment.isBetween(reservationStartMoment, reservationEndMoment)) {
                    return false;
                }
            }
        }
    }

    return isAvailable;
}

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});