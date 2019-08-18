import data from "./json.js";

const HEADINGS = ["Идентификатор", "Имя", "Фамилия", "Пол", "Ключевые фразы", "Изображение"];
const HEADNAMES = ['id', 'name', 'name', 'gender', 'memo', 'img'];
const rowNum = data.length;
const colNum = 6;

function createTable(data, headings) {
    let table = document.createElement('table');
    fillHeadings(table, headings);
    let tr = [];
    for (let i = 0; i < rowNum; i++) {
        tr[i] = document.createElement('tr');
        for (let j = 0; j < colNum; j++) {
            let td = document.createElement('td');
            switch (j) {
                case 1:
                    td.innerHTML = data[i][HEADNAMES[j]]['first'];
                    break;
                case 2:
                    td.innerHTML = data[i][HEADNAMES[j]]['last'];
                    break;
                case 4:
                    data[i][HEADNAMES[j]].forEach(function (item) {
                        td.innerHTML += item + '</br>';
                    });
                    break;
                case 5:
                    let img = document.createElement('img');
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
    document.getElementById('tablearea').appendChild(table);
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
function filter(phrase, table, e) { //TODO запрещенные символы [ \ ^ $ . | ? * + ( )
    e.preventDefault();
    phrase = phrase.trim();
    let new_phrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    let arrCols = checkCols();
    deleteOldSpans(table);
    let pattern = new RegExp(new_phrase, 'i');
    let findFlag = false;
    for (let i = 1; i < rowNum + 1 ; i++) {
        findFlag = false;
        for (let j = 0; j < colNum - 1; j++){
            if (arrCols[j]) {
                findFlag = pattern.test(table.rows[i].cells[j].innerHTML.replace(/<br>/g, ''));
                if (findFlag) break;
            }
        }
        if (findFlag){
            table.rows[i].classList.remove('notFind');
        }
        else table.rows[i].classList.add('notFind');
    }
    let count = highlight(phrase, table, arrCols);
    let findLabel = document.getElementById("findLabel");
    findLabel.innerHTML = `Строк найдено: ${75-document.getElementsByClassName('notFind').length}`;
    if (count) findLabel.innerHTML += `; Совпадений: ${count}`;
    findLabel.classList.remove('hidden');
}
function checkCols() {
    let searchCols = (new Array(5)).fill(true, 0, 5);
    let checkBoxes = document.querySelectorAll('#searchCols input');
    checkBoxes.forEach((elem, index)=>{
        if (!elem.checked) searchCols[index] = false;
    });
    return searchCols;
}
function deleteOldSpans(table) {
    let deleteSpan1 = /<span class="highlight">/ig;
    let deleteSpan2 = /<\/span>/ig;
    for (let i = 1; i < rowNum +1 ; i++) {
        for (let j = 0; j < colNum - 1; j++) {
            table.rows[i].cells[j].innerHTML = table.rows[i].cells[j].innerHTML.replace(deleteSpan1, "");
            table.rows[i].cells[j].innerHTML = table.rows[i].cells[j].innerHTML.replace(deleteSpan2, "");
        }
    }
}
function highlight(phrase, table, arrCols) {
    let new_phrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    let pattern = new RegExp(new_phrase,'ig');
    let count = 0;
    for (let i = 1; i < rowNum + 1; i++){
        if (!table.rows[i].classList.contains('notFind'))
        for (let j = 0; j < colNum - 1; j++) {
            if (~table.rows[i].cells[j].innerHTML.toLowerCase().indexOf(phrase.toLowerCase()) && phrase!=="" && arrCols[j]) {
                count += table.rows[i].cells[j].innerHTML.match(pattern).length;
                table.rows[i].cells[j].innerHTML = table.rows[i].cells[j].innerHTML.replace(pattern, '<span class="highlight">$&</span>');
            }
        }
    }
    return count;
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
    if (row && table.contains(row) && row.rowIndex!==0){
        modal.style.display = "flex";
        document.getElementById('modal-id').value = row.cells[0].innerHTML;
        document.getElementById('modal-first').value = row.cells[1].innerHTML;
        document.getElementById('modal-last').value = row.cells[2].innerHTML;
        if (row.cells[3].innerHTML === "Male"){
            document.getElementById('modal-gender-male').checked = true;
            document.getElementById('modal-gender-female').checked = false;
        }
        else{
            document.getElementById('modal-gender-male').checked = false;
            document.getElementById('modal-gender-female').checked = true;
        }
        document.getElementById('modal-memo').innerHTML = row.cells[4].innerHTML.replace(/<br>/g, "\n");
        if (row.cells[5].children[0].style.visibility !== 'hidden' ){
            document.getElementById('modal-img-show').checked = true;
            document.getElementById('modal-img-hide').checked = false;
        }
        else{
            document.getElementById('modal-img-show').checked = false;
            document.getElementById('modal-img-hide').checked = true;
        }
        let modal_btn = document.getElementById('modal-btn');
        modal_btn.dataset.row = row.rowIndex.toString();
    }
}
function saveChanges(e) {
    e.preventDefault();
    let index = +e.target.dataset.row;
    let table = document.querySelector('#tablearea table');
    let row = table.rows[index];
    if (row){
        row.cells[0].innerHTML = document.getElementById('modal-id').value;
        row.cells[1].innerHTML = document.getElementById('modal-first').value;
        row.cells[2].innerHTML = document.getElementById('modal-last').value;
        row.cells[3].innerHTML = (document.getElementById('modal-gender-male').checked === true) ? "Male" : "Female";
        row.cells[4].innerHTML = document.getElementById('modal-memo').value.replace(/\n/g,"<br>");
        row.cells[5].children[0].style.visibility = (document.getElementById('modal-img-show').checked === true) ? "visible" : "hidden";
        closeModal(e);
    }
}
function closeModal(e) {
    let modal = document.querySelector('.modal');
    let close = document.getElementsByClassName('close')[0];
    let btn = document.getElementById('modal-btn');
    if (e.target===close || e.target === btn) modal.style.display = 'none';
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ()=>createTable(data, HEADINGS));
} else {
    createTable(data, HEADINGS);
}

let filter_btn = document.getElementById('filter-btn');
let table = document.querySelectorAll('#tablearea table')[0];
let filter_input = document.getElementById('filter-input');

document.querySelectorAll('#hideCols button').forEach((elem)=>elem.addEventListener('click', hideCol));

filter_btn.addEventListener('click',(e)=>filter(filter_input.value, table, e));

table.addEventListener('click', editRow);

document.getElementsByClassName('close')[0].addEventListener('click',closeModal);
document.getElementById('modal-btn').addEventListener("click", saveChanges);


