/**Низкоуровневые методы для работы с БД. Приложение не работает с этими методами напрямую, а использует промежуточный класс (firebaseHelper).
 * Методы ничего не знают про приложение, не знают как называется БД и из каких таблиц (коллекций) состоит. Само приложение не в курсе, как работать с БД,
 * общается через firebaseHelper. Полная инкапсуляция. */


function listen_new(database, table, func) {
    database.collection(table)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(() => func());
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

function valueOf(id) {
    return document.getElementById(id).value
}


/**Загрузка в таблицу имен*/
function loadNames(id, name_ru, name_en, name_it, name_de, name_fr) {
    /*let db = firebase.firestore();
    db.collection('names').doc(valueOf(id)).set({
        ru: valueOf(name_ru),
        en: valueOf(name_en),
        it: valueOf(name_it),
        de: valueOf(name_de),
        fr: valueOf(name_fr)
    }, { merge: true });

    if (valueOf(name_ru)!=="")db.collection('names').doc(valueOf(id)).set({ ru: valueOf(name_ru)}, { merge: true });
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
