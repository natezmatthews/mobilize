export default function valid(shortPath: string): boolean {
    const regex = /^[A-Za-z0-9_-]+$/
    return shortPath.match(regex) !== null;
}