import { Segment } from "./segment";

export enum ActivityType {
    RUN = 'Run',
    RIDE = 'Ride',
}

export class Activity {

    constructor(
        public id: number,
        public name: string,
        public date: string,
        public type: ActivityType,
        public distance: number,
        public duration: number,
        public avgSpeed: number,
        public maxSpeed: number,
        public avgHr: number,
        public maxHr: number,
        public minHr: number,
        public segments: Segment[],
    ) { }
}