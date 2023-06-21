import {Router} from "express";

export interface ExpressController {
    readonly path: string;
    buildRoutes(): Router;
}