
function getNamesFromObjectList(arr) {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        newArr.push(arr[i].getNameRu)
    }
    return newArr;
}

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
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}
//----------------------------------------------------------------------------------------------------------------------

let locations = [];
let employees = [];
let states = [];
let devices = [];

//----------------------------------------------------------------------------------------------------------------------
/**Добавления списка локаций в спиннер*/
function updateLocationSpinner() {
    let arr = getNamesFromObjectList(locations);
    insertSpinnerByArray_new(locationSpinner, arr);
}

function setLocations(arr) {
    locations = arr;
    locations.unshift(new Location(null, ANY_VALUE, ALL_LOCATIONS));
}

function loadLocation() {
    let loc_arr = [];
    DBASE.collection(TABLE_LOCATIONS)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let id = doc.data().id;
            let name_id = doc.data().name_id;
            let name_ru = doc.data().name_id;
            //console.log(id+" "+name_id+" "+name_ru);
            let location = new Location(id, name_id, name_ru);

            joinNamesRu(name_id, location, updateLocationSpinner);

            loc_arr.push(location);
        });
        setLocations(loc_arr);
        updateLocationSpinner();
    });
}

//----------------------------------------------------------------------------------------------------------------------
/**Добавления списка сотрудников в спиннер*/
function updateEmployeeSpinner() {
    let arr = getNamesFromObjectList(employees);
    insertSpinnerByArray_new(employeeSpinner, arr);
}

function setEmployees(arr) {
    employees = arr;
    employees.unshift(new Employee(null, ANY_VALUE, ALL_EMPLOYEES, null, null));
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
            //console.log(id+" "+name_id+" "+name_ru+" "+email+" "+location_id);
            let employee = new Employee(id, name_id, name_ru, email, location_id);

            joinNamesRu(name_id, employee, updateEmployeeSpinner);

            emp_arr.push(employee);
        });
        setEmployees(emp_arr);
        updateEmployeeSpinner();
    });
}
//----------------------------------------------------------------------------------------------------------------------
function updateStatesSpinner() {
    let arr = getNamesFromObjectList(states);
    insertSpinnerByArray_new(statesSpinner, arr);
}

function setStates(arr) {
    states = arr;
    states.unshift(new State(null, ANY_VALUE, ALL_STATES, null, null));
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
            //console.log(id+" "+name_id+" "+name_ru+" "+type+" "+location_id);
            let state = new State(id, name_id, name_ru, type, location_id);

            joinNamesRu(name_id, state, updateStatesSpinner);

            sta_arr.push(state);
        });
        setStates(sta_arr);
        updateStatesSpinner();
    });
}

// function getAllStatesInLocation_new(/*sp_location, serial_radio, id*/) {
//     let location = getValueFromSpinner(locationSpinner);
//     let type = serialRadio.checked?TYPE_SERIAL:TYPE_REPAIR;
//     if (location === ALL_LOCATIONS) {
//         getAllStates_new(type);
//     } else {
//         location = getIdByName(location, locationNameList, locationIdList);
//         getStatesInLocation(type, location, function (arr) {
//             let arr2 = getNewArrayFromArray(arr);
//             arr2.unshift(ALL_STATES);// в начало списка добавлено 'Все статусы'
//             insertSpinnerByArray(id, arr2);
//         });
//     }
// }

// function getAllStates_new(type) {
//     getStates(type, function () {
//         updateStatesSpinner();
//     });
// }
//----------------------------------------------------------------------------------------------------------------------
function updateDeviceSpinner() {
    let arr = getNamesFromObjectList(devices);
    insertSpinnerByArray_new(namesSpinner, arr);
}

function setDevices(arr) {
    devices = arr;
    devices.unshift(new Device(null, ANY_VALUE, ALL_DEVICES));
}

function loadDevices() {
    let dev_arr = [];
    DBASE.collection(TABLE_DEVICES)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let id = doc.data().id;
            let name_id = doc.data().name_id;
            let name_ru = doc.data().name_id;
            //console.log(id+" "+name_id+" "+name_ru);
            let device = new Device(id, name_id, name_ru);

            joinNamesRu(name_id, device, updateDeviceSpinner);

            dev_arr.push(device);
        });
        setDevices(dev_arr);
        updateDeviceSpinner();
    });
}
//----------------------------------------------------------------------------------------------------------------------
/**Показывает/скрывает список всех событий для выбранного юнита*/
function getAllEventsByUnitIdSmall(unit_id) {
    let host = STATE_PREF + unit_id;
    let size = document.getElementById(host).innerHTML.length;
    //если список событий не показан, то показать, если уже показывается (size!==0), то очищаем (удаляем) список
    if (size === 0) getAllEventsByUnitId_new(DBASE, TABLE_EVENTS, EVENT_UNIT, unit_id, addCollectionOfDocumentToDiv_new, EVENT_DATE, DESCENDING, host);
    else document.getElementById(host).innerHTML = '';

}

function startSearch_new() {
    //В чём вся магия получения id имени из спиннеров, в которых содержаться только имена (без идентификаторов): в
    // момент получения массива, например, локаций создается массив объектов локаций, в которых сохраняется и имя, и его
    // идентификатор. В начало массива добавляется объект "все локации" (имя="все локации", id="any_value", когда
    // getUnitListFromBD получает параметр "any_value", значит выборка будет игнорировать значение локации, т.е. будет
    // выбран юнит с любой локацией), а в момент начала поиска берем позицию выбранного элемента спиннера, в массиве
    // объектов локаций по этой позиции (ведь спиннер формируется из этого массива (включая "все локации"), а значит
    // оба списка всегда совпадают, по позиции имени в спиннере в списке объектов всегда лежит объект с таким же именем)
    // берем объект локации, а у этого объекта берем значение name_id.

    let deviceName_id = devices[namesSpinner.selectedIndex].getNameId;
    let location_id =   locations[locationSpinner.selectedIndex].getNameId;
    let state_id =      states[statesSpinner.selectedIndex].getNameId;
    let employee_id =   employees[employeeSpinner.selectedIndex].getNameId;
    let serial =        serialText.value;
    let type_id =       serialRadio.checked?TYPE_SERIAL:TYPE_REPAIR;//todo isSerial

    console.log("name="+deviceName_id+" loc="+location_id+" state="+state_id+" empl="+employee_id+" serial="+serial+" type="+type_id);

    //Если поле номера пустое, то ищем по параметрам, если поле содержит значение, то ищем по этому значению, игнорируя
    // все остальные параметры. Т.е. ищем или по параметрам, или по номеру
    if (serial === "") getUnitListFromBD(deviceName_id, location_id, employee_id, type_id, state_id, ANY_VALUE);
    else getUnitListFromBD(ANY_VALUE, ANY_VALUE, ANY_VALUE, ANY_VALUE, ANY_VALUE, serial);
}


function getEmployeeById(id) {
    for (let i = 0; i < employees.length; i++) {
        if (employees[i].getId===id) return employees[i];
    }
    return id;
}
function getLocationById(id) {
    for (let i = 0; i < locations.length; i++) {
        if (locations[i].getId===id) return locations[i];
    }
    return id;
}
function getDeviceById(id) {
    for (let i = 0; i < devices.length; i++) {
        if (devices[i].getId===id) return devices[i];
    }
    return id;
}
function getStateById(id) {
    for (let i = 0; i < states.length; i++) {
        if (states[i].getId===id) return states[i];
    }
    return id;
}
//----------------------------------------------------------------------------------------------------------------------
let isSerial;

const serialRadio = document.getElementById('serial_radio');
const repairRadio = document.getElementById('repair_radio');
const serialText = document.getElementById('serial');
const namesSpinner = document.getElementById('names_spinner');
const locationSpinner = document.getElementById('location_spinner');
const statesSpinner = document.getElementById('states_spinner');
const employeeSpinner = document.getElementById('employee_spinner');
const searchButton = document.getElementById('search_button');

serialRadio.addEventListener('click', function () {
    //todo on change getAllStatesInLocation('location_spinner', 'serial_radio', 'states_spinner')
    isSerial = true;
});

repairRadio.addEventListener('click', function () {
    //todo on change getAllStatesInLocation('location_spinner', 'serial_radio', 'states_spinner')
    isSerial = false;
});

locationSpinner.addEventListener('change', function () {
    console.log(getValueFromSpinner(locationSpinner));
    ////////////////getAllStatesInLocation_new();
});

searchButton.addEventListener('click', function () {
    startSearch_new(namesSpinner, locationSpinner, statesSpinner, employeeSpinner, serialText, serialRadio);
});

listen_new(DBASE, TABLE_LOCATIONS, loadLocation);
listen_new(DBASE, TABLE_EMPLOYEES, loadEmployees);
listen_new(DBASE, TABLE_STATES, loadStates);
listen_new(DBASE, TABLE_DEVICES, loadDevices);
