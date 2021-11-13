import { NextFunction, Request, Response } from "express";
import { resultsValidator } from "../validators";
import { IAddPoints, ISpentPoints, ITransaction } from "../interfaces/points";

export default class PointsController {
  private static transactions: ITransaction[] = [];

  public static async AddPoint(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // validation
      const errors = resultsValidator(req);
      if (errors.length > 0)
        return res.status(400).json({
          method: req.method,
          status: res.statusCode,
          error: errors,
        });

      const addPoints: IAddPoints = req.body;
      const newTrans: ITransaction = {
        ...addPoints,
        remainPoints: addPoints.points,
        spentPoints: 0,
      };
      this.transactions.push(newTrans);
      // sort by timestamp
      this.transactions.sort(
        (prev, next) => prev.timestamp.getTime() - next.timestamp.getTime()
      );
      return res.json({ trans: this.transactions });
    } catch (error) {
      return res.json({ error });
    }
  }

  public static async SpendPoint(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // validation
      const errors = resultsValidator(req);
      if (errors.length > 0)
        return res.status(400).json({
          method: req.method,
          status: res.statusCode,
          error: errors,
        });

      let points: number = parseInt(<string>req.query.points);

      // validate current transactions
      if (this.transactions.length == 0)
        return res.json({ succeed: false, message: "No transactions" });

      // summerize because of negative points
      await this.Summerize();

      // spend points
      const result: ISpentPoints[] = [];
      for (let i = 0; i < this.transactions.length; i++) {
        const trans = this.transactions[i];
        if (trans.remainPoints > 0) {
          const min = Math.min(trans.remainPoints, points);
          result.push({ payer: trans.payer, points: -min });
          trans.remainPoints -= min;
          points -= min;
          if (points == 0) break;
        }
      }
      if (points > 0)
        return res.json({
          succeed: false,
          message: `Required points is greater than total points. So only spent ${
            parseInt(<string>req.query.points) - points
          }`,
        });
      return res.json(result);
    } catch (error) {
      return res.json({ error });
    }
  }

  public static async GetBalance(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result: any = {};
      // group by payer and sum remain points
      this.transactions.reduce((sum, trans) => {
        sum[trans.payer] = sum.hasOwnProperty(trans.payer)
          ? sum[trans.payer] + trans.remainPoints
          : trans.remainPoints;
        return sum;
      }, result);
      return res.json(result);
    } catch (error) {
      return res.json({ error });
    }
  }

  private static async Summerize() {
    const result: ITransaction[] = [];
    this.transactions.reduce((result, trans) => {
      if (trans.remainPoints > 0) result.push(trans);
      else {
        trans.remainPoints = -trans.remainPoints;
        for (let i = 0; i < result.length - 1; i++)
          if (result[i].payer === trans.payer && result[i].remainPoints > 0) {
            const min = Math.min(result[i].remainPoints, trans.remainPoints);
            result[i].remainPoints -= min;
            trans.remainPoints -= min;
            if (trans.remainPoints == 0) break;
          }
      }
      return result;
    }, result);
    this.transactions = result;
  }
}
