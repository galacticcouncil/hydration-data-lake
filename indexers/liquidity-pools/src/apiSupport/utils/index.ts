import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';
import { AggregationTimeRangeLabel } from '../types';
dayjs.extend(isoWeek);
dayjs.extend(utc);

export class AggregationTimeRange {
  private nowDatetime: dayjs.Dayjs;
  private rangeStartDatetime: dayjs.Dayjs | null = null;
  private rangeMs: number | null = null;

  constructor(
    private rangeLabel: AggregationTimeRangeLabel,
    currentTime: dayjs.Dayjs | number = dayjs()
  ) {
    this.nowDatetime =
      typeof currentTime === 'number' ? dayjs.utc(currentTime) : currentTime;

    this.ensureCurrentTime();
    this.ensureRangeLabel();

    this.parseRangeLabel();
  }

  get nowUnixTimestamp() {
    return this.nowDatetime.valueOf();
  }
  get nowIsoString() {
    return this.nowDatetime.toISOString();
  }
  get nowDate() {
    return this.nowDatetime.toDate();
  }
  get nowDayjs() {
    return dayjs(this.nowDatetime.valueOf());
  }
  get startUnixTimestamp() {
    return this.nowDatetime.valueOf();
  }
  get startIsoString() {
    return this.rangeStartDatetime!.toISOString();
  }
  get startDate() {
    return this.rangeStartDatetime!.toDate();
  }
  get startDayjs() {
    return dayjs(this.rangeStartDatetime!.valueOf());
  }
  get timeRangeMs() {
    return this.rangeMs;
  }

  private parseRangeLabel() {
    const hourMs = 1000 * 60 * 60;
    switch (this.rangeLabel) {
      case AggregationTimeRangeLabel['1H']:
        this.rangeMs = hourMs;
        this.rangeStartDatetime = this.nowDatetime.subtract(1, 'hour');
        break;
      case AggregationTimeRangeLabel['12H']:
        this.rangeMs = hourMs * 12;
        this.rangeStartDatetime = this.nowDatetime.subtract(12, 'hour');
        break;
      case AggregationTimeRangeLabel['1D']:
      case AggregationTimeRangeLabel['24H']:
        this.rangeMs = hourMs * 24;
        this.rangeStartDatetime = this.nowDatetime.subtract(24, 'hours');
        break;
      case AggregationTimeRangeLabel['7D']:
      case AggregationTimeRangeLabel['1W']:
        this.rangeMs = hourMs * 24 * 7;
        this.rangeStartDatetime = this.nowDatetime.subtract(7, 'days');
        break;
      case AggregationTimeRangeLabel['30D']:
      case AggregationTimeRangeLabel['1M']:
        this.rangeMs = hourMs * 24 * 30;
        this.rangeStartDatetime = this.nowDatetime.subtract(30, 'days');
        break;
      case AggregationTimeRangeLabel['90D']:
        this.rangeMs = hourMs * 24 * 90;
        this.rangeStartDatetime = this.nowDatetime.subtract(90, 'days');
        break;
      case AggregationTimeRangeLabel['180D']:
        this.rangeMs = hourMs * 24 * 180;
        this.rangeStartDatetime = this.nowDatetime.subtract(180, 'days');
        break;
      case AggregationTimeRangeLabel['365D']:
      case AggregationTimeRangeLabel['1Y']:
        this.rangeMs = hourMs * 24 * 365;
        this.rangeStartDatetime = this.nowDatetime.subtract(365, 'days');
        break;
      default:
        this.rangeMs = this.nowDatetime.valueOf();
        this.rangeStartDatetime = this.nowDatetime.subtract(
          this.rangeMs,
          'milliseconds'
        );
    }
  }

  private ensureRangeLabel() {
    if (!Object.values(AggregationTimeRangeLabel).includes(this.rangeLabel))
      throw new Error('Valid Time Range is expected. Received invalid range.');
  }

  private ensureCurrentTime() {
    if (!this.nowDatetime.isValid())
      throw new Error(
        'Valid Dayjs or timestamp is expected. Received invalid date.'
      );
  }
}
