function rightDayString(i) {
    if (i===11||i===12||i===13||i===14)return "дней";
    switch (i%10) {
        case 1:return "день";
        case 2:
        case 3:
        case 4:return "дня";
        default:return "дней";
    }
}

function addSerialDataRowToPage(arr) {
    if (arr.length === 0) insertNothing('row_table');
    else if (document.getElementById('row_table') != null) {

        document.getElementById('main_logo').style.display = "none";

        let unit;
        let data = '';
        for (let i = 0; i < arr.length; i++) {
            // console.log(i);
            unit = arr[i];

            let now_date = new Date();
            let daysCount = (now_date.getTime() - unit.date.toDate().getTime()) / (1000*60*60*24);
            daysCount = Math.round(daysCount);

            let stateDate = unit.date.toDate().toLocaleDateString('ru-RU'); //Дата - 18.03.2021
            let stateTime = unit.date.toDate().toLocaleTimeString('ru-RU'); //Время - 09:07:49
            let deviceName = unit.device_id;
            let serial = unit.serial;
            let innerSerial = unit.inner_serial;
            if (innerSerial==="") innerSerial = '';
            else innerSerial = '(вн. '+ innerSerial +')';
            let date = stateDate + " " + stateTime;
            let state = unit.state_id;
            let location = unit.location_id;
            let dayString = rightDayString(daysCount);
            let isClose = unit.close_date!==undefined;
            let employee = unit.employee_id;
            let type = unit.type_id;
            let trackId = unit.trackid;
            if (trackId===null || typeof trackId==='undefined')trackId = '- - -';

            deviceName = getDeviceById(deviceName).getNameRu;
            state = getStateById(state).getNameRu;
            location = getLocationById(location).getNameRu;
            employee = getEmployeeById(employee).getNameRu;
            type = type==="serial_type"?"Серия":"Ремонт";


            // state = getStateById(state);
            // if (state!=='undefined') state = state.getNameRu;//todo когда state и location будет браться из ивента, сделать, типа "deviceName = getDeviceById(deviceName).getNameRu"
            // location = getLocationById(location);
            // if (location!=='undefined') location = location.getNameRu;

            let trackIdStroke = type==="Серия"?'':'<span class="big_orange">ID: '+ trackId +'</span><br>';

            let isCloseStroke = '';
            if (isClose) {
                isCloseStroke =
                    '<div style="width: auto">'+
                    '    <span class="big_green" style="width: auto; text-align: center">ЗАВЕРШЕН</span>'+
                    // '<hr>'+
                    '</div>';
            }

            data +=
            '<div class="found_unit_item" onclick=getAllEventsByUnitIdSmall("'+unit.id+'")>'+
                isCloseStroke+
            '    <div class="item_info_div">'+trackIdStroke+
            '        <span class="big_orange">'+ deviceName +'</span>'+
            '        <span class="small_white">№ '+ serial +'</span>'+
            '        <span class="small_white">'+ innerSerial +'</span><br>'+
            '        <span class="big_orange">'+ location +'</span><br>'+
            '        <span class="small_white">'+ date +'</span>'+
            '        <span class="small_white">'+ state +'</span>'+
            '    </div>'+
            '    <div class="day_count_div">'+
            '        <span class="big_orange">'+ type +'</span><br>'+
            '        <span class="small_white">Отв.: '+ employee +'</span><br>'+
            '        <span class="small_white">Дней в работе: '+daysCount+'</span>'+
            // '        <span class="big_orange">'+ daysCount +'</span><br>'+
            // '        <span class="small_white">'+ dayString +'</span>'+
            '    </div>'+
            '    <div id="'+STATE_PREF+unit.id+'" class="state_host"></div>'+
            '</div>';
        }

        document.getElementById('row_table').innerHTML = '' + data;
    }
}

/**
 * Вставляет <SPAN> "Не найдено" в выбранный по id элемент
 * @param id - id элемента, в который будет вставлено "Не найдено"
 */
function insertNothing(id) {
    document.getElementById(id).innerHTML = '<span class="white_span">'+FOUND_NOTHING+'</span>'
}

/**Из массива событий формирует HTML код в виде списка панелек и добавляет в DIV выбранного устройства*/
function addEventsCollectionToDiv(arr, host) {
    let data;
    if (arr.length === 0) {
        document.getElementById(host).innerHTML =
            '<span class="white_span">Статусов не найдено</span>';
    } else {
        let event;
        data = '';
        for (let i = 0; i < arr.length; i++) {
            event = arr[i];

            let stateDate = event.date.toDate().toLocaleDateString('ru-RU'); //Дата - 18.03.2021
            let stateTime = event.date.toDate().toLocaleTimeString('ru-RU'); //Время - 09:07:49
            let state = event.state_id;
            let location = event.location_id;
            // console.log(location);

            state = getStateById(state).getNameRu;
            location = getLocationById(location).getNameRu;

            data +=
                '<div class="state_div">'+
                '    <div class="item_info_div">'+
                '        <span class="big_orange">'+ location +'</span><br>'+
                '        <span class="small_white">'+ state +'</span>'+
                '    </div>'+
                '    <div class="date_div">'+
                '        <span class="small_white">'+ stateDate +'</span><br>'+
                '        <span class="small_white">'+ stateTime +'</span>'+
                '    </div>'+
                '</div>';
        }
        document.getElementById(host).innerHTML = '' + data;
    }
}

// Для времени варианты
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