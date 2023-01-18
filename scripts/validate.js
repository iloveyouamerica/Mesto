
// объект первичных настроек
const validationSettings = {
  inputError: 'form__input_error', // input подчёркивается красным
  inputSelector: '.form__input', // селектор полей input
  formSelector: '.form', // селектор формы
  submitButtonSelector: '.form__submit', // селектор кнопки submit
  inactiveButtonClass: 'form__submit_inactive' // состояние кнопки submit
};

// функция показа ошибки при заполнения поля
const showInputError = (elementForm, elementInput, errorMessage, settings) => {
  // добавляем нижний, красный border для input
  elementInput.classList.add(settings.inputError);
  //console.log(errorMessage);

  // пишем текст ошибки валидации в span-блок
  const errorElement = elementForm.querySelector(`.${elementInput.id}-error`);
  errorElement.textContent = errorMessage;
};

// функция сокрытия ошибки при заполнения поля
const hideInputError = (elementForm, elementInput, settings) => {
  // удаляем нижний, красный border для input
  elementInput.classList.remove(settings.inputError);

  // убираем текст ошибки валидации в span-блоке
  const errorElement = elementForm.querySelector(`.${elementInput.id}-error`);
  errorElement.textContent = '';
};

// функция проверки полей формы
const inputValidation = (elementForm, inputElement, settings) => {
  if(inputElement.validity.valid) {
    hideInputError(elementForm, inputElement, settings);
    //console.log('валидно');
  } else {
    showInputError(elementForm, inputElement, inputElement.validationMessage, settings);
    //console.log('невалидно');
  }
};

// функция повесит обработчики события на каждый инпут
const setEventListeners = (formElement, settings) => {
  // находим коллекцию и преобразуем в массив все инпуты
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  // вызовем функцию проверки состояния кнопки submit
  toggleButtonState(inputList, buttonElement, settings);

  // обходим циклом массив и вешаем обработчик события на каждый input
  inputList.forEach(inputElement => {
    inputElement.addEventListener('input', () => {
      inputValidation(formElement, inputElement, settings)

      // вызовем функцию проверки состояния кнопки submit
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
};

// функция добавляет валидацию всем формам
const enableValidation = (settings) => {
  // найдём все формы в документе
  const formList = Array.from(document.querySelectorAll(settings.formSelector));

  // перебор циклом всех форм
  formList.forEach(formElement => {
    // для каждой формы вызовем setEventListeners
    setEventListeners(formElement, settings);
  });
};

// функция проверит на валидность сразу все поля формы
const hasInvalidInput = (inputList) => {
  // проходим по массиву inputs методом some
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

// функция меняет состояние кнопки submit
const toggleButtonState = (inputList, buttonElement, settings) => {
  // если есть хотя бы один невалидный input
  if(hasInvalidInput(inputList)){
    // сделать кнопку неактивной
    buttonElement.classList.add(settings.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(settings.inactiveButtonClass);
    buttonElement.disabled = false;
  }
};

// функция удаляет сообщения с ошибками формы
const clearErrorMessage = (elementForm, inputList, settings) => {
  inputList.forEach(input => {
    hideInputError(elementForm, input, settings);
  });
}

// вызовем функцию добавления валидации всем формам
enableValidation(validationSettings);