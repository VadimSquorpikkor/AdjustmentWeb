/**Важно! Для эксперимента добавил библиотеку (fdictionary), в которой храню names, locations, devices. При загрузке
 * страницы эти данные теперь берутся не из БД, а из этой библиотеки, это сделано, чтобы сократить кол-во запросов в БД.
 * Из минусов: теперь если добавлю/поменяю имена, локации или устройства в БД, то придется их также менять в fdictionary
 * (раньше ничего не нужно было менять, всё автоматом). Для возврата в вариант из БД в firebase_low_level раскоментировать //вариант когда имена беру из БД//*/


/**Словарь id->names*/
let dictionary = new Map();


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
//----------------------------------------------------------------------------------------------------------------------
function loadLocation() {
    //вариант когда имена беру из библиотеки//
    locations = getAllLocationsFromFile();
    if (document.getElementById('location_spinner')!==null) updateLocationSpinner();

    //вариант когда имена беру из БД//
    /*let loc_arr = [];
    DBASE.collection(TABLE_LOCATIONS)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let id = doc.data().id;
            let name_id = doc.data().name_id;
            let name_ru = doc.data().name_id;
            let location = new Location(id, name_id, name_ru);

            changeNameIdToNameRu(name_id, location);
            loc_arr.push(location);
        });
        locations = loc_arr;
        if (document.getElementById('location_spinner')!==null) updateLocationSpinner();
    });*/
}
//----------------------------------------------------------------------------------------------------------------------
/**Сотрудников на английском нет вот почему: они используются ТОЛЬКО в приложениях для внутреннего пользования (AdjustmentDB и
 * AdjustmentWeb, людям отслеживающих ремонт знать фамилии сотрудников не нужно), а значит значения нужны только на
 * русском, а значит можно значение на русском записать в поле name_id документа таблицы "employees", при загрузке
 * списка сотрудников в name_ru будет присвоено значение идентификатора автоматом (метод join не найдя сотрудников в
 * "names" оставит идентификатор, который является в этом случае именем на русском. Профит)*/
function loadEmployees() {
    let emp_arr = [];
    //Внимание! Для employee name_id — это id, а name — это name_id
    //Так сделано, потому что для сохранения сотрудника в юните нужен id сотрудника
    // (поэтому name_id — это id), а для отображения имени в спиннере достаточно
    // name_id без подгрузки имени из таблицы имен (name — это name_id)
    DBASE.collection(TABLE_EMPLOYEES)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let id = doc.data().id;
            let name_id = id;
            let name_ru = doc.data().name_id;
            let email = doc.data().email;
            let location_id = doc.data().location_id;
            let employee = new Employee(id, name_id, name_ru, email, location_id);
            emp_arr.push(employee);
        });
        employees = emp_arr;
        if (document.getElementById('location_spinner')!==null) updateEmployeeSpinner();
    });
}
//----------------------------------------------------------------------------------------------------------------------
function loadStates() {
    let sta_arr = [];
    DBASE.collection(TABLE_STATES)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let id = doc.data().id;
            let name_id = doc.data().name_id;
            let name_ru = doc.data().name_id;
            let type = doc.data().type_id;
            let location_id = doc.data().location_id;
            let state = new State(id, name_id, name_ru, type, location_id);

            changeNameIdToNameRu(name_id, state);
            sta_arr.push(state);
        });
        states = sta_arr;
        if (document.getElementById('location_spinner')!==null) updateStatesSpinner();
    });
}
//----------------------------------------------------------------------------------------------------------------------
function listen(table, func) {
    DBASE.collection(table)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            func(doc);
        });
    });
}
//----------------------------------------------------------------------------------------------------------------------
function loadDevices() {
    //вариант когда имена беру из библиотеки//
    devices = getAllDevicesFromFile();
    if (document.getElementById('location_spinner')!==null) updateDeviceSpinner();

    //вариант когда имена беру из БД//
    /*let dev_arr = [];
    DBASE.collection(TABLE_DEVICES)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let id = doc.data().id;
            let name_id = doc.data().name_id;
            let name_ru = doc.data().name_id;
            let device = new Device(id, name_id, name_ru);

            //альт вариант
            // changeNameIdToNameRu(name_id, device);
            // devices.push(device);
            // updateDeviceSpinner();

            changeNameIdToNameRu(name_id, device);
            dev_arr.push(device);
        });
        devices = dev_arr;
        if (document.getElementById('location_spinner')!==null) updateDeviceSpinner();
    });*/
}
//----------------------------------------------------------------------------------------------------------------------
/**При загрузке страницы первым делом загружаются данные из таблицы имен (только русский вариант). Эти данные помещаются
 * в Map (dictionary), где ключ — это имя документа firebase, а значение — это значение поля "ru"
 * При загрузке данных для employees, states, devices, location вместо join (как было раньше) используется метод
 * changeNameIdToNameRu, который из библиотеки берет значение на русском по идентификатору
 *
 * Сейчас для эксперимента не загружаю имена из БД, а беру из файла, чтобы сократить кол-во обращений к БД*/
function loadNames() {
    //вариант когда имена беру из библиотеки//
    dictionary = getDictionaryFromFile();
    console.log('...dictionary size = '+dictionary.size);

    //вариант когда имена беру из БД//
    /*DBASE.collection(TABLE_NAMES)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // let en = doc.data().en;
            let ru = doc.data().ru;
            let id = doc.id;
            dictionary.set(id, {ru: ru});
        });
    });*/
}
//-- для QR ------------------------------------------------------------------------------------------------------------
function loadDevices2() {
    //вариант когда имена беру из библиотеки//
    devicesQR = getAllDevicesFromFile();
    updateDeviceSpinner2();

    //вариант когда имена беру из БД//
    /*let dev_arr = [];
    DBASE.collection(TABLE_DEVICES)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let id = doc.data().id;
            let name_id = doc.data().name_id;
            let name_ru = doc.data().name_id;
            let device = new Device(id, name_id, name_ru);

            joinNamesRu(name_id, device, updateDeviceSpinner2);

            dev_arr.push(device);
        });
        devices = dev_arr;
    });*/
}

function joinNamesRu(name_id, obj, func) {
    let docRef = DBASE.collection(TABLE_NAMES).doc(name_id);
    docRef.get().then((doc) => {
        if (doc.exists) {
            obj.setNameRu(doc.data().ru);
            func();
        }
    });
}
//----------------------------------------------------------------------------------------------------------------------
/**Слушатель новых событий у выбранной локации. Если в локации что-то изменилось, автоматом выводится информация на
 * странице (без перезагрузки)*/
function listen_changes(location, div, func) {
    DBASE.collection(TABLE_UNITS).where('location_id', "==", location)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(() => getRepairUnitListFromBDByLocation(location, div, func));
        });
}
//----------------------------------------------------------------------------------------------------------------------
function changeNameIdToNameRu(name_id, obj) {
    obj.setNameRu(dictionary.get(name_id).ru);
}



// function getName(id) {
//     if (!dictionary.has(id)) return id;
//     return (typeof dictionary.get(id).en)==='undefined'?dictionary.get(id):dictionary.get(id).ru;
// }
//----------------------------------------------------------------------------------------------------------------------
