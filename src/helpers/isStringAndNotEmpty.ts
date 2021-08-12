import { isString } from "lodash";

export default function isStringAndNotEmpty(s) {
    return isString(s) && s.length > 0;
}