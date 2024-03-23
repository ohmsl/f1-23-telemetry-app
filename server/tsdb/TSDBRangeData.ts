import type { ITSDBRangeData } from './ITSDBRangeData';
import type { TSEntry } from './ITSEntry';

export class TSDBRangeData implements ITSDBRangeData {
    fromTS = 0;
    toTS = 0;
    sum = 0;
    count = 0;
    in = 0;
    out = 0;
    average = 0;
    open = 0;
    close = 0;
    entryIds?: number[] = [];
    load(data: Partial<ITSDBRangeData>) {
        Object.assign(this, data);
    }

    constructor(includeEntryIds = false) {
        if (includeEntryIds) this.entryIds = [];
    }

    push(entry: TSEntry) {
        this.sum += entry.amount;
        this.count += 1;
        this.average = this.sum / this.count;
        this.close = this.sum + this.open;
        if (entry.amount < 0) {
            this.out += Math.abs(entry.amount);
        }
        if (entry.amount > 0) {
            this.in += entry.amount;
        }
        if (!this.fromTS || entry.timestamp < this.fromTS) {
            this.fromTS = entry.timestamp;
        }
        if (!this.toTS || entry.timestamp > this.fromTS) {
            this.toTS = entry.timestamp;
        }
        if (this.entryIds) this.entryIds.push(entry.id);
        //  this.entryIds.push(entry.id);
    }

    concat(other: TSDBRangeData) {
        this.sum += other.sum;
        this.count += other.count;
        this.average = this.sum / this.count;
        this.close = this.sum + this.open;
        this.in += other.in;
        this.out += other.out;
        if (this.fromTS === undefined || other.fromTS < this.fromTS) {
            this.fromTS = other.fromTS;
        }
        if (this.toTS === undefined || other.toTS > this.fromTS) {
            this.toTS = other.toTS;
        }

        if (!other.entryIds) return;
        //  this.entryIds = this.entryIds.concat(other.entryIds);
        if (this.entryIds) this.entryIds = this.entryIds.concat(other.entryIds);
    }

    data(): ITSDBRangeData {
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
            entryIds: this.entryIds,
            //   entryIdx: this.entryIdx
        };
    }
}
