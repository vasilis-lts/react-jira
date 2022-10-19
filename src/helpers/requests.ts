

export async function getProject() {

  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic bW9uaWFyb3Mub3JhbmdlQGdtYWlsLmNvbTpDaWt4UDQ3SExEQUZkMHRIWFd2WjQxNzQ=");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "atlassian.xsrf.token=6a8987f4-5a8a-4cd7-baf1-e16e286bfac9_fdb509d9d4ad94a51d0859ed700716490331d2c9_lin");

  var raw = JSON.stringify({
    "name": "Test scrum board",
    "type": "scrum",
    "filterId": 10060
  });

  var requestOptions: any = {
    method: 'GET',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://orangebg.atlassian.net/rest/agile/1.0/board/3/project", requestOptions)
    .then(response => response.text())
    .then(result => { console.log(result); return result; })
    .catch(error => console.log('error', error));
}