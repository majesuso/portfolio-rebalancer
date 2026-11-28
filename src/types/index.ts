import type { TargetAllocation } from "./Portfolio";
import type { PortfolioPosition } from "./PortfolioPosition";

export interface Portfolio {
    positions: PortfolioPosition[];
    targetAllocation: TargetAllocation;
}

export interface PortfolioPositionForm {
    symbol: string;
    quantity: number;
    currentPrice: number;
    targetPercentage: number;
}

