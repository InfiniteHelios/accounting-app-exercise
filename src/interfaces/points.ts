export interface ITransaction {
  payer: string;
  points: number;
  remainPoints: number;
  spentPoints: number;
  timestamp: Date;
}

export interface IAddPoints {
  payer: string;
  points: number;
  timestamp: Date;
}

export interface ISpentPoints {
  payer: string;
  points: number;
}
