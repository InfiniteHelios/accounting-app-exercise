import { check, ValidationChain } from "express-validator";

export const addPointsValidator = (): ValidationChain[] => [
  check("payer")
    .trim()
    .notEmpty()
    .withMessage("payer is required")
    .isString()
    .withMessage("payer must be string"),
  check("points")
    .notEmpty()
    .withMessage("points is required")
    .isNumeric()
    .toInt()
    .withMessage("points must be numeric"),
  check("timestamp")
    .notEmpty()
    .withMessage("timestamp is required")
    .isISO8601()
    .toDate()
    .withMessage("timestamp must be ISO format datetime"),
];

export const spendPointsValidator = (): ValidationChain[] => [
  check("points")
    .notEmpty()
    .withMessage("points is required")
    .isNumeric()
    .toInt()
    .withMessage("points must be numeric")
    .custom((val: number) => val > 0)
    .withMessage("points must be positive"),
];
