import data from "./json.js"; //Импорт данного JSON

let num = 0;                 //отвечает за показ опредленной десятки строк

function showData(data, tenIndex) {          //функция парсинга JSON и вставки строк в документ
    let btnB = document.getElementById('btn-b'); //кнопка "Предыдущие"
    let btnN = document.getElementById('btn-n'); //кнопка "Следующие"
    if (tenIndex > 0) {                     //если есть предыдущие элементы, показываем соответствующую кнопку, иначе скрываем
        btnB.style.visibility = "visible";
    }
    else{
        btnB.style.visibility = "hidden";
    }
    if (tenIndex > (data.length)/10-1){  //если нет следующих элементов, скрываем соответствующую кнопку, иначе показываем
        btnN.style.visibility = "hidden";
    }
    else {
        btnN.style.visibility = "visible";
    }
    let textarea = document.getElementById('textarea');
    textarea.innerHTML = "";
    let p = document.createElement('p');
    for (let i = tenIndex*10; i < (((tenIndex+1)*10 > data.length) ? data.length : (tenIndex+1)*10); i++) {
        p.innerHTML += `${i}. `;
        p.innerHTML += ' email: ';
        p.innerHTML += JSON.stringify(data[i]['email']);
        p.innerHTML += ' gender: ';
        p.innerHTML += JSON.stringify(data[i]['gender']);
        p.innerHTML += ' id: ';
        p.innerHTML += JSON.stringify(data[i]['id']);
        p.innerHTML += ' img: ';
        p.innerHTML += JSON.stringify(data[i]['img']);
        for (let j = 0; j < data[i]['memo'].length; j++) {
            p.innerHTML += `    memo[${j}]: `;
            p.innerHTML += JSON.stringify(data[i]['memo'][j]);
        }
        p.innerHTML += ' first name: ';
        p.innerHTML += JSON.stringify(data[i]['name']['first']);
        p.innerHTML += ' last name: ';
        p.innerHTML += JSON.stringify(data[i]['name']['last']);
        p.innerHTML += '<br>';
    }
    textarea.appendChild(p);
}

if (document.readyState === 'loading') {                    //если документ готов, показываем информацию
    document.addEventListener('DOMContentLoaded', ()=>showData(data, num));
} else {
    showData(data, num);
}

let btnB = document.getElementById('btn-b');  //кнопка "Предыдущие"
let btnN = document.getElementById('btn-n'); //кнопка "Следующие"
btnB.addEventListener("click", ()=>showData(data, --num)); //слушатель для показа предыдущих строк
btnN.addEventListener("click", ()=>showData(data, ++num)); //слушатель для показа следующих строк