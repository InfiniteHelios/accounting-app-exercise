import { Router } from "express";
import { PointsRoutes } from "./points.route";

const router: Router = Router();

router.use("/points", PointsRoutes);

export const MainRouter: Router = router;
