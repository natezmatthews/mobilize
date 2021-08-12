import { isString } from "lodash";

export default function isStringAndNotEmpty(s: string): boolean {
    return isString(s) && s.length > 0;
}