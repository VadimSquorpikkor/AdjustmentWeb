function load() {
    const db = firebase.firestore();
    db.collection("units").doc("3509_98765").set({
        innerSerial: "98765",
        name: "3509",
        serial: "55555",
        state: "На сборке"
    });
}

function insertSpinner() {
    document.getElementById('spinner').innerHTML = '' +
        '   <select id="ra_spinner" onchange="nothing()">' +
        '                    <option value="1">БДКГ-02</option>' +
        '                    <option value="2">БДПА-01</option>' +
        '                    <option value="3">БДМГ-2327</option>' +
        '                </select>'
}

/** Массив имен для динамического спиннера выбора имени устройства. Потом массив будет формироваться динамически из БД*/
let unit_names = ['Все устройства', 'БДКГ-02', 'АТ2503', 'АТ6130']; //уже не используется
/** Массив статусов для динамического спиннера выбора статусов устройства. Потом массив будет формироваться динамически из БД*/
let all_states = ['Все статусы', 'На сборке', 'На регулировке', 'На линейке', 'Ещё что-то']; //уже не используется

/** Из массива названий формирует Спиннер */
function insertSpinnerByArray(name, arr) {
    if (document.getElementById(name) != null) {
        let code = '   <select id="ra_spinner" onchange="nothing()">'; //первая строчка html (nothing() потом будет изменен на нужный метод)
        for (let i = 0; i < arr.length; i++) {
            code += '<option value=' + (i + 1) + '>' + arr[i] + '</option>' //через цикл добавляется строка спиннера (option) вида: <option value="1">БДКГ-02</option>
        }
        document.getElementById(name).innerHTML = code + '</select>'; //добавляем закрывающий тэг и выводим всё в элемент по id
    }
}

function nothing() {

}

function addDataRowToPage(arr) {
    let data = '<tr>' +
        '<th>Имя</th>' +
        '<th>Внутренний номер</th>' +
        '<th>Серийный</th>' +
        '<th>Статус</th>' +
        '</tr>';
    let unit;
    for (let i = 0; i < arr.length; i++) {
        unit = arr[i];
        // data += unit.name + ' ' + unit.innerSerial + ' ' + unit.serial + ' ' + unit.state + '<br>';
        data += '<tr>' +
            '<td>' + unit.name + '</td>' +
            '<td>' + unit.innerSerial + '</td>' +
            '<td>' + unit.serial + '</td>' +
            '<td>' + unit.state + '</td>' +
            '</tr>';
    }
    document.getElementById('row_table').innerHTML = '' + data;
}


