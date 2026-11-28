export interface PortfolioPositionForm {
    symbol: string;
    quantity: number;
    currentPrice: number;
    targetPercentage: number;
}

export interface PortfolioFormValues {
  positions: PortfolioPositionForm[];
}

export interface TargetAllocation {
    readonly stock: Stock;
    readonly percentage: number;
}

export interface RebalanceAction {
    symbol: string;
    action: RebalanceActionType;
    amount: number;
}

export type RebalanceActionType =
    | "BUY"
    | "SELL"
    | "HOLD";
