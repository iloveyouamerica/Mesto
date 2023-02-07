import { Card } from '../components/Card.js';
import { validationSettings, FormValidator } from '../components/FormValidator.js';
import { Section } from '../components/Section.js';
import { PopupWithImage } from '../components/PopupWithImage.js';
import { PopupWithForm } from '../components/PopupWithForm.js';
import { UserInfo } from '../components/UserInfo.js';
import { initialCards } from '../utils/constants.js';

// определяем переменные
const buttonOpenEditProfileForm = document.querySelector('#edit-btn'); // кнопка редактирования профиля
const buttonOpenAddCardForm = document.querySelector('#add-btn'); // кнопка добавления карточки

const inputName = document.querySelector('#input-name'); // input с именем
const inputAbout = document.querySelector('#input-about'); // input о себе

const cardContainer = document.querySelector('.elements__list'); // <ul> блок для карточек

const bigImage = document.querySelector('.view-image__image'); // находим большую картинку в popup'е просмотра
const bigImageTitle = document.querySelector('.view-image__title'); // находим title большой картинки в popup'е просмотра

// ------------------------------------------- NEW CARD CREATE ----------------------------------------
// функция создания новой карточки через экземпляр класса Card (можно без неё, напрямую создавать в экз. класса Section)
// функция открытия большой картинки для просмотра в полном размере
const handleCardClick = (name, link) => {
  bigImage.src = link;
  bigImage.alt = name;
  bigImageTitle.textContent = name;

  // открываем попап с большой картинкой (экземпляр класса создан 1 раз ниже)
  popupWithImage.open(link, name); // вызываем метод открытия попап

  // устанавливаем слушатели событий на попап с большой картинкой
  popupWithImage.setEventListeners(); // вызываем метод добавления слушателей событий
};

// создаём 1 раз 1 экземпляр класса попапа для большой картинки
const popupWithImage = new PopupWithImage('#popup-image-view'); // создаём объект класса

// функция создания новой карточки
const createCard = (item) => {
  const card = new Card(item, '#template-card', handleCardClick);
  const cardElement = card.generateCard();
  return cardElement;
};

// циклом берём все данные из массива карточек
const cardList = new Section({
  items: initialCards.reverse(),
  renderer: (item) => {
    const card = createCard(item);

    // добавляем карточку на страницу
    cardList.addItem(card);
  }
}, cardContainer);

// вызовем метод экземпляра класса Section для отрисовки (не добавления) карточки
cardList.renderItems();

// -------------------------------------------- Создаём экемпляр класса UserInfo---------------------------------
const userInfo = new UserInfo({
  userNameSelector: '.profile__name',
  userInfoSelector: '.profile__about'
});

// -------------------------------------------- Создаём экземпляры классов FormValidator ------------------------
const validatorFromEdit = new FormValidator(validationSettings, '#form-profile-edit'); // валидатор формы редактирования профиля
validatorFromEdit.enableValidation(); // включаем валидацию формы
const validatorFromAdd = new FormValidator(validationSettings, '#form-card-add'); // валидатор формы добавления карточки
validatorFromAdd.enableValidation(); // включаем валидацию формы


// -------------------------------------------- Создаём экземпляры классов Popup и необходимые для работы функции

// callback сабмита формы редактирования профиля (второй параметр класса PopupWithForm)
const handleFormSubmitProfileEdit = (data) => { // здесь data - это объект с данными полей формы
  // установить новые данные пользователя на страницу
  userInfo.setUserInfo(data);
  // попап закроется сам потому что коллбэк сабмита формы имеет такой метод в классе PopupWithForm
};

// callback сабмита формы добавления новой карточки (второй параметр класса PopupWithForm)
const handleFormSubmitCardAdd = (data) => { // здесь data - это объект с данными полей формы
  // здесь пришёл такой объект: {name: 'NAME', link: 'LINK'}
  // данные для карточки есть, теперь нужно создать самы карточку
  // в класс Card мы передаём массив объектов
  const newCard = new Section({
    items: [data],
    renderer: (item) => {
      const card = createCard(item);

      // добавляем карточку на страницу
      newCard.addItem(card);
    }
  }, cardContainer);

  newCard.renderItems();
};

// попап с формой редактирования профиля
const popupFormEdit = new PopupWithForm('#popup-edit', handleFormSubmitProfileEdit);
// установим ему слушатели событий
popupFormEdit.setEventListeners();

// попап с формой добавления нового места
const popupFormAdd = new PopupWithForm('#popup-add', handleFormSubmitCardAdd);
// установим ему слушатели событий
popupFormAdd.setEventListeners();

// -------------------------------------------- Открываем popup с формой редактирования профиля ------

// при клике на кнопку редактирования профайла
buttonOpenEditProfileForm.addEventListener('click', () => {
  // откроем попап с формой редактирования
  popupFormEdit.open();

  // получим данные о пользователе со страницы
  const userData = userInfo.getUserInfo();

  // присвоим полям формы значения о пользователе
  inputName.value = userData.userName;
  inputAbout.value = userData.userInfo;

  // при открытии попапа проверим состояние кнопки сабмит в форме
  validatorFromEdit.enableValidation();
});

// -------------------------------------------- Открываем popup с формой добавления новой карточки ----
// при клике на кнопку добавления новой карточки
buttonOpenAddCardForm.addEventListener('click', () => {
  // откроем попап с формой добавления данных для новой карточки
  popupFormAdd.open();

  // при открытии попапа проверим состояние кнопки сабмит в форме
  validatorFromAdd.enableValidation();
});