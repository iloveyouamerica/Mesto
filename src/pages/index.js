import './index.css'; // добавили импорт главного файла стилей 

import { Card2 } from '../components/Card2.js';
import { validationSettings, FormValidator } from '../components/FormValidator.js';
import { Section } from '../components/Section.js';
import { PopupWithImage } from '../components/PopupWithImage.js';
import { PopupWithForm } from '../components/PopupWithForm.js';
import { PopupConfirm } from '../components/PopupConfirm.js';
import { UserInfo } from '../components/UserInfo.js';
//import { initialCards } from '../utils/constants.js';
import { Api } from '../components/Api.js';

// определяем переменные
const buttonOpenEditProfileForm = document.querySelector('#edit-btn'); // кнопка редактирования профиля
const buttonOpenAddCardForm = document.querySelector('#add-btn'); // кнопка добавления карточки

const inputName = document.querySelector('#input-name'); // input с именем
const inputAbout = document.querySelector('#input-about'); // input о себе

const cardContainer = document.querySelector('.elements__list'); // <ul> блок для карточек

const bigImage = document.querySelector('.view-image__image'); // находим большую картинку в popup'е просмотра
const bigImageTitle = document.querySelector('.view-image__title'); // находим title большой картинки в popup'е просмотра

// ------------------------------------------- API ----------------------------------------------------
const optionsApi = { // объект настроек для класса Api
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-60',
  token: '5ade358d-5f88-408c-b48d-f9edcc6552b1'
};

// создаём объект класса Api
const api = new Api(optionsApi);

// -------------------------------------------- Создаём экемпляр класса UserInfo---------------------------------
const userInfo = new UserInfo({
  userNameSelector: '.profile__name',
  userInfoSelector: '.profile__about',
  userAvatarSelector: '.profile__image'
});

/* // после создания класса Api загрузим данные пользователя с сервера и отобразим их на странице
api.getUserInfo()
  .then((data) => {
    //console.log(data);
    // установим данные пользователя
    const userData = {
      username: data.name,
      userinfo: data.info,
      useravatar: data.avatar,
      userid: data._id
    };
    userInfo.setUserInfo(userData);
  })
  .catch((err) => {
    console.log(`Ошибка получения информации о пользователе с сервера: ${err}`);
  }); */

// ------------------------------------------- NEW CARD CREATE ----------------------------------------

// функция открытия большой картинки для просмотра в полном размере
const handleImageClick = (name, link) => {

  // открываем попап с большой картинкой (экземпляр класса создан 1 раз ниже)
  popupWithImage.open(link, name); // вызываем метод открытия попап, он обновит данные картинки внутри (url и title)
};

// функция удаления карточки (для мягкой связи между классами)
const handleDeleteCard = () => {
  console.log("Удалили карточку!");
};

/* // функция создания новой карточки
const createCard = (item) => {
  const card = new Card2(item, '#template-card', {handleImageClick});
  const cardElement = card.generateCard();
  return cardElement;
}; */

// функция создания новой карточки
const createCard = (item) => {
  //const card = new Card2(item, '#template-card', {handleImageClick, handleLikeClick, handleDeleteLikeClick, handleDeleteCard});
  const card = new Card2(item, '#template-card', {
    handleImageClick,
    handleLikeClick: () => {
      console.log('Дабавляем лайк', item._id);
    },
    handleDeleteLikeClick: () => {
      console.log("Удалили лайк!", item._id);
    },
    handleDeleteCard: () => { // передаём в классе объект готовой карточки
      console.log("Удалили карточку!", item._id, item);
      // нужно открыть попап с подтверждением удаления карточки
      popupConfirm.open();

    }
  });
  const cardElement = card.generateCard(userInfo.userId); // пробросим наш id на этап создания карточки
  return cardElement;
};

// создаём экземпляр класса Section, который будет добавлять карточки на страницу в секцию с карточками
const cardList = new Section({
  renderer: (item) => {
    // добавляем карточку на страницу
    cardList.addItem(createCard(item));
  }
}, cardContainer);

// установим промисы для ожидания и обратки запросов с сервера (нужно дождаться инфо о пользователе и карточки)
Promise.all([api.getUserInfo(), api.getCards()])
  .then(([info, cards]) => {
    userInfo.setUserInfo(info);
    cardList.renderItems(cards.reverse());
  })

// -------------------------------------------- Создаём экземпляры классов FormValidator ------------------------
const validatorFromEdit = new FormValidator(validationSettings, '#form-profile-edit'); // валидатор формы редактирования профиля
validatorFromEdit.enableValidation(); // включаем валидацию формы
const validatorFromAdd = new FormValidator(validationSettings, '#form-card-add'); // валидатор формы добавления карточки
validatorFromAdd.enableValidation(); // включаем валидацию формы


// -------------------------------------------- Создаём экземпляры классов Popup и необходимые для работы функции

/* // callback сабмита формы редактирования профиля (второй параметр класса PopupWithForm)
const handleFormSubmitProfileEdit = (data) => { // здесь data - это объект с данными полей формы
  // установить новые данные пользователя на страницу
  userInfo.setUserInfo(data);
  // попап закроется сам потому что коллбэк сабмита формы имеет такой метод в классе PopupWithForm
}; */

// callback сабмита формы редактирования профиля (второй параметр класса PopupWithForm)
const handleFormSubmitProfileEdit = (data) => { // здесь data - это объект с данными полей формы
  // получив данные из полей формы их нужно отправить на сервер и дождаться ответ (получим объект этих новых данных)
  const dataUser = {
    name: data.username,
    about: data.userinfo
  };
  api.editUserProfile(dataUser)
    .then((data) => {
      // установить новые данные пользователя на страницу
      userInfo.setUserInfo(data);
      // попап закроется сам потому что коллбэк сабмита формы имеет такой метод в классе PopupWithForm
    })
    .catch((err) => {
      console.log(`Ошибка обновлния данных о пользователе: ${err}`);
    })

  /* // установить новые данные пользователя на страницу
  userInfo.setUserInfo(data);
  // попап закроется сам потому что коллбэк сабмита формы имеет такой метод в классе PopupWithForm */
};

// callback сабмита формы добавления новой карточки (второй параметр класса PopupWithForm)
const handleFormSubmitCardAdd = (data) => { // здесь data - это объект с данными полей формы
  // здесь пришёл такой объект: {name: 'NAME', link: 'LINK'}
  // данные для карточки есть, теперь нужно создать самы карточку
  // в класс Card мы передаём массив объектов
 
  /* const card = createCard(data); // создаём карточку из данных формы

  // добавляем карточку на страницу (cardList - это экземпляр класса Section, он отвечает за добавление карточек)
  cardList.addItem(card); */

  api.addNewCard(data)
    .then((dataCard) => { // dataCard - объект ответа от сервера, там содержатся данные новой карточки
      //console.log(dataCard.likes.length);
      cardList.addItem(createCard(dataCard));
    })
    .catch((err) => {
      console.log(`Ошибка добавления новой карточки: ${err}`);
    })
};

// callback сабмита формы удаление карточки
const handleFormSubmitDeleteCard = () => {
  console.log("Подтверждение удаления карточки");
  popupConfirm.close();
};

// попап с формой редактирования профиля
const popupFormEdit = new PopupWithForm('#popup-edit', handleFormSubmitProfileEdit);
// установим ему слушатели событий
popupFormEdit.setEventListeners();

// попап с формой добавления нового места
const popupFormAdd = new PopupWithForm('#popup-add', handleFormSubmitCardAdd);
// установим ему слушатели событий
popupFormAdd.setEventListeners();

// создаём экземпляр класса попапа для большой картинки
const popupWithImage = new PopupWithImage('#popup-image-view'); // создаём объект класса
// устанавливаем слушатели событий на попап с большой картинкой
popupWithImage.setEventListeners(); // вызываем метод добавления слушателей событий

// попап с подтверждением намериния (удалить карточку)
const popupConfirm = new PopupConfirm('#popup-confirm', handleFormSubmitDeleteCard);
// установим слушатели событий
popupConfirm.setEventListeners();

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
  validatorFromEdit.resetValidation();
});

// -------------------------------------------- Открываем popup с формой добавления новой карточки ----
// при клике на кнопку добавления новой карточки
buttonOpenAddCardForm.addEventListener('click', () => {
  // откроем попап с формой добавления данных для новой карточки
  popupFormAdd.open();

  // при открытии попапа проверим состояние кнопки сабмит в форме
  validatorFromAdd.resetValidation();
});

