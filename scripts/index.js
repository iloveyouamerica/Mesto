import { Card } from './Card.js';
import { validationSettings, FormValidator } from './FormValidator.js';
import { initialCards } from './constants.js';
import { Section } from './Section.js';
import { PopupWithImage } from './PopupWithImage.js';
import { PopupWithForm } from './PopupWithForm.js';
import { UserInfo } from './UserInfo.js';

// определяем переменные
const buttonOpenEditProfileForm = document.querySelector('#edit-btn'); // кнопка редактирования профиля
const buttonOpenAddCardForm = document.querySelector('#add-btn'); // кнопка добавления карточки

/* const popupEditProfile = document.querySelector('#popup-edit'); // popup редактирования данных пользователя
const popupAddCard = document.querySelector('#popup-add'); // popup добавления новых фотокарточек
const popupImageView = document.querySelector('#popup-image-view'); // popup для большой картинки

const closePopupButtons = document.querySelectorAll('.popup__close-btn'); // все кнопки-крестики закрытия попапов

const profileName = document.querySelector('.profile__name'); // имя
const profileAbout = document.querySelector('.profile__about'); // о себе */

const inputName = document.querySelector('#input-name'); // input с именем
const inputAbout = document.querySelector('#input-about'); // input о себе

/* const inputNameCard = document.querySelector('#input-place-name'); // input с названием места
const inputLinkCard = document.querySelector('#input-place-link'); // input ссылка на место

const formProfileEdit = document.querySelector('#form-profile-edit'); // форма редактирования данных пользователя
const formCardAdd = document.querySelector('#form-card-add'); // форма добавления новых карточек

const cardTemplate = document.querySelector('#template-card'); // шаблон фотокарточки */
const cardContainer = document.querySelector('.elements__list'); // <ul> блок для карточек

const bigImage = document.querySelector('.view-image__image'); // находим большую картинку в popup'е просмотра
const bigImageTitle = document.querySelector('.view-image__title'); // находим title большой картинки в popup'е просмотра

/* const inputListFormProfileEdit = Array.from(formProfileEdit.querySelectorAll('.form__input')); // массив со всеми input для формы редактирования
const inputListFormCardAdd = Array.from(formCardAdd.querySelectorAll('.form__input')); // массив со всеми input для формы добавления

const submitFormProfileEdit = formProfileEdit.querySelector('.form__submit'); // submit формы редактирования
const submitFormAddCard = formCardAdd.querySelector('.form__submit'); // submit формы добавления карточки */


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
  console.log([data]);
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


/* // функция устанавливает значения введённые пользователем
const setProfileData = () => {
  // установить значения полям формы
  inputName.value = profileName.textContent;
  inputAbout.value = profileAbout.textContent;

  // открыть попап
  openPopup(popupEditProfile);
};

// функция сбрасывает форму и закрывает popup
const resetForm = (form) => {
  form.reset();

  // закроем соответствующий popup
  closePopup(form.closest('.popup'));
};

// функция открытия для всех popup
const openPopup = (popup) => {
  // откроем popup
  popup.classList.add('popup_opened');

  // при открытии попап добавим обработчик события для клавиши Esc
  document.addEventListener('keydown', closePopupByEsc);
};

// функция закрытия для всех popup
const closePopup = (popup) => {
  // закроем popup
  popup.classList.remove('popup_opened');

  // удалим обработчик события для клавиши Esc
  document.removeEventListener('keydown', closePopupByEsc);
};

// функция закроет popup клавишей Esc
const closePopupByEsc = (event) => {
  // если была нажата клавиша Esc
  if(event.key === 'Escape') {
    // найдём открытый popup
    const popupOpened = document.querySelector('.popup_opened');

    //закроем найденный открытый popup
    closePopup(popupOpened);
  }
};

// функция сохраяет изменения в профайле
const saveChangeProfile = (event) => {
  // отменяем событие отправки формы
  event.preventDefault();

  profileName.textContent = inputName.value;
  profileAbout.textContent = inputAbout.value;

  // закрываем popup
  closePopup(popupEditProfile);
}

// функция принимает из формы данные для создания новой карточки
const submitAddCardForm  = (event) => {
  // отменяем событие отправки формы
  event.preventDefault();

  // получаем данные будущей карточки из формы
  const cardData = {
    name: inputNameCard.value,
    link: inputLinkCard.value
  };

  // создадим и добавим новую карточку
  addCard(createCard(cardData));

  // очистим поля формы и закроем popup
  resetForm(event.target);
};

// слушатели событий ------------------------------------------------------------------//

// открыть popup для редактирования данных
buttonOpenEditProfileForm.addEventListener('click', () => {
  // установим данные полям и откроем popup
  setProfileData();

  // очистим ошибки валидации формы и проверим валидность полей формы
  // и активируем / деактивируем кнопку submit
  formValidatorProfile.resetValidation();
});

// открыть popup для добавления новых мест
buttonOpenAddCardForm.addEventListener('click', () => {
  // очистим ошибки валидации формы и проверим валидность полей формы
  // и активируем / деактивируем кнопку submit
  formValidatorAddCard.resetValidation();

  // откроем popup
  openPopup(popupAddCard);
});

formValidatorAddCard.enableValidation();
formValidatorProfile.enableValidation();

// повесим на все кнопки-крестики закрытия попапов обработчик события
closePopupButtons.forEach((button) => {
  // найдём ближайший к кнопке-крестику попап
  const popup = button.closest('.popup');
  
  // устанавливаем обработчик события на каждую кнопку-крестик закрытия попап
  button.addEventListener('click', () => closePopup(popup));
});

// отправка данных из формы редактирования профиля
formProfileEdit.addEventListener('submit', saveChangeProfile);

// отправка данных из формы добавлеия новой карточки
formCardAdd.addEventListener('submit', submitAddCardForm);

// закрытие popup по overlay, найдём все popup'ы в документе
const popups = document.querySelectorAll('.popup');
// пройдём циклом по массиву попапов
popups.forEach(popup => {
  // повесим обработчик события на каждый попап (оверлей)
  popup.addEventListener('click', (event) => {
    // проверим по какому элементу был клик, если по overlay (popup), то закроем его
    if(event.target.classList.contains('popup')) {
      // закрываем popup
      closePopup(popup);
    }
  });
}); */

