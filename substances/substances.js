//Создание пустого массива, в который динамически будут добавлены объекты
let addTable = [];

// функция добавления строк в таблицу
function addRows() {
    addTable.forEach((item) => {
        addRow(item);
    });
}

function addRow(subData) {
    //создание ячейки таблицы
    const idEl = document.createElement("td");
    idEl.innerText = subData?.id;

    const nameIUPACEl = document.createElement("td");
    nameIUPACEl.innerText = subData?.nameIUPAC;

    const descriptionEl = document.createElement("td");
    descriptionEl.innerText = subData?.description;

    const formulaEl = document.createElement("td");
    formulaEl.innerText = subData?.formula;

    const classEl = document.createElement("td");
    classEl.innerText = subData?.class;

    const openerEl = document.createElement("td");
    openerEl.innerText = subData?.opener;

    //Удаление и редактирование
    const actionEl = document.createElement("td");
    const editEl = document.createElement("div");
    editEl.innerText = "Редактировать";
    editEl.classList.add("table-btn", "edit-btn");
    editEl.onclick = function () {
        // вызов функции для редактирования строки
        updateForm(subData)
    };

    const removeEl = document.createElement("div");
    removeEl.innerText = "Удалить";
    removeEl.classList.add("table-btn", "remove-btn");
    removeEl.onclick = function () {
        // вызов функции для удаления строки
        removeRowFromTable(subData);
    };
    actionEl.append(editEl, removeEl);

    const row = document.createElement("tr");
    row.setAttribute("id", subData?.id + "-row");
    row.classList.add("data-row");
    row.append(idEl, nameIUPACEl, descriptionEl, formulaEl, classEl, openerEl, actionEl);
    $("#table").append(row);

};

//Удаление зависимых сущностей
function removeRowFromTable(subData) {
    result = confirm("Вы действительно хотите удалить запись?");
    if (result) {
        if (addTable.nameIUPAC === " " &
            addTable.description === " " &
            addTable.formula === " " &
            addTable.class === " " &
            addTable.opener === " ") {
            addTable = addTable.filter((item) => item.id !== subData.id);
            removeRow(subData);
            localStorage.setItem("addTable", JSON.stringify(addTable));
        } else {
            alert("Ошибка, таблица зависима")
        }
    }
};

function removeRow(subData) {
    $("#" + subData?.id + "-row").remove();
};

// функция для добавления записи в массив
function addSubstance(data) {
    data.id = getRandomIntInclusive(0, 1000);
    addTable.push(data);
    localStorage.setItem("addTable", JSON.stringify(addTable));
    addRow(data);
};

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//для очистки формы после добавления
function clearForm() {
    $("#nameIUPAC").val(function () {
        return "";
    });
    $("#description").val(function () {
        return "";
    });
    $("#formula").val(function () {
        return "";
    });
    $("#class").val(function () {
        return "";
    });
    $("#opener").val(function () {
        return "";
    });
};

function updateForm(subData) {
    returnAddBtn();
    selectedRowId = subData?.id;
    // с помощью метода children мы получаем дочерние элемента (ячейки таблицы) строки с id '{n}-row'
    const cells = $("#" + selectedRowId + "-row").children();
    $("#nameIUPAC").val(function () {
        return cells[1].innerText;
    });
    $("#description").val(function () {
        return cells[2].innerText;
    });
    $("#formula").val(function () {
        return cells[3].innerText;
    });
    $("#class").val(function () {
        return cells[4].innerText;
    });
    $("#opener").val(function () {
        return cells[5].innerText;
    });

    // изменение текста кнопки "Добавить" на "Изменить"

    $(".btn-submit").val(function () {

        return "Изменить";

    });
    // создание кнопки "Отменить"
    const cancelEl = document.createElement("input");
    cancelEl.classList.add("submit-btn-red");
    cancelEl.setAttribute("type", "button");
    cancelEl.setAttribute("value", "Отменить");
    cancelEl.onclick = function () {
        returnAddBtn();
    };
    $(".submit-btn-wrapper").append(cancelEl);
}


// изменение данных в строке
function updateRow(subData) {
    const cells = $("#" + selectedRowId + "-row").children();
    cells[1].innerText = subData.nameIUPAC;
    cells[2].innerText = subData.description;
    cells[3].innerText = subData.formula;
    cells[4].innerText = subData.class;
    cells[5].innerText = subData.opener;
    addTable.forEach(item => {
        if (item.id === selectedRowId) {
            item.nameIUPAC = subData.nameIUPAC;
            item.description = subData.description;
            item.formula = subData.formula;
            item.class = subData.class;
            item.opener = subData.opener;
        }
    })
    localStorage.setItem("addTable", JSON.stringify(addTable))
}

// удаление кнопки "Отмена" и изменение кнопки "Изменить" на кнопку "Добавить"
function returnAddBtn() {
    clearForm();
    $(".submit-btn-red").remove();
    $(".btn-submit").val(function () {
        return "Добавить";
    });
    selectedRowId = null;
}

$(document).ready(function () {
    //localStorage.setItem("addTable", JSON.stringify([]))
    addTable = JSON.parse(localStorage.getItem("addTable"))
    addRows();
    $("#form").submit(function tableAppend(event) {
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        const value = $("#submitBtn").val();
        if (value === "Добавить") {
            data.id = getRandomIntInclusive(0, 1000);
            addSubstance(data);
        } else if (value === "Изменить") {
            updateRow(data);
        }
        returnAddBtn();
        return false;
    });
});

