import type { PortfolioPositionForm } from "./types";

export const INITIAL_POSITIONS: PortfolioPositionForm[] = [
    {
        symbol: "META",
        quantity: 3,
        currentPrice: 200,
        targetPercentage: 40,
    },
    {
        symbol: "AAPL",
        quantity: 4,
        currentPrice: 150,
        targetPercentage: 60,
    }
]
