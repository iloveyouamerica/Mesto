import {Popup} from './Popup.js';

// класс попапа с подтверждением действия (удалить карточку)
export class PopupConfirm extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._form =  this._popup.querySelector('.popup__form');// найдём форму данного попап (там только кнопка submit)
  }

  // метод активации сабмита формы попапа
  setSubmitForm(method) {
    this._handleFormSubmit = method;
  }

  // метод установки слушателей событий
  setEventListeners() {
    super.setEventListeners();

    // вешаем обработчик события на форму попапа подтверждения при submit
    this._form.addEventListener('submit', (event) => {
      event.preventDefault(); // отменяем стандартное поведение формы

      // вызываем callback сабмита
      this._handleFormSubmit();
    });
  }
}