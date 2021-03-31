/**Имя базы данных*/
const DBASE = firebase.firestore();
/**------- Коллекции (таблицы) ---------------------------------------------------------------------------------------*/
/**Коллекция серийных устройств*/
const TABLE_SERIALS = "serials";
/**Коллекция ремонтных устройств*/
const TABLE_REPAIRS = "repairs";
/**Коллекция имен для устройств*/
const TABLE_NAMES = "dev_types";
/**Коллекция имен профилей*/
const TABLE_PROFILES = "profiles";
/**Коллекция статусов*/
const TABLE_ALL_STATES = "states";
/**-------------------------------------------------------------------------------------------------------------------*/
const PROFILE_ADJUSTMENT = "adjustment";
const PROFILE_ASSEMBLY = "assembly";
const PROFILE_GRADUATION = "graduation";
const PROFILE_SOLDERING = "soldering";
const PROFILE_REPAIR_AREA = "repair_area";
/**-------------------------------------------------------------------------------------------------------------------*/
const PROFILE_LOCATION = "location";
const PROFILE_NAME = "name";
const PROFILE_TYPE = "type";
const PROF_TYPE_ANY = "any";
const PROF_TYPE_REPAIR = "repair";
const PROF_TYPE_SERIAL = "serial";
/**------- Параметры -------------------------------------------------------------------------------------------------*/
/**Имя (название) устройства*/
const PARAM_NAME = "name";
/**Серийный номер устройства*/
const PARAM_SERIAL = "serial";
/**Текущий статус устройства (нужен ли? или просто брать последний статус из коллекции статусов)*/
const PARAM_STATE = "state";

const PARAM_UNIT_ID = "unit_id";
const PARAM_DATE = "date";
/**------- Другое ----------------------------------------------------------------------------------------------------*/
const ALL_UNITS = "Все устройства";
const ALL_STATES = "Все статусы";
const REPAIR_UNIT = "Ремонт";

/** Класс для устройства, или блока детектирования */
class DUnit {
    constructor(id, name, innerSerial, serial, state, location, description) {
        this.id = id;
        this.name = name;
        this.innerSerial = innerSerial;
        this.serial = serial;
        this.state = state;
        this.location = location;
        this.description = description;
    }

    toString() {
        return this.id + ', ' + this.name + ', ' + this.innerSerial + ', ' + this.serial + ', ' + this.state + ', ' + this.location + ', ' + this.description;
    }
}

/** Firestore data converter. Нужен для загрузки из БД объекта класса DUnit */
let dUnitConverter = {
    toFirestore: function (dunit) {
        return {
            id: dunit.id,
            name: dunit.name,
            innerSerial: dunit.innerSerial,
            serial: dunit.serial,
            state: dunit.state,
            location: dunit.location,
            description: dunit.description
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new DUnit(data.id, data.name, data.innerSerial, data.serial, data.state, data.location, data.description);
    }
};

/**Класс статусов. Содержит сам статус и его дату*/
class DState {
    constructor(state, date, description, location) {
        this.state = state;
        this.date = date;
        this.description = description;
        this.location = location;
    }

    toString() {
        return this.state + ', ' + this.date + ', ' + this.description + ', ' + this.location;
    }
}

/** Firestore data converter. Нужен для загрузки из БД объекта класса dState */
let dStateConverter = {
    toFirestore: function (dState) {
        return {
            state: dState.state,
            date: dState.date,
            description: dState.description,
            location: dState.location
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new DState(data.state, data.date, data.description, data.location);
    }
}

/** Загрузка всех юнитов из БД */
function getAllUnits() {
    getAll(DBASE, TABLE_SERIALS, dUnitConverter, addDataRowToPage);
}

/** Загрузка всех ремонтных юнитов из БД */
function getAllRepairUnits() {
    getAll(DBASE, TABLE_REPAIRS, dUnitConverter, addRepairDataRowToPage);
}

/**Фильтр для загрузки серийных устройств. При изменении спиннера загружаются только устройства, категории которых
 * совпадают с выбранными в двух спиннерах — имя устройства и по его статус.
 * Пока не знаю, как в "where" запрашивать "ВСЕ" элементы (для случаев "Все статусы" и "Все устройства"), поэтому
 * использую разные методы для разных случаев: если и "все устройства" и "все статусы", просто загружаю всё,
 * если "все" только одна из категорий, загружаю по одному параметру, иначе — по двум параметрам*/
function getAllUnitsByParam(sp_name, sp_state) {
    let name = getValueFromSpinner(sp_name);
    let state = getValueFromSpinner(sp_state);
    console.log(name+" "+state);
    if (name === ALL_UNITS && state === ALL_STATES) {
        getAllUnits();
    } else if (name === ALL_UNITS) {
        getAllByOneParam(DBASE, TABLE_SERIALS, dUnitConverter, PARAM_STATE, state, addDataRowToPage);
    } else if (state === ALL_STATES) {
        getAllByOneParam(DBASE, TABLE_SERIALS, dUnitConverter, PARAM_NAME, name, addDataRowToPage);
    } else {
        getAllByTwoParam(DBASE, TABLE_SERIALS, dUnitConverter, PARAM_NAME, name, PARAM_STATE, state, addDataRowToPage);
    }
}

/** Загрузка всех статусов из БД */
function getAllStates(location, type, id) {
    getStates(type, location, function (arr) {
        arr.unshift(ALL_STATES);// в начало списка добавлено 'Все статусы'
        insertSpinnerByArray(id, arr);
    });
}

/** Загрузка всех имен из БД */
function getAllNames() {
    getAllObjectNames(DBASE, TABLE_NAMES, function (arr) {
        //Добавил ещё массив. В него копирую исходный массив. Теперь у меня 2 независимых массива
        //Это нужно, так как для 'names_spinner' и для 'selected_type_for_generator' нужны немного разные массивы
        //по составу (различаются первым элементом)
        let arr2 = [];
        for (let i = 0; i < arr.length; i++) {
            arr2.push(arr[i]);
        }
        insertSpinnerByArray('selected_type', arr);
        insertSpinnerByArray('search_names_spinner', arr);
        arr.unshift(ALL_UNITS);//для names_spinner в начало списка добавляю 'Все устройства'
        insertSpinnerByArray('names_spinner', arr);
        arr2.unshift(REPAIR_UNIT);//для selected_type_for_generator в начало списка добавляю 'Ремонт'
        insertSpinnerByArray('selected_type_for_generator', arr2);
    });
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
    getAllByTwoParam(DBASE, TABLE_REPAIRS, dUnitConverter, PARAM_NAME, name, PARAM_SERIAL, serial, function (arr) {
        if (arr.length === 0) insertNothing('repair_search_result');
        else {
            let dUnit = arr[0];
            getAllByOneParamOrdered(DBASE, TABLE_ALL_STATES, dStateConverter, PARAM_UNIT_ID, dUnit.id, addCollectionOfDocumentToDiv, dUnit, PARAM_DATE);
        }
    });
}
