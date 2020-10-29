import { check } from 'k6';
import http from 'k6/http';

export default function () {
  // const url = 'http://localhost:8088/performance';
  const url = 'http://push.nextschool.io:8088/performance';

  const payload = JSON.stringify({
    token:
      'dptcndUMS1KRAoUIeiGDod:APA91bEiS3GJyzNPZE-pZMSL7enEMSwmSlQkHq5YyL59-V4lzpYJY3hAoJ5UwUwVsG0K7DNR6Eikup58MJ5uSfb7tEE-fuOLIqYJ7cVZYF8TX92Dlur-yd1eMSVfgmpjfsHZ_i9a83-h',
    title: `ข้อความจาก NextSchool ${new Date().toLocaleTimeString()}}`,
    msg: 'ทดสอบส่งข้อความ ได้รับหรือไม่ กรุณาแจ้งกลับทาง line@ นะคะ',
    badge: 0,
    data: {
      pushData: {
        route: 'foodCourtTrans',
        params: {
          studentId: '278285',
          profile: {
            studentId: '278285',
            date: '2019-09-06',
          },
        },
      },
    },
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  if (res.status === 200) {
    const body = JSON.parse(res.body);
    const token = body.token;

    check(token, {
      'Is Token not undefined': (token) => typeof token !== 'undefined',
    });
  }
}
