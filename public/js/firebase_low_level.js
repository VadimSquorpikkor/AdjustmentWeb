/**Низкоуровневые методы для работы с БД. Приложение не работает с этими методами напрямую, а использует промежуточный класс (firebaseHelper).
 * Методы ничего не знают про приложение, не знают как называется БД и из каких таблиц (коллекций) состоит. Само приложение не в курсе, как работать с БД,
 * общается через firebaseHelper. Полная инкапсуляция. Надо будет ещё как-то с лисенерами разобраться, пока выбиваются из картинки. */

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

/**Загрузка в БД. Не используется*/
/*function load() {
    const db = firebase.firestore();
    db.collection("units").doc("3509_98765").set({
        innerSerial: "98765",
        name: "3509",
        serial: "55555",
        state: "На сборке"
    });
}*/

/**Загрузка коллекции, находящейся внутри другой коллекции*/
function getTableOfTable(database, document_name, collection_1, collection_2, converter, func, obj, orderBy) {
    let dState;
    let arr = [];
    database.collection(collection_1).doc(document_name).collection(collection_2).orderBy(orderBy).withConverter(converter)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                //console.log(doc.id, " => ", doc.data());
                dState = doc.data();
                arr.push(dState);
            });
            func(arr, obj);
        });
}