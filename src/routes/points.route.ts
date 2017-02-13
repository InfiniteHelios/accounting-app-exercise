import { NextFunction, Request, Response, Router } from "express";
import {
  addPointsValidator,
  spendPointsValidator,
} from "../validators/points.validator";
import PointsController from "../controllers/points.controller";

const router: Router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) =>
  PointsController.GetBalance(req, res, next)
);

// add points
router.post(
  "/",
  addPointsValidator(),
  (req: Request, res: Response, next: NextFunction) =>
    PointsController.AddPoint(req, res, next)
);

router.delete(
  "/",
  spendPointsValidator(),
  (req: Request, res: Response, next: NextFunction) =>
    PointsController.SpendPoint(req, res, next)
);

export const PointsRoutes: Router = router;
