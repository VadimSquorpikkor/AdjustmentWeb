/**
 * Принцип хранения/загрузки данных
 * 1. Данные загружаются из БД; сущности (локация, статус, сотрудник, устройство) не имеют имен, только идентификаторы имени
 * 2. Сами имена для всех сущностей хранятся в отдельной таблице "names", у каждого имени есть варианты на других языках
 * (исключая имена устройств — для них только варианты на русском и английском)
 * 3. В приложении есть соответствующие массивы объектов для каждого вида сущностей: locations, states, employees, devices.
 * В объекте хранятся и имена, и их идентификаторы (и ещё разные данные)
 * 4. Эти массивы заполняются только при сработке соответствующих лисенеров, каждый из которых отслеживает изменения в
 * соответствующей сущности таблице в БД ("devices", "locations", "employees", "states"). Таким образов данные в массивы
 * загружаются из БД только при изменении данных (лисенер для локаций срабатывает только при изменениях в таблице "locations",
 * на другие не обращает внимания) или при старте приложения — загрузке страницы (срабатывают все лисенеры)
 * 4. Массивы играют роль словарей и источников данных, из них формируются спиннеры, с их помощью переводятся идентификаторы
 * в имена и обратно, это всё происходит БЕЗ обращения в БД
 * 5. Для заполнения спинеров данными, получения идентификаторов по выбранным пунктам и др, осуществляется через SpinnerAdapter
 * 6. В load методах в массивы загружаются объекты с данными из таблицы, в самих методах используется квази JOIN, чтобы
 * после получения идентификаторов имен сразу же получить из таблицы "names" имена на нужном языке
 * 7. При загрузке юнитов и событий JOIN уже не нужен, данные для имен берутся в соответствующем объекте (locations[i].getNameRu)
 * */


/**
 *
 * @param name_id этот идентификатор будет заменен именем из таблицы имен
 * @param obj объект в котором поле name_ru будет заменено с идентификатора, заданного в конструкторе, на нормальное имя
 * @param func функция, которая будет обновлять спиннер новыми данными
 */
function joinNamesRu(name_id, obj, func) {
    let docRef = DBASE.collection(TABLE_NAMES).doc(name_id);
    docRef.get().then((doc) => {
        if (doc.exists) {
            obj.setNameRu(doc.data().ru);
            func();
        } else {
            // console.log("No such document!");
        }
    }).catch((error) => {
        // console.log("Error getting document:", error);
    });
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

//----------------------------------------------------------------------------------------------------------------------
/**Добавления списка локаций в спиннер*/
function updateLocationSpinner() {
    let selectedLocations = getLocationsByParam(locations, getType());
    locationSpinnerAdapter.setDataObj(selectedLocations);
    locationSpinnerAdapter.addFirstLineObj(new Location(null, ANY_VALUE, ALL_LOCATIONS));
}

function loadLocation() {
    let loc_arr = [];
    DBASE.collection(TABLE_LOCATIONS)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let id = doc.data().id;
            let name_id = doc.data().name_id;
            let name_ru = doc.data().name_id;
            let location = new Location(id, name_id, name_ru);

            joinNamesRu(name_id, location, updateLocationSpinner);

            loc_arr.push(location);
        });
        locations = loc_arr;
        updateLocationSpinner();
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
/**Добавления списка сотрудников в спиннер*/
function updateEmployeeSpinner() {
    employeeSpinnerAdapter.setDataObj(employees);
    employeeSpinnerAdapter.addFirstLineObj(new Employee(null, ANY_VALUE, ALL_EMPLOYEES, null, null));
}

/**Внимание: сотрудников нет в таблице имен (по крайней мере пока) поэтому join не найдя их возвращает идентификатор.
 * Поэтому join здесь не работает и, как бы, не нужен. Оставил для порядка и на тот случай, если вдруг сотрудники будут
 * добавлены в таблицу имен.
 * Сотрудников нет вот почему: они используются ТОЛЬКО в приложениях для внутреннего пользования (AdjustmentDB и
 * AdjustmentWeb, людям отслеживающих ремонт знать фамилии сотрудников не нужно), а значит значения нужны только на
 * русском, а значит можно значение на русском записать в поле name_id документа таблицы "employees", при загрузке
 * списка сотрудников в name_ru будет присвоено значение идентификатора автоматом (метод join не найдя сотрудников в
 * "names" оставит идентификатор, который является в этом случае именем на русском. Профит)*/
function loadEmployees() {
    let emp_arr = [];
    DBASE.collection(TABLE_EMPLOYEES)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let id = doc.data().id;
            let name_id = doc.data().name_id;
            let name_ru = doc.data().name_id;
            let email = doc.data().email;
            let location_id = doc.data().location_id;
            let employee = new Employee(id, name_id, name_ru, email, location_id);

            joinNamesRu(name_id, employee, updateEmployeeSpinner);

            emp_arr.push(employee);
        });
        employees = emp_arr;
        updateEmployeeSpinner();
    });
}
//----------------------------------------------------------------------------------------------------------------------
function updateStatesSpinner() {
    let selectedStates = getStatesByParam(states, getType(), locationSpinnerAdapter.getSelectedNameId());
    stateSpinnerAdapter.setDataObj(selectedStates);
    stateSpinnerAdapter.addFirstLineObj(new State(null, ANY_VALUE, ALL_STATES, null, null));
}

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
            console.log('name_id = '+name_id);

            joinNamesRu(name_id, state, updateStatesSpinner);

            sta_arr.push(state);
        });
        states = sta_arr;
        updateStatesSpinner();
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
function updateDeviceSpinner() {
    devicesSpinnerAdapter.setDataObj(devices);
    devicesSpinnerAdapter.addFirstLineObj(new Device(null, ANY_VALUE, ALL_DEVICES));

    devicesForGeneratorAdapter.setDataObj(devices);
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

            joinNamesRu(name_id, device, updateDeviceSpinner);

            dev_arr.push(device);
        });
        devices = dev_arr;
        updateDeviceSpinner();
    });
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

    console.log("name="+deviceName_id+" loc="+location_id+" state="+state_id+" empl="+employee_id+" serial="+serial+" type="+type_id);

    //Если поле номера пустое, то ищем по параметрам, если поле содержит значение, то ищем по этому значению, игнорируя
    // все остальные параметры. Т.е. ищем или по параметрам, или по номеру. Тип устройства учитывается в любом из случаев
    if (serial === "") getUnitListFromBD(deviceName_id, location_id, employee_id, type_id, state_id, ANY_VALUE);
    else getUnitListFromBD(ANY_VALUE, ANY_VALUE, ANY_VALUE, type_id, ANY_VALUE, serial);
}


function getDeviceById(id) {
    if (id===null) return new Device("", "", EMPTY_VALUE);
    for (let i = 0; i < devices.length; i++) {
        if (devices[i].getId===id) return devices[i];
    }
    return id;
}
function getEmployeeById(id) {
    if (id===null) return new Employee("", "", EMPTY_VALUE, "","");
    for (let i = 0; i < employees.length; i++) {
        if (employees[i].getId===id) return employees[i];
    }
    return id;
}
function getLocationById(id) {
    if (id===null) return new Location("", "", EMPTY_VALUE);
    for (let i = 0; i < locations.length; i++) {
        if (locations[i].getId===id) return locations[i];
    }
    return id;
}
function getStateById(id) {
    if (id===null) return new State("", "", EMPTY_VALUE, "");
    console.log('ID - '+id);
    for (let i = 0; i < states.length; i++) {
        console.log(i+' - '+states[i].getId);
        if (states[i].getId===id) return states[i];
    }
    return id;
}
//----------------------------------------------------------------------------------------------------------------------

const serialRadio = document.getElementById('serial_radio');
const repairRadio = document.getElementById('repair_radio');
const serialText = document.getElementById('serial');
const namesSpinner = document.getElementById('names_spinner');
const locationSpinner = document.getElementById('location_spinner');
const statesSpinner = document.getElementById('states_spinner');
const employeeSpinner = document.getElementById('employee_spinner');
const searchButton = document.getElementById('search_button');

let isSerial = serialRadio.checked;

function getType() {
    return isSerial?SERIAL_TYPE:REPAIR_TYPE;
}

serialRadio.addEventListener('click', function () {
    isSerial = true;
    updateStatesSpinner();
    updateLocationSpinner();
});

repairRadio.addEventListener('click', function () {
    isSerial = false;
    updateStatesSpinner();
    updateLocationSpinner();
});

locationSpinner.addEventListener('change', function () {
    updateStatesSpinner();
});

searchButton.addEventListener('click', function () {
    startSearch_new(namesSpinner, locationSpinner, statesSpinner, employeeSpinner, serialText, serialRadio);
});

/**Лисенер изменений поля ввода серийного номера. Если поле не пустое, все спиннеры не активны, если пустое — активны.
 * Так надо, так как если ввести серийный номер и нажать поиск, то поиск будет идти ТОЛЬКО по серийному номеру, игнорируя
 * спиннеры. Сделано, чтобы не путать пользователя (уже набрав номер, он может пытаться выбрать параметры в спиннерах,
 * которые всё равно будут проигнорированы при поиске)*/
serialText.addEventListener('input', function () {
    if (serialText.value.length !== 0) {
        namesSpinner.disabled = true;
        locationSpinner.disabled = true;
        employeeSpinner.disabled = true;
        statesSpinner.disabled = true;
    } else {
        namesSpinner.disabled = false;
        locationSpinner.disabled = false;
        employeeSpinner.disabled = false;
        statesSpinner.disabled = false;
    }
});

let locationSpinnerAdapter = new SpinnerAdapter(locationSpinner);
let devicesSpinnerAdapter = new SpinnerAdapter(namesSpinner);
let employeeSpinnerAdapter = new SpinnerAdapter(employeeSpinner);
let stateSpinnerAdapter = new SpinnerAdapter(statesSpinner);


listen_new(DBASE, TABLE_LOCATIONS, loadLocation);
listen_new(DBASE, TABLE_EMPLOYEES, loadEmployees);
listen_new(DBASE, TABLE_STATES, loadStates);
listen_new(DBASE, TABLE_DEVICES, loadDevices);
