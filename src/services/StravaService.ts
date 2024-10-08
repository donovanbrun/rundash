import axios from 'axios';

const CLIENT_ID = import.meta.env.VITE_APP_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_APP_CLIENT_SECRET;

export const getAccessToken = async (code: string) => {
    const res = await axios.post(
        `https://www.strava.com/oauth/token?client_id=${CLIENT_ID}&code=${code}&client_secret=${CLIENT_SECRET}&grant_type=authorization_code`
    );

    return res.data.access_token;
}

export const getActivities = async (accessToken: string) => {
    return axios.get(
        `https://www.strava.com/api/v3/athlete/activities?per_page=100`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );
}

export const getActivity = async (accessToken: string, id: number) => {
    const strava_activity = await axios.get(
        `https://www.strava.com/api/v3/activities/${id}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );

    const strava_segments = await axios.get(
        `https://www.strava.com/api/v3/activities/${id}/streams?keys=latlng,time,heartrate,altitude&key_by_type=true`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );

    return {
        activity: strava_activity.data,
        segments: strava_segments.data
    };
}