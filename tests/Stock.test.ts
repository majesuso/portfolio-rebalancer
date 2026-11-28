import { describe, it, expect } from 'vitest';
import { Stock } from '../src/types/Stock';

describe('Stock', () => {
    // current price tests
    it('should return the current price', () => {
        const stock = new Stock('META', 200);
        const currentPrice = stock.getCurrentPrice();
        expect(currentPrice).toBe(200);
    });

    it.each([-200, 0, NaN, Infinity])(
        'should reject an invalid current price: %s',
        (price) => {
            expect(() => new Stock('META', price))
                .toThrow('Stock price is invalid');
        }
    );

    // symbol tests
    it('should normalize the stock symbol', () => {
        const stock = new Stock(' meta ', 200);
        const currentSymbol = stock.symbol;
        expect(currentSymbol).toBe('META');
    });

    it.each(['', '   '])(
        'should reject an invalid stock symbol: %s',
        (symbol) => {
            expect(() => new Stock(symbol, 200))
                .toThrow('Stock symbol must not be empty');
        }
    );
});
