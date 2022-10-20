
export async function listAssets() {
  let res;

  await fetch('http://localhost:5000/assets')
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      res = data;
    })
    .catch(err => {
      res = err
    })

  return res;
}