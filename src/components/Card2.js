
export class Card2 {
  constructor(data, template, {handleImageClick, handleLikeClick, handleDeleteLikeClick, handleDeleteCard}) {
    this._name = data.name; // название карточки с сервера
    this._link = data.link; // url картинки (с сервера)
    this._likes = data.likes; // счётчик лайков (с свервера)
    this._owner = data.owner._id; // id владельца карточки (с сервера)
    this._template = template; // селектор шаблона
    this._handleImageClick = handleImageClick; // метод для открытия большой картинки
    this._handleLikeClick = handleLikeClick; // метод для добавления лайка
    this._handleDeleteLikeClick = handleDeleteLikeClick; // метод для снятия лайка
    this._handleDeleteCard = handleDeleteCard; // метод для удаления карточки
  }

  // метод получает шаблон карты
  _getTemplate() {
    const cardTemplate = document.querySelector(this._template).content.querySelector('.elements__list-item').cloneNode(true);
    return cardTemplate;
  }

  // метод создаёт карточку на основе шаблона и данных
  generateCard(myId) {
    this._card = this._getTemplate(); // получаем шаблон карточки

    // переменные класса
    this._cardImage = this._card.querySelector('.card__image'); // картинка карточки
    this._cardTitle = this._card.querySelector('.card__title'); // название карточки
    this._cardLikeButton = this._card.querySelector('.card__like'); // кнопка лайка
    this._cardDeleteButton = this._card.querySelector('.card__delete'); // кнопка удаления карточки
    this._cardLikeCount = this._card.querySelector('.card__like-counter'); // поле с количеством лайков

    // установим значения карточке
    this._cardImage.src = this._link;
    this._cardImage.alt = this._name;
    this._cardTitle.textContent = this._name;
    this._cardLikeCount.textContent = this._likes.length;

    // удалим кнопку корзины (удаления карточки), если это картчка загружена не мною
    if(this._owner != myId) {
      this._cardDeleteButton.remove();
    }

    // добавим метод обработки событий
    this._setEventListeners();

    return this._card;
  }

  // внутренний ментод для удаления лайка с карточки
  _deleteLike() {
    // удалим класс с активным лайком
    this._cardLikeButton.classList.remove('card__like_active');
    //console.log("Delete Like!");

    // вызовем функцию обработчик (опишем её в index.js)
    this._handleDeleteLikeClick();
  }

  // внутренний метод для добавления лайка карточке
  _getLike() {
    // установим класс с активным лайком
    this._cardLikeButton.classList.add('card__like_active');
    //console.log("Get Like");

    // вызовем функцию, описанную в index.js
    this._handleLikeClick();
  }

  // метод устанавливает слушатели событий на карточку
  _setEventListeners() {
    // слушатель клика по лайку
    this._cardLikeButton.addEventListener('click', () => {
      //console.log('Like Button RULES!', this);
      // если кнопке лайк уже установлен лайк (есть чёрное сердечко)
      if(this._cardLikeButton.classList.contains('card__like_active')) {
        // удалить лайк
        this._deleteLike();
      } else {
        //добавить лайк
        this._getLike();
      }
    });

    // слушатель удаления карточки (клик по корзине)
    this._cardDeleteButton.addEventListener('click', () => {
      this._handleDeleteCard();
    });

    // слушатель клика по картинке карточки, чтобы открыть её в большом размере
    this._cardImage.addEventListener('click', () => {
      this._handleImageClick(this._name, this._link);
    });
  }
}