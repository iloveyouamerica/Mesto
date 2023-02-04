export class Section {
  constructor({items, renderer}, containerSelector) {
    this._itemsArray = items; // массив данных, которые нужно добавить на страницу
    this._renderer = renderer; // функция, которая отвечает за создание и отрисовку данных на странице
    this._container = containerSelector; // селектор контейнера, в который нужно добавлять созданные эле-ты
  }

  // приватный метод для очистки контейнера
  _containerClear() {
    this._container.innerHTML = ""; // убрать все html-элементы из контейнера
  }

  // публичный метод, который отвечает за отрисовку всех эл-тов
  renderItems() {
    this._containerClear();
    
    this._itemsArray.forEach((item) => {
      this._renderer(item); // вызываем renderer, передав ей эл-т массива item
    });
  }

  // пбличный метод, который принимает DOM эл-т и добавляет его в контейнер
  addItem(element) {
    this._container.prepend(element);
  }
}