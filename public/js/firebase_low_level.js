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
        // console.log(arr.length);
        func(arr, host);
    });
}

/**Обертка для getAllUnitsByParam*/
function getUnitListFromBD(deviceName, location, employee, type, state, serial) {
    getAllUnitsByParam(DBASE, TABLE_UNITS, dUnitConverter, UNIT_DEVICE, deviceName, UNIT_LOCATION, location, UNIT_EMPLOYEE, employee, UNIT_TYPE, type, UNIT_STATE, state, UNIT_SERIAL, serial, null, addSerialDataRowToPage);
}

function getRepairUnitListFromBDByLocation(location, div, func) {
    getAllUnitsByParam(DBASE, TABLE_UNITS, dUnitConverter, UNIT_DEVICE, ANY_VALUE, UNIT_LOCATION, location, UNIT_EMPLOYEE, ANY_VALUE, UNIT_TYPE, REPAIR_TYPE, UNIT_STATE, ANY_VALUE, UNIT_SERIAL, ANY_VALUE, div, func);
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
                            div,
                            func) {
    let query = database.collection(table);//.withConverter(converter);//todo убрать конвертер?
    if (value_1 !== ANY_VALUE) query = query.where(param_1, "==", value_1)
    if (value_2 !== ANY_VALUE) query = query.where(param_2, "==", value_2)
    if (value_3 !== ANY_VALUE) query = query.where(param_3, "==", value_3)
    if (value_4 !== ANY_VALUE) query = query.where(param_4, "==", value_4)
    if (value_5 !== ANY_VALUE) query = query.where(param_5, "==", value_5)
    if (value_6 !== ANY_VALUE) query = query.where(param_6, "==", value_6)

    let arr = [];
    query.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log("-------------one more--------------");
            // Convert to object
            obj = doc.data();
            arr.push(obj);
        });

        if (div===null) func(arr);
        else func(arr, div);
    });
}

function eraseSecureKey() {
    secureKey = "";
}

/**Получает из БД секретный ключ (нужен для генерации QR-кода). Если ключ не удалось загрузить, на странице выводится
 * сообщение об ошибке*/
function getSecureKey() {
    DBASE.collection(TABLE_SETTINGS).doc(SECURE_KEY_DOC)
        .get().then((doc) => {
        if (doc.exists) {
            secureKey = doc.data().value;
            console.log("..."+secureKey);
        } else showError('ВНИМАНИЕ! Ошибка ключа безопасности');
    }).catch((error) => {
        console.log("Error getting document:", error);
        showError('ВНИМАНИЕ! Ошибка ключа безопасности');
    });
    console.log("..."+secureKey);
}

let secureKey = "";
