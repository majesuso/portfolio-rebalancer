import { describe, it, expect } from 'vitest';
import { Portfolio } from '../src/types/Portfolio';
import { PortfolioPosition } from '../src/types/PortfolioPosition';
import { Stock } from '../src/types/Stock';

describe('Portfolio', () => {

    describe('getTotalValue', () => {
        it('should calculate the total portfolio value', () => {
            const meta = new Stock('META', 200);
            const apple = new Stock('AAPL', 150);
            const positions = [
                new PortfolioPosition(meta, 3),
                new PortfolioPosition(apple, 4)
            ];
            const portfolio = new Portfolio(positions, []);
            const totalValue = portfolio.getTotalValue();
            expect(totalValue).toBe(200 * 3 + 150 * 4);
        });

        it('should handle an empty portfolio', () => {
            const portfolio = new Portfolio([], []);
            const totalValue = portfolio.getTotalValue();
            expect(totalValue).toBe(0);
        });

    });

    describe('rebalance', () => {
        it('should generate buy and sell actions to rebalance the portfolio', () => {
            const meta = new Stock('META', 200);
            const apple = new Stock('AAPL', 150);

            const positions = [
                new PortfolioPosition(meta, 3),
                new PortfolioPosition(apple, 4)
            ];

            const targetAllocations = [
                { stock: meta, percentage: 0.4 },
                { stock: apple, percentage: 0.6 }
            ];

            const portfolio = new Portfolio(positions, targetAllocations);

            const actions = portfolio.rebalance();

            expect(actions).toEqual([
                { symbol: 'META', action: 'SELL', amount: 120 },
                { symbol: 'AAPL', action: 'BUY', amount: 120 }
            ]);
        });

        it('should hold stocks when the portfolio is already balanced', () => {
            const meta = new Stock('META', 200);
            const apple = new Stock('AAPL', 150);

            const positions = [
                new PortfolioPosition(meta, 3),
                new PortfolioPosition(apple, 4)
            ];

            const targetAllocations = [
                { stock: meta, percentage: 0.5 },
                { stock: apple, percentage: 0.5 }
            ];

            const portfolio = new Portfolio(positions, targetAllocations);

            const actions = portfolio.rebalance();

            expect(actions).toEqual([
                { symbol: 'META', action: 'HOLD', amount: 0 },
                { symbol: 'AAPL', action: 'HOLD', amount: 0 }
            ]);

        });

        it('should generate a buy action for a stock not currently held', () => {
            const meta = new Stock('META', 200);
            const aapl = new Stock('AAPL', 150);
            const nvda = new Stock('NVDA', 100);

            const positions = [
                new PortfolioPosition(meta, 3),
                new PortfolioPosition(aapl, 4)
            ];

            const targetAllocations = [
                { stock: meta, percentage: 0.4 },
                { stock: aapl, percentage: 0.3 },
                { stock: nvda, percentage: 0.3 }
            ];

            const portfolio = new Portfolio(positions, targetAllocations);

            const actions = portfolio.rebalance();

            expect(actions).toEqual([
                { symbol: 'META', action: 'SELL', amount: 120 },
                { symbol: 'AAPL', action: 'SELL', amount: 240 },
                { symbol: 'NVDA', action: 'BUY', amount: 360 }
            ]);
        });

        it('should sell stocks that are not included in the target allocations', () => {
            const meta = new Stock('META', 200);
            const apple = new Stock('AAPL', 150);

            const positions = [
                new PortfolioPosition(meta, 3),
                new PortfolioPosition(apple, 4)
            ];

            const targetAllocations = [
                { stock: apple, percentage: 1 }
            ];

            const portfolio = new Portfolio(positions, targetAllocations);

            const actions = portfolio.rebalance();

            expect(actions).toEqual([
                { symbol: 'META', action: 'SELL', amount: 600 },
                { symbol: 'AAPL', action: 'BUY', amount: 600 },
            ]);
        });
    });

    describe('validation', () => {
        it.each([-1, 1.1, NaN, Infinity])(
            'should reject an invalid percentage: %s',
            (percentage) => {
                const meta = new Stock('META', 200);
                const targetAllocations = [{ stock: meta, percentage }];
                const portfolio = new Portfolio([], targetAllocations);

                expect(() => portfolio.rebalance()).toThrow('Target allocations must be between 0 and 1');
            }
        );

        it.each([
            [0.4, 0.4],
            [0.6, 0.6],
            [0, 0]
        ])(
            'should reject allocations that do not add up to 1: %s and %s',
            (metaPercentage, aaplPercentage) => {
                // Arrange
                const meta = new Stock('META', 200);
                const apple = new Stock('AAPL', 150);
                const targetAllocations = [
                    { stock: meta, percentage: metaPercentage },
                    { stock: apple, percentage: aaplPercentage }
                ];
                const portfolio = new Portfolio([], targetAllocations);

                expect(() => portfolio.rebalance()).toThrow('Target allocations must add up to 1');

            }
        );

        it('should reject duplicate stocks in the portfolio positions', () => {
            const meta = new Stock('META', 200);
            const meta2 = new Stock('META', 150);

            const positions = [
                new PortfolioPosition(meta, 3),
                new PortfolioPosition(meta2, 4)
            ];

            const targetAllocations = [{ stock: meta, percentage: 1 }];
            const portfolio = new Portfolio(positions, targetAllocations);

            expect(() => portfolio.rebalance()).toThrow('Portfolio positions must have unique stock symbols');
        });

        it('should reject duplicate stocks in the target allocations', () => {
            const meta = new Stock('META', 200);
            const meta2 = new Stock('META', 150);

            const targetAllocations = [
                { stock: meta, percentage: 0.5 },
                { stock: meta2, percentage: 0.5 }
            ];

            const portfolio = new Portfolio([], targetAllocations);

            expect(() => portfolio.rebalance()).toThrow('Target allocations must have unique stock symbols');
        });
    });

    describe('monetary tolerance', () => {
        it('should hold stocks when the difference is below the monetary tolerance', () => {
            const meta = new Stock('META', 100);
            const apple = new Stock('AAPL', 100);

            const positions = [
                new PortfolioPosition(meta, 0.49995),
                new PortfolioPosition(apple, 0.50005)
            ];

            const targetAllocations = [
                { stock: meta, percentage: 0.5 },
                { stock: apple, percentage: 0.5 }
            ];

            const portfolio = new Portfolio(positions, targetAllocations);
            const actions = portfolio.rebalance();
            expect(actions).toEqual([
                { symbol: 'META', action: 'HOLD', amount: 0 },
                { symbol: 'AAPL', action: 'HOLD', amount: 0 }
            ]);
        });

        it('should generate trades when the difference exceeds the monetary tolerance', () => {
            const meta = new Stock('META', 100);
            const apple = new Stock('AAPL', 100);

            const positions = [
                new PortfolioPosition(meta, 0.4998),
                new PortfolioPosition(apple, 0.5002)
            ];

            const targetAllocations = [
                { stock: meta, percentage: 0.5 },
                { stock: apple, percentage: 0.5 }
            ];

            const portfolio = new Portfolio(positions, targetAllocations);
            const actions = portfolio.rebalance();

            expect(actions).toHaveLength(2);

            expect(actions[0].amount).toBeCloseTo(0.02, 10);
            expect(actions[0].symbol).toBe('META');
            expect(actions[0].action).toBe('BUY');

            expect(actions[1].amount).toBeCloseTo(0.02, 10);
            expect(actions[1].symbol).toBe('AAPL');
            expect(actions[1].action).toBe('SELL');
        });
        it('should generate trades when the difference equals the monetary tolerance', () => {

            const meta = new Stock('META', 0.01);
            const apple = new Stock('AAPL', 100);

            const positions = [
                new PortfolioPosition(meta, 1),
                new PortfolioPosition(apple, 0)
            ];

            const targetAllocations = [
                { stock: meta, percentage: 0 },
                { stock: apple, percentage: 1 }
            ];

            const portfolio = new Portfolio(positions, targetAllocations);
            const actions = portfolio.rebalance();

            expect(actions).toHaveLength(2);
            expect(actions[0].symbol).toBe('META');
            expect(actions[0].action).toBe('SELL');
            expect(actions[0].amount).toBeCloseTo(0.01, 10);
            expect(actions[1].symbol).toBe('AAPL');
            expect(actions[1].action).toBe('BUY');
            expect(actions[1].amount).toBeCloseTo(0.01, 10);
        });

    });

    describe('edge cases', () => {
        it('should not generate trades when the portfolio has no capital', () => {
            const meta = new Stock('META', 100);
            const apple = new Stock('AAPL', 100);


            const targetAllocations = [
                { stock: meta, percentage: 0.4 },
                { stock: apple, percentage: 0.6 }
            ];

            const portfolio = new Portfolio([], targetAllocations);
            const actions = portfolio.rebalance();
            expect(actions).toEqual([
                { symbol: 'META', action: 'HOLD', amount: 0 },
                { symbol: 'AAPL', action: 'HOLD', amount: 0 }
            ]);
        });

        it('should protect portfolio positions from external array mutations', () => {
            const meta = new Stock('META', 100);
            const apple = new Stock('AAPL', 100);

            const positions = [
                new PortfolioPosition(meta, 40)
            ];

            const portfolio = new Portfolio(positions, []);

            positions.push(new PortfolioPosition(apple, 60));

            expect(positions).toHaveLength(2);
            expect(portfolio.portfolioPositions).toHaveLength(1);
        });

        it('should protect target allocations from external array mutations', () => {
            const meta = new Stock('META', 100);
            const apple = new Stock('AAPL', 100);

            const targetAllocations = [
                { stock: meta, percentage: 0.4 }
            ];

            const portfolio = new Portfolio([], targetAllocations);

            targetAllocations.push({ stock: apple, percentage: 0.6 });

            expect(targetAllocations).toHaveLength(2);
            expect(portfolio.targetAllocations).toHaveLength(1);
        });

        it('should preserve the total portfolio value when rebalancing', () => {
            const meta = new Stock('META', 200);
            const apple = new Stock('AAPL', 150);
            const nvda = new Stock('NVDA', 100);
            const positions = [
                new PortfolioPosition(meta, 3),
                new PortfolioPosition(apple, 4),
                new PortfolioPosition(nvda, 0)
            ];

            const targetAllocations = [
                { stock: meta, percentage: 0.4 },
                { stock: apple, percentage: 0.3 },
                { stock: nvda, percentage: 0.3 }
            ];

            const portfolio = new Portfolio(positions, targetAllocations);

            const actions = portfolio.rebalance();

            // Calculate total purchases
            const totalBuy = actions
                .filter(action => action.action === 'BUY')
                .reduce((total, action) => total + action.amount, 0);

            // Calculate total sales
            const totalSell = actions
                .filter(action => action.action === 'SELL')
                .reduce((total, action) => total + action.amount, 0);

            expect(totalBuy).toBeGreaterThan(0);
            expect(totalSell).toBeGreaterThan(0);
            expect(totalBuy).toBeCloseTo(totalSell, 10);
        });
    });
});
