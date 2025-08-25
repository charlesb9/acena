import dayjs from 'dayjs';

class DateHelper {
  static add(date, value, type) {
    return dayjs(date).add(value, type);
  }
}

export default DateHelper;