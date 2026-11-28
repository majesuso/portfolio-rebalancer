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
