export class Segment {

    id: number;
    time: number;
    lat: number;
    lon: number;
    ele: number;
    hr: number;

    constructor(param: any) {
        this.id = param.id;
        this.time = param.time;
        this.lat = param.lat;
        this.lon = param.lon;
        this.ele = param.ele;
        this.hr = param.hr;
    }
};