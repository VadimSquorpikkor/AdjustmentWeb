let serialRadio = document.getElementById('serial_radio');
let repairRadio = document.getElementById('repair_radio');
let serialText = document.getElementById('serial');
let namesSpinner = document.getElementById('names_spinner');
let locationSpinner = document.getElementById('location_spinner');
let statesSpinner = document.getElementById('states_spinner');
let employeeSpinner = document.getElementById('employee_spinner');
let searchButton = document.getElementById('search_button');

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
let devicesSpinnerAdapter = new  SpinnerAdapter(namesSpinner);
let employeeSpinnerAdapter = new SpinnerAdapter(employeeSpinner);
let stateSpinnerAdapter = new SpinnerAdapter(statesSpinner);

/**Добавления списка локаций в спиннер*/
function updateLocationSpinner() {
    let selectedLocations = getLocationsByParam(locations, getType());
    locationSpinnerAdapter.setDataObj(selectedLocations);
    locationSpinnerAdapter.addFirstLineObj(new Location(ANY_VALUE, ALL_LOCATIONS));
}
/**Добавления списка сотрудников в спиннер*/
function updateEmployeeSpinner() {
    employeeSpinnerAdapter.setDataObj(employees);
    employeeSpinnerAdapter.addFirstLineObj(new Employee(ANY_VALUE, ALL_EMPLOYEES, null, null));
}

function updateStatesSpinner() {
    let selectedStates = getStatesByParam(states, getType(), locationSpinnerAdapter.getSelectedId());
    stateSpinnerAdapter.setDataObj(selectedStates);
    stateSpinnerAdapter.addFirstLineObj(new State(ANY_VALUE, ALL_STATES, null, null));
}

function updateDeviceSpinner() {
    devicesSpinnerAdapter.setDataObj(devices);
    devicesSpinnerAdapter.addFirstLineObj(new Device(ANY_VALUE, ALL_DEVICES, ''));
    if (typeof devicesForGeneratorAdapter!=='undefined') devicesForGeneratorAdapter.setDataObj(devices);
}

function startSearch_new() {
    // В начало массива добавляется объект "все локации" (имя="все локации", id="any_value", когда
    // getUnitListFromBD получает параметр "any_value", значит выборка будет игнорировать значение локации, т.е. будет
    // выбран юнит с любой локацией

    let deviceName_id = devicesSpinnerAdapter.getSelectedId();
    let location_id =   locationSpinnerAdapter.getSelectedId();
    let state_id =      stateSpinnerAdapter.getSelectedId();
    let employee_id =   employeeSpinnerAdapter.getSelectedId();
    let serial =        serialText.value;
    let type_id =       getType();

    //console.log("name="+deviceName_id+" loc="+location_id+" state="+state_id+" empl="+employee_id+" serial="+serial+" type="+type_id);

    //Если поле номера пустое, то ищем по параметрам, если поле содержит значение, то ищем по этому значению, игнорируя
    // все остальные параметры. Т.е. ищем или по параметрам, или по номеру. Тип устройства учитывается в любом из случаев
    if (serial === "") getUnits(deviceName_id, location_id, employee_id, type_id, state_id, ANY_VALUE);
    else getUnits(ANY_VALUE, ANY_VALUE, ANY_VALUE, type_id, ANY_VALUE, serial);
}