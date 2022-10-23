import { BASE_URL } from "../appSettings";

export async function listAssets() {
  let res;

  await fetch(BASE_URL + '/assets')
    .then((response) => response.json())
    .then((data) => {
      res = data;
    })
    .catch(err => {
      res = err;
      throw Error(err);
    })

  return res;
}

export async function getAssetById(id) {
  let res;

  console.log(id);

  await fetch(BASE_URL + `/asset?assetid=${id}`)
    .then((response) => response.json())
    .then((data) => {
      res = data;
    })
    .catch(err => {
      res = err;
      throw Error(err);
    })

  return res;
}

export async function getAssetRequestsByAssetId(id) {
  let res;

  await fetch(BASE_URL + `/assetRequestsByAssetId?assetid=${id}`)
    .then((response) => response.json())
    .then((data) => {
      res = data;
    })
    .catch(err => {
      res = err;
      throw Error(err);
    })

  return res;
}

export async function getAssetRequestsByAssetIdAndDate(id, revenuefilter) {
  let res;

  await fetch(BASE_URL + `/assetRequestsByAssetIdAndDate?assetid=${id}&revenuefilter=${revenuefilter}`)
    .then((response) => response.json())
    .then((data) => {
      res = data;
    })
    .catch(err => {
      res = err;
      throw Error(err);
    })

  return res;
}