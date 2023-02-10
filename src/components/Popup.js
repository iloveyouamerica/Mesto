// класс открывает и закрывает попап (принимает 1 параметр - селектор попапа)
export class Popup {
  constructor(popupSelector) {
    this._popup = document.querySelector(popupSelector);

    // привяжем this к объекту
    this._handleEscClose = this._handleEscClose.bind(this);
  }

  // приватный метод закрытия попап по Esc
  _handleEscClose(event) {
    // если была нажата клавиша Esc
    if(event.key === 'Escape') {
      this.close();
    }
  }

  // публичный метод который добавляет слушатель клика иконке закрытия попапа.
  // Модальное окно также закрывается при клике на затемнённую область вокруг формы.
  setEventListeners() {
    this._popup.addEventListener('click', (event) => {
      // если клик был по кнопке закрытия или по самому попап (пустое затемнённое место)
      if(event.target.classList.contains('popup__close-btn') || event.target.classList.contains('popup_opened')) {
        // закрыть попап
        this.close();
      }
    });
  }

  // публичный метод открытия попап
  open() {
    // указанному попап добавим модификатор открытия
    this._popup.classList.add('popup_opened');

    // вешаем обработчик события на документ и отслеживаем клик по клавише Esc
    document.addEventListener('keydown', this._handleEscClose);
  }

  // публичный метод закрытия попап
  close() {
    // указанному попап удалим модификатор открытия
    this._popup.classList.remove('popup_opened');

    // вешаем обработчик события на документ и отслеживаем клик по клавише Esc
    document.removeEventListener('keydown', this._handleEscClose);
  }
}