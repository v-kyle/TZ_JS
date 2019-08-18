import data from "./json.js";                                                           //Импорт данного JSON

const HEADINGS = ["Идентификатор", "Имя", "Фамилия", "Пол", "Ключевые фразы", "Изображение"]; //Масив заголовков шапки таблицы
const HEADNAMES = ['id', 'name', 'name', 'gender', 'memo', 'img'];                            //Массив имен полей объекта (используется в парсинге JSON)
const rowNum = data.length;                                                 //Кол-во строк в таблице
const colNum = 6;                                                           //Кол-во столбцов

function createTable(data, headings) {                      //Функция по парсингу JSON и создания на его основе таблицы
    let table = document.createElement('table');
    fillHeadings(table, headings);                          //Создание шапки таблицы
    let tr = [];
    for (let i = 0; i < rowNum; i++) {
        tr[i] = document.createElement('tr');
        for (let j = 0; j < colNum; j++) {
            let td = document.createElement('td');
            switch (j) {
                case 1:                                     //Случай с именем
                    td.innerHTML = data[i][HEADNAMES[j]]['first'];
                    break;
                case 2:
                    td.innerHTML = data[i][HEADNAMES[j]]['last'];           //Случай с фамилией
                    break;
                case 4:
                    data[i][HEADNAMES[j]].forEach(function (item) {             //Случай с ключевыми словами
                        td.innerHTML += item + '</br>';
                    });
                    break;
                case 5:
                    let img = document.createElement('img');            //Случай с изображением
                    img.src = data[i][HEADNAMES[j]].toString();
                    td.appendChild(img);
                    break;
                default:
                    td.innerHTML = data[i][HEADNAMES[j]];
                    break;
            }
            tr[i].appendChild(td);
        }
        table.appendChild(tr[i]);
    }
    document.getElementById('tablearea').appendChild(table);    //Вставка сформированной таблицы
}
function fillHeadings(table, headings) {                             //Создание шапки таблицы - используется массив объявленный выше
    let tr = document.createElement('tr');
    for (let j = 0; j < colNum; j++){
        let th = document.createElement('th');
        th.innerHTML = headings[j];
        tr.appendChild(th);
    }
    table.appendChild(tr);
}
function filter(phrase, table, e) {                      //Функция поиска по таблице
    e.preventDefault();
    phrase = phrase.trim();                              //Удаление лишних пробелов
    let new_phrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');   //используется для экранирования спец символов, при их поиске
    let arrCols = checkCols();                                            // checkCols возвращает колонки, в которых надо произодить поиск
    deleteOldSpans(table);                                              //Удаляются старые подсвечивания найденных совпадений
    let pattern = new RegExp(new_phrase, 'i');                     //регулярное выражение, на основе которого будет происходить поиск и выделение
    let findFlag = false;                                                   // Флаг для понимания, какие строки надо скрывать
    for (let i = 1; i < rowNum + 1 ; i++) {           //начинаем с 1, так как i = 0 - это шапка
        findFlag = false;
        for (let j = 0; j < colNum - 1; j++){              // до colNum - 1, так как последний столбик это изображение
            if (arrCols[j]) {                                            //проверка, является ли колонка нам нужной, или пользователь не хочет искать в ней
                findFlag = pattern.test(table.rows[i].cells[j].innerHTML.replace(/<br>/g, ''));
                if (findFlag) break;       //если есть совпадение в строке, переходем к следующей
            }
        }
        if (findFlag){
            table.rows[i].classList.remove('notFind');  //Если в строке есть совпадение, не скрываем её
        }
        else table.rows[i].classList.add('notFind');  //иначе скрываем
    }
    let count = highlight(phrase, table, arrCols);    //highlight возвращает кол-во найденных совпадений (ко-во подсвечиваний)
    let findLabel = document.getElementById("findLabel");
    findLabel.innerHTML = `Строк найдено: ${75-document.getElementsByClassName('notFind').length}`;
    if (count) findLabel.innerHTML += `; Совпадений: ${count}`;
    findLabel.classList.remove('hidden');                  //Вывод резулата поиска
}
function checkCols() {                                                         //функция возвращает массив, размер которого 5, а каждый [i] элемент обозначает, нужно ли искать в [i] колонке
    let searchCols = (new Array(5)).fill(true, 0, 5);
    let checkBoxes = document.querySelectorAll('#searchCols input');
    checkBoxes.forEach((elem, index)=>{
        if (!elem.checked) searchCols[index] = false;
    });
    return searchCols;
}
function deleteOldSpans(table) {                       //удаление старых посвечиваний (реализуется при помощи поиска и удаления тега span с классом highlight
    let deleteSpan1 = /<span class="highlight">/ig;
    let deleteSpan2 = /<\/span>/ig;
    for (let i = 1; i < rowNum +1 ; i++) {
        for (let j = 0; j < colNum - 1; j++) {
            table.rows[i].cells[j].innerHTML = table.rows[i].cells[j].innerHTML.replace(deleteSpan1, "");
            table.rows[i].cells[j].innerHTML = table.rows[i].cells[j].innerHTML.replace(deleteSpan2, "");
        }
    }
}
function highlight(phrase, table, arrCols) {                               //функция подсвечивания найденных элементов (возращает кол-во соответствий)
    let new_phrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    let pattern = new RegExp(new_phrase,'ig');
    let count = 0;
    for (let i = 1; i < rowNum + 1; i++){                            //начинаем с 1, так как i = 0 - это шапка
        if (!table.rows[i].classList.contains('notFind'))
        for (let j = 0; j < colNum - 1; j++) {                        // до colNum - 1, так как последний столбик это изображение
            if (~table.rows[i].cells[j].innerHTML.toLowerCase().indexOf(phrase.toLowerCase()) && phrase!=="" && arrCols[j]) {   //если есть соответсвие, фраза для поиска не пустая и эта колонка есть в списке тех, в которых ищем
                count += table.rows[i].cells[j].innerHTML.match(pattern).length; //кол-во соответствий
                table.rows[i].cells[j].innerHTML = table.rows[i].cells[j].innerHTML.replace(pattern, '<span class="highlight">$&</span>'); // подсвечиваем при помощи тега span и класса highlight
            }
        }
    }
    return count;
}
function hideCol(e) {                                                          //скрытие колонок
    let table = document.querySelectorAll('#tablearea table')[0];
    e.target.classList.toggle('notActiveBtn');               //изменение цвета нажатой кнопки
    e.target.classList.toggle('ActiveBtn');
    let num = e.target.id[1];                                      //id кнопки - это пара буквы и цифры, цифра отвечает за номер колонки (второй знак в id)
    for (let i = 0; i < rowNum + 1; i++)
        table.rows[i].cells[num].classList.toggle('notFind'); //скрываем колонку
}
function editRow(e) {                                             //функция изменения строки в модальном окне
    let modal = document.querySelector('.modal');
    let table = document.querySelectorAll('#tablearea table')[0];
    let row = e.target.closest('tr');                              //если нажали на ячейку, ищем ближайшую к ней колонку
    if (row && table.contains(row) && row.rowIndex!==0){          //если колонка найдена, она в таблице и это не шапка
        modal.style.display = "flex";                               //показ модального окна
        document.getElementById('modal-id').value = row.cells[0].innerHTML;        //id
        document.getElementById('modal-first').value = row.cells[1].innerHTML; //имя
        document.getElementById('modal-last').value = row.cells[2].innerHTML; //фамилия
        if (row.cells[3].innerHTML === "Male"){                    //пол
            document.getElementById('modal-gender-male').checked = true;
            document.getElementById('modal-gender-female').checked = false;
        }
        else{
            document.getElementById('modal-gender-male').checked = false;
            document.getElementById('modal-gender-female').checked = true;
        }
        document.getElementById('modal-memo').innerHTML = row.cells[4].innerHTML.replace(/<br>/g, "\n");  //ключевые слова
        if (row.cells[5].children[0].style.visibility !== 'hidden' ){                  //картинка
            document.getElementById('modal-img-show').checked = true;
            document.getElementById('modal-img-hide').checked = false;
        }
        else{
            document.getElementById('modal-img-show').checked = false;
            document.getElementById('modal-img-hide').checked = true;
        }
        let modal_btn = document.getElementById('modal-btn');
        modal_btn.dataset.row = row.rowIndex.toString();                //сохраняем в dataset кнопки номер изменяемой строки
    }
}
function saveChanges(e) {
    e.preventDefault();
    let index = +e.target.dataset.row;           //получаем из dataset кнопки номер строки, которую надо изменить
    let table = document.querySelector('#tablearea table');
    let row = table.rows[index];
    if (row){       //если строка в таблице найдена
        row.cells[0].innerHTML = document.getElementById('modal-id').value;
        row.cells[1].innerHTML = document.getElementById('modal-first').value;
        row.cells[2].innerHTML = document.getElementById('modal-last').value;
        row.cells[3].innerHTML = (document.getElementById('modal-gender-male').checked === true) ? "Male" : "Female";
        row.cells[4].innerHTML = document.getElementById('modal-memo').value.replace(/\n/g,"<br>");
        row.cells[5].children[0].style.visibility = (document.getElementById('modal-img-show').checked === true) ? "visible" : "hidden";
        closeModal(e);      //закрытие модального окна
    }
}
function closeModal(e) { //закрытие модального окна возможно с сохранением через кнопку или при нажатии на крестик в углу модального окна
    let modal = document.querySelector('.modal');
    let close = document.getElementsByClassName('close')[0];
    let btn = document.getElementById('modal-btn');
    if (e.target===close || e.target === btn) modal.style.display = 'none';
}

if (document.readyState === 'loading') {                              //если документ готов, формируем таблицу
    document.addEventListener('DOMContentLoaded', ()=>createTable(data, HEADINGS));
} else {
    createTable(data, HEADINGS);
}

let filter_btn = document.getElementById('filter-btn');      //кнопка поиска
let table = document.querySelectorAll('#tablearea table')[0];  //сформированная таблица
let filter_input = document.getElementById('filter-input');        //строка поиска

document.querySelectorAll('#hideCols button').forEach((elem)=>elem.addEventListener('click', hideCol));  //назначем слушатели на checkbox, для скрытия колонок

filter_btn.addEventListener('click',(e)=>filter(filter_input.value, table, e)); //слушатель на кнопке для поиска

document.getElementById('pagedata-btn').addEventListener("click", function () {  //открытие новой вкладки (доп цель #1)
   window.open('data.html');
});

table.addEventListener('click', editRow);  //слушатель для изменения строки

document.getElementsByClassName('close')[0].addEventListener('click',closeModal);  //слушатели для закрытия модального окна
document.getElementById('modal-btn').addEventListener("click", saveChanges);




