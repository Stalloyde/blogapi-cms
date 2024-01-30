import { DateTime } from 'luxon';

const formatDate = (date) =>
  DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED);

export default formatDate;
