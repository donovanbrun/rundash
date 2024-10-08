import { Segment } from "../models/segment";
import { getDistanceFromLatLonInKm } from "./gps";

const filteredData = (segments: Segment[]) => segments.filter(s => s.hr !== undefined && s.hr > 0);

export const distance = (segments: Segment[]) => {
    if (segments.length === 0) return 0;
    return segments.reduce((acc, d, index) => {
        if (index === 0) return acc;
        const prev = segments[index - 1];
        return acc + getDistanceFromLatLonInKm(prev.lat, prev.lon, d.lat, d.lon);
    }, 0);
}

export const averageHr = (segments: Segment[]) => {
    const filteredSegments = filteredData(segments);
    if (filteredSegments.length === 0) return 0;

    const validData = filteredSegments.filter(d => typeof d.hr === 'number' && !isNaN(d.hr) && d.hr > 0);

    if (validData.length === 0) return 0;

    const sum = validData.reduce((acc, d) => acc + d.hr!, 0);
    return sum / validData.length;
}

export const maxHr = (segments: Segment[]) => {
    const filteredSegments = filteredData(segments);
    if (filteredSegments.length === 0) return 0;
    return filteredSegments.reduce((acc, d) => Math.max(acc, d.hr!), 0);
}

export const minHr = (segments: Segment[]) => {
    const filteredSegments = filteredData(segments);
    if (filteredSegments.length === 0) return 0;
    return filteredSegments.reduce((acc, d) => Math.min(acc, d.hr!), 1000);
}

export const hrZones = (segments: Segment[], maxHr: number) => {
    const filteredSegments = segments.filter(segment => segment.hr !== undefined);
    if (filteredSegments.length === 0) return [0, 0, 0, 0, 0];

    const zones = [0, 0, 0, 0, 0];
    const zoneThresholds = [
        maxHr * 0.6, // Zone 1: jusqu'à 60% de la FC max
        maxHr * 0.7, // Zone 2: 60% - 70% de la FC max
        maxHr * 0.8, // Zone 3: 70% - 80% de la FC max
        maxHr * 0.9, // Zone 4: 80% - 90% de la FC max
        maxHr        // Zone 5: > 90% de la FC max
    ];

    let totalDuration = 0;

    for (let i = 0; i < filteredSegments.length - 1; i++) {
        const current = filteredSegments[i];
        const next = filteredSegments[i + 1];

        // Assurez-vous que `time` est bien un objet `Date`
        const currentTime = current.time instanceof Date ? current.time : new Date(current.time);
        const nextTime = next.time instanceof Date ? next.time : new Date(next.time);

        const duration = (nextTime.getTime() - currentTime.getTime()) / 1000;
        totalDuration += duration;

        if (current.hr !== undefined) {
            if (current.hr <= zoneThresholds[0]) {
                zones[0] += duration; // Zone 1
            } else if (current.hr <= zoneThresholds[1]) {
                zones[1] += duration; // Zone 2
            } else if (current.hr <= zoneThresholds[2]) {
                zones[2] += duration; // Zone 3
            } else if (current.hr <= zoneThresholds[3]) {
                zones[3] += duration; // Zone 4
            } else {
                zones[4] += duration; // Zone 5
            }
        }
    }

    const zonePercentages = zones.map(zoneDuration => (zoneDuration / totalDuration) * 100);

    return zonePercentages;
};

export const gradient = (segments: Segment[]) => {
    segments = segments.filter(s => s.ele! > 0);

    if (segments.length === 0) return 0;

    let totalElevationGain = 0;
    let totalDistance = 0;

    segments.reduce((prev, curr) => {
        const elevationGain = curr.ele! - prev.ele!;
        const distanceKm = getDistanceFromLatLonInKm(prev.lat, prev.lon, curr.lat, curr.lon);
        const distanceM = distanceKm * 1000;
        totalElevationGain += elevationGain;
        totalDistance += distanceM;
        return curr;
    });

    const gradientPercentage = (totalElevationGain / totalDistance) * 100;

    return gradientPercentage;
}

export const sumElevation = (segments: Segment[]) => {
    segments = segments.filter(s => s.ele! > 0);
    if (segments.length === 0) return 0;
    return segments.reduce((acc, d, index) => {
        if (index === 0) return acc;
        const prev = segments[index - 1];
        return acc + (d.ele! - prev.ele!);
    }, 0);
}

export const elevationGain = (segments: Segment[]) => {
    segments = segments.filter(s => s.ele! > 0);
    if (segments.length === 0) return 0;
    return segments.reduce((acc, d, index) => {
        if (index === 0) return acc;
        const prev = segments[index - 1];
        return acc + Math.max(0, d.ele! - prev.ele!);
    }, 0);
}

export const elevationLoss = (segments: Segment[]) => {
    segments = segments.filter(s => s.ele! > 0);
    if (segments.length === 0) return 0;
    return segments.reduce((acc, d, index) => {
        if (index === 0) return acc;
        const prev = segments[index - 1];
        return acc + Math.max(0, prev.ele! - d.ele!);
    }, 0);
}

export const maxElevation = (segments: Segment[]) => {
    segments = segments.filter(s => s.ele! > 0);
    if (segments.length === 0) return 0;
    return segments.reduce((acc, d) => Math.max(acc, d.ele!), 0);
}

export const minElevation = (segments: Segment[]) => {
    segments = segments.filter(s => s.ele! > 0);
    if (segments.length === 0) return 0;
    return segments.reduce((acc, d) => Math.min(acc, d.ele!), 10000);
}

export const averageSpeed = (segments: Segment[]) => {
    if (segments.length === 0) return 0;
    const sum = segments.reduce((acc, d, index) => {
        if (index === 0) return acc;
        const prev = segments[index - 1];
        const distance = getDistanceFromLatLonInKm(prev.lat, prev.lon, d.lat, d.lon);
        const time = (new Date(d.time).getTime() - new Date(prev.time).getTime()) / 1000 / 3600;
        if (time === 0) return acc;
        if (distance > 100) return acc;
        return acc + distance / time;
    }, 0);

    return sum / (segments.length - 1);
}

export const maxSpeed = (segments: Segment[]) => {
    if (segments.length === 0) return 0;
    return segments.reduce((acc, d, index) => {
        if (index === 0) return acc;
        const prev = segments[index - 1];
        const distance = getDistanceFromLatLonInKm(prev.lat, prev.lon, d.lat, d.lon);
        const time = (new Date(d.time).getTime() - new Date(prev.time).getTime()) / 1000 / 3600;
        if (time === 0) return acc;
        if (distance / time > 100) return acc;
        return Math.max(acc, distance / time);
    }, 0);
}

export const deltaTime = (segments: Segment[]) => {
    if (segments.length === 0) return 0;
    const first = new Date(segments[0].time);
    const last = new Date(segments[segments.length - 1].time);
    const diff = last.getTime() - first.getTime();
    return diff;
}

export const groupByKm = (segments: Segment[], step: number): Segment[][] => {
    let distance = 0;
    let groups = [];
    let group: Segment[] = [];

    if (segments.length === 0) return [];
    group.push(segments[0]);

    for (let i = 1; i < segments.length; i++) {
        const segment = segments[i];
        distance += getDistanceFromLatLonInKm(
            segments[i - 1].lat,
            segments[i - 1].lon,
            segment.lat,
            segment.lon
        );

        group.push(segment);

        if (distance >= step) {
            distance = 0;
            groups.push(group);
            group = [];
        }
    }
    groups.push(group);

    return groups;
}