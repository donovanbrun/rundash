import { Segment } from "../models/segment";
import { Activity } from "../models/activity";
import * as functions from "./functions";

export const convertStravaToActivity = async (strava_activity: any) => {

    const segments: Segment[] = [];

    for (let i = 0; i < strava_activity.segments.time.data.length; i++) {
        const latlng = strava_activity.segments.latlng.data[i];
        const time = new Date(
            new Date(strava_activity.activity.start_date).getTime() + i * 1000
        ).toISOString();
        const heartrate = strava_activity.segments.heartrate.data[i];
        const altitude = strava_activity.segments.altitude.data[i];

        const segmentData: Segment = {
            id: i,
            lat: latlng[0],
            lon: latlng[1],
            time: time as any,
            hr: heartrate,
            ele: altitude
        };

        segments.push(segmentData);
    }

    const activity = new Activity(
        strava_activity.activity.id,
        strava_activity.activity.name,
        new Date(strava_activity.activity.start_date).toISOString() as any,
        strava_activity.activity.type === 'Ride' ? 'Cycling' : 'Running' as any,
        functions.distance(segments),
        functions.deltaTime(segments),
        functions.averageSpeed(segments),
        functions.maxSpeed(segments),
        functions.averageHr(segments),
        functions.maxHr(segments),
        functions.minHr(segments),
        functions.elevationGain(segments),
        functions.elevationLoss(segments),
        functions.maxElevation(segments),
        functions.minElevation(segments),
        segments
    )

    return activity;
}