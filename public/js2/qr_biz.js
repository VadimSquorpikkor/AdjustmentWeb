const devicesForGenerator = document.getElementById('selected_type_for_generator');
let devicesForGeneratorAdapter = new SpinnerAdapter(devicesForGenerator);

function updateDeviceSpinner() {
    devicesForGeneratorAdapter.setDataObj(devices);
    devicesForGeneratorAdapter.addFirstLineObj(new Device("Ремонт", "Ремонт", ''));
}

getDevices();

