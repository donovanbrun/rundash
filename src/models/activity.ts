import { Segment } from "./segment";

export enum ActivityType {
    RUNNING = 'Running',
    CYCLING = 'Cycling',
    SWIMMING = 'Swimming',
}

export class Activity {

    constructor(
        public id: number,
        public name: string,
        public date: Date,
        public type: ActivityType,
        public distance: number,
        public duration: number,
        public avgSpeed: number,
        public maxSpeed: number,
        public avgHr: number,
        public maxHr: number,
        public minHr: number,
        public elevationGain: number,
        public elevationLoss: number,
        public maxElevation: number,
        public minElevation: number,
        public segments: Segment[],
    ) { }
}