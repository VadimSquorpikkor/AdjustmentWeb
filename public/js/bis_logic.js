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
 * 7.
 * */
//----------------------------------------------------------------------------------------------------------------------
function getName(id) {
    if (!dictionary.has(id)) return id;
    return (typeof dictionary.get(id).en)==='undefined'?dictionary.get(id):dictionary.get(id).ru;
}

function changeNameIdToNameRu(name_id, obj) {
    obj.setNameRu(dictionary.get(name_id).ru);
}
//----------------------------------------------------------------------------------------------------------------------
/**Массив объектов всех локаций*/
let locations = [];
/**Массив объектов всех сотрудников*/
let employees = [];
/**Массив объектов всех статусов*/
let states = [];
/**Массив объектов всех устройств*/
let devices = [];
/**Словарь id->names*/
let dictionary = new Map();
//----------------------------------------------------------------------------------------------------------------------
function loadLocation() {
    let loc_arr = [];
    DBASE.collection(TABLE_LOCATIONS)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let id = doc.data().id;
            let name_id = doc.data().name_id;
            let name_ru = doc.data().name_id;
            let location = new Location(id, name_id, name_ru);

            changeNameIdToNameRu(name_id, location);
            loc_arr.push(location);
        });
        locations = loc_arr;
        if (document.getElementById('location_spinner')!==null) updateLocationSpinner();
    });
}

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
/**Сотрудников на английском нет вот почему: они используются ТОЛЬКО в приложениях для внутреннего пользования (AdjustmentDB и
 * AdjustmentWeb, людям отслеживающих ремонт знать фамилии сотрудников не нужно), а значит значения нужны только на
 * русском, а значит можно значение на русском записать в поле name_id документа таблицы "employees", при загрузке
 * списка сотрудников в name_ru будет присвоено значение идентификатора автоматом (метод join не найдя сотрудников в
 * "names" оставит идентификатор, который является в этом случае именем на русском. Профит)*/
function loadEmployees() {
    let emp_arr = [];
    //Внимание! Для employee name_id — это id, а name — это name_id
    //Так сделано, потому что для сохранения сотрудника в юните нужен id сотрудника
    // (поэтому name_id — это id), а для отображения имени в спиннере достаточно
    // name_id без подгрузки имени из таблицы имен (name — это name_id)
    DBASE.collection(TABLE_EMPLOYEES)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let id = doc.data().id;
            let name_id = id;
            let name_ru = doc.data().name_id;
            let email = doc.data().email;
            let location_id = doc.data().location_id;
            let employee = new Employee(id, name_id, name_ru, email, location_id);
            emp_arr.push(employee);
        });
        employees = emp_arr;
        if (document.getElementById('location_spinner')!==null) updateEmployeeSpinner();
    });
}
//----------------------------------------------------------------------------------------------------------------------
function loadStates() {
    let sta_arr = [];
    DBASE.collection(TABLE_STATES)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let id = doc.data().id;
            let name_id = doc.data().name_id;
            let name_ru = doc.data().name_id;
            let type = doc.data().type_id;
            let location_id = doc.data().location_id;
            let state = new State(id, name_id, name_ru, type, location_id);

            changeNameIdToNameRu(name_id, state);
            sta_arr.push(state);
        });
        states = sta_arr;
        if (document.getElementById('location_spinner')!==null) updateStatesSpinner();
    });
}

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
function listen(table, func) {
    DBASE.collection(table)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            func(doc);
        });
    });
}

function loadDevices() {
    let dev_arr = [];
    DBASE.collection(TABLE_DEVICES)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let id = doc.data().id;
            let name_id = doc.data().name_id;
            let name_ru = doc.data().name_id;
            let device = new Device(id, name_id, name_ru);

            //альт вариант
            // changeNameIdToNameRu(name_id, device);
            // devices.push(device);
            // updateDeviceSpinner();

            changeNameIdToNameRu(name_id, device);
            dev_arr.push(device);
        });
        devices = dev_arr;
        if (document.getElementById('location_spinner')!==null) updateDeviceSpinner();
    });
}
//----------------------------------------------------------------------------------------------------------------------
/**При загрузке страницы первым делом загружаются данные из таблицы имен (только русский вариант). Эти данные помещаются
 * в Map (dictionary), где ключ — это имя документа firebase, а значение — это значение поля "ru"
 * При загрузке данных для employees, states, devices, location вместо join (как было раньше) используется метод
 * changeNameIdToNameRu, который из библиотеки берет значение на русском по идентификатору*/
function loadNames() {
    DBASE.collection(TABLE_NAMES)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // let en = doc.data().en;
            let ru = doc.data().ru;
            let id = doc.id;
            dictionary.set(id, {ru: ru});
        });
    });
    // loadLocation();
    // loadEmployees();
    // loadStates();
    // loadDevices();
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
