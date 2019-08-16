//TODO: Комментировать код
import data from "./json.js";

let headings = ["Идентификатор", "Имя", "Фамилия", "Пол", "Ключевые фразы", "Изображение"];
const rowNum = data.length;
const colNum = 6;
let headNames = ['id', 'name', 'name', 'gender', 'memo', 'img'];

function checkCols() {
    let searchCols = [1,1,1,1,1];
    let checkBoxes = document.querySelectorAll('#searchCols input');
    checkBoxes.forEach((elem, index)=>{
        if (!elem.checked) searchCols[index] = 0;
    });
    return searchCols;
}

function fillHeadings(table, headings) {

    let tr = document.createElement('tr');
    for (let j = 0; j < colNum; j++){
        let th = document.createElement('th');
        th.innerHTML = headings[j];
        tr.appendChild(th);
    }
    table.appendChild(tr);
}

function createTable(data, headings) {
    let table = document.createElement('table');
    fillHeadings(table, headings);
    let tr = [];
    for (let i = 0; i < rowNum; i++) {
        tr[i] = document.createElement('tr');
        for (let j = 0; j < colNum; j++) {
            let td = document.createElement('td');
            if (j===1) {
                td.innerHTML = data[i][headNames[j]]['first'];
            }
            else if (j===2){
                td.innerHTML = data[i][headNames[j]]['last'];
            }
            else if (j===4){
                data[i][headNames[j]].forEach(function (item) {
                    td.innerHTML += item + '</br>';
                })
            }
            else if (j===5){
                let img = document.createElement('img');
                img.src = data[i][headNames[j]].toString();
                td.appendChild(img);
            }
            else td.innerHTML = data[i][headNames[j]];
            tr[i].appendChild(td);
        }
        table.appendChild(tr[i]);
    }
    document.getElementById('tablearea').appendChild(table);
}

function highlight(phrase, table) {
    let arrCols = checkCols();
    let pattern = new RegExp(phrase.trim(),'ig');
    let count = 0;
    for (let i = 1; i < rowNum + 1; i++){
        if (!table.rows[i].classList.contains('notFind'))
        for (let j = 0; j < colNum - 1; j++) {
            if (~table.rows[i].cells[j].innerHTML.toUpperCase().indexOf(phrase.trim().toUpperCase()) && phrase.trim()!=="" && arrCols[j]) {
                count += table.rows[i].cells[j].innerHTML.match(pattern).length;
                table.rows[i].cells[j].innerHTML = table.rows[i].cells[j].innerHTML.replace(pattern, '<span class="highlight">$&</span>');
            }
        }
    }
    return count;
}

function deleteOldSpans(table) {
    let deleteSpan1 = /<span class="highlight"(.*?)>/ig;
    let deleteSpan2 = /<\/span>/ig;
    for (let i = 1; i < rowNum +1 ; i++) {
        for (let j = 0; j < colNum - 1; j++) {
            table.rows[i].cells[j].innerHTML = table.rows[i].cells[j].innerHTML.replace(deleteSpan1, "");
            table.rows[i].cells[j].innerHTML = table.rows[i].cells[j].innerHTML.replace(deleteSpan2, "");
        }
    }
}

function filter(phrase, table, e) {
    e.preventDefault();
    let colsArr = checkCols();
    deleteOldSpans(table);
    let pattern = new RegExp(phrase.trim(), 'i');
    let findFlag = false;
    for (let i = 1; i < rowNum + 1 ; i++) {
        findFlag = false;
        for (let j = 0; j < colNum - 1; j++){
            if (colsArr[j]) {
                findFlag = pattern.test(table.rows[i].cells[j].innerHTML.replace(/<br>/g, ''));
                if (findFlag) break;
            }
        }
        if (findFlag){
            table.rows[i].classList.remove('notFind');
        }
        else table.rows[i].classList.add('notFind');
    }
    let count = highlight(phrase, table);
    let findLabel = document.getElementById("findLabel");
    findLabel.innerHTML = `Number of rows found: ${75-document.getElementsByClassName('notFind').length}`;
    if (count) findLabel.innerHTML += `; Number of mathes: ${count}`;
    findLabel.classList.remove('hidden');
}

function hideCol(e) {
    let table = document.querySelectorAll('#tablearea table')[0];
    e.target.classList.toggle('notActiveBtn');
    e.target.classList.toggle('ActiveBtn');
    let num = e.target.id[1];
    for (let i = 0; i < rowNum + 1; i++)
        table.rows[i].cells[num].classList.toggle('notFind');
}

function editRow(e) {
    let modal = document.querySelector('.modal');
    let table = document.querySelectorAll('#tablearea table')[0];
    let row = e.target.closest('tr');
    if (row && table.contains(row) && row.rowIndex!==0) modal.style.display = "flex";

}
createTable(data, headings);

let filter_btn = document.getElementById('filter-btn');
let table = document.querySelectorAll('#tablearea table')[0];
let filter_input = document.getElementById('filter-input');

document.querySelectorAll('#hideCols button').forEach((elem)=>elem.addEventListener('click', (e)=>hideCol(e)));

filter_btn.addEventListener('click',(e)=>filter(filter_input.value, table, e));

table.addEventListener('click', (e)=>editRow(e));


