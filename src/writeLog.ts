import fs from 'fs';
import { differenceInDays, format } from 'date-fns';

export const today = new Date().toString().split(' ')[0];
const file = `${__dirname}/../log/${today}.log`;

function getDateTimeNow(): string {
  return format(new Date(), 'yyyy/MM/dd HH:mm:ss');
}

function isWeekAgo(): boolean {
  let flag;

  try {
    const stats = fs.statSync(file);
    const lastModified = stats.mtime;
    const date = new Date();
    differenceInDays(date, lastModified) >= 7 ? (flag = true) : (flag = false);
    return flag;
  } catch (error) {
    console.log(`Created file...`);
  }
}

export const writeLog = (text: string) => {
  const msg = `${getDateTimeNow()} - ${text}\n`;

  if (isWeekAgo()) {
    fs.writeFile(file, msg, (err) => {
      if (err) throw err;
      else console.log(`Today is ${today}, Write File on ${file}`);
    });
  } else {
    fs.appendFile(file, msg, (err) => {
      if (err) throw err;
    });
  }
};
