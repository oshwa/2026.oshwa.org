import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import advancedFormat from "dayjs/plugin/advancedFormat";

import config from "./metadata";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);

export const DefaultParseFormat = "YYYY-M-D h:mm A";

export type DateTime = dayjs.Dayjs;

export function datetime(date: DateTime | Date | string, tz?: string): DateTime {
    tz ??= config.timezone;

    if (typeof date === "string") {
        date = parse(date, DefaultParseFormat, tz);
    }

    return dayjs.tz(date, tz);
}

export function parse(date: Date | string, format: string = DefaultParseFormat, tz?: string): DateTime {
    tz ??= config.timezone;
    return dayjs.tz(date, format, tz);
}

export function format(date: string | DateTime | Date, format: string, tz?: string) {
    // Reference: https://day.js.org/docs/en/display/format
    tz ??= config.timezone;

    if (typeof date === "string") {
        date = parse(date, DefaultParseFormat, tz);
    }

    return dayjs.tz(date, tz).format(format);
}

export function sorter(a: string | DateTime | Date, b: string | DateTime | Date) {
    const a_ = datetime(a);
    const b_ = datetime(b);
    return a_.unix() - b_.unix();
}

