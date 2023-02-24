
export class Api {
  constructor({baseUrl, token}) {
    this._baseUrl = baseUrl;
    this._token = token;
  }

  // метод обработки результата ответа сервера
  _checkResponse(res) {
    if(res.ok) {
      return res.json();
    }
    return Promise.reject(new Error('Произошла ошибка получения данных с сервера'));
  }

  // метод для загрузки информации о пользователе с сервера
  getUserInfo() {
    // создаём запрос на сервер для получения информации о пользователе, которая хранится на сервере
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        authorization: this._token
      }
    })
      .then(this._checkResponse);
  }

  // метод получения карточек с сервера
  getCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        authorization: this._token
      }
    })
      .then(this._checkResponse);
  }

  // метод для редактирования профиля
  editUserProfile({name, about}) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
      .then(this._checkResponse);
  }

  // метод для добавления новой карточки
  addNewCard({name, link}) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        link: link
      })
    })
      .then(this._checkResponse);
  }

  // метод для удаления карточки https://mesto.nomoreparties.co/v1/cohortId/cards/cardId 
  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      }
    })
      .then(this._checkResponse);
  }

  // метод для добавления лайка карточке https://mesto.nomoreparties.co/v1/cohortId/cards/cardId/likes
  addLikeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      }
    })
      .then(this._checkResponse);
  }

  // метод для удаления лайка карточке https://mesto.nomoreparties.co/v1/cohortId/cards/cardId/likes
  deleteLikeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      }
    })
      .then(this._checkResponse);
  }

  // метод для редактирования аватара пользователя PATCH https://mesto.nomoreparties.co/v1/cohortId/users/me/avatar 
  changeAvatar(avatarLink) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: avatarLink
      })
    })
      .then(this._checkResponse);
  }

}

/* const api = new Api(optionsApi, (data) => {
  console.log(data);
});
api.getUserInfoFromServer(); */

/*
  class Api {
    1. берёт данные пользователя с сервера
    2. берёт карточки с сервера
    3. отправляет запрос на обновление данных пользователя с сервера
    4. отправляет запрос на удаление карточек
    5. отправляет запрос на добавление лайков
    6. отправляет запрос на снятие лайков
    7. отправляет запрос на добавление новой карточки на сервер
  }
*/