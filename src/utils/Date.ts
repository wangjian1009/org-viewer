import moment from 'moment';

export function formatDate(date: Date, base: Date): string {
  const target = moment(date);
  target.calendar(undefined, {
    sameDay: '[今天]',
    nextDay: '[明天]',
    nextWeek: 'dddd',
    lastDay: '[昨天]',
    lastWeek: '[上个] dddd',
    sameElse: 'DD/MM/YYYY'
  });

  return target.calendar(base);
  // const diffDay = target.diff(base, 'days');
  // if (diffDay == 0) {
  //   return "今天";
  // }
  // else {
  //   return target.format("YYYY年MM月DD日");
  // }
}
