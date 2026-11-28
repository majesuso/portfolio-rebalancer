import { useForm } from 'react-hook-form';
import { INITIAL_POSITIONS } from '../contants';
import type { RebalanceAction, PortfolioFormValues } from '../types';

export const usePortfolio = () => {
    const {
        register,
        handleSubmit,
        watch,
        getValues,
        formState: { errors },
    } = useForm<PortfolioFormValues>({
        defaultValues: {
            positions: INITIAL_POSITIONS,
        },
    });

    const positions = watch('positions');

    const portfolioValue = positions.reduce(
        (total, position) =>
            total + position.currentPrice * position.quantity,
        0
    );

    const rebalanceValue: RebalanceAction[] = positions.map((position) => {
        const targetPercentage = position.targetPercentage / 100
        const targetValue = portfolioValue * targetPercentage
        const currentValue = position.currentPrice * position.quantity
        const difference = targetValue - currentValue
        return ({
            symbol: position.symbol,
            action: difference > 0
                ? 'BUY'
                : difference < 0
                    ? 'SELL'
                    : 'HOLD',
            amount: Math.abs(difference)
        })
    })

    console.log('rebalance value:', rebalanceValue);

    return ({
        handleSubmit,
        register,
        watch,
        errors,
        getValues,
        positions,
        portfolioValue,
        rebalanceValue
    })
}

