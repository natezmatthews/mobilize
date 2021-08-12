export default function isoDateString(date: Date): string {
    return date.toISOString().split('T')[0];
}