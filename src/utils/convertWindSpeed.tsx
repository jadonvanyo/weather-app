export function convertWindSpeed(speedInMeteresPerScond: number): string {
    const speedInKilometersPerHour = speedInMeteresPerScond * 3.6;
    return `${speedInKilometersPerHour.toFixed(1)} km/h`
}