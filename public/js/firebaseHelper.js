const DBASE = firebase.firestore();
const TABLE_UNITS = "units";
const TABLE_NAMES = "dev_types";
const TABLE_STATES = "states";

/** Класс для устройства, или блока детектирования */
class DUnit {
    constructor(name, innerSerial, serial, state) {
        this.name = name;
        this.innerSerial = innerSerial;
        this.serial = serial;
        this.state = state;
    }

    toString() {
        return this.name + ', ' + this.innerSerial + ', ' + this.serial + ', ' + this.state;
    }
}

/** Firestore data converter. Нужен для загрузки из БД объекта класса DUnit */
var dUnitConverter = {
    toFirestore: function (dunit) {
        return {
            name: dunit.name,
            innerSerial: dunit.innerSerial,
            serial: dunit.serial,
            state: dunit.state
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new DUnit(data.name, data.innerSerial, data.serial, data.state);
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