
export interface ITSDBRangeData {
    fromTS: number;
    toTS: number;
    sum: number;
    count: number;
    in: number;
    out: number;
    average: number;
    open: number;
    close: number;
    entryIds?: number[];
}
