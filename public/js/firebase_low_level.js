/**Низкоуровневые методы для работы с БД. Приложение не работает с этими методами напрямую, а использует промежуточный класс (firebaseHelper).
 * Методы ничего не знают про приложение, не знают как называется БД и из каких таблиц (коллекций) состоит. Само приложение не в курсе, как работать с БД,
 * общается через firebaseHelper. Полная инкапсуляция. Надо будет ещё как-то с лисенерами разобраться, пока выбиваются из картинки. */

/***/
function listen(database, table, func) {
    database.collection(table)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                console.log(change.doc.data());
                getPairedCollectionFromDB(table, function (arr_id, arr_name) {
                    // nameList = arr_name;
                    // idList = arr_id;
                    func(arr_name, arr_id);
                });
            });
        });
}

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
    let query = database.collection(table).withConverter(converter);
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
            arr.push(doc.data().name);
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
            arr.push(doc.data().name);
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
            arr_name.push(doc.data().name);
        });
        func(arr_id, arr_name);
    });
}

function valueOf(id) {
    return document.getElementById(id).value
}

const db = firebase.firestore();
/**Загрузка в БД из insert.html (там всё закомментировано)*/
/*function loadStates(table, name, location, type, id) {
        db.collection('states').doc(valueOf(id)).set({
            name: valueOf(name),
            location_id: valueOf(location),
            type_id: valueOf(type),
            id: valueOf(id)
        });
}

function loadDevices(id, name, type) {
    db.collection('devices').doc(valueOf(id)).set({
        name: valueOf(name),
        type: valueOf(type),
        id: valueOf(id)
    });
}

function loadEmployees(id, name, email, location) {
    db.collection('employees').doc(valueOf(id)).set({
        id: valueOf(id),
        name: valueOf(name),
        email: valueOf(email),
        location_id: valueOf(location)
    });
}

function loadLocations(id, name) {
    db.collection('locations').doc(valueOf(id)).set({
        id: valueOf(id),
        name: valueOf(name)
    });
}*/



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



/**В отличии от getAll добавляет в массив не сам объект, а его параметр .name*/
function getAllObjectNames(database, table, func) {
    let arr = [];
    database.collection(table)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            arr.push(doc.data().name);
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