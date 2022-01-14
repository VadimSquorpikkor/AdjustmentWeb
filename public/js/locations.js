console.log('...загрузка');

const EMPTY_LOCATION = 'Ничего нет...';

let divReg = document.getElementById("location_reg");
let divLin = document.getElementById("location_lin");
let divSbr = document.getElementById("location_sbr");
let divMon = document.getElementById("location_mon");
let divSer = document.getElementById("location_ser");

divReg.innerHTML = '<span class="white_span">'+EMPTY_LOCATION+'</span>'
divLin.innerHTML = '<span class="white_span">'+EMPTY_LOCATION+'</span>'
divSbr.innerHTML = '<span class="white_span">'+EMPTY_LOCATION+'</span>'
divMon.innerHTML = '<span class="white_span">'+EMPTY_LOCATION+'</span>'
divSer.innerHTML = '<span class="white_span">'+EMPTY_LOCATION+'</span>'

/**Для страницы локаций: добавляет информацию о каждом ремонтном устройстве в соответствующий локации div*/
function addListToDiv(arr, div) {
    if (arr.length === 0) div.innerHTML = '<span class="white_span">'+EMPTY_LOCATION+'</span>';
    else if (div != null) {

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
            let deviceName = '- - -';
            deviceName = unit.device_id;
            let serial = unit.serial;
            let date = stateDate + " " + stateTime;
            let state = unit.state_id;
            let isClose = unit.close_date!==undefined;
            let employee = unit.employee_id;

            deviceName = getDeviceById(deviceName).getNameRu;
            state = getStateById(state).getNameRu;
            employee = getEmployeeById(employee).getNameRu;

            let isCloseStroke = '';
            if (isClose) {
                isCloseStroke =
                    '<div style="width: auto">'+
                    '    <span class="big_green" style="width: auto; text-align: center">ЗАВЕРШЕН</span>'+
                    '</div>';
            }

            data +=
                '<div class="found_unit_item" onclick=showHideInfo("'+unit.id+'")>'+
                isCloseStroke+
                '    <div class="item_info_div">'+
                '        <span class="big_orange">'+ deviceName +'</span>'+
                '        <span class="small_white">№ '+ serial +'</span><br>'+

                '        <span id="'+unit.id+'" style="display: none"><span class="small_white">Дата: '+ date +'</span><br>'+
                '        <span class="small_white">Статус: '+ state +'</span><br>'+
                '        <span class="small_white">Ответственный: '+ employee +'</span><br>'+
                '        <span class="small_white">Дней в ремонте: '+daysCount+'</span></span>'+
                '    </div>'+
                '    <div id="'+STATE_PREF+unit.id+'" class="state_host"></div>'+
                '</div>';
        }

        div.innerHTML = '' + data;
    }
}

/**Слушатель новых событий у выбранной локации. Если в локации что-то изменилось, автоматом выводится информация на
 * странице (без перезагрузки)*/
function listen_changes(location, div, func) {
    DBASE.collection(TABLE_UNITS).where('location_id', "==", location)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(() => getRepairUnitListFromBDByLocation(location, div, func));
        });
}

listen_changes(ADJUSTMENT_LOCATION_ID, divReg, addListToDiv);
listen_changes(ASSEMBLY_LOCATION_ID, divSbr, addListToDiv);
listen_changes(GRADUATION_LOCATION_ID, divLin, addListToDiv);
listen_changes(REPAIR_AREA_LOCATION_ID, divSer, addListToDiv);
listen_changes(SOLDERING_LOCATION_ID, divMon, addListToDiv);

