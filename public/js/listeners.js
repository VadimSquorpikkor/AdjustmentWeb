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