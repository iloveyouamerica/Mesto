class Card {
  constructor(name, link, template) {
    this._name = name;
    this._link = link;
    this._template = template;
  }

  // метод получает шаблон карты
  _getTemplate() {
    const cardTemplate = document.querySelector(this._template).content.querySelector('.elements__list-item').cloneNode(true);
    return cardTemplate;
  }

  // метод создаёт карту на основе шаблона и данных
  generateCard() {
    this._card = this._getTemplate();

    this._card.querySelector('.card__image').src = this._link;
    this._card.querySelector('.card__image').alt = this._name;
    this._card.querySelector('.card__title').textContent = this._name;

    // добавим метод обработки событий
    this._setEventListeners();

    return this._card;
  }

  // метод для активации и деактивации лайка
  _getLike() {
    this._card.querySelector('.card__like').classList.toggle('card__like_active');
  }

  // метод удаления карточки
  _deleteCard() {
    this._card.remove();
  }

  // метод откроет картинку в большом размере внутри popup
  _openBigImage() {
    // вызываем функцию открытия попапа с картинкой большого размера
    createBigViewImage(this._name, this._link);
  }

  // метод устанавливает слушатели событий на карточку
  _setEventListeners() {

    // слушатель клика по лайку
    this._card.querySelector('.card__like').addEventListener('click', () => {
      this._getLike();
    });

    // слушатель удаления карточки (клик по корзине)
    this._card.querySelector('.card__delete').addEventListener('click', () => {
      this._deleteCard();
    });

    // слушатель клика по картинку карточки, чтобы открыть её в большом размере
    this._card.querySelector('.card__image').addEventListener('click', () => {
      this._openBigImage();
    });
  }
}