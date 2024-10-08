const SETTINGS_KEY = 'settings';

export const getSettings = () => {
    if (!localStorage.getItem(SETTINGS_KEY)) {
        return null;
    }
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
};

export const saveSettings = (settings: any) => {
    localStorage
        .setItem(SETTINGS_KEY, JSON.stringify(settings));
}