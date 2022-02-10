/**Массив объектов всех локаций*/
let locations = [];
/**Массив объектов всех сотрудников*/
let employees = [];
/**Массив объектов всех статусов*/
let states = [];
/**Массив объектов всех устройств*/
let devices = [];
/**Массив объектов всех комплектов устройств*/
let deviceSets = [];
//----------------------------------------------------------------------------------------------------------------------
/**Если ремонт, то добавляем всё, если серия, то всё, кроме "Группа сервиса" */
function getLocationsByParam(locations, type_id) {
    if (type_id===REPAIR_TYPE) return locations;
    let new_arr = [];
    for (let i = 0; i < locations.length; i++) {
        if (locations[i].getId!=="repair_area") new_arr.push(locations[i]);
    }
    return new_arr;
}
//----------------------------------------------------------------------------------------------------------------------
function getStatesByParam(states, type_id, location_id) {
    let new_arr = [];
    if (location_id === ANY_VALUE) {
        for (let i = 0; i < states.length; i++) {
            if (states[i].getType===TYPE_ANY || states[i].getType===type_id) new_arr.push(states[i]);
        }
    } else {
        for (let i = 0; i < states.length; i++) {
            if ((states[i].getType===TYPE_ANY || states[i].getType===type_id) && states[i].getLocation===location_id) new_arr.push(states[i]);
        }
    }
    return new_arr;
}
//----------------------------------------------------------------------------------------------------------------------


function getDeviceById(id) {
    if (id===null||typeof id === 'undefined') return new Device("", "", EMPTY_VALUE);
    for (let i = 0; i < devices.length; i++) {
        if (devices[i].getId===id) return devices[i];
    }
    return id;
}
function getEmployeeById(id) {
    if (id===null||typeof id === 'undefined') return new Employee("", "", EMPTY_VALUE, "","");
    for (let i = 0; i < employees.length; i++) {
        if (employees[i].getId===id) return employees[i];
    }
    return id;
}
function getLocationById(id) {
    if (id===null||typeof id === 'undefined') return new Location("", "", EMPTY_VALUE);
    for (let i = 0; i < locations.length; i++) {
        if (locations[i].getId===id) return locations[i];
    }
    return id;
}
function getStateById(id) {
    if (id===null||typeof id === 'undefined') return new State("", "", EMPTY_VALUE, "");
    for (let i = 0; i < states.length; i++) {
        // console.log(i+' - '+states[i].getId);
        if (states[i].getId===id) return states[i];
    }
    return id;
}

//----------------------------------------------------------------------------------------------------------------------
/**Показывает/скрывает список всех событий для выбранного юнита*/
function getAllEventsByUnitIdSmall(unit_id) {
    let host = STATE_PREF + unit_id;
    let size = document.getElementById(host).innerHTML.length;
    //если список событий не показан, то показать, если уже показывается (size!==0), то очищаем (удаляем) список
    if (size === 0) getAllEventsByUnitId(unit_id, addEventsCollectionToDiv, EVENT_DATE, DESCENDING, host);
    else document.getElementById(host).innerHTML = '';
}
//----------------------------------------------------------------------------------------------------------------------
getLocations();
getEmployees();
getStates();
getDevices();
getDeviceSets();
