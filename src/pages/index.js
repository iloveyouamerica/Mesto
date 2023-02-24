import './index.css'; // добавили импорт главного файла стилей 

import { Card } from '../components/Card.js';
import { validationSettings } from '../utils/constants.js';
import { FormValidator } from '../components/FormValidator.js';
import { Section } from '../components/Section.js';
import { PopupWithImage } from '../components/PopupWithImage.js';
import { PopupWithForm } from '../components/PopupWithForm.js';
import { PopupConfirm } from '../components/PopupConfirm.js';
import { UserInfo } from '../components/UserInfo.js';
import { Api } from '../components/Api.js';
import { optionsApi } from '../utils/constants.js';

// определяем переменные
const buttonOpenEditProfileForm = document.querySelector('#edit-btn'); // кнопка редактирования профиля
const buttonOpenAddCardForm = document.querySelector('#add-btn'); // кнопка добавления карточки
const buttonOpenAvatarEditForm = document.querySelector('#avatar-edit-btn'); // кнопка редактирования аватара

const inputName = document.querySelector('#input-name'); // input с именем
const inputAbout = document.querySelector('#input-about'); // input о себе

const cardContainer = document.querySelector('.elements__list'); // <ul> блок для карточек

// ------------------------------------------- API ----------------------------------------------------

// создаём объект класса Api
const api = new Api(optionsApi);

// -------------------------------------------- Создаём экемпляр класса UserInfo---------------------------------
const userInfo = new UserInfo({
  userNameSelector: '.profile__name',
  userInfoSelector: '.profile__about',
  userAvatarSelector: '.profile__image'
});

// ------------------------------------------- NEW CARD CREATE ----------------------------------------

// функция открытия большой картинки для просмотра в полном размере
const handleImageClick = (name, link) => {

  // открываем попап с большой картинкой (экземпляр класса создан 1 раз ниже)
  popupWithImage.open(link, name); // вызываем метод открытия попап, он обновит данные картинки внутри (url и title)
};

// функция создания новой карточки
const createCard = (item) => {
  const card = new Card(item, '#template-card', {
    handleImageClick,
    handleLikeClick: () => {
      //console.log('Дабавляем лайк', item._id);

      // вызываем метод класса Api, чтобы послать запрос на сервер для добавления лайка
      api.addLikeCard(item._id)
        .then((data) => {
          //console.log(data);

          // отрисуем сердечко карточке
          card.getActiveLike();

          // взять новое количество лайков в ответе сервера и изменить на странице
          card.getLikesCount(data); // здесь data это ответ с сервера
        })
        .catch((err) => {
          console.log(`Ошибка добавления лайка: ${err}`);
        });
    },
    handleDeleteLikeClick: () => {
      //console.log("Удаляем лайк!", item._id);

      // вызываем метод класса Api, чтобы послать запрос на сервер для удаления лайка
      api.deleteLikeCard(item._id)
        .then((data) => {
          //console.log(data);

          // отрисуем удаления сердечка
          card.deleteActiveLike();

          // взять новое количество лайков в ответе сервера и изменить на странице
          card.getLikesCount(data); // здесь data это ответ с сервера
        })
        .catch((err) => {
          console.log(`Ошибка удаления лайка: ${err}`);
        })
    },
    handleDeleteCard: () => { // передаём в классе объект готовой карточки
      //console.log("Удалили карточку!", item._id, item);
      // нужно открыть попап с подтверждением удаления карточки
      popupConfirm.open();
      popupConfirm.setSubmitForm(() => {
        //console.log("Удаляем карточку - пользователь дал согласие в форме попапа");

        // вызываем метод класса Api для удаления карточки (item - это карточка, _id - это её id)
        api.deleteCard(item._id)
          .then(() => { // можно передать data, что посмотреть ответ сервера
            //console.log(data);

            // если карточка удалена на сервере, то удалим её на странице
            card.deleteCard();
            // закроем попап согласия пользователя
            popupConfirm.close();
          })
          .catch((err) => {
            console.log(`Ошибка удаления карточки: ${err}`);
          });
      });
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

const validatorFormAvatarEdit = new FormValidator(validationSettings, '#form-avatar-edit');
validatorFormAvatarEdit.enableValidation();

// -------------------------------------------- Создаём экземпляры классов Popup и необходимые для работы функции

// callback сабмита формы редактирования профиля (второй параметр класса PopupWithForm)
const handleFormSubmitProfileEdit = (data) => { // здесь data - это объект с данными полей формы
  // получив данные из полей формы их нужно отправить на сервер и дождаться ответ (получим объект этих новых данных)
  
  // покажем состояние загрузки
  popupFormEdit.renderLoading(true);

  const dataUser = {
    name: data.username,
    about: data.userinfo
  };

  api.editUserProfile(dataUser)
    .then((data) => {

      // установить новые данные пользователя на страницу
      userInfo.setUserInfo(data);
      
      // закрывать попапы нужно только после удачного ответа сервера
      popupFormEdit.close();
    })
    .catch((err) => {
      console.log(`Ошибка обновления данных о пользователе: ${err}`);
    })
    .finally(() => {
      // покажем состояние загрузки
      popupFormEdit.renderLoading(false);
    });
};

// callback сабмита формы добавления новой карточки (второй параметр класса PopupWithForm)
const handleFormSubmitCardAdd = (data) => { // здесь data - это объект с данными полей формы {name: 'NAME', link: 'LINK'}

   // покажем состояние загрузки
   popupFormAdd.renderLoading(true);

  api.addNewCard(data)
    .then((dataCard) => { // dataCard - объект ответа от сервера, там содержатся данные новой карточки
      //console.log(dataCard.likes.length);

      cardList.addItem(createCard(dataCard));

      // закроем попап только после удачного ответа сервера
      popupFormAdd.close();
    })
    .catch((err) => {
      console.log(`Ошибка добавления новой карточки: ${err}`)
    })
    .finally(() => {
      // покажем состояние загрузки
      popupFormAdd.renderLoading(false);
    });
};

// callback сабмита формы редактирования аватара пользователя
const handleFormSubmitAvatarEdit = (input) => { // в data метод _getInputValues class PopupWithForm передаёт знач. инпутов
  //console.log('Попап редактирования аватара: форма отправлена!');

  // покажем состояние загрузки
  popupAvatarEdit.renderLoading(true);

  // отправим запрос на сервер на изменение аватара пользователя
  api.changeAvatar(input.link)
    .then((data) => {
      //console.log(data);

      // поменять аватар на странице
      userInfo.setAvatar(data.avatar);

      // закрываем попап только после удачного ответа от сервера
      popupAvatarEdit.close();
    })
    .catch((err) => {
      console.log(`Ошибка смены аватара: ${err}`)
    })
    .finally(() => {
      // покажем состояние загрузки
      popupAvatarEdit.renderLoading(false);
    });
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
const popupConfirm = new PopupConfirm('#popup-confirm');
// установим слушатели событий
popupConfirm.setEventListeners();

// попап с формой смены аватара
const popupAvatarEdit = new PopupWithForm('#popup-avatar-edit', handleFormSubmitAvatarEdit);
// установим слушатели событий
popupAvatarEdit.setEventListeners();

// -------------------------------------------- Открываем попап редактирования фотографии пользователя
buttonOpenAvatarEditForm.addEventListener('click', () => {
  // откроем попап с формой редактирования аватара
  popupAvatarEdit.open();

  // при открытии попапа проверим состояние кнопки сабмит в форме
  validatorFormAvatarEdit.resetValidation();
});

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

