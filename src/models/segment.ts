export class Segment {

    id: number;
    time: Date;
    lat: number;
    lon: number;
    ele: number | undefined;
    hr: number | undefined;

    constructor(param: any) {
        this.id = param.id;
        this.time = param.time;
        this.lat = param.lat;
        this.lon = param.lon;
        this.ele = param.ele;
        this.hr = param.hr;
    }
};