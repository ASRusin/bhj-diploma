/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */
class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (element) {
      this.element = element;
      this.registerEvents();
      this.update();
    } else {
      new Error("Такой элемент не существует");
    }
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.element.querySelector(".create-account").addEventListener("click", (e) => {
      e.preventDefault();
      App.getModal("createAccount").open();
    });

    const account = this.element.querySelectorAll(".account");
    for (let acc of account) {
      acc.addEventListener("click", (e) => {
        e.preventDefault();
        this.onSelectAccount(acc);
      });
    }
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (User.current()) {
      Account.list(User.current(), (err, response) => {
        if (response.success === true) {
          this.clear();
          this.renderItem(response.data);
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const account = this.element.querySelectorAll(".account");
    for (let acc of account) {
      acc.remove();
    }
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    const account = this.element.querySelectorAll(".account");
    for (let acc of account) {
      acc.className = "account";
    }
    element.className = "active account";
    App.showPage("transactions", { account_id: element.dataset.id });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const spanFirst = document.createElement("span");
    const spanSecond = document.createElement("span");
    li.className = "account";
    li.dataset.id = item.id;
    a.href = "#";
    spanFirst.textContent = item.name + " / ";
    let sumString = item.sum.toLocaleString();
    const arr = sumString.split("");
    const arr2 = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === " ") {
        arr2.push(",");
      } else if (arr[i] === ",") {
        arr2.push(".");
      } else {
        arr2.push(arr[i]);
      }
    }
    if (arr2[arr2.length - 2] === ".") {
      arr2.push("0");
    }
    sumString = arr2.join("");
    spanSecond.textContent = sumString + " ₽";
    a.appendChild(spanFirst);
    a.appendChild(spanSecond);
    li.appendChild(a);
    return li;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(item) {
    for (let i of item) {
      const html = this.getAccountHTML(i);
      this.element.appendChild(html);
    }
    this.registerEvents();
  }
}
