
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

/**Таблица серийных устройств. Из массива данных формирует HTML таблицу и заполняет её данными из массива*/
function addDataRowToPage(arr) {
    if (arr.length === 0) insertNothing('row_table');
    else if (document.getElementById('row_table') != null) {

        let data ='<table class="row_table"' +
            '<tr>' +
            '<th>Имя</th>' +
            '<th>Внутренний номер</th>' +
            '<th>Серийный</th>' +
            '<th>Статус</th>' +
            '<th>Локация</th>' +
            '<th>Описание</th>' +
            '</tr>';
        let unit;
        for (let i = 0; i < arr.length; i++) {
            console.log(i);
            unit = arr[i];
            data += '<tr>' +
                '<td>' + unit.device_id + '</td>' +
                '<td>' + unit.inner_serial + '</td>' +
                '<td>' + unit.serial + '</td>' +
                '<td>' + unit.state_id + '</td>' +
                '<td>' + getLocationName(unit.location_id) + '</td>' +
                '<td>' + unit.description + '</td>' +
                '</tr>'
            ;
        }
        data += '</table>';
        document.getElementById('row_table').innerHTML = '' + data;
    }
}

/**Таблица ремонтных устройств. Из массива данных формирует HTML таблицу и заполняет её данными из массива*/
function addRepairDataRowToPage(arr) {
    if (arr.length === 0) insertNothing('repair_table');
    else if (document.getElementById('repair_table') != null) {
        let data = '<table class="row_table"' +
            '<tr>' +
            '<th>Имя</th>' +
            '<th>Серийный</th>' +
            '<th>Статус</th>' +
            '<th>Локация</th>' +
            '</tr>';
        let unit;
        for (let i = 0; i < arr.length; i++) {
            unit = arr[i];
            data += '<tr>' +
                '<td>' + unit.device_id + '</td>' +
                '<td>' + unit.serial + '</td>' +
                '<td>' + unit.state_id + '</td>' +
                '<td>' + getLocationName(unit.location_id) + '</td>' +
                '</tr>'
            ;
        }
        data += '</table>';
        document.getElementById('repair_table').innerHTML = '' + data;
    }
}

function getLocationName(text) {
    let name;
    switch (text) {
        case PROFILE_ADJUSTMENT: name = "Регулировка"; break;
        case PROFILE_ASSEMBLY: name = "Сборка"; break;
        case PROFILE_GRADUATION: name = "Градуировка"; break;
        case PROFILE_SOLDERING: name = "Монтаж"; break;
        case PROFILE_REPAIR_AREA: name = "Уч. ремонта"; break;
        default: name = " — ";
    }
    return name;
}

/**Вставляет <SPAN> "Не найдено" в выбранный по id элемент
 *
 * @param id - id элемента, в который будет вставлено "Не найдено"
 */
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

            // console.log('!1 '+new Date(dState.date).getDate()); //NaN
            // console.log('!2 '+new Date(dState.date)); //Invalid Date
            // console.log('!3 '+new Date(dState.date/1000000)); //Thu Jan 01 1970 03:01:03 GMT+0300 (Москва, стандартное время)
            // console.log('!4 '+new Date(dState.date/1000)); //Thu Jan 01 1970 20:42:31 GMT+0300 (Москва, стандартное время)
            // console.log('!5 '+dState.date); //063751644469.254000000
            // console.log('!6 '+dState.date.date); //undefined
            // console.log('!7 '+dState.date.dateTime); //undefined
            // console.log('!9 '+dState.date); //063751644469.254000000
            // console.log('!12 '+new Date(dState.date._seconds*1000)); //Invalid Date
            // console.log('!11 '+dState.date.toDate().toDateString()); //Thu Mar 18 2021
            // console.log('!12 '+dState.date.toDate().toLocaleTimeString('en-US')); //9:07:49 AM
            // console.log('!13 '+dState.date.toDate().toLocaleDateString('en-US')); //3/18/2021
            // console.log('!12 '+dState.date.toDate().toLocaleTimeString('ru-RU')); //09:07:49
            // console.log('!14 '+dState.date.toDate().toLocaleDateString('ru-RU')); //18.03.2021
            // console.log('!15 '+firebase.firestore.Timestamp.fromDate(new Date()).toDate()); //Thu Mar 18 2021 11:26:37 GMT+0300 (Москва, стандартное время)

            let stateDate = dState.date.toDate().toLocaleDateString('ru-RU'); //Дата - 18.03.2021
            let stateTime = dState.date.toDate().toLocaleTimeString('ru-RU'); //Время - 09:07:49

            data += '<tr>' +
                '<td>' + stateDate + ' ' + stateTime + '</td>' +
                '<td>' + dState.state + '</td>' +
                '</tr>';
        }
        data += '</table>';
        document.getElementById('repair_search_result').innerHTML = '' + data;
    }
}
