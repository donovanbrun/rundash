import { Activity } from "../models/activity";

const ACTIVITY_KEY = 'activities';

export const getActivities = (): Activity[] => {
    return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');
};

export const getActivity = (id: number): Activity | undefined => {
    if (typeof id !== 'number') {
        id = parseInt(id);
    }
    const activities = getActivities();
    return activities.find((a: Activity) => a.id === id);
};

export const saveActivity = (activity: Activity) => {
    const activities = getActivities();
    if (activities.some((a: Activity) => a.id === activity.id)) {
        const index = activities.findIndex((a: Activity) => a.id === activity.id);
        activities[index] = activity;
    }
    else {
        activities.push(activity);
    }
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities));
};