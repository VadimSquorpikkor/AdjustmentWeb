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
        let data =

            '<table><tr>'+
            '    <th>Имя</th>'+
            '    <th>№</th>'+
            '    <th>Операция</th>'+
            '    <th>Пришел в ремонт</th>'+
            '    <th>Ответственный</th>'+
            '</tr>';

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
                '<tr>'+
                '    <td>'+deviceName+'</td>'+
                '    <td>'+serial+'</td>'+
                '    <td>'+state+'</td>'+
                '    <td>'+date+'</td>'+
                '    <td>'+employee+'</td>'+
                '</tr>';

        }

        div.innerHTML = ''+data+'</table>';
    }
}

listen_changes(ADJUSTMENT_LOCATION_ID, divReg, addListToDiv);
listen_changes(ASSEMBLY_LOCATION_ID, divSbr, addListToDiv);
listen_changes(GRADUATION_LOCATION_ID, divLin, addListToDiv);
listen_changes(REPAIR_AREA_LOCATION_ID, divSer, addListToDiv);
listen_changes(SOLDERING_LOCATION_ID, divMon, addListToDiv);

