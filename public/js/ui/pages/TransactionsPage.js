/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
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
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render();
    if (this.lastOption) {
      this.render(this.lastOption);
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccount = this.element.querySelector(".remove-account");
    const transactionRemove = this.element.querySelector(".transaction__remove");
    if (removeAccount) {
      removeAccount.addEventListener("click", (e) => {
        e.preventDefault();
        this.removeAccount();
      });
    } else {
      transactionRemove.addEventListener("click", (e) => {
        e.preventDefault();
        this.removeTransaction(transactionRemove.dataset.id);
      });
    }
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.update()
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOption) {
      let answer = confirm("Вы действительно хотите удалить счёт?");
      if (answer === true) {
        Account.remove(this.lastOption, User.current(), (err, response) => {
          if (response.success === true) {
            App.update();
          }
        });
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update()
   * */
  removeTransaction(id) {
    let answer = confirm("Вы действительно хотите удалить эту транзакцию?");
    if (answer === true) {
      Transaction.remove(id, User.current(), (err, response) => {
        if (response.success === true) {
          App.update();
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (options) {
      this.lastOption = options;
      Account.get(options.account_id, User.current(), (err, response) => {
        if (response.success === true) {
          this.renderTitle(response.data.name);
        }
      });
      Transaction.list(User.current(), (err, response) => {
        if (response.success === true) {
          this.renderTransactions(response.data);
        }
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle("Название счёта");
    this.lastOption = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    const title = this.element.querySelector(".content-title");
    title.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const month = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];

    let newDate = `${date.slice(8, 10)} ${month[Number(date.slice(5, 7)) - 1]} ${date.slice(
      0,
      4,
    )} г. в ${date.slice(11, 16)}`;
    return newDate;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    const date = this.formatDate(item.date);
    const generalDiv = document.createElement("div");
    if (item.type === "expense") {
      generalDiv.className = "transaction transaction_expense row";
    } else {
      generalDiv.className = "transaction transaction_income row";
    }
    const detailsDiv = document.createElement("div");
    detailsDiv.className = "col-md-7 transaction__details";

    const iconDiv = document.createElement("div");
    iconDiv.className = "transaction__icon";

    const faSpan = document.createElement("span");
    faSpan.className = "fa fa-money fa-2x";

    iconDiv.appendChild(faSpan);
    detailsDiv.appendChild(iconDiv);

    const infoDiv = document.createElement("div");
    infoDiv.className = "transaction__info";

    const titleH4 = document.createElement("h4");
    titleH4.className = "transaction__title";
    titleH4.textContent = item.name;

    const dateDiv = document.createElement("div");
    dateDiv.className = "transaction__date";
    dateDiv.textContent = date;

    infoDiv.appendChild(titleH4);
    infoDiv.appendChild(dateDiv);
    detailsDiv.appendChild(infoDiv);
    generalDiv.appendChild(detailsDiv);

    const md3Div = document.createElement("div");
    md3Div.className = "col-md-3";

    const sumDiv = document.createElement("div");
    sumDiv.className = "transaction__summ";
    sumDiv.textContent = item.sum;

    const currencySpan = document.createElement("span");
    currencySpan.className = "currency";
    currencySpan.textContent = "₽";

    sumDiv.appendChild(currencySpan);
    md3Div.appendChild(sumDiv);
    generalDiv.appendChild(md3Div);

    const controlsDiv = document.createElement("div");
    controlsDiv.className = "col-md-2 transaction__controls";

    const button = document.createElement("button");
    button.className = "btn btn-danger transaction__remove";
    button.dataset.id = item.id;

    const trashI = document.createElement("i");
    trashI.className = "fa fa-trash";

    button.appendChild(trashI);
    controlsDiv.appendChild(button);
    generalDiv.appendChild(controlsDiv);
    return generalDiv;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const content = this.element.querySelector(".content");
    for (let item of data) {
      const html = this.getTransactionHTML(item);
      content.appendChild(html);
    }
  }
}
