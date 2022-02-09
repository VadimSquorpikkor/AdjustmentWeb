const devicesForGenerator = document.getElementById('selected_type_for_generator');
let devicesForGeneratorAdapter = new SpinnerAdapter(devicesForGenerator);
let devicesQR = [];

loadDevices2();

function updateDeviceSpinner2() {
    devicesForGeneratorAdapter.setDataObj(devicesQR);
    devicesForGeneratorAdapter.addFirstLineObj(new Device(null, "Ремонт", "Ремонт"));
}

