export const getOrders = () =>
  sendRequest("/orders", {
    method: "GET",
  });

export const addOrder = (data) =>
  sendRequest("/orders", {
    body: JSON.stringify(data),
    method: "POST",
  });

export const updateOrder = (data) =>
  sendRequest("/orders/" + data.order_id, {
    body: JSON.stringify(data),
    method: "PUT",
  });

export const deleteOrder = (order_id) =>
  sendRequest("/orders/" + order_id, {
    method: "DELETE",
  });

async function sendRequest(path, opts = {}) {
  const headers = Object.assign({}, opts.headers || {}, {
    "Content-type": "application/json; charset=UTF-8",
  });

  const response = await fetch(
    getAPIURL() + path,
    Object.assign({method: "POST", mode: "same-origin"}, opts, {
      headers,
    })
  );

  console.log(response);
  const data = await response.json();

  if (response.status === 302 && data.redirectUri) {
    window.location = data.redirectUri;
    return [];
  }

  if (response.status !== 200 || data.error) {
    console.log(data.error);
    throw new Error(`${response.status} Message: ${data.message}`);
  }

  return data;
}

const getAPIURL = () => {
  var apiUrl = window.Config.API_URL;
  return apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
};
