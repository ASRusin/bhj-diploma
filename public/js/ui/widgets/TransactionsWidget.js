/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */
class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
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
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const incomeButton = this.element.querySelector(".create-income-button");
    incomeButton.addEventListener("click", (e) => {
      e.preventDefault();
      const newIncome = App.getModal("newIncome");
      newIncome.open();
    });

    const expenseButton = this.element.querySelector(".create-expense-button");
    expenseButton.addEventListener("click", (e) => {
      e.preventDefault();
      const newExpense = App.getModal("newExpense");
      newExpense.open();
    });
  }
}
