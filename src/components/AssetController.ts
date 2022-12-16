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

export async function listAssetsNew() {
  let res;

  await fetch(BASE_URL + '/assetsNew')
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

export async function downloadAttachment(asset) {
  let res;

  if (asset?.fields.attachment[0]?.content) {
    await fetch(BASE_URL + `/downloadAttachment?attachmentUrl=${asset.fields.attachment[0].thumbnail}`)
      .then((response) => response.blob())
      .then((blob) => {
        var img = URL.createObjectURL(blob);
        res = img;
      })
      .catch(err => {
        res = err;
        throw Error(err);
      })

  } else {
    console.log('attachment not found');
    res = ''
  }

  return res;
}

