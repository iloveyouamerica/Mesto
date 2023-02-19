
const optionsApi = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-60',
  token: '5ade358d-5f88-408c-b48d-f9edcc6552b1'
};

class Api {
  constructor({baseUrl, token}) {
    this._baseUrl = baseUrl;
    this._token = token;
  }

  // метод для загрузки информации о пользователе с сервера
  getUserInfoFromServer() {
    // создаём запрос на сервер для получения информации о пользователе, которая хранится на сервере
    fetch(`${this._baseUrl}/users/me`, {
      headers: {
        authorization: this._token
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, data.name, data.about, data.avatar);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

const api = new Api(optionsApi);
api.getUserInfoFromServer();