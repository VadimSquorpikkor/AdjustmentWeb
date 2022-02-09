/**
 * Принцип хранения/загрузки данных
 * 1. Данные загружаются из БД; сущности (локация, статус, сотрудник, устройство) не имеют имен, только идентификаторы имени
 * 2. Сами имена для всех сущностей хранятся в отдельной таблице "names", у каждого имени есть варианты на других языках
 * (исключая имена устройств — для них только варианты на русском и английском, и исключая employees — у них только русские)
 * 3. В приложении есть соответствующие массивы объектов для каждого вида сущностей: locations, states, employees, devices.
 * В объекте хранятся и имена, и их идентификаторы (и ещё разные данные)
 * 4. Массивы играют роль словарей и источников данных, из них формируются спиннеры, с их помощью переводятся идентификаторы
 * в имена и обратно, это всё происходит БЕЗ обращения в БД
 * 5. При загрузке страницы первым делом загружаются данные из таблицы имен (только русский вариант). Эти данные помещаются
 * в Map (dictionary), где ключ — это имя документа firebase, а значение — это значение поля "ru"
 * При загрузке данных для employees, states, devices, location вместо join (как было раньше) используется метод
 * changeNameIdToNameRu, который из библиотеки берет значение на русском по идентификатору
 * 6. Для заполнения спинеров данными, получения идентификаторов по выбранным пунктам и др, осуществляется через SpinnerAdapter
 * 7. Важно! Для эксперимента добавил библиотеку (fdictionary), в которой храню names, locations, devices. При загрузке
 * страницы эти данные теперь берутся не из БД, а из этой библиотеки, это сделано, чтобы сократить кол-во запросов в БД.
 * Из минусов: теперь если добавлю/поменяю имена, локации или устройства в БД, то придется их также менять в fdictionary
 * (раньше ничего не нужно было менять, всё автоматом). Для возврата в вариант из БД в firebase_low_level раскоментировать //вариант когда имена беру из БД//
 *
 * */
//----------------------------------------------------------------------------------------------------------------------
/**Массив объектов всех локаций*/
let locations = [];
/**Массив объектов всех сотрудников*/
let employees = [];
/**Массив объектов всех статусов*/
let states = [];
/**Массив объектов всех устройств*/
let devices = [];
//----------------------------------------------------------------------------------------------------------------------
/**Если ремонт, то добавляем всё, если серия, то всё, кроме "Группа сервиса" */
function getLocationsByParam(locations, type_id) {
    if (type_id===REPAIR_TYPE) return locations;
    let new_arr = [];
    for (let i = 0; i < locations.length; i++) {
        if (locations[i].getNameId!=="repair_area") new_arr.push(locations[i]);
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
/**Показывает/скрывает список всех событий для выбранного юнита*/
function getAllEventsByUnitIdSmall(unit_id) {
    let host = STATE_PREF + unit_id;
    let size = document.getElementById(host).innerHTML.length;
    //если список событий не показан, то показать, если уже показывается (size!==0), то очищаем (удаляем) список
    if (size === 0) getAllEventsByUnitId_new(DBASE, TABLE_EVENTS, EVENT_UNIT, unit_id, addEventsCollectionToDiv, EVENT_DATE, DESCENDING, host);
    else document.getElementById(host).innerHTML = '';

}

/**Показывает/скрывает доп инфо*/
function showHideInfo(unit_id) {
    let elem = document.getElementById(unit_id);
    if (elem.style.display === 'none') elem.style.display = 'inline-block';
    else elem.style.display = 'none';
}

function startSearch_new() {
    // В начало массива добавляется объект "все локации" (имя="все локации", id="any_value", когда
    // getUnitListFromBD получает параметр "any_value", значит выборка будет игнорировать значение локации, т.е. будет
    // выбран юнит с любой локацией

    let deviceName_id = devicesSpinnerAdapter.getSelectedNameId();
    let location_id =   locationSpinnerAdapter.getSelectedNameId();
    let state_id =      stateSpinnerAdapter.getSelectedNameId();
    let employee_id =   employeeSpinnerAdapter.getSelectedNameId();

    let serial =        serialText.value;
    let type_id =       getType();

    //console.log("name="+deviceName_id+" loc="+location_id+" state="+state_id+" empl="+employee_id+" serial="+serial+" type="+type_id);

    //Если поле номера пустое, то ищем по параметрам, если поле содержит значение, то ищем по этому значению, игнорируя
    // все остальные параметры. Т.е. ищем или по параметрам, или по номеру. Тип устройства учитывается в любом из случаев
    if (serial === "") getUnitListFromBD(deviceName_id, location_id, employee_id, type_id, state_id, ANY_VALUE);
    else getUnitListFromBD(ANY_VALUE, ANY_VALUE, ANY_VALUE, type_id, ANY_VALUE, serial);
}


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
loadNames();
loadLocation();
loadEmployees();
loadStates();
loadDevices();
