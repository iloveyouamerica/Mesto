
// объект первичных настроек валидации
export const validationSettings = {
  inputError: 'form__input_error', // input подчёркивается красным
  inputSelector: '.form__input', // селектор полей input
  formSelector: '.form', // селектор формы
  submitButtonSelector: '.form__submit', // селектор кнопки submit
  inactiveButtonClass: 'form__submit_inactive' // состояние кнопки submit
};

export class FormValidator {
  constructor(objectSettings, form) {
    this._inputError = objectSettings.inputError; // класс-модификатор подчёркивает input красным
    this._inputSelector = objectSettings.inputSelector; // селектор полей input
    this._formSelector = objectSettings.formSelector; // селектор формы
    this._inactiveButtonClass = objectSettings.inactiveButtonClass; // селектор кнопки submit
    this._submitButtonSelector = objectSettings.submitButtonSelector; // состояние кнопки submit
    this._form = document.querySelector(form); // элемент формы, которая валидируется

    this._inputList = Array.from(this._form.querySelectorAll(this._inputSelector));
    this._buttonElement = this._form.querySelector(this._submitButtonSelector);
  }

  // функция показа ошибки при заполнения поля
  _showInputError(elementInput, errorMessage) {
    // добавляем нижний, красный border для input
    elementInput.classList.add(this._inputError);

    // пишем текст ошибки валидации в span-блок
    const errorElement = this._form.querySelector(`.${elementInput.id}-error`);
    errorElement.textContent = errorMessage;
  }

  // функция сокрытия ошибки при заполнения поля
  _hideInputError(elementInput) {
    // удаляем нижний, красный border для input
    elementInput.classList.remove(this._inputError);

    // убираем текст ошибки валидации в span-блоке
    const errorElement = this._form.querySelector(`.${elementInput.id}-error`);
    errorElement.textContent = '';
  }

  // функция проверки полей формы
  _inputValidation(inputElement) {
    if(inputElement.validity.valid) {
      this._hideInputError(inputElement);
      //console.log('валидно');
    } else {
      this._showInputError(inputElement, inputElement.validationMessage);
      //console.log('невалидно');
    }
  }

  // функция повесит обработчики события на каждый инпут
  _setEventListeners() {
    // вызовем функцию проверки состояния кнопки submit
    this.toggleButtonState(this._inputList, this._buttonElement);

    // обходим циклом массив и вешаем обработчик события на каждый input
    this._inputList.forEach(inputElement => {
      inputElement.addEventListener('input', () => {
        this._inputValidation(inputElement)

        // вызовем функцию проверки состояния кнопки submit
        this.toggleButtonState(this._inputList, this._buttonElement);
      });
    });
  }

  // функция добавляет валидацию всем формам
  enableValidation() {
    this._setEventListeners();
  }

  // функция проверит на валидность сразу все поля формы
  _hasInvalidInput(inputList) {
    // проходим по массиву inputs методом some
    return inputList.some((inputElement) => {
      return !inputElement.validity.valid;
    });
  }

  // функция меняет состояние кнопки submit
  toggleButtonState (inputList, buttonElement) {
    // если есть хотя бы один невалидный input
    if(this._hasInvalidInput(inputList)){
      // сделать кнопку неактивной
      buttonElement.classList.add(this._inactiveButtonClass);
      buttonElement.disabled = true;
      //console.log('кнопка неактивна');
    } else {
      buttonElement.classList.remove(this._inactiveButtonClass);
      buttonElement.disabled = false;
      //console.log('кнопка активна');
    }
  }

  // функция сброса валидации формы
  resetValidation() {
    this.toggleButtonState(this._inputList, this._buttonElement);

    this._inputList.forEach((inputElement) => {
      this._hideInputError(inputElement);
    });
  }
}