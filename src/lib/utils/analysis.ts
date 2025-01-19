import type { StockRowDataModel } from './types';

export async function getRowsDataFromCSVFile(file: File): Promise<StockRowDataModel[]> {
	const lines: string[] = (await file.text()).split('\n').filter((str) => str !== '');

	const rowsData: StockRowDataModel[] = [];

	for (const line of lines) {
		const splitLine: string[] = line.split(',');
		rowsData.push({
			_id: parseInt(splitLine[0]),
			date: new Date(splitLine[1]),
			value: parseFloat(splitLine[2]),
			currency: splitLine[3]
		});
	}

	return rowsData;
}

export async function findLargestDailyDecline(rows: StockRowDataModel[]): Promise<number | null> {
	if (rows.length < 2) return null;

	let result: number = 0;

	for (let i = 0; i < rows.length - 1; i++) {
		const difference = rows[i + 1].value - rows[i].value;

		if (result > difference) {
			result = difference;
		}
	}

	return -result;
}

export async function findDeclinePeriods(
	rows: StockRowDataModel[]
): Promise<StockRowDataModel[][]> {
	if (rows.length < 2) return [];

	const result: StockRowDataModel[][] = [];

	let isInDecline: boolean = false;
	let currentDeclinePeriod: StockRowDataModel[] = [];

	for (let i = 1; i < rows.length; i++) {
		const difference = rows[i].value - rows[i - 1].value;

		if (difference < 0) {
			if (!isInDecline) {
				isInDecline = true;
				currentDeclinePeriod = [rows[i - 1]];
			}
			currentDeclinePeriod.push(rows[i]);
		} else {
			if (isInDecline) {
				result.push(currentDeclinePeriod);
				currentDeclinePeriod = [];
			}

			isInDecline = false;
		}
	}

	if (isInDecline && currentDeclinePeriod.length > 0) result.push(currentDeclinePeriod);

	return result;
}
