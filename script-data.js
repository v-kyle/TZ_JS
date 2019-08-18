import data from "./json.js";

let num = 0;

function showData(data, tenIndex) {
    let btnB = document.getElementById('btn-b');
    let btnN = document.getElementById('btn-n');
    if (tenIndex > 0) {
        btnB.style.visibility = "visible";
    }
    else{
        btnB.style.visibility = "hidden";
    }
    if (tenIndex > (data.length)/10-1){
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ()=>showData(data, num));
} else {
    showData(data, num);
}

let btnB = document.getElementById('btn-b');
let btnN = document.getElementById('btn-n');
btnB.addEventListener("click", ()=>showData(data, --num));
btnN.addEventListener("click", ()=>showData(data, ++num));