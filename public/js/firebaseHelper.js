const DBASE = firebase.firestore();
const TABLE_UNITS = "units";
const TABLE_REPAIRS = "repairs";
const TABLE_NAMES = "dev_types";
const TABLE_STATES = "states";
const TABLE_REPAIR_STATES = "repair_states";
const PARAM_INNER_SERIAL = "innerSerial";
const PARAM_NAME = "name";
const PARAM_SERIAL = "serial";
const PARAM_STATE = "state";
const ALL_UNITS = "Все устройства";
const ALL_STATES = "Все статусы";

/** Класс для устройства, или блока детектирования */
class DUnit {
    constructor(id, name, innerSerial, serial, state) {
        this.id = id;
        this.name = name;
        this.innerSerial = innerSerial;
        this.serial = serial;
        this.state = state;
    }

    toString() {
        return this.id + ', ' + this.name + ', ' + this.innerSerial + ', ' + this.serial + ', ' + this.state;
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
            state: dunit.state
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new DUnit(data.id, data.name, data.innerSerial, data.serial, data.state);
    }
};

/**Класс статусов. Содержит сам статус и его дату*/
class DState {
    constructor(state, date) {
        this.state = state;
        this.date = date;
    }

    toString() {
        return this.state + ', ' + this.date;
    }
}

/** Firestore data converter. Нужен для загрузки из БД объекта класса dState */
let dStateConverter = {
    toFirestore: function (dState) {
        return {
            state: dState.state,
            date: dState.date
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new DState(data.state, data.date);
    }
}

/** Загрузка всех юнитов из БД */
function getAllUnits() {
    getAll(DBASE, TABLE_UNITS, dUnitConverter, addDataRowToPage);
}

/** Загрузка всех ремонтных юнитов из БД */
function getAllRepairUnits() {
    getAll(DBASE, TABLE_REPAIRS, dUnitConverter, addRepairDataRowToPage);
}



function getAllUnitsByParam(sp_name, sp_state) {
    let name = getValueFromSpinner(sp_name);
    let state = getValueFromSpinner(sp_state);
    console.log(name+" "+state);
    if (name === ALL_UNITS && state === ALL_STATES) {
        getAllUnits();
    } else if (name === ALL_UNITS) {
        // getAllUnitsByOneParam(PARAM_STATE, state);
        getAllByOneParam(DBASE, TABLE_UNITS, dUnitConverter, PARAM_STATE, state, addDataRowToPage);
    } else if (state === ALL_STATES) {
        // getAllUnitsByOneParam(PARAM_NAME, name);
        getAllByOneParam(DBASE, TABLE_UNITS, dUnitConverter, PARAM_NAME, name, addDataRowToPage);
    } else {
        // getAllUnitsByTwoParam(PARAM_NAME, name, PARAM_STATE, state);
        getAllByTwoParam(DBASE, TABLE_UNITS, dUnitConverter, PARAM_NAME, name, PARAM_STATE, state, addDataRowToPage);
    }
}

/*function getAllUnitsByOneParam(param, value) {
    getAllByOneParam(DBASE, TABLE_UNITS, dUnitConverter, param, value, addDataRowToPage)
}*/

/*function getAllUnitsByTwoParam(param_1, value_1, param_2, value_2) {
    getAllByTwoParam(DBASE, TABLE_UNITS, dUnitConverter, param_1, value_1, param_2, value_2, addDataRowToPage)
}*/

/*function getAllUnitsByOneParam(param, name) {
    let unit;
    var arr = [];
    DBASE.collection(TABLE_UNITS).withConverter(dUnitConverter)
        .where(param, "==", name)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Convert to City object
            unit = doc.data();
            arr.push(unit);
        });
        addDataRowToPage(arr);
    });
}

function getAllUnitsByTwoParam(param, value, param_2, value_2) {
    let unit;
    var arr = [];
    DBASE.collection(TABLE_UNITS).withConverter(dUnitConverter)
        .where(param, "==", value)
        .where(param_2, "==", value_2)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Convert to City object
            unit = doc.data();
            arr.push(unit);
        });
        addDataRowToPage(arr);
    });
}*/




/*function insertToSpinner(arr) {
    insertSpinnerByArray('selected_type', arr);
    insertSpinnerByArray('search_names_spinner', arr);
    arr.unshift('Все устройства');//для names_spinner в начало списка добавляю 'Все устройства'
    insertSpinnerByArray('names_spinner', arr);
}*/

/** Загрузка всех статусов из БД */
/*function getAllStates_old() {
    var arr = [];
    DBASE.collection(TABLE_STATES)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            arr.push(doc.data().name);
        });
        arr.unshift('Все статусы');// в начало списка добавлено 'Все статусы'
        insertSpinnerByArray('states_spinner', arr);
    });
}*/

function getAllStates() {
    getAllObjectNames(DBASE, TABLE_STATES, function (arr) {
        arr.unshift(ALL_STATES);// в начало списка добавлено 'Все статусы'
        insertSpinnerByArray('states_spinner', arr);
    });
}

function getAllNames() {
    getAllObjectNames(DBASE, TABLE_NAMES, function (arr) {
        insertSpinnerByArray('selected_type', arr);
        insertSpinnerByArray('search_names_spinner', arr);
        arr.unshift(ALL_UNITS);//для names_spinner в начало списка добавляю 'Все устройства'
        insertSpinnerByArray('names_spinner', arr);
    });
}

/** Загрузка всех имен из БД */
/*function getAllNames_old() {
    var arr = [];
    DBASE.collection(TABLE_NAMES)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            arr.push(doc.data().name);
        });
        insertSpinnerByArray('selected_type', arr);
        insertSpinnerByArray('search_names_spinner', arr);
        arr.unshift('Все устройства');//для names_spinner в начало списка добавляю 'Все устройства'
        insertSpinnerByArray('names_spinner', arr);
    });
}*/



/**
 * Лисенер для изменений юнитов БД. При изменении/добавлении юнитов в БД данные на странице автоматически обновляются
 *  БЕЗ ПЕРЕЗАГРУЗКИ страницы
 */
DBASE.collection(TABLE_UNITS)
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log(change.doc.data());
            // const payload = {
            //     id: change.doc.id,
            //     data: change.doc.data(),
            // };
            getAllUnits()
        });
    });

/**
 * Лисенер для изменений юнитов БД. При изменении/добавлении юнитов в БД данные на странице автоматически обновляются
 *  БЕЗ ПЕРЕЗАГРУЗКИ страницы
 */
DBASE.collection(TABLE_REPAIRS)
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log(change.doc.data());
            // const payload = {
            //     id: change.doc.id,
            //     data: change.doc.data(),
            // };
            getAllRepairUnits()
        });
    });

/**
 * Лисенер для изменений списка статусов в БД. При изменении/добавлении статусов в БД данные в спиннере автоматически обновляются
 *  БЕЗ ПЕРЕЗАГРУЗКИ страницы
 */
DBASE.collection(TABLE_STATES)
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log(change.doc.data());
            getAllStates();
        });
    });

/**
 * Лисенер для изменений списка статусов в БД. При изменении/добавлении статусов в БД данные в спиннере автоматически обновляются
 *  БЕЗ ПЕРЕЗАГРУЗКИ страницы
 */
DBASE.collection(TABLE_NAMES)
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log(change.doc.data());
            getAllNames();
        });
    });

function getRepairUnit(nameId, serialId) {
    let sel = document.getElementById(nameId);
    let name = ''+sel.options[sel.selectedIndex].text;

    let serial = document.getElementById(serialId).value;
    getRepairUnitByNameAndSerial(name, serial);
}


function getRepairUnitByNameAndSerial(name, serial) {
    console.log('' + name + ' ' + serial);
    let unit;
    var arr = [];
    DBASE.collection(TABLE_REPAIRS).withConverter(dUnitConverter)
        .where(PARAM_NAME, '==', name)//, '&&', "serial", '==', serial
        .where(PARAM_SERIAL, '==', serial)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Convert to City object
            unit = doc.data();
            arr.push(unit);
        });
        console.log(arr.length)
        if (arr.length === 0) {
            insertNothing('repair_search_result');
            console.log('юнитов не найдено')
        }
        //else addRepairDataRowToPage2(arr);
        else getCollectionOfDocument(TABLE_REPAIRS, TABLE_REPAIR_STATES, arr);
    });
}


function getCollectionOfDocument(collection_1,  collection_2, unitArray) {
    let dUnit = unitArray[0];
    let document_1 = 'r_'+dUnit.id;
    let dstate;
    var arr = [];
    DBASE.collection(collection_1).doc(document_1).collection(collection_2).withConverter(dStateConverter)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                //console.log(doc.id, " => ", doc.data());
                dstate = doc.data();
                arr.push(dstate);
            });
                addCollectionOfDocumentToDiv(arr, dUnit);
        });
}


