import {Card} from './Card.js';
import {validationSettings, FormValidator} from './FormValidator.js';
import {initialCards} from './constants.js';

// определяем переменные
const buttonOpenEditProfileForm = document.querySelector('#edit-btn'); // кнопка редактирования профиля
const buttonOpenAddCardForm = document.querySelector('#add-btn'); // кнопка добавления карточки

const popupEditProfile = document.querySelector('#popup-edit'); // popup редактирования данных пользователя
const popupAddCard = document.querySelector('#popup-add'); // popup добавления новых фотокарточек
const popupImageView = document.querySelector('#popup-image-view'); // popup для большой картинки

const buttonCloseEditPopup = document.querySelector('#close-popup-edit'); // кнопка закрытия popup-edit
const buttonCloseAddPopup = document.querySelector('#close-popup-add'); // кнопка закрытия popup-add
const buttonCloseImagePopup = document.querySelector('#close-popup-image-view'); // кнопка закрытия popup-image

const profileName = document.querySelector('.profile__name'); // имя
const profileAbout = document.querySelector('.profile__about'); // о себе

const inputName = document.querySelector('#input-name'); // input с именем
const inputAbout = document.querySelector('#input-about'); // input о себе

const inputNameCard = document.querySelector('#input-place-name'); // input с названием места
const inputLinkCard = document.querySelector('#input-place-link'); // input ссылка на место

const formProfileEdit = document.querySelector('#form-profile-edit'); // форма редактирования данных пользователя
const formCardAdd = document.querySelector('#form-card-add'); // форма добавления новых карточек

const cardTemplate = document.querySelector('#template-card'); // шаблон фотокарточки
const cardContainer = document.querySelector('.elements__list'); // <ul> блок для карточек

const bigImage = document.querySelector('.view-image__image'); // находим большую картинку в popup'е просмотра
const bigImageTitle = document.querySelector('.view-image__title'); // находим title большой картинки в popup'е просмотра

const inputListFormProfileEdit = Array.from(formProfileEdit.querySelectorAll('.form__input')); // массив со всеми input для формы редактирования
const inputListFormCardAdd = Array.from(formCardAdd.querySelectorAll('.form__input')); // массив со всеми input для формы добавления

const submitFormProfileEdit = formProfileEdit.querySelector('.form__submit'); // submit формы редактирования
const submitFormAddCard = formCardAdd.querySelector('.form__submit'); // submit формы добавления карточки

// создаём экземпляры для каждой формы

// экземпляр класса для формы редактирования профиля
const formValidatorProfile = new FormValidator(validationSettings, formProfileEdit);

// экземпляр класса для формы добавления карточек
const formValidatorAddCard = new FormValidator(validationSettings, formCardAdd);

// функция создаёт большую картинку для просмотра в полном размере
export const createBigViewImage = (name, link) => {
  bigImage.src = link;
  bigImage.alt = name;
  bigImageTitle.textContent = name;

  // откроем popup
  openPopup(popupImageView);
};

// функция добавляет карточки на страницу
const addCard = (card) => {
  // добавим каждую новую карточку в начало списка
  cardContainer.prepend(card);
};

// выведем карточки из массива на страницу с помощью цикла forEach
initialCards.forEach((item) => {
  // создаём экземпляр класса Card
  const card = new Card(item, '#template-card');
  document.querySelector('.elements__list').append(card.generateCard());
});

// функция устанавливает значения введённые пользователем
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
  const card = new Card(cardData, '#template-card');
  addCard(card.generateCard());

  // очистим поля формы и закроем popup
  resetForm(event.target);
};

// слушатели событий ------------------------------------------------------------------//

// открыть popup для редактирования данных
buttonOpenEditProfileForm.addEventListener('click', () => {
  // установим данные полям и откроем popup
  setProfileData();

  // очистим ошибки валидации формы
  //clearErrorMessage(formProfileEdit, inputListFormProfileEdit, validationSettings);
  formValidatorProfile.clearErrorMessage(inputListFormProfileEdit);

  // проверим валидность полей формы и активируем / деактивируем кнопку submit
  //toggleButtonState(inputListFormProfileEdit, submitFormProfileEdit, validationSettings);
  formValidatorProfile.toggleButtonState(inputListFormProfileEdit, submitFormProfileEdit);
});

// открыть popup для добавления новых мест
buttonOpenAddCardForm.addEventListener('click', () => {
  // очистим ошибки валидации формы
  //clearErrorMessage(formCardAdd, inputListFormCardAdd, validationSettings);
  formValidatorAddCard.clearErrorMessage(inputListFormCardAdd);

  // проверим валидность полей формы и активируем / деактивируем кнопку submit
  //toggleButtonState(inputListFormCardAdd, submitFormAddCard, validationSettings);
  formValidatorAddCard.toggleButtonState(inputListFormCardAdd, submitFormAddCard);

  // откроем popup
  openPopup(popupAddCard);
});

formValidatorAddCard.enableValidation();
formValidatorProfile.enableValidation();

buttonCloseEditPopup.addEventListener('click', () => {closePopup(popupEditProfile)}); // закрыть popup без сохранения изменений
buttonCloseAddPopup.addEventListener('click', () => {resetForm(formCardAdd)}); // закрыть popup без сохранения изменений
buttonCloseImagePopup.addEventListener('click', () => {closePopup(popupImageView)}); // закрыть popup с просмотром картинки

formProfileEdit.addEventListener('submit', saveChangeProfile); // отправка данных из формы редактирования профиля
formCardAdd.addEventListener('submit', submitAddCardForm); // отправка данных из формы добавлеия новой карточки

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
});