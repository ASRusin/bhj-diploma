/**
 * Класс Modal отвечает за
 * управление всплывающими окнами.
 * В первую очередь это открытие или
 * закрытие имеющихся окон
 * */
class Modal {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью Modal.registerEvents()
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (element) {
      this.element = element;
      this.registerEvents();
    } else {
      new Error("Такой элемент не существует");
    }
  }

  /**
   * При нажатии на элемент с data-dismiss="modal"
   * должен закрыть текущее окно
   * (с помощью метода Modal.onClose)
   * */
  registerEvents() {
    const modalClose = this.element.querySelectorAll('*[data-dismiss="modal"]');

    modalClose.forEach((e) => {
      const context = this;
      e.addEventListener("click", (e) => {
        e.preventDefault();
        this.onClose(context);
      });
    });
  }

  /**
   * Срабатывает после нажатия на элементы, закрывающие окно.
   * Закрывает текущее окно (Modal.close())
   * */
  onClose(e) {
    e.close();
  }
  /**
   * Удаляет обработчики событий
   * */
  unregisterEvents() {
    const modalClose = this.element.querySelectorAll('*[data-dismiss="modal"]');

    modalClose.forEach((e) => {
      const context = this;
      e.removeEventListener("click", (e) => {
        e.preventDefault();
        this.onClose(context);
      });
    });
  }
  /**
   * Открывает окно: устанавливает CSS-свойство display
   * со значением «block»
   * */
  open() {
    this.element.style = "display:block";
  }
  /**
   * Закрывает окно: удаляет CSS-свойство display
   * */
  close() {
    this.element.style = "";
  }
}
