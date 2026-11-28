import { describe, it, expect } from 'vitest';
import { PortfolioPosition } from '../src/types/PortfolioPosition';
import { Stock } from '../src/types/Stock';

describe('PortfolioPosition', () => {

    it.each([
        [10, 2000],
        [0.5, 100],
        [0, 0]
    ])(
        'should calculate the position value for quantity %s: %s',
        (quantity, expectedValue) => {
            const stock = new Stock('META', 200);
            const position = new PortfolioPosition(stock, quantity);

            const value = position.getValue();

            expect(value).toBe(expectedValue);
        });

    it.each([-200, NaN, Infinity])(
        'should reject an invalid quantity: %s',
        (quantity) => {
            const stock = new Stock('META', 200);
            expect(() => new PortfolioPosition(stock, quantity))
                .toThrow('Quantity is invalid');
        }
    );
});
