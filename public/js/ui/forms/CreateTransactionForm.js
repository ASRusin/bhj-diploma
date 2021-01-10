/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * Наследуется от AsyncForm
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const incomeAccountsList = this.element.querySelector("#income-accounts-list");
    const expenseAccountsList = this.element.querySelector("#expense-accounts-list");
    if (incomeAccountsList) {
      Account.list(User.current(), (err, response) => {
        if (response.success === true) {
          const list = response.data;
          for (let item of list) {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.name;
            incomeAccountsList.appendChild(option);
          }
        }
      });
    } else {
      Account.list(User.current(), (err, response) => {
        if (response.success === true) {
          const list = response.data;
          for (let item of list) {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.name;
            expenseAccountsList.appendChild(option);
          }
        }
      });
    }
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(options) {
    Transaction.create(options, (err, response) => {
      if (response.success === true) {
        this.element.reset();
        App.getModal("newExpense").close();
        App.getModal("newIncome").close();
        App.update();
      }
    });
  }
}
