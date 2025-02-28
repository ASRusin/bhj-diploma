/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static URL = "/user";

  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.user = JSON.stringify(user);
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem("user");
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    if (localStorage.user) {
      try {
        return JSON.parse(localStorage.user);
      } catch (e) {
        return null;
      }
    } else {
      return undefined;
    }
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(data, callback = (f) => f) {
    return createRequest({
      url: this.URL + "/current",
      data: data,
      responseType: "json",
      method: "GET",
      callback: (err, response) => {
        if (response && response.user) {
          User.setCurrent(response.user);
        } else {
          User.unsetCurrent();
        }
      },
    });
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback = (f) => f) {
    return createRequest({
      url: this.URL + "/login",
      data: data,
      responseType: "json",
      method: "POST",
      callback: (err, response) => {
        if (response && response.user) {
          User.setCurrent(response.user);
        }
        callback(err, response);
      },
    });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback = (f) => f) {
    return createRequest({
      url: this.URL + "/register",
      data: data,
      responseType: "json",
      method: "POST",
      callback: (err, response) => {
        if (response && response.user) {
          User.setCurrent(response.user);
        }
        callback(err, response);
      },
    });
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(data, callback = (f) => f) {
    return createRequest({
      url: this.URL + "/logout",
      data: data,
      responseType: "json",
      method: "POST",
      callback(err, response) {
        if (response.success === true) {
          User.unsetCurrent();
        }
        callback(err, response);
      },
    });
  }
}
