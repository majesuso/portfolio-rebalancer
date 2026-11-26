export interface Portfolio {
    positions: PortfolioPosition[];
    targetAllocation: TargetAllocation
}

export interface PortfolioPositionForm {
    symbol: string;
    quantity: number;
    currentPrice: number;
    targetPercentage: number;
}

//////
export class Portfolio {
    readonly portfolioPositions: readonly PortfolioPosition[];
    readonly targetAllocations: readonly TargetAllocation[];

    constructor(positions: PortfolioPosition[], targetAllocations: TargetAllocation[]) {
        this.portfolioPositions = [...positions];
        this.targetAllocations = [...targetAllocations];
    }

    getTotalValue(): number {
        const total = this.portfolioPositions.reduce((total, position) => total + position.getValue(), 0)
        return total
    }

    private validateTargetAllocations(): void {
        const arePercentagesValid = this.targetAllocations.every(
            (target) =>
                Number.isFinite(target.percentage) &&
                target.percentage >= 0 &&
                target.percentage <= 1
        );

        if (!arePercentagesValid) {
            throw new Error('Target allocations must be between 0 and 1')
        }

        const totalAllocation = this.targetAllocations.reduce((acc, allocation) => acc + allocation.percentage, 0)
        const tolerance = 1e-9;
        const isTotalValid = Math.abs(totalAllocation - 1) < tolerance;

        if (!isTotalValid) {
            throw new Error('Target allocations must add up to 1')
        }
    }

    private validateUniqueSymbols(): void {
        // Validate portfolio positions
        const positionSymbols = this.portfolioPositions.map((position) => position.stock.symbol)
        const uniquePositionSymbols = new Set<string>(positionSymbols)
        if (positionSymbols.length !== uniquePositionSymbols.size) {
            throw new Error('Portfolio positions must have unique stock symbols')
        }
        // Validate target allocations
        const allocationSymbols = this.targetAllocations.map((allocation) => allocation.stock.symbol)
        const uniqueAllocationSymbols = new Set<string>(allocationSymbols)

        if (allocationSymbols.length !== uniqueAllocationSymbols.size) {
            throw new Error('Target allocations must have unique stock symbols')
        }
    }

    rebalance(): RebalanceAction[] {
        this.validateUniqueSymbols()
        this.validateTargetAllocations()

        const totalValue = this.getTotalValue();
        const targetPercentages = new Map<string, number>();
        const currentValues = new Map<string, number>();


        this.portfolioPositions.forEach((position) => {
            currentValues.set(
                position.stock.symbol,
                position.getValue()
            );
        })

        this.targetAllocations.forEach((allocation) => {
            targetPercentages.set(
                allocation.stock.symbol,
                allocation.percentage
            );
        })

        const allStockSymbols = new Set<string>([
            ...currentValues.keys(),
            ...targetPercentages.keys()
        ]);

        const allocationData = [...allStockSymbols].map((symbol) => {

            return {
                symbol,
                percentage: targetPercentages.get(symbol) ?? 0,
                currentValue: currentValues.get(symbol) ?? 0,
            }
        })

        const rebalanceActions = allocationData.map<RebalanceAction>((item) => {
            const targetValue = totalValue * item.percentage
            const difference = targetValue - item.currentValue
            const monetaryTolerance = 0.01;
            const isBalanced = Math.abs(difference) < monetaryTolerance;
            if (isBalanced) {
                return ({
                    symbol: item.symbol,
                    action: 'HOLD',
                    amount: 0
                })
            }

            return ({
                symbol: item.symbol,
                action: difference > 0 ? 'BUY' : 'SELL',
                amount: Math.abs(difference)
            })
        })
        return rebalanceActions
    }
}

export class Stock {
    readonly symbol: string;
    private readonly currentPrice: number;

    constructor(symbol: string, currentPrice: number) {
        const normalizedSymbol = symbol.trim().toUpperCase();

        if (normalizedSymbol.length === 0) {
            throw new Error('Stock symbol must not be empty');
        }

        if (!Number.isFinite(currentPrice) || currentPrice <= 0) {
            throw new Error('Stock price is invalid');
        }

        this.symbol = normalizedSymbol;
        this.currentPrice = currentPrice;
    }

    getCurrentPrice(): number {
        return this.currentPrice
    }
}

export class PortfolioPosition {
    readonly stock: Stock;
    private readonly quantity: number;

    constructor(stock: Stock, quantity: number) {
        if (!Number.isFinite(quantity) || quantity < 0) {
            throw new Error('Quantity is invalid');
        }

        this.stock = stock;
        this.quantity = quantity;
    }

    getValue(): number {
        return this.stock.getCurrentPrice() * this.quantity;
    }
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
