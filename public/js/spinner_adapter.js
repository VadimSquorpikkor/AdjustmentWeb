class SpinnerAdapter {



    constructor(spinner) {
        this._spinner = spinner;

    }

    setData(arr_names, arr_ids) {
        this._arr_names = arr_names;
        this._arr_ids = arr_ids;
        updateSpinner(this._spinner, this._arr_names);
    }

    setDataObj(arr) {
        this._arr_names = getNames(arr);
        this._arr_ids = getIds(arr);
        updateSpinner(this._spinner, this._arr_names);
    }

    getSelectedNameId() {
        return this._arr_ids[this._spinner.selectedIndex];
    }

    addFirstLineObj(obj) {
        this._arr_names.unshift(obj.getNameRu);
        this._arr_ids.unshift(obj.getNameId);
        updateSpinner(this._spinner, this._arr_names);
    }
}

function updateSpinner(spinner, arr) {
    if (spinner == null) return;
    let code = '';
    for (let i = 0; i < arr.length; i++) {
        code += '<option value=' + (i + 1) + '>' + arr[i] + '</option>' //через цикл добавляется строка спиннера (option) вида: <option value="1">БДКГ-02</option>
    }
    spinner.innerHTML = '   <select>' + code + '</select>'; //добавляем открывающий и закрывающий тэг и выводим всё в элемент по id
}

function getNames(arr) {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        newArr.push(arr[i].getNameRu)
    }
    return newArr;
}

function getIds(arr) {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        newArr.push(arr[i].getNameId)
    }
    return newArr;
}