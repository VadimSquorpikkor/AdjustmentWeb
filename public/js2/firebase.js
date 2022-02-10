let secureKey = "";

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
            // console.log("..."+secureKey);
        } else showError('ВНИМАНИЕ! Ошибка ключа безопасности');
    }).catch((error) => {
        console.log("Error getting document:", error);
        showError('ВНИМАНИЕ! Ошибка ключа безопасности');
    });
    console.log("..."+secureKey);
}

