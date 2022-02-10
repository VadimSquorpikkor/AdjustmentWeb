
class SpinnerAdapter {

    constructor(spinner) {
        this._spinner = spinner;

    }

    setDataObj(arr) {
        this._arr_names = getNames(arr);
        this._arr_ids = getIds(arr);
        console.log('***'+this._arr_names[0]);
        console.log('***'+this._arr_ids[0]);
        updateSpinner(this._spinner, this._arr_names);
    }

    getSelectedId() {
        if (this._arr_ids===undefined)return;
        return this._arr_ids[this._spinner.selectedIndex];
    }

    getSelectedName() {
        if (this._arr_names===undefined)return;
        return this._arr_names[this._spinner.selectedIndex];
    }

    addFirstLineObj(obj) {
        this._arr_names.unshift(obj.getNameRu);
        this._arr_ids.unshift(obj.getId);
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
        newArr.push(arr[i].getId)
    }
    return newArr;
}