
import type { ITSDBRangeData } from './ITSDBRangeData';
import type { TSEntry } from './ITSEntry';
import { LRUCache } from './LRUCache';
import { TSDBRangeData } from './TSDBRangeData';

import type { TimeBucketSize } from './TimeBucketSize';

export const bucketSizesMapping: Record<TimeBucketSize, number> = {
    '264ms': 264,
    '20hz': 50,
    '50hz': 20,
    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000, // Approximation for simplicit
    year: 365 * 24 * 60 * 60 * 1000, // Approximation for simplicit
};

export interface GetAggregatesByGranularityFlatOptions {
    start?: Date;
    end: Date;
    granularity: TimeBucketSize;
    includeEmpties?: boolean;
    includeBalances?: boolean;
    includeEntries?: boolean;
}

export interface ITSDBData extends ITSDBRangeData {
    bucketsBySize: Array<[number, Array<[number, ITSDBRangeData]>]>;
}

export type TSDBOptions = {
    cacheEnabled?: boolean;
    bucketSizes?: Array<TimeBucketSize>;
};

export default class TsDbV2 extends TSDBRangeData {
    private _bucketsBySize = new Map<number, Map<number, TSDBRangeData>>();
    private _bucketSizes = [bucketSizesMapping['hour'], bucketSizesMapping['day'], bucketSizesMapping['month']];
    private _cache: LRUCache<string, TSDBRangeData> | undefined;

    reset() {
        this._bucketsBySize = new Map<number, Map<number, TSDBRangeData>>();
    }

    constructor(options: TSDBOptions = {}) {
        super();
        if (options.cacheEnabled) {
            this._cache = new LRUCache<string, TSDBRangeData>(100000);
        }
        if (options.bucketSizes) {
            this._bucketSizes = options.bucketSizes.map((bs) => {return typeof(bs) === 'string' ? bucketSizesMapping[bs] : bs;});
            console.log('Bucket sizes', options.bucketSizes,  this._bucketSizes);
        }
    }

    load(data?: Partial<ITSDBData>) {
        super.load({
            fromTS: data?.fromTS,
            toTS: data?.toTS,
            sum: data?.sum,
            count: data?.count,
            in: data?.in,
            out: data?.out,
            average: data?.average,
            open: data?.open,
            close: data?.close,
        });
        if (data && data.bucketsBySize) {
            for (const [key, value] of data.bucketsBySize) {
                const bucketSizeMap = new Map<number, TSDBRangeData>();
                for (const [key2, value2] of value) {
                    const tsdb = new TSDBRangeData();
                    tsdb.load(value2);
                    bucketSizeMap.set(key2, tsdb);
                }
                this._bucketsBySize.set(key, bucketSizeMap);
            }
        }
    }

    getBucketSizeMap(bucketSize: number) {
        if (!this._bucketsBySize.has(bucketSize)) {
            const bucketSizeMap = new Map<number, TSDBRangeData>();
            this._bucketsBySize.set(bucketSize, bucketSizeMap);
            return bucketSizeMap;
        }
        return this._bucketsBySize.get(bucketSize) as Map<number, TSDBRangeData>;
    }

    getBucketForTs(ts: number, bucketSize: number) {
        const bucketKey = Math.floor(ts / bucketSize);

        const bucketsForSize = this.getBucketSizeMap(bucketSize);
        if (!bucketsForSize) throw new Error('Bucket is undefined');

        if (!bucketsForSize.has(bucketKey)) {
            const fromTS = bucketKey * bucketSize;
            const toTS = fromTS + bucketSize;
            const tsdb = new TSDBRangeData();
            tsdb.fromTS = fromTS;
            tsdb.toTS = toTS;

            bucketsForSize.set(bucketKey, tsdb);
        }

        return bucketsForSize.get(bucketKey);
    }

    push(entry: TSEntry) {
        super.push(entry);
        for (const bucketSize of this._bucketSizes) {
            const bucket = this.getBucketForTs(entry.timestamp, bucketSize);
            if (!bucket) throw new Error('BucketRecs is undefined');
            bucket.push(entry);
        }
    }

    toUTC(date: Date): Date {
        return new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
        );
    }

    range(startDate?: Date, endDate?: Date, includeEntries = false): TSDBRangeData {
        // Convert dates to utc
        startDate = startDate ? this.toUTC(startDate) : undefined;
        endDate = endDate ? this.toUTC(endDate) : undefined;

        const start = startDate?.getTime();
        const end = endDate?.getTime();

        const cacheKey = `${start}-${end}-${includeEntries}`;
        if (this._cache) {
            const cachedResponse = this._cache.get(cacheKey);
            if (cachedResponse) return cachedResponse;
        }

        const response = this._range(start, end, false, includeEntries);

        if (this._cache) this._cache.set(cacheKey, response);
        return response;
    }

    private _range(
        fromTS: number | undefined,
        toTS: number | undefined,
        includeBalances = false,
        includeEntries = false,
        rangeData?: TSDBRangeData
    ): TSDBRangeData {
        if (!toTS) toTS = this.toTS;

        if (!fromTS) {
            // If fromTS is not provided, we are going to get the first bucket size and get the first bucket in that size
            fromTS = this.getBucketSizeMap(this._bucketSizes[0]).keys().next().value * this._bucketSizes[0];
        }

        if (!rangeData) {
            rangeData = new TSDBRangeData(includeEntries);
            rangeData.fromTS = fromTS;
            rangeData.toTS = toTS;
            if (includeBalances) {
                rangeData.open = this._range(0, fromTS, false, false).sum;
            }
        }

        const duration = toTS - fromTS;
        if (duration > 0) {
            const { startBucket, bucketSize, endBucket, bucketsForSize } = this.getBucketSizesForDuration(fromTS, toTS);

            const firstBucketTS = startBucket * bucketSize;
            const startStragglers = firstBucketTS - fromTS;
            const endBucketTS = endBucket * bucketSize;
            const endStragglers = toTS - endBucketTS;

            if (startStragglers > 0) {
                this._range(fromTS, firstBucketTS, false, includeEntries, rangeData);
            }
            if (bucketsForSize) {
                for (let i = startBucket; i < endBucket; i++) {
                    if (!bucketsForSize.has(i)) continue;
                    rangeData.concat(bucketsForSize.get(i) as TSDBRangeData);
                }
            }

            if (endStragglers > 0) {
                this._range(endBucketTS, toTS, false, includeEntries, rangeData);
            }
        }
        rangeData.close = rangeData.open + rangeData.sum;

        return rangeData;
    }

    private getBucketSizesForDuration(fromTS: number, toTS: number) {
        const duration = toTS - fromTS;
        if (duration < 0) {
            throw new Error('Duration is 0 or less');
        }

        const bucketSizesThatFitDuration = this._bucketSizes.filter(bs => bs === duration || bs < duration);

        const bucketSize = bucketSizesThatFitDuration[0]; // Smallest bucket that this duration fits into
        let startBucket;
        let endBucket;
        if (!bucketSize) {
            // The range is smaller than the smallest bucket size
            throw new Error(
                `Duration is smaller than the smallest bucket size`
            );
            //return rangeData;
            // bucketSize = this._bucketSizes[0];
            //there is no bucket size for this duration so we are going to go get the next bucket up and iterate through all the entries in that.
            // bucketSize = this._bucketSizes[this._bucketSizes.length - 1];
            // startBucket = Math.floor(fromTS / bucketSize);
            // endBucket = Math.ceil(toTS / bucketSize);
        } else {
            startBucket = Math.ceil(fromTS / bucketSize);
            endBucket = Math.floor(toTS / bucketSize);
        }

        const bucketsForSize = this._bucketsBySize.get(bucketSize);

        return { startBucket, bucketSize, endBucket, bucketsForSize };
    }

    between(from?: Date, to?: Date, includeEntries = false): TSDBRangeData {
        if (from && to && from.valueOf() > to.valueOf()) throw new Error('onOrAfter is after toBefore');

        return this.range(from, to, includeEntries);
    }

    balance(dateTime: Date): number {
        if (!dateTime) throw new Error('dateTime is required');
        const range = this.range(undefined, dateTime, false);
        return range.sum;
    }

    after(dateTime: Date, includeEntries = false): TSDBRangeData {
        if (!dateTime) throw new Error('dateTime is required');
        return this.between(dateTime, new Date(), includeEntries);
    }

    before(dateTime: Date, includeEntries = false): TSDBRangeData {
        if (!dateTime) throw new Error('dateTime is required');
        return this.between(this.fromTS ? new Date(this.fromTS) : new Date(0), dateTime, includeEntries);
    }

    getBalancesByDay(start: Date, end: Date) {
        start = this.toUTC(start);
        end = this.toUTC(end);
        const resp: Array<{ date: Date; value: number }> = [];
        const startTimestamp = start ? start.getTime() : this.fromTS || 0;
        const endTimestamp = end ? end.getTime() : this.toTS || 0;
        let currentTimestamp = startTimestamp;
        while (currentTimestamp < endTimestamp) {
            const nextDay = new Date(currentTimestamp + 24 * 60 * 60 * 1000);
            const bal = this.balance(nextDay);
            resp.push({ date: nextDay, value: bal });
            currentTimestamp = nextDay.getTime();
        }
        return resp;
    }

    // Get aggregated data for a given date time range and granularity, with labels
    getAggregatesByGranularity({
        end,
        granularity,
        start,
        includeBalances = true,
        includeEmpties = false,
        includeEntries = false,
    }: GetAggregatesByGranularityFlatOptions): Array<TSDBRangeData> {
        if (start && start.valueOf() === end.valueOf()) end.setDate(end.getDate() + 1);

        let startTimestamp = start?.valueOf();
        let endTimestamp = end.valueOf();
        if (!startTimestamp) startTimestamp = this.fromTS;

        if (endTimestamp < startTimestamp) throw new Error('End date is before start date');

        if (!startTimestamp) startTimestamp = this.fromTS;
        if (!endTimestamp) endTimestamp = this.toTS;

        if (granularity === 'month') {
            return this._getByMonth(startTimestamp, endTimestamp, includeEntries);
        }
        if (granularity === 'week') {
            return this._getByWeek(startTimestamp, endTimestamp, includeEntries);
        }
        if (granularity === 'year') {
            return this._getByYear(startTimestamp, endTimestamp, includeEntries);
        }
        const bucketSize = bucketSizesMapping[granularity];
        const startBucket = Math.ceil(startTimestamp / bucketSize);
        const endBucket = Math.floor(endTimestamp / bucketSize);

        const aggregateBucket = this._bucketsBySize.get(bucketSize);
        if (!aggregateBucket) {
            console.error('No aggregate bucket found for bucket size ' + bucketSize);
            return [];
        }

        const aggregates: Array<TSDBRangeData> = [];
        let open = 0;
        let close = 0;
        if (includeBalances) {
            open = this._range(0, startTimestamp, false, false).sum;
            close = open;
        }
        for (let bucketKey = startBucket; bucketKey <= endBucket; bucketKey++) {
            const fromTS = bucketKey * bucketSize;
            const toTS = (bucketKey + 1) * bucketSize - 1;
            if (!aggregateBucket.has(bucketKey)) {
                const range = new TSDBRangeData();
                range.fromTS = fromTS;
                range.toTS = toTS;
                if (includeEmpties) aggregates.push(range);
                continue;
            }

            const aggregateData = aggregateBucket.get(bucketKey);

            if (!aggregateData) throw 'No aggregate data found for bucket size ' + bucketSize + ' and bucket key ' + bucketKey;
            close = open + aggregateData.sum;

            if (includeBalances) {
                aggregateData.close = close;
                aggregateData.open = open;
            }
            aggregates.push(aggregateData);
            open = close;
        }

        return aggregates;
    }

    getAggregatesByGranularityFlat({
        end,
        granularity,
        start,
        includeBalances = true,
        includeEmpties = false,
    }: GetAggregatesByGranularityFlatOptions): Array<ITSDBRangeData | number> {
        start = start && this.toUTC(start);
        end = this.toUTC(end);
        let startTimestamp = start && start.getTime();
        let endTimestamp = end.getTime();
        if (!startTimestamp) startTimestamp = this.fromTS;

        if (!endTimestamp) endTimestamp = this.toTS;

        const bucketSize = bucketSizesMapping[granularity];
        const startBucket = Math.ceil(startTimestamp / bucketSize);
        const endBucket = Math.floor(endTimestamp / bucketSize);

        const aggregateBucket = this._bucketsBySize.get(bucketSize);
        if (!aggregateBucket) {
            console.error('No aggregate bucket found for bucket size ' + bucketSize);
            return [];
        }

        const aggregates: Array<ITSDBRangeData | number> = [];
        let open = 0;
        let close = 0;
        if (includeBalances) {
            open = this._range(0, startTimestamp - 1, false, false).sum;
            close = open;
        }
        for (let bucketKey = startBucket; bucketKey <= endBucket; bucketKey++) {
            const fromTS = bucketKey * bucketSize;
            const toTS = (bucketKey + 1) * bucketSize - 1;

            if (!aggregateBucket.has(bucketKey)) {
                const range = new TSDBRangeData();
                range.fromTS = fromTS;
                range.toTS = toTS;
                if (includeEmpties) aggregates.push(range);

                continue;
            }

            const aggregateData = aggregateBucket.get(bucketKey);

            if (!aggregateData) throw 'No aggregate data found for bucket size ' + bucketSize + ' and bucket key ' + bucketKey;
            close = open + aggregateData.sum;

            if (includeBalances) {
                aggregateData.close = close;
                aggregateData.open = open;
            }

            aggregates.push(aggregateData.data());

            // add all the entries to the aggregates
            if (aggregateData.entryIds) {
                for (const entry of aggregateData.entryIds) {
                    aggregates.push(entry);
                }
            }
            open = close;
        }

        return aggregates;
    }

    private _getByWeek(startTimestamp: number, endTimestamp: number, includeEntries = false): Array<TSDBRangeData> {
        const resp: Array<TSDBRangeData> = [];
        let currentTimestamp = startTimestamp;
        while (currentTimestamp < endTimestamp) {
            const nextWeekStartTimeStamp = currentTimestamp + 7 * 24 * 60 * 60 * 1000;
            const range = this._range(currentTimestamp, nextWeekStartTimeStamp, includeEntries);
            resp.push(range);
            currentTimestamp = nextWeekStartTimeStamp;
        }
        return resp;
    }

    private _getByMonth(startTimestamp: number, endTimestamp: number, includeEntries = false): Array<TSDBRangeData> {
        const resp: Array<TSDBRangeData> = [];
        let currentTimestamp = startTimestamp;
        while (currentTimestamp < endTimestamp) {
            const dt = new Date(currentTimestamp);
            const nextMonth = new Date(dt.getFullYear(), dt.getMonth() + 1, 1);
            //const nextMonthUTC = this.toUTC(nextMonth);
            const range = this._range(currentTimestamp, nextMonth.getTime(), includeEntries);
            resp.push(range);
            currentTimestamp = nextMonth.getTime();
        }
        return resp;
    }

    private _getByYear(startTimestamp: number, endTimestamp: number, includeEntries = false): Array<TSDBRangeData> {
        const resp: Array<TSDBRangeData> = [];

        let currentTimestamp = startTimestamp;
        while (currentTimestamp < endTimestamp) {
            const dt = new Date(currentTimestamp);
            const nextYear = new Date(dt.getFullYear() + 1, 0, 1);
            //const nextYear = new Date(currentTimestamp + 365 * 24 * 60 * 60 * 1000);
            const range = this._range(currentTimestamp, nextYear.getTime(), includeEntries);
            resp.push(range);
            currentTimestamp = nextYear.getTime();
        }
        return resp;
    }

    data(): ITSDBData {
        return {
            fromTS: this.fromTS,
            toTS: this.toTS,
            sum: this.sum,
            count: this.count,
            in: this.in,
            out: this.out,
            average: this.average,
            open: this.open,
            close: this.close,
            bucketsBySize: Array.from(this._bucketsBySize).map(([key, value]) => {
                return [
                    key,
                    Array.from(value).map(([key2, value2]) => {
                        return [key2, value2.data()];
                    }),
                ];
            }),
        };
    }
}
