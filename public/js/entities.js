class Location {

    /**
     *
     * @param id идентификатор локации
     * @param name_id идентификатор имени
     * @param name_ru имя для отображения (на русском)
     */
    constructor(id, name_id, name_ru) {
        this._id = id;
        this._name_id = name_id;
        this._name_ru = name_ru;
    }

    get getId() {
        return this._id;
    }
    get getNameId() {
        return this._name_id;
    }
    get getNameRu() {
        return this._name_ru;
    }

    /**!Для JOIN обязательно нужно, чтобы в классе был такой метод!*/
    setNameRu(value) {
        this._name_ru = value;
    }
}

class Employee {

    /**
     *
     * @param id идентификатор сотрудника
     * @param name_id идентификатор имени
     * @param name_ru имя для отображения (на русском)
     * @param email
     * @param location
     */
    constructor(id, name_id, name_ru, email, location) {
        this._id = id;
        this._name_id = name_id;
        this._name_ru = name_ru;
        this._email = email;
        this._location = location;
    }

    get getId() {
        return this._id;
    }

    get getNameId() {
        return this._name_id;
    }

    get getNameRu() {
        return this._name_ru;
    }

    get getEmail() {
        return this._email;
    }

    get getLocation() {
        return this._location;
    }

    /**!Для JOIN обязательно нужно, чтобы в классе был такой метод!*/
    setNameRu(value) {
        this._name_ru = value;
    }
}

class State {

    /**
     *
     * @param id
     * @param name_id
     * @param name_ru
     * @param type
     * @param location
     */
    constructor(id, name_id, name_ru, type, location) {
        this._id = id;
        this._name_id = name_id;
        this._name_ru = name_ru;
        this._type = type;
        this._location = location;
    }

    get getId() {
        return this._id;
    }

    get getNameId() {
        return this._name_id;
    }

    get getNameRu() {
        return this._name_ru;
    }

    get getType() {
        return this._type;
    }

    get getLocation() {
        return this._location;
    }

    /**!Для JOIN обязательно нужно, чтобы в классе был такой метод!*/
    setNameRu(value) {
        this._name_ru = value;
    }
}

class Device {

    /**
     *
     * @param id идентификатор
     * @param name_id идентификатор имени
     * @param name_ru имя для отображения (на русском)
     */
    constructor(id, name_id, name_ru) {
        this._id = id;
        this._name_id = name_id;
        this._name_ru = name_ru;
    }

    get getId() {
        return this._id;
    }
    get getNameId() {
        return this._name_id;
    }
    get getNameRu() {
        return this._name_ru;
    }

    /**!Для JOIN обязательно нужно, чтобы в классе был такой метод!*/
    setNameRu(value) {
        this._name_ru = value;
    }
}
