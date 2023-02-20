
// Принимает в конструктор объект с селекторами двух элементов: 
// элемента имени пользователя и элемента информации о себе

export class UserInfo {
  constructor({userNameSelector, userInfoSelector, userAvatarSelector}) {
    this._userName = document.querySelector(userNameSelector);
    this._userInfo = document.querySelector(userInfoSelector);
    this._userAvatar = document.querySelector(userAvatarSelector);
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
  setUserInfo({name, about, avatar, _id}) {
    this._userName.textContent = name;
    this._userInfo.textContent = about;
    this._userAvatar.src = avatar;
    this.userId = _id;
  }
}