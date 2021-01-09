/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest();
  if (options.method === "GET") {
    let url = "";
    for (let key in options.data) {
      url += `&${key}=${options.data[key]}`;
    }
    url = `${options.url}?${url.slice(1)}`;
    xhr.open(options.method, url);
    xhr.withCredentials = true;

    for (let key in options.headers) {
      xhr.setRequestHeader(key, options.headers[key]);
    }

    xhr.send();
  } else {
    const formData = new FormData();
    for (let key in options.data) {
      formData.append(key, options.data[key]);
    }
    xhr.open(options.method, options.url);
    xhr.withCredentials = true;

    for (let key in options.headers) {
      xhr.setRequestHeader(key, options.headers[key]);
    }

    xhr.send(formData);
  }
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState === xhr.DONE) {
      const response = JSON.parse(xhr.responseText);
      
      if (response.success === true) {
        options.callback(null, response);
      } else {
        options.callback(response.error, response);
      }
    }
  });
};
