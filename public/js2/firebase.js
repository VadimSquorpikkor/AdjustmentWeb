let secureKey = "";

function eraseSecureKey() {
    secureKey = "";
}

/**Получает из БД секретный ключ (нужен для генерации QR-кода). Если ключ не удалось загрузить, на странице выводится
 * сообщение об ошибке*/
function getSecureKey() {
    DBASE.collection(TABLE_SETTINGS).doc(SECURE_KEY_DOC).get().then((doc) => {
        if (doc.exists) secureKey = doc.data().value;
        else showError('ВНИМАНИЕ! Ошибка ключа безопасности');
    }).catch((error) => {
        console.log("Error getting document:", error);
        showError('ВНИМАНИЕ! Ошибка ключа безопасности');
    });
    console.log("..."+secureKey);
}


/**Обертка для getAllUnitsByParam*/
function getUnitListFromBD(deviceName, location, employee, type, state, serial) {
    getAllUnitsByParam(DBASE, TABLE_UNITS, UNIT_DEVICE, deviceName, UNIT_LOCATION, location, UNIT_EMPLOYEE, employee, UNIT_TYPE, type, UNIT_STATE, state, UNIT_SERIAL, serial, null, addSerialDataRowToPage);
}

//todo кроме ANY_VALUE добавить ещё null и ""
/**Получить все объекты из коллекции, совпадающие по параметрам. Если значение параметра равно ANY_VALUE,
 * то этот параметр будет проигнорирован при поиске*/
function getAllUnitsByParam(database, table,
                            param_1, value_1,
                            param_2, value_2,
                            param_3, value_3,
                            param_4, value_4,
                            param_5, value_5,
                            param_6, value_6,
                            div,
                            func) {
    let query = database.collection(table);
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

            //TODO Добавить если close_date==null т.е. не загружать завершенные

            let id = doc.id;
            let description = doc.data().description;
            let device_id = doc.data().device_id;
            let employee_id = doc.data().employee_id;
            let inner_serial = doc.data().inner_serial;
            let location_id = doc.data().location_id;
            let serial = doc.data().serial;
            let state_id = doc.data().state_id;
            let type_id = doc.data().type_id;
            let date = doc.data().date;
            let close_date = doc.data().close_date;
            let unit = new Unit(id, description, device_id, employee_id, inner_serial, location_id, serial, state_id, type_id, date, close_date)

            arr.push(unit);
        });

        if (div===null) func(arr);
        else func(arr, div);
    });
}

function getAllEventsByUnitId(value, func, orderBy, order, host){
        let arr = [];
        DBASE.collection(TABLE_EVENTS)
        .where(EVENT_UNIT, "==", value)
        .orderBy(orderBy, order)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let event = new Event(doc.data().date, doc.data().description, doc.data().location_id, doc.data().state_id, doc.data().unit_id);
            arr.push(event);
        });
        // console.log(arr.length);
        func(arr, host);
    });
}