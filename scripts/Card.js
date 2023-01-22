
export class Card {
  constructor(data, template, handleCardClick) {
    this._name = data.name;
    this._link = data.link;
    this._template = template;
    this._handleCardClick = handleCardClick;
  }

  // метод получает шаблон карты
  _getTemplate() {
    const cardTemplate = document.querySelector(this._template).content.querySelector('.elements__list-item').cloneNode(true);
    return cardTemplate;
  }

  // метод создаёт карту на основе шаблона и данных
  generateCard() {
    this._card = this._getTemplate();

    // переменные класса
    this._cardImage = this._card.querySelector('.card__image');
    this._cardTitle = this._card.querySelector('.card__title');

    this._cardImage.src = this._link;
    this._cardImage.alt = this._name;
    this._cardTitle.textContent = this._name;

    // добавим метод обработки событий
    this._setEventListeners();

    return this._card;
  }

  // метод для активации и деактивации лайка
  _getLike() {
    this._cardLikeButton.classList.toggle('card__like_active');
  }

  // метод удаления карточки
  _deleteCard() {
    this._card.remove();
    this._card = null;
  }

  // метод устанавливает слушатели событий на карточку
  _setEventListeners() {
    // переменные класса
    this._cardLikeButton = this._card.querySelector('.card__like');
    this._cardDeleteButton = this._card.querySelector('.card__delete');

    // слушатель клика по лайку
    this._cardLikeButton.addEventListener('click', () => {
      this._getLike();
    });

    // слушатель удаления карточки (клик по корзине)
    this._cardDeleteButton.addEventListener('click', () => {
      this._deleteCard();
    });

    // слушатель клика по картинке карточки, чтобы открыть её в большом размере
    this._cardImage.addEventListener('click', () => {
      this._handleCardClick(this._name, this._link);
    });
  }
}