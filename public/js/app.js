
function addSerialDataRowToPage(arr) {
    if (arr.length === 0) insertNothing('row_table');
    else if (document.getElementById('row_table') != null) {

        document.getElementById('main_logo').style.display = "none";

        let unit;
        let data = '';
        for (let i = 0; i < arr.length; i++) {
            console.log(i);
            unit = arr[i];

            let now_date = new Date();
            let daysCount = (now_date.getTime() - unit.date.toDate().getTime()) / (1000*60*60*24);
            daysCount = Math.round(daysCount);

            let stateDate = unit.date.toDate().toLocaleDateString('ru-RU'); //Дата - 18.03.2021
            let stateTime = unit.date.toDate().toLocaleTimeString('ru-RU'); //Время - 09:07:49
            let deviceName = unit.device_id;
            let serial = unit.serial;
            let innerSerial = unit.inner_serial;
            let date = stateDate + " " + stateTime;
            let state = unit.state_id;
            let location = unit.location_id;
            let dayString = rightDayString(daysCount);

            deviceName = getDeviceById(deviceName).getNameRu;
            state = getStateById(state).getNameRu;
            location = getLocationById(location).getNameRu;

            data +=
            '<div class="found_unit_item" onclick=getAllEventsByUnitIdSmall("'+unit.id+'")>'+
            '    <div class="item_info_div">'+
            '        <span class="big_orange">'+ deviceName +'</span>'+
            '        <span class="small_white">№ '+ serial +'</span>'+
            '        <span class="small_white">(вн. '+ innerSerial +')</span><br>'+
            '        <span class="big_orange">'+ location +'</span><br>'+
            '        <span class="small_white">'+ date +'</span>'+
            '        <span class="small_white">'+ state +'</span>'+
            '    </div>'+
            '    <div class="day_count_div">'+
            '        <span class="big_orange">'+ daysCount +'</span><br>'+
            '        <span class="small_white">'+ dayString +'</span>'+
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

function addCollectionOfDocumentToDiv_new(arr, host) {
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