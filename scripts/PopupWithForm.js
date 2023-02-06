import {Popup} from './Popup.js';

export class PopupWithForm extends Popup {
  // в конструктор добавляем callback сабмита формы
  constructor(popupSelector) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit; // функция-коллбэк сабмита формы
    this._form = this._popup.querySelector('.popup__form'); // найдём форму данного попап
  }

  // приватный метод _getInputValues, который собирает данные всех полей формы данного попап
  _getInputValues() {
    // находим все инпуты формы открытого попап
    this._inputsList = this._form.querySelectorAll('.form__input');

    // объект с данными полей формы
    this._formValues = {};

    // обойдём поля формы циклом и соберём данные в объект
    this._inputsList.forEach((item) => {
      this._formValues[item.name] = item.values;
    });
    
    // вернём объект со значениями полей формы
    return this._formValues;
  }

  // Перезаписывает родительский метод setEventListeners. 
  //Метод setEventListeners класса PopupWithForm должен не только добавлять обработчик клика иконке закрытия, 
  //но и добавлять обработчик сабмита формы.
  setEventListeners() {
    super.setEventListeners(); // вызываем родительский метод класса Popup

    // вешаем обработчик события на форму попапа
    this._form.addEventListener('submit', (event) => {
      event.preventDefault(); // отменяем стандартное событие поведения формы

      // в коллбэк сабмита передаём данные инпутов (объект данных)
      this._handleFormSubmit(this._getInputValues());

      // закрываем попап с формой
      this.close();
    });
  }

  // Перезаписывает родительский метод close, так как при закрытии попапа форма должна ещё и сбрасываться.
  close() {
    super.close(); // вызываем метод родителя и ниже расширяем

    this._form.reset(); // сбросим поля / очистим форму этого попапа
  }
}