import { Injectable } from '@nestjs/common';
import crypto from 'node:crypto';
import dayjs, { ManipulateType } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';
import BigNumber from 'bignumber.js';
// dayjs.extend(isoWeek);
// dayjs.extend(utc);

@Injectable()
export class CommonUtils {
  constructor() {}

  getUnixTimestampWithoutTime(currentDate?: Date) {
    let day = currentDate ? dayjs.utc(currentDate) : dayjs.utc();
    day = day.startOf('day');
    return day.unix();
  }

  getWeekId(date: dayjs.Dayjs | number = dayjs()): number {
    const currentDate = typeof date === 'number' ? dayjs.utc(date) : date;
    return currentDate.year() * 100 + currentDate.isoWeek();
  }

  getWeekNumber(date: dayjs.Dayjs | number = dayjs()): number {
    const currentDate = typeof date === 'number' ? dayjs.utc(date) : date;
    return currentDate.isoWeek();
  }
  getYear(date: dayjs.Dayjs | number = dayjs()): number {
    const currentDate = typeof date === 'number' ? dayjs.utc(date) : date;
    return currentDate.year();
  }

  getUtcDate(timestamp?: string) {
    if (timestamp) return dayjs.utc(timestamp);
    return dayjs.utc();
  }

  isOlderThan(
    originDate: Date,
    diff: number,
    unit: ManipulateType = 'minutes',
  ) {
    const date1 = dayjs(originDate);
    const date2 = dayjs().subtract(diff, unit);
    return date1.diff(date2, unit) <= 0;
  }

  getBalanceWithoutDecimals(
    balance: string | BigNumber,
    decimals: number,
  ): BigNumber {
    return BigNumber(balance).multipliedBy(BigNumber(10).pow(decimals));
  }

  getBalanceWithDecimals(
    balance: string | BigNumber,
    decimals: number,
  ): BigNumber {
    return BigNumber(balance).dividedBy(BigNumber(10).pow(decimals));
  }

  bigintToStringAllKeys(data: Record<string, any>) {
    const result = { ...data };
    for (const key in result) {
      if (typeof result[key] === 'bigint') result[key] = result[key].toString();
    }
    return result;
  }
}
