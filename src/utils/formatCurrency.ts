export const formatCurrency = (value: number): string => {
    if (!Number.isFinite(value)) return '—';

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
};