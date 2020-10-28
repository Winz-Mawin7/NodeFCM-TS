import { check } from 'k6';
import http from 'k6/http';

export default function () {
  const url = 'http://localhost:8088/performance';
  // const mock_data = {
  //   token:
  //     'dptcndUMS1KRAoUIeiGDod:APA91bEiS3GJyzNPZE-pZMSL7enEMSwmSlQkHq5YyL59-V4lzpYJY3hAoJ5UwUwVsG0K7DNR6Eikup58MJ5uSfb7tEE-fuOLIqYJ7cVZYF8TX92Dlur-yd1eMSVfgmpjfsHZ_i9a83-h',
  //   title: `ข้อความจาก NextSchool ${new Date().toLocaleTimeString()}}`,
  //   msg: 'ทดสอบส่งข้อความ ได้รับหรือไม่ กรุณาแจ้งกลับทาง line@ นะคะ',
  //   badge: 0,
  //   data: {
  //     pushData: {
  //       route: 'foodCourtTrans',
  //       params: {
  //         studentId: '278285',
  //         profile: {
  //           studentId: '278285',
  //           date: '2019-09-06',
  //         },
  //       },
  //     },
  //   },

  const mock_data = {
    schoolId: '123',
  };

  const res = http.post(url, mock_data);
  console.log(JSON.stringify(res, null, 2));

  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  if (res.status === 200) {
    const body = JSON.parse(res.data);
    console.log(body);
    // const school_id = body.school_id;

    // check(school_id, {
    //   'is stats total is ok': (school_id) => typeof school_id !== 'undefined',
    // });
  }
}
