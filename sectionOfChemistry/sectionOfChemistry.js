let addTable = [];
//  let addTable = [
//     {
//         id: 1,
//         formula: "cc",
//         organic: "RRR",
//         neorganic: "rrr",

//     },
//     {
//         id: 2,
//         formula: "cc",
//         organic: "P",
//         neorganic: "P",

//     },
//     {
//         id: 3,
//         formula: "cc",
//         organic: "W",
//         neorganic: "W",

//     },
//     {
//         id: 4,
//         formula: "cc",
//         organic: "F",
//         neorganic: "F",

//     },
//     {
//         id: 5,
//         formula: "cc",
//         organic: "D",
//         neorganic: "D",

//     }
// ]
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

    const formulaEl = document.createElement("td");
    formulaEl.innerText = subData?.formula;

    const organicEl = document.createElement("td");
    organicEl.innerText = subData?.org_neorg === "true";

    const neorganicEl = document.createElement("td");
    neorganicEl.innerText = subData?.org_neorg === "false";


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
    row.append(idEl, formulaEl, organicEl, neorganicEl, actionEl);
    $("#table").append(row);

};
// function f(){
//         let a = document.getElementById('s1').value;
//         alert(a); // "msk", если выбрана Москва
//         }
//Удаление и редактирование 

function removeRowFromTable(subData) {
    result = confirm("Вы действительно хотите удалить запись?");
    if (result) {
        if (addTable.formula === " " &
            addTable.organic === " " &
            addTable.neorganic === " ") {
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
    $("#formula").val(function () {
        return "";
    });
    $("#organic").val(function () {
        return "";
    });
    $("#neorganic").val(function () {
        return "";
    });
};

function updateForm(subData) {
    returnAddBtn();
    selectedRowId = subData?.id;
    // с помощью метода children мы получаем дочерние элемента (ячейки таблицы) строки с id '{n}-row'
    const cells = $("#" + selectedRowId + "-row").children();
    $("#formula").val(function () {
        return cells[1].innerText;
    });
    $("#organic").val(function () {
        return cells[2].innerText;
    });
    $("#neorganic").val(function () {
        return cells[3].innerText;
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
    cells[1].innerText = subData.formula;
    cells[2].innerText = subData.org_neorg === "true";;
    cells[3].innerText = subData.org_neorg === "false";;
    addTable.forEach(item => {
        if (item.id === selectedRowId) {
            item.formula = subData.formula;
            item.organic = subData.org_neorg === "true";
            item.neorganic = subData.org_neorg === "false";

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

// document.getElementById('submitBtn').onclick = function() {
//     for (let option of document.getElementById("org_neorg").options)
//     {
//     if (option.value === 'organic')
//     {
//         option.selected = true;
//         return;
//     }
//     }
// }
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

