import { ExpressController } from "./controller.interface";
import { RoomService } from "../services";
import { Request, Response, Router } from "express";
import * as express from "express";

export class RoomController implements ExpressController {

    readonly path: string;
    readonly roomService: RoomService;

    constructor() {
        this.path = "/available";
        this.roomService = new RoomService();
    }


    async isAvailable(req: Request, res: Response): Promise<void> {
        // Check if the query parameters are present
        if (!req.query.date || !req.query.resourceId) {
            res.status(400).send("Missing query parameters");
            return;
        }

        // Check if the query parameters are valid
        if (typeof req.query.date !== "string" || isNaN(Number(req.query.resourceId))) {
            res.status(400).send("Invalid query parameters");
            return;
        }

        // Check if date as date and hour
        if (req.query.date.split("T").length !== 2) {
            res.status(400).send("Invalid date");
            return;
        }

        
        const date = req.query.date as string;
        const resourceId = Number(req.query.resourceId);
        // console.log(date, resourceId);

        const isAvailable = await this.roomService.isRoomAvailable(date, resourceId);
        res.json({ isAvailable });
    }



    buildRoutes(): Router {
        const router = express.Router();
        router.get('/', this.isAvailable.bind(this));
        return router;
    }

}