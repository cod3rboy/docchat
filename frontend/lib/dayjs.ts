import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import _dayjs from "dayjs";

_dayjs.extend(duration);
_dayjs.extend(relativeTime);

export const dayjs = _dayjs;
