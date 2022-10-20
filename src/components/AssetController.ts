import { BASE_URL } from "../appSettings";

export async function listAssets() {
  let res;

  await fetch(BASE_URL + '/assets')
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      res = data;
    })
    .catch(err => {
      res = err;
      throw Error(err);
    })

  return res;
}