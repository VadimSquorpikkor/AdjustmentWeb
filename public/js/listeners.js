
const EMPTY_VALUE = "- - -";

function getNewArrayFromArray(arr) {
    let arr2 = [];
    for (let i = 0; i < arr.length; i++) {
        arr2.push(arr[i]);
    }
    return arr2;
}

function getIdByName(name, nameList, idList) {
    let position = nameList.indexOf(name);
    if (position===-1) return EMPTY_VALUE;
    else return idList[position];
}

function getNameById(id, nameList, idList) {
    let position = idList.indexOf(id);
    if (position===-1) return EMPTY_VALUE;
    else return nameList[position];
}

// ---------------------------------------------------------------------------------------------------------------------
let deviceIdList = [];
let deviceNameList = [];
let locationIdList = [];
let locationNameList = [];
let stateIdList = [];
let stateNameList = [];
let employeeIdList = [];
let employeeNameList = [];
// ---------------------------------------------------------------------------------------------------------------------
/**Лисенер для списка имен устройств*/
listen(DBASE, TABLE_DEVICES, insertDevNames);

function insertDevNames(arr_name, arr_id) {
    deviceNameList = arr_name;
    deviceIdList = arr_id;

    let arr2 = [];
    for (let i = 0; i < arr_name.length; i++) {
        arr2.push(arr_name[i]);
    }
    let arr3 = getNewArrayFromArray(arr_name);
    insertSpinnerByArray('selected_type', arr3);
    insertSpinnerByArray('search_names_spinner', arr3);
    arr3.unshift(ALL_DEVICES);//для names_spinner в начало списка добавляю 'Все устройства'
    insertSpinnerByArray('names_spinner', arr3);
    arr2.unshift(REPAIR_UNIT);//для selected_type_for_generator в начало списка добавляю 'Ремонт'
    insertSpinnerByArray('selected_type_for_generator', arr2);
}
// ---------------------------------------------------------------------------------------------------------------------
/**Лисенер для локаций*/
listen(DBASE, TABLE_LOCATIONS, insertLocationsNames);

function insertLocationsNames(arr_name, arr_id) {
    locationNameList = arr_name;
    locationIdList = arr_id;

    let arr2 = getNewArrayFromArray(arr_name);
    arr2.unshift(ALL_LOCATIONS);
    insertSpinnerByArray('location_spinner', arr2);
}
// ---------------------------------------------------------------------------------------------------------------------
/**Лисенер для статусов*/
listen(DBASE, TABLE_STATES, insertStatesNames);

function insertStatesNames(arr_name, arr_id) {
    stateNameList = arr_name;
    stateIdList = arr_id;

    let arr2 = getNewArrayFromArray(arr_name);
    arr2.unshift(ALL_STATES);
    insertSpinnerByArray('states_spinner', arr2);
}
/** Загрузка всех статусов из БД в текущей локации и выбранного типа*/
function getAllStatesInLocation(sp_location, serial_radio, id) {
    let location = getValueFromSpinner(sp_location);
    let type = document.getElementById(serial_radio).checked?TYPE_SERIAL:TYPE_REPAIR;
    if (location === ALL_LOCATIONS) {
        getAllStates(type, id);
    } else {
        location = getIdByName(location, locationNameList, locationIdList);
        getStatesInLocation(type, location, function (arr) {
            let arr2 = getNewArrayFromArray(arr);
            arr2.unshift(ALL_STATES);// в начало списка добавлено 'Все статусы'
            insertSpinnerByArray(id, arr2);
        });
    }
}

function getAllStates(type, id) {
    getStates(type, function (arr) {
        let arr2 = getNewArrayFromArray(arr);
        arr2.unshift(ALL_STATES);// в начало списка добавлено 'Все статусы'
        insertSpinnerByArray(id, arr2);
    });
}
// ---------------------------------------------------------------------------------------------------------------------
/**Лисенер для сотрудников*/
listen(DBASE, TABLE_EMPLOYEES, insertEmployeesNames);

function insertEmployeesNames(arr_name, arr_id) {
    employeeNameList = arr_name;
    employeeIdList = arr_id;

    let arr2 = getNewArrayFromArray(arr_name);
    arr2.unshift(ALL_EMPLOYEES);
    insertSpinnerByArray('employee_spinner', arr2);
}
// ---------------------------------------------------------------------------------------------------------------------
/**Старый вариант лисенера*/
/*DBASE.collection(TABLE_LOCATIONS)
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log(change.doc.data());
            getPairedCollectionFromDB(TABLE_LOCATIONS, function (arr_id, arr_name) {
                locationIdList = arr_id;
                locationNameList = arr_name;
                insertLocationsNames(arr_name)
            });
        });
    });*/