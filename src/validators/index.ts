import { Request } from "express";
import { validationResult } from "express-validator";

export const resultsValidator = (req: Request) => {
  const messages = [];
  if (!validationResult(req).isEmpty()) {
    const errors = validationResult(req).array();
    for (const i of errors) messages.push(i);
  }
  return messages;
};
