/**Имя базы данных*/
const DBASE = firebase.firestore();
const TABLE_NAMES = "names";


const ALL_DEVICES = "Все устройства";
const ALL_STATES = "Все статусы";
const ALL_LOCATIONS = "Все локации";
const ALL_EMPLOYEES = "Все сотрудники";
const REPAIR_UNIT = "Ремонт";
const FOUND_NOTHING = "Ничего не найдено";

//Новые const для новой БД:
const TABLE_UNITS = "units";
const UNIT_DESCRIPTION = "description";
const UNIT_DEVICE = "device_id";
const UNIT_EMPLOYEE = "employee_id";
const UNIT_ID = "id";
const UNIT_INNER_SERIAL = "inner_serial";
const UNIT_LOCATION = "location_id";
const UNIT_SERIAL = "serial";
const UNIT_STATE = "state_id";
const UNIT_TYPE = "type_id";

const TABLE_STATES = "states"; //в прошлом profile
const STATE_LOCATION = "location_id";
const STATE_NAME = "name";
const STATE_TYPE = "type_id";

const TABLE_EVENTS = "events"; //в прошлом states
const EVENT_DATE = "date";
const EVENT_DESCRIPTION = "description";
const EVENT_LOCATION = "location_id";
const EVENT_STATE = "state_id";
const EVENT_UNIT = "unit_id";

const TABLE_EMPLOYEES = "employees"; //в прошлом users
const EMPLOYEE_EMAIL = "email"; //email нельзя использовать в качестве id, так как у пользователя может поменяться email, и тогда при необходимости выбрать устройства пользователя нужно будет искать и по старому email и по новому
const EMPLOYEE_ID = "id";
const EMPLOYEE_LOCATION = "location_id";
const EMPLOYEE_NAME = "name";

const TABLE_LOCATIONS = "locations";
const LOCATION_ID = "id";
const LOCATION_NAME = "name";

const TABLE_DEVICES = "devices";
const DEVICE_ID = "id";
const DEVICE_NAME = "name";
const DEVICE_TYPE = "type";

const TYPE_ANY = "any_type";
const TYPE_REPAIR = "repair_type";
const TYPE_SERIAL = "serial_type";

const SERIAL_TYPE = "serial_type";
const REPAIR_TYPE = "repair_type";

const ANY_VALUE = "any_value";
const STATE_PREF = "state_";
const DESCENDING = "desc";




/** Класс для устройства, или блока детектирования */
class DUnit {
    constructor(id, description, device_id, employee_id, inner_serial, location_id, serial, state_id, type_id, date) {
        this.id = id;
        this.description = description;
        this.device_id = device_id;
        this.employee_id = employee_id;
        this.inner_serial = inner_serial;
        this.location_id = location_id;
        this.serial = serial;
        this.state_id = state_id;
        this.type_id = type_id;
        this.date = date;
    }

    toString() {
        return this.id + ', ' +
            this.description + ', ' +
            this.device_id + ', ' +
            this.employee_id + ', ' +
            this.inner_serial + ', ' +
            this.location_id + ', ' +
            this.serial + ', ' +
            this.state_id + ', ' +
            this.type_id + ', ' +
            this.date;
    }
}

/** Firestore data converter. Нужен для загрузки из БД объекта класса DUnit */
let dUnitConverter = {
    toFirestore: function (dunit) {
        return {
            id: dunit.id,
            description: dunit.description,
            device_id: dunit.device_id,
            employee_id: dunit.employee_id,
            inner_serial: dunit.inner_serial,
            location_id: dunit.location_id,
            serial: dunit.serial,
            state_id: dunit.state_id,
            type_id: dunit.type_id,
            date: dunit.date
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new DUnit(data.id, data.description, data.device_id, data.employee_id, data.inner_serial, data.location_id, data.serial, data.state_id, data.type_id, data.date);
    }
};

/**Класс статусов. Содержит сам статус и его дату*/
class DEvent {
    constructor(date, description, location_id, state_id, unit_id) {
        this.date = date;
        this.description = description;
        this.location_id = location_id;
        this.state_id = state_id;
        this.unit_id = unit_id;
    }

    toString() {
        return this.date + ', ' +
            this.description + ', ' +
            this.location_id + ', ' +
            this.state_id + ', ' +
            this.unit_id;
    }
}

/** Firestore data converter. Нужен для загрузки из БД объекта класса dState */
let dEventConverter = {
    toFirestore: function (dEvent) {
        return {
            date: dEvent.date,
            description: dEvent.description,
            location_id: dEvent.location_id,
            state_id: dEvent.state_id,
            unit_id: dEvent.unit_id
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new DEvent(data.date, data.description, data.location_id, data.state_id, data.unit_id);
    }
}

//**********************************************************************************************************************

/** Загрузка всех юнитов из БД */
function getAllSerialUnits() {
    getAllByOneParam(DBASE, TABLE_UNITS, dUnitConverter, UNIT_TYPE, SERIAL_TYPE, addSerialDataRowToPage);
}

/** Загрузка всех ремонтных юнитов из БД */
function getAllRepairUnits() {
    getAllByOneParam(DBASE, TABLE_UNITS, dUnitConverter, UNIT_TYPE, REPAIR_TYPE, addRepairDataRowToPage);
}

/**Обертка*/
function getAllUnitsByOneParam(type, param, value, func) {
    getAllByTwoParam(DBASE, TABLE_UNITS, dUnitConverter, UNIT_TYPE, type, param, value, func);
}

/**Обертка*/
function getAllUnitsByTwoParam(type, param, value, param2, value2, func) {
    getAllByThreeParam(DBASE, TABLE_UNITS, dUnitConverter, UNIT_TYPE, type, param, value, param2, value2, func);
}

function startSearch(devName_id, location_id, state_id, employee_id, serial_id, serial_radio_id) {
    let deviceName = getValueFromSpinner(devName_id);
    let location = getValueFromSpinner(location_id);
    let state = getValueFromSpinner(state_id);
    let employee = getValueFromSpinner(employee_id);
    let serial = valueOfElement(serial_id);
    let type = document.getElementById(serial_radio_id).checked?TYPE_SERIAL:TYPE_REPAIR;

    console.log("name="+deviceName+" loc="+location+" state="+state+" empl="+employee+" serial="+serial+" type="+type);

    //Если параметр не "any", то имя параметра переводим в его идентификатор ("Диагностика" -> "adj_r_diagnostica")
    //Если "any", то так и оставляем
    if (deviceName === ALL_DEVICES) deviceName = ANY_VALUE;
    else deviceName = getIdByName(deviceName, deviceNameList, deviceIdList);
    if (location === ALL_LOCATIONS) location = ANY_VALUE;
    else location = getIdByName(location, locationNameList, locationIdList);
    if (state === ALL_STATES) state = ANY_VALUE;
    else state = getIdByName(state, stateNameList, stateIdList);
    if (employee === ALL_EMPLOYEES) employee = ANY_VALUE;
    else employee = getIdByName(employee, employeeNameList, employeeIdList);

    //Если поле номера пустое, то ищем по параметрам, если поле содержит значение, то ищем по этому значению, игнорируя
    // все остальные параметры. Т.е. ищем или по параметрам, или по номеру
    if (serial === "") getUnitListFromBD(deviceName, location, employee, type, state, ANY_VALUE);
    else getUnitListFromBD(ANY_VALUE, ANY_VALUE, ANY_VALUE, ANY_VALUE, ANY_VALUE, serial);

}


function getAllRepairUnitsByParam(sp_name, sp_state) {
    let name = getValueFromSpinner(sp_name);
    let state = getValueFromSpinner(sp_state);
    console.log(name+" "+state);
    if (name === ALL_DEVICES && state === ALL_STATES) {
        getAllRepairUnits();
    } else if (name === ALL_DEVICES) {
        getAllUnitsByOneParam(REPAIR_TYPE, UNIT_STATE, state, addRepairDataRowToPage);
    } else if (state === ALL_STATES) {
        getAllUnitsByOneParam(REPAIR_TYPE, UNIT_DEVICE, name, addRepairDataRowToPage);
    } else {
        getAllUnitsByTwoParam(REPAIR_TYPE, UNIT_DEVICE, name, UNIT_STATE, state, addRepairDataRowToPage);
    }
}


/**Обертка для getRepairUnitByNameAndSerial. Получает на вход ID элементов, берет из них данные и вызывает
 * getRepairUnitByNameAndSerial используя эти данные */
function getRepairUnit(nameId, serialId) {
    let name = getValueFromSpinner(nameId);
    let serial = document.getElementById(serialId).value;
    getRepairUnitByNameAndSerial(name, serial);
}

/**По имени и серийному номеру ремонтного прибора получает список событий (статусов) этого прибора и формирует из этих
 * данных DIV с таблицей статусов */
function getRepairUnitByNameAndSerial(name, serial) {
    getAllUnitsByTwoParam(REPAIR_TYPE, UNIT_DEVICE, name, UNIT_SERIAL, serial, function (arr) {
        if (arr.length === 0) insertNothing('repair_search_result');
        else {
            let dUnit = arr[0];
            // getAllByOneParamOrdered(DBASE, TABLE_EVENTS, dEventConverter, EVENT_UNIT, dUnit.id, addCollectionOfDocumentToDiv, dUnit, EVENT_DATE);
            getAllEventsByUnitId(DBASE, TABLE_EVENTS, EVENT_UNIT, dUnit.id, addCollectionOfDocumentToDiv, dUnit, EVENT_DATE);
        }
    });
}

/**Показывает/скрывает список всех событий для выбранного юнита*/
function getAllEventsByUnitIdSmall(unit_id) {
    let host = STATE_PREF + unit_id;
    let size = document.getElementById(host).innerHTML.length;
    console.log(size);
    //если список событий не показан, то показать, если уже показывается (size!==0), то очищаем (удаляем) список
    if (size === 0) getAllEventsByUnitId_new(DBASE, TABLE_EVENTS, EVENT_UNIT, unit_id, addCollectionOfDocumentToDiv_new, EVENT_DATE, DESCENDING, host);
    else document.getElementById(host).innerHTML = '';


}
