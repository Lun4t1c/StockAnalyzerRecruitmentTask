export interface StockRowDataModel {
	_id: number;
	date: Date;
	value: number;
	currency: string;
}

export interface Periods {
	increase: StockRowDataModel[][];
	constant: StockRowDataModel[][];
	decline: StockRowDataModel[][];
}

/**
 * Converts content of .csv file to standarized objects
 * @param file .csv file passed as {@link File}
 * @returns Rows of data as array of {@link StockRowDataModel}
 */
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

/**
 * @param rows All data from table 'ceny_akcji' in database passed as array of {@link StockRowDataModel}
 * @returns Value of largest daily decline found or {@link null} if there was not enough data or no declines
 */
export async function findLargestDailyDecline(rows: StockRowDataModel[]): Promise<number | null> {
	if (rows.length < 2) return null;

	let result: number = 0;

	for (let i = 0; i < rows.length - 1; i++) {
		const difference = rows[i + 1].value - rows[i].value;

		if (result > difference) {
			result = difference;
		}
	}

	return result < 0 ? Math.abs(result) : null;
}

/**
 * Analyzes all data from table 'ceny_akcji' and looks groups it as periods - declines, increases and constants
 * @param rows All data from 'ceny_akcji' passed as array of {@link StockRowDataModel}
 * @returns Grouped periods as {@link Periods} object
 */
export async function findAllPeriods(rows: StockRowDataModel[]): Promise<Periods> {
	if (rows.length < 2) return { increase: [], decline: [], constant: [] };

	const result: Periods = {
		increase: [],
		constant: [],
		decline: []
	};

	let currentPeriodType: 'decline' | 'increase' | 'constant' = 'constant';
	let currentPeriod: StockRowDataModel[] = [];

	const sortedRows = rows.sort((a, b) => a.date.getTime() - b.date.getTime());

	for (let i = 1; i < sortedRows.length; i++) {
		const difference = sortedRows[i].value - sortedRows[i - 1].value;

		if (difference < 0) {
			// Handle decline period
			if (currentPeriodType !== 'decline') {
				if (currentPeriod.length > 0) {
					result[currentPeriodType].push(currentPeriod);
				}
				currentPeriodType = 'decline';
				currentPeriod = [sortedRows[i - 1]];
			}
			currentPeriod.push(sortedRows[i]);
		} else if (difference > 0) {
			// Handle increase period
			if (currentPeriodType !== 'increase') {
				if (currentPeriod.length > 0) {
					result[currentPeriodType].push(currentPeriod);
				}
				currentPeriodType = 'increase';
				currentPeriod = [sortedRows[i - 1]];
			}
			currentPeriod.push(sortedRows[i]);
		} else {
			// Handle constant period
			if (currentPeriodType !== 'constant') {
				if (currentPeriod.length > 0) {
					result[currentPeriodType].push(currentPeriod);
				}
				currentPeriodType = 'constant';
				currentPeriod = [sortedRows[i - 1]];
			}
			currentPeriod.push(sortedRows[i]);
		}
	}

	// Push the last period to the result
	if (currentPeriod.length > 0) {
		result[currentPeriodType].push(currentPeriod);
	}

	return result;
}

/**
 * @param declinePeriods Periods in which value was in decline passed as 2d array of {@link StockRowDataModel}
 * @returns Single period in which value has decreased the most as array of {@link StockRowDataModel}
 * or {@link null} if there was not enough data
 */
export async function findBiggestDeclinePeriod(
	declinePeriods: StockRowDataModel[][]
): Promise<StockRowDataModel[] | null> {
	if (declinePeriods.length === 0) return null;
	if (declinePeriods.length === 1) return declinePeriods[0];

	let result: StockRowDataModel[] = declinePeriods[0];

	for (let i = 1; i < declinePeriods.length; i++) {
		const tempDeclinePeriod = declinePeriods[i];

		const currentLargestDecline = result[0].value - result[result.length - 1].value;
		const tempLargestDecline =
			tempDeclinePeriod[0].value - tempDeclinePeriod[tempDeclinePeriod.length - 1].value;

		if (tempLargestDecline > currentLargestDecline) result = tempDeclinePeriod;
	}

	return result;
}

/**
 *
 * @param constantPeriods Periods in which value did not change passed as 2d array of {@link StockRowDataModel}
 * @returns Longest single period in which value did not change as array of {@link StockRowDataModel}
 * or {@link null} if it there was not enough data
 */
export async function findLongestConstantValuePeriod(
	constantPeriods: StockRowDataModel[][]
): Promise<StockRowDataModel[] | null> {
	if (constantPeriods.length === 0) return null;
	if (constantPeriods.length === 1) return constantPeriods[0];

	let result: StockRowDataModel[] = constantPeriods[0];

	for (let i = 1; i < constantPeriods.length; i++) {
		if (constantPeriods[i].length > result.length) result = constantPeriods[i];
	}

	return result;
}
