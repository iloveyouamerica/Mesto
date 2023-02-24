// объект первичных настроек валидации
export const validationSettings = {
  inputError: 'form__input_error', // input подчёркивается красным
  inputSelector: '.form__input', // селектор полей input
  formSelector: '.form', // селектор формы
  submitButtonSelector: '.form__submit', // селектор кнопки submit
  inactiveButtonClass: 'form__submit_inactive' // состояние кнопки submit
};

// объект настроек для класса Api
export const optionsApi = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-60',
  token: '5ade358d-5f88-408c-b48d-f9edcc6552b1'
};