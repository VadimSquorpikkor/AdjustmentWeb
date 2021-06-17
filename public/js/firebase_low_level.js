/**Низкоуровневые методы для работы с БД. Приложение не работает с этими методами напрямую, а использует промежуточный класс (firebaseHelper).
 * Методы ничего не знают про приложение, не знают как называется БД и из каких таблиц (коллекций) состоит. Само приложение не в курсе, как работать с БД,
 * общается через firebaseHelper. Полная инкапсуляция. */


function listen_new(database, table, func) {
    database.collection(table)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(() => func());
        });
}









/**Лисенер для коллекции БД. Суть такого лисенера: следит за изменениями в коллекции, при ивенте загружает из коллекции
 * список всех имен и список всех идентификаторов. Оба списка передает через "этой функции", которая уже занимается
 * сохранением списков и формированием из них спинеров*/
function listen(database, table, func) {
    database.collection(table)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                console.log(change.doc.data());
                getPairedCollectionFromDB(table, function (arr_id, arr_name) {
                    func(arr_name, arr_id); //Эта функция
                });
            });
        });
}






/*DBASE.collection(TABLE_STATES)
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log(change.doc.data());
            getAllStates();
        });
    });*/


/**Получение всех событий выбранного юнита по его идентификатору (unit.id)*/
function getAllEventsByUnitId(database, table, param, value, func, obj, orderBy){
    let arr = [];
    database.collection(table)
        .where(param, "==", value)
        .orderBy(orderBy)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let event = new DEvent(doc.data().date, doc.data().description, doc.data().location_id, doc.data().state_id, doc.data().unit_id);
            arr.push(event);
        });
        console.log(arr.length);
        func(arr, obj);
    });
}

function getAllEventsByUnitId_new(database, table, param, value, func, orderBy, order, host){
    let arr = [];
    database.collection(table)
        .where(param, "==", value)
        .orderBy(orderBy, order)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let event = new DEvent(doc.data().date, doc.data().description, doc.data().location_id, doc.data().state_id, doc.data().unit_id);
            arr.push(event);
        });
        console.log(arr.length);
        func(arr, host);
    });
}

/**Обертка для getAllUnitsByParam*/
function getUnitListFromBD(deviceName, location, employee, type, state, serial) {
    getAllUnitsByParam(DBASE, TABLE_UNITS, dUnitConverter, UNIT_DEVICE, deviceName, UNIT_LOCATION, location, UNIT_EMPLOYEE, employee, UNIT_TYPE, type, UNIT_STATE, state, UNIT_SERIAL, serial, addSerialDataRowToPage);
}
//todo кроме ANY_VALUE добавить ещё null и ""
/**Получить все объекты из коллекции, совпадающие по параметрам. Если значение параметра равно ANY_VALUE,
 * то этот параметр будет проигнорирован при поиске*/
function getAllUnitsByParam(database, table, converter,
                            param_1, value_1,
                            param_2, value_2,
                            param_3, value_3,
                            param_4, value_4,
                            param_5, value_5,
                            param_6, value_6,
                            func) {
    let query = database.collection(table).withConverter(converter);//todo убрать конвертер?
    if (value_1 !== ANY_VALUE) query = query.where(param_1, "==", value_1)
    if (value_2 !== ANY_VALUE) query = query.where(param_2, "==", value_2)
    if (value_3 !== ANY_VALUE) query = query.where(param_3, "==", value_3)
    if (value_4 !== ANY_VALUE) query = query.where(param_4, "==", value_4)
    if (value_5 !== ANY_VALUE) query = query.where(param_5, "==", value_5)
    if (value_6 !== ANY_VALUE) query = query.where(param_6, "==", value_6)

    let arr = [];
    query.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Convert to object
            obj = doc.data();
            arr.push(obj);
        });
        func(arr);
    });
}

function getStatesInLocation(type, location, func) {
    let arr = [];
    DBASE.collection(TABLE_STATES)
        .where(STATE_LOCATION, "==", location)
        .where(STATE_TYPE, 'in', [TYPE_ANY, type])
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            arr.push(doc.data().name_ru);
        });
        func(arr);
    });
}

/**Загружает статусы выбранного типа и статусы "любой", при выборе, например "ремонта" загрузятся все ремонтные статуты и статусы, у которых общий тип*/
function getStates(type, func) {
    let arr = [];
    DBASE.collection(TABLE_STATES)
        .where(STATE_TYPE, 'in', [TYPE_ANY, type]) //или type или any_type
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            arr.push(doc.data().name_ru);
        });
        func(arr);
    });
}

function getPairedCollectionFromDB(table, func) {
    let arr_id = [];
    let arr_name = [];
    DBASE.collection(table)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            arr_id.push(doc.data().id);
            arr_name.push(doc.data().name_ru);
        });
        func(arr_id, arr_name);
    });
}

function valueOf(id) {
    return document.getElementById(id).value
}

const db = firebase.firestore();
/**Загрузка в БД из insert.html (там всё закомментировано)*/
/*function loadStates(name_ru, name_en, name_zh, name_it, location, type, id) {
        db.collection('states').doc(valueOf(id)).set({
            name_ru: valueOf(name_ru),
            name_en: valueOf(name_en),
            name_zh: valueOf(name_zh),
            name_it: valueOf(name_it),
            location_id: valueOf(location),
            type_id: valueOf(type),
            id: valueOf(id)
        }, { merge: true });
}*/

/**Для всех языков кроме русского загружается вариант как для английского*/
/*function loadDevices(id, name_ru, name_en, type) {
    db.collection('devices').doc(valueOf(id)).set({
        name_ru: valueOf(name_ru),
        name_en: valueOf(name_en),
        name_zh: valueOf(name_en),
        name_it: valueOf(name_en),
        type: valueOf(type),
        id: valueOf(id)
    }, { merge: true });
}*/

/**Для всех языков кроме русского загружается вариант как для английского (на китайском всё равно будет "Serikov")*/
/*function loadEmployees(id, name_ru, name_en, email, location) {
    db.collection('employees').doc(valueOf(id)).set({
        id: valueOf(id),
        name_ru: valueOf(name_ru),
        name_en: valueOf(name_en),
        name_zh: valueOf(name_en),
        name_it: valueOf(name_en),
        email: valueOf(email),
        location_id: valueOf(location)
    }, { merge: true });
}*/

/*function loadLocations(id, name_ru, name_en, name_zh, name_it) {
    db.collection('locations').doc(valueOf(id)).set({
        id: valueOf(id),
        name_ru: valueOf(name_ru),
        name_en: valueOf(name_en),
        name_zh: valueOf(name_zh),
        name_it: valueOf(name_it)
    }, { merge: true });
}*/

function loadNames(id, name_ru, name_en, name_it, name_de, name_fr) {
    /*db.collection('names').doc(valueOf(id)).set({
        ru: valueOf(name_ru),
        en: valueOf(name_en),
        zh: valueOf(name_it),
        it: valueOf(name_de),
        de: valueOf(name_fr)
    }, { merge: true });*/

    /*if (valueOf(name_ru)!=="")db.collection('names').doc(valueOf(id)).set({ ru: valueOf(name_ru)}, { merge: true });
    if (valueOf(name_en)!=="")db.collection('names').doc(valueOf(id)).set({ en: valueOf(name_en)}, { merge: true });
    if (valueOf(name_it)!=="")db.collection('names').doc(valueOf(id)).set({ it: valueOf(name_it)}, { merge: true });
    if (valueOf(name_de)!=="")db.collection('names').doc(valueOf(id)).set({ de: valueOf(name_de)}, { merge: true });
    if (valueOf(name_fr)!=="")db.collection('names').doc(valueOf(id)).set({ fr: valueOf(name_fr)}, { merge: true });*/
}

function clearInput(id1, id2, id3, id4, id5, id6) {
    document.getElementById(id1).value = "";
    document.getElementById(id2).value = "";
    document.getElementById(id3).value = "";
    document.getElementById(id4).value = "";
    document.getElementById(id5).value = "";
    document.getElementById(id6).value = "";
}


// ---------------------------------------------------------------------------------------------------------------------





/**Получить все объекты из коллекции, совпадающие по одному параметру*/
function getAllByOneParam(database, table, converter, param, value, func) {
    let obj;
    let arr = [];
    database.collection(table).withConverter(converter)
        .where(param, "==", value)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Convert to object
            obj = doc.data();
            arr.push(obj);
        });
        func(arr);
    });
}

/**Получить все объекты из коллекции, совпадающие по одному параметру*/
function getAllByOneParamOrdered(database, table, converter, param, value, func, obj, orderBy) {
    let dState;
    let arr = [];
    database.collection(table)
        .withConverter(converter)
        .where(param, "==", value)
        .orderBy(orderBy)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Convert to object
            dState = doc.data();
            arr.push(dState);
        });
        console.log(arr.length);
        func(arr, obj);
    });
}



/**Получить все объекты из коллекции, совпадающие по двум параметрам*/
function getAllByTwoParam(database, table, converter, param_1, value_1, param_2, value_2, func) {
    let obj;
    let arr = [];
    database.collection(table).withConverter(converter)
        .where(param_1, "==", value_1)
        .where(param_2, "==", value_2)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Convert to object
            obj = doc.data();
            arr.push(obj);
        });
        func(arr);
    });
}

/**Получить все объекты из коллекции, совпадающие по двум параметрам*/
function getAllByThreeParam(database, table, converter, param_1, value_1, param_2, value_2, param_3, value_3, func) {
    let obj;
    let arr = [];
    database.collection(table).withConverter(converter)
        .where(param_1, "==", value_1)
        .where(param_2, "==", value_2)
        .where(param_3, "==", value_3)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Convert to object
            obj = doc.data();
            arr.push(obj);
        });
        func(arr);
    });
}


function getAllRuMapNames(database, table, func) {
    let map = new Map();
    database.collection(table)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            map.set(doc.id(), doc.data().ru)
            console.log(doc.id()+' - '+doc.data().ru);
            // arr.push(doc.data().name_ru);
        });
        func(map);
    });
}



/**В отличии от getAll добавляет в массив не сам объект, а его параметр .name*/
function getAllObjectNames(database, table, func) {
    let arr = [];
    database.collection(table)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            arr.push(doc.data().name_ru);
        });
        func(arr);
    });
}





/**Получить все объекты из коллекции*/
function getAll(database, table, converter, func) {
    let obj;
    let arr = [];
    database.collection(table).withConverter(converter)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Convert to object
            obj = doc.data();
            arr.push(obj);
        });
        func(arr);
    });
}