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

export const speedToMinKm = (speed: number) => {
    if (speed === 0) return '0:00';
    const min = 60 / speed;
    const sec = (min - Math.floor(min)) * 60;
    return `${Math.floor(min)}:${Math.floor(sec) < 10 ? '0' + Math.floor(sec) : Math.floor(sec)}`;
}

export const deltaTime = (segments: Segment[]) => {
    if (segments.length === 0) return 0;
    const first = new Date(segments[0].time);
    const last = new Date(segments[segments.length - 1].time);
    const diff = last.getTime() - first.getTime();
    return diff;
}

export const formatNumber = (n: number, m: number = 2) => n?.toFixed(m);

export const formatTime = (ms: number) => {
    const diff = Number(ms);
    const hours = Math.floor(diff / 1000 / 3600);
    const minutes = Math.floor((diff - hours * 1000 * 3600) / 1000 / 60);
    const seconds = Math.floor((diff - hours * 1000 * 3600 - minutes * 1000 * 60) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
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