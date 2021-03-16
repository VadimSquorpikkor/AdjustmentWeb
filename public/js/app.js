
/** Массив имен для динамического спиннера выбора имени устройства. Потом массив будет формироваться динамически из БД*/
let unit_names = ['Все устройства', 'БДКГ-02', 'АТ2503', 'АТ6130']; //уже не используется
/** Массив статусов для динамического спиннера выбора статусов устройства. Потом массив будет формироваться динамически из БД*/
let all_states = ['Все статусы', 'На сборке', 'На регулировке', 'На линейке', 'Ещё что-то']; //уже не используется

/** Из массива названий формирует Спиннер
 * @param name - id пустого спиннера, в который будут добавлены данные
 * @param arr  - массив данных, которыми будет заполняться спиннер
 */
function insertSpinnerByArray(name, arr) {
    if (document.getElementById(name) != null) {
        let code = '';
        for (let i = 0; i < arr.length; i++) {
            code += '<option value=' + (i + 1) + '>' + arr[i] + '</option>' //через цикл добавляется строка спиннера (option) вида: <option value="1">БДКГ-02</option>
        }
        document.getElementById(name).innerHTML = '   <select>' + code + '</select>'; //добавляем открывающий и закрывающий тэг и выводим всё в элемент по id
    }
}

/**Возвращает текущее значение спиннера. Нужно, так как spinner.value возвращает номер пункта, но не его значение*/
function getValueFromSpinner(id) {
    let sel = document.getElementById(id);
    return sel.options[sel.selectedIndex].text;
}

/**Таблица серийных устройств. Из массива данных формирует HTML таблицы и заполняет её данными из массива*/
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
        data += '<tr>' +
            '<td>' + unit.name + '</td>' +
            '<td>' + unit.innerSerial + '</td>' +
            '<td>' + unit.serial + '</td>' +
            '<td>' + unit.state + '</td>' +
            '</tr>';
    }
    document.getElementById('row_table').innerHTML = '' + data;
}

/**Таблица ремонтных устройств. Из массива данных формирует HTML таблицы и заполняет её данными из массива*/
function addRepairDataRowToPage(arr) {
    if (document.getElementById('repair_table') != null) {
        let data = '<tr>' +
            '<th>ID</th>' +
            '<th>Имя</th>' +
            '<th>Серийный</th>' +
            '</tr>';
        let unit;
        for (let i = 0; i < arr.length; i++) {
            unit = arr[i];
            data += '<tr>' +
                '<td>' + unit.id + '</td>' +
                '<td>' + unit.name + '</td>' +
                '<td>' + unit.serial + '</td>' +
                '</tr>';
        }
        document.getElementById('repair_table').innerHTML = '' + data;
    }
}

function insertNothing(id) {
    document.getElementById(id).innerHTML = '<span class="white_span">Не найдено</span>'
}

function addCollectionOfDocumentToDiv(arr, unit) {
    let data;
    if (arr.length === 0) {
        document.getElementById('repair_search_result').innerHTML =
            '<h3>'+unit.name+' №' + unit.serial + '</h3>'+
            '<span class="white_span">Статусов не найдено</span>';
        //insertNothing('repair_search_result_table');
        console.log('статусов не найдено');
    } else {
        let dState;
        data =
            '<h3>'+unit.name+' №' + unit.serial + '</h3>'+
            '<table class="row_table" id="repair_search_result_table">'+
            '<tr>' +
            '<th style="width: 200px">Дата</th>' +
            '<th style="width: 400px">Статус</th>' +
            '</tr>';
        for (let i = 0; i < arr.length; i++) {
            dState = arr[i];
            data += '<tr>' +
                '<td>' + dState.date + '</td>' +
                '<td>' + dState.state + '</td>' +
                '</tr>';
        }
        data += '</table>';
        document.getElementById('repair_search_result').innerHTML = '' + data;
    }
}
