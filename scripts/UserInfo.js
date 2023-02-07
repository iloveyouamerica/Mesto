
// Принимает в конструктор объект с селекторами двух элементов: 
// элемента имени пользователя и элемента информации о себе

export class UserInfo {
  constructor({userNameSelector, userInfoSelector}) {
    this._userName = document.querySelector(userNameSelector);
    this._userInfo = document.querySelector(userInfoSelector);
  }

  // публичный метод, возвращает объект с данными пользователя
  // Этот метод пригодится когда данные пользователя нужно будет подставить в форму при открытии.
  getUserInfo() {
    return {
      userName: this._userName.textContent,
      userInfo: this._userInfo.textContent
    };
  }

  // публичный метод setUserInfo, который принимает новые данные пользователя и добавляет их на страницу
  setUserInfo(userData) {
    this._userName.textContent = userData.username;
    this._userInfo.textContent = userData.userinfo;
  }
}