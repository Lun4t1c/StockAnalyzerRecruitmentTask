export function formatNumberToMoneyString(amount: number | undefined | null): string {
	if (!amount) return 'NaN';

	return amount.toLocaleString('pl-PL', {
		style: 'currency',
		currency: 'PLN',
		minimumFractionDigits: 2
	});
}

export function formatDate(date: Date): string {
	return date.toLocaleDateString('pl-PL', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric'
	});
}
