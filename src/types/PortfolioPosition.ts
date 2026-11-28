import type { Stock } from "./Stock";

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
