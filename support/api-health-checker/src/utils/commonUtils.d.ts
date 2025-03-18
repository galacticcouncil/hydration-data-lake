import dayjs, { ManipulateType } from 'dayjs';
import BigNumber from 'bignumber.js';
export declare class CommonUtils {
    constructor();
    getUnixTimestampWithoutTime(currentDate?: Date): number;
    getWeekId(date?: dayjs.Dayjs | number): number;
    getWeekNumber(date?: dayjs.Dayjs | number): number;
    getYear(date?: dayjs.Dayjs | number): number;
    getUtcDate(timestamp?: string): dayjs.Dayjs;
    isOlderThan(originDate: Date, diff: number, unit?: ManipulateType): boolean;
    getBalanceWithoutDecimals(balance: string | BigNumber, decimals: number): BigNumber;
    getBalanceWithDecimals(balance: string | BigNumber, decimals: number): BigNumber;
}
