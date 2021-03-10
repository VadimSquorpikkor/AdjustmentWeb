const DBASE = firebase.firestore();
const TABLE_UNITS = "units";
const TABLE_REPAIRS = "repairs";
const TABLE_NAMES = "dev_types";
const TABLE_STATES = "states";
const TABLE_REPAIR_STATES = "repair_states";

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
var dUnitConverter = {
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

class DState {
    constructor(state, date) {
        this.state = state;
        this.date = date;
    }

    toString() {
        return this.state + ', ' + this.date;
    }
}

var dStateConverter = {
    toFirestore: function (dstate) {
        return {
            state: dstate.state,
            date: dstate.date
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new DState(data.state, data.date);
    }
};

/** Загрузка всех юнитов из БД */
function getAllUnits() {
    let unit;
    var arr = [];
    DBASE.collection(TABLE_UNITS).withConverter(dUnitConverter)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Convert to City object
            unit = doc.data();
            // data = data + doc.data() + '<br>'; //просто стринг без объекта
            arr.push(unit);
        });
        addDataRowToPage(arr);
        // insertSpinnerByArray('name_spinner', unit_names);
        // insertSpinnerByArray('states_spinner', states);
    });
}

/** Загрузка всех ремонтных юнитов из БД */
function getAllRepairUnits() {
    let unit;
    var arr = [];
    DBASE.collection(TABLE_REPAIRS).withConverter(dUnitConverter)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Convert to City object
            unit = doc.data();
            arr.push(unit);
        });
        addRepairDataRowToPage(arr);
    });
}

/** Загрузка всех статусов из БД */
function getAllStates() {
    var arr = [];
    DBASE.collection(TABLE_STATES)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            arr.push(doc.data().name);
        });
        arr.unshift('Все статусы');// в начало списка добавлено 'Все статусы'
        insertSpinnerByArray('states_spinner', arr);
    });
}

/** Загрузка всех имен из БД */
function getAllNames() {
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
}

/** Загрузка данных в БД (не используется) */
function load() {
    DBASE.collection(TABLE_UNITS).doc("3509_98765").set({
        innerSerial: "98765",
        name: "3509",
        serial: "55555",
        state: "На сборке"
    });
}

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
            console.log('*********РАБОТАЕТ!!!!!!');
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
        .where("name", '==', name)//, '&&', "serial", '==', serial
        .where("serial", '==', serial)
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

function insertNothing(id) {
    document.getElementById(id).innerHTML = '<span class="white_span">Не найдено</span>'
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

function addCollectionOfDocumentToDiv(arr, unit) {

    let data;
    if (arr.length === 0) {
        document.getElementById('repair_search_result').innerHTML =
            '<h3>'+unit.name+' №' + unit.serial + '</h3>'+
            '<span class="white_span">Статусов не найдено</span>';
        //insertNothing('repair_search_result_table');
        console.log('статусов не найдено');
    } else {
        let dState;
        data =
            '<h3>'+unit.name+' №' + unit.serial + '</h3>'+
            '<table class="row_table" id="repair_search_result_table">'+
            '<tr>' +
            '<th style="width: 200px">Дата</th>' +
            '<th style="width: 400px">Статус</th>' +
            '</tr>';
        for (let i = 0; i < arr.length; i++) {
            dState = arr[i];
            data += '<tr>' +
                '<td>' + dState.date + '</td>' +
                '<td>' + dState.state + '</td>' +
                '</tr>';
        }
        data += '</table>';
        document.getElementById('repair_search_result').innerHTML = '' + data;
    }


}
