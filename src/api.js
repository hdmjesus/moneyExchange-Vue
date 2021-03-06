const url = "https://api.coincap.io/v2";

function getAssets() {
  return fetch(`${url}/assets?limit=20`)
    .then(response => response.json())
    .then(response => {
      return response.data;
    })
    .catch(err => console.log(err.message));
}

function getAsset(coin) {
  return fetch(`${url}/assets/${coin}`)
    .then(response => response.json())
    .then(response => {
      return response.data;
    })
    .catch(err => console.log(err.message));
}

function getAssetHistory(coin) {
  const now = new Date();
  const end = now.getTime();
  now.setDate(now.getDate() - 1);
  const start = now.getTime();
  console.log(start);
  console.log(end);

  return fetch(
    `${url}/assets/${coin}/history?interval=h1&start=${start}&end=${end}`
  )
    .then(response => response.json())
    .then(response => {
      return response.data;
    })
    .catch(err => console.log(err.message));
}

function getMarkets(coin) {
  return fetch(`${url}/assets/${coin}/markets?limit=5`)
    .then(response => response.json())
    .then(response => {
      return response.data;
    })
    .catch(err => console.log(err.message));
}
function getExchanges(id) {
  return fetch(`${url}/exchanges/${id}`)
    .then(response => response.json())
    .then(response => {
      return response.data;
    })
    .catch(err => console.log(err.message));
}

export default {
  getAssets,
  getAsset,
  getAssetHistory,
  getMarkets,
  getExchanges
};
