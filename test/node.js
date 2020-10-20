import { check } from 'k6';
import http from 'k6/http';
export default function () {
  var url = 'https://localhost:8448/test2';
  var formdata = {
    school_id: '202',
  };
  var params = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirects: 1,
  };
  let res = http.post(url, formdata, params);
  console.log(res.body);

  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  if (res.status === 200) {
    // console.log(JSON.stringify(res.body));
    const body = JSON.parse(res.body);
    const school_id = body.school_id;

    // console.log(`total : ${total}`);
    // console.log(`checkedIn : ${checkedIn}`);
    // console.log(school_id);

    check(school_id, {
      'is stats total is ok': (school_id) => typeof school_id !== 'undefined',
    });
  }
}
