import {Popup} from './Popup.js';

export class PopupWithImage extends Popup{
  constructor(popupSelector) {
    super(popupSelector);

    // в конструкторе определяем переменные класса (картинка попапа и подпись к картинке)
    this._popupBigImage = this._popup.querySelector('.view-image__image');
    this._popupTitle = this._popup.querySelector('.view-image__title');
  }

  open(image, title) {
    super.open();

    // присваиваем значения
    this._popupBigImage.src = image;
    this._popupBigImage.alt = `${title}.`; // в alt ставим точку (для ридеров)
    this._popupTitle.textContent = title;
  }
}