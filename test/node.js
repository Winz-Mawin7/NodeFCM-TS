import { check } from 'k6';
import http from 'k6/http';

export default function () {
  // var url = 'https://localhost:8443/test2';
  var url = 'http://localhost:8000/test2';
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

  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  if (res.status === 200) {
    const body = JSON.parse(res.body);
    const school_id = body.school_id;

    check(school_id, {
      'is stats total is ok': (school_id) => typeof school_id !== 'undefined',
    });
  }
}
