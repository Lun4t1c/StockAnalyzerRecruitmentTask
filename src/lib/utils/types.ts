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
