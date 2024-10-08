export const formatNumber = (n: number, m: number = 2) => n?.toFixed(m);

export const formatTime = (ms: number) => {
    const diff = Number(ms);
    const hours = Math.floor(diff / 1000 / 3600);
    const minutes = Math.floor((diff - hours * 1000 * 3600) / 1000 / 60);
    const seconds = Math.floor((diff - hours * 1000 * 3600 - minutes * 1000 * 60) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
}

export const speedToMinKm = (speed: number) => {
    if (speed === 0) return '0:00';
    const min = 60 / speed;
    const sec = (min - Math.floor(min)) * 60;
    return `${Math.floor(min)}:${Math.floor(sec) < 10 ? '0' + Math.floor(sec) : Math.floor(sec)}`;
}