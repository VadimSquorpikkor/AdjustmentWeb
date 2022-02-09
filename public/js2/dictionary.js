function getAllDevicesFromFile() {//todo добавить devSet
    let arr = [];
    console.log('...getAllDevicesFromFile');
    arr.push(new Device('AT2503',      'ДКГ-AT2503',    ''));
    arr.push(new Device('AT6130',      'МКС-AT6130',    ''));
    arr.push(new Device('AT6130C',     'МКС-AT6130C',   ''));
    arr.push(new Device('BDKG-01',     'БДКГ-01',       ''));
    arr.push(new Device('BDKG-04',     'БДКГ-04',       ''));
    arr.push(new Device('AT1103M',     'ДКР-AT1103M',   ''));
    arr.push(new Device('AT1117M',     'MKC-AT1117M',   ''));
    arr.push(new Device('AT1120',      'MKC-AT1120',    ''));
    arr.push(new Device('AT1120A',     'MKC-AT1120A',   ''));
    arr.push(new Device('AT1120M',     'MKC-AT1120M',   ''));
    arr.push(new Device('AT1121',      'ДКС-AT1121',    ''));
    arr.push(new Device('AT1123',      'ДКС-AT1123',    ''));
    arr.push(new Device('AT1125',      'MKC-AT1125',    ''));
    arr.push(new Device('AT1125A',     'MKC-AT1125A',   ''));
    arr.push(new Device('BDKG-02',     'БДКГ-02',       ''));
    arr.push(new Device('BDKG-03',     'БДКГ-03',       ''));
    arr.push(new Device('BDKG-04',     'БДКГ-04',       ''));
    arr.push(new Device('BDKG-05',     'БДКГ-05',       ''));
    arr.push(new Device('BDKG-05C',    'БДКГ-05C',      ''));
    arr.push(new Device('BDKG-05M',    'БДКГ-05M',      ''));
    arr.push(new Device('BDKG-07',     'БДКГ-07',       ''));
    arr.push(new Device('BDKG-10',     'БДКГ-10',       ''));
    arr.push(new Device('BDKG-104',    'БДКГ-104',      ''));
    arr.push(new Device('BDKG-11',     'БДКГ-11',       ''));
    arr.push(new Device('BDKG-111',    'БДКГ-111',      ''));
    arr.push(new Device('BDKG-11C',    'БДКГ-11C',      ''));
    arr.push(new Device('BDKG-11M',    'БДКГ-11M',      ''));
    arr.push(new Device('BDKG-17',     'БДКГ-17',       ''));
    arr.push(new Device('BDKG-19',     'БДКГ-19',       ''));
    arr.push(new Device('BDKG-19M',    'БДКГ-19M',      ''));
    arr.push(new Device('BDKG-201M',   'БДКГ-201M',     ''));
    arr.push(new Device('BDKG-203M',   'БДКГ-203M',     ''));
    arr.push(new Device('BDKG-204',    'БДКГ-204',      ''));
    arr.push(new Device('BDKG-205M',   'БДКГ-205M',     ''));
    arr.push(new Device('BDKG-211M',   'БДКГ-211M',     ''));
    arr.push(new Device('BDKG-219M',   'БДКГ-219M',     ''));
    arr.push(new Device('BDKG-22',     'БДКГ-22',       ''));
    arr.push(new Device('BDKG-224',    'БДКГ-224',      ''));
    arr.push(new Device('BDKG-23',     'БДКГ-23',       ''));
    arr.push(new Device('BDKG-230',    'БДКГ-230',      ''));
    arr.push(new Device('BDKG-23_1',   'БДКГ-23/1',     ''));
    arr.push(new Device('BDKG-24',     'БДКГ-24',       ''));
    arr.push(new Device('BDKG-25',     'БДКГ-25',       ''));
    arr.push(new Device('BDKG-27',     'БДКГ-27',       ''));
    arr.push(new Device('BDKG-28',     'БДКГ-28',       ''));
    arr.push(new Device('BDKG-29',     'БДКГ-29',       ''));
    arr.push(new Device('BDKG-30',     'БДКГ-30',       ''));
    arr.push(new Device('BDKG-32',     'БДКГ-32',       ''));
    arr.push(new Device('BDKG-34',     'БДКГ-34',       ''));
    arr.push(new Device('BDKG-35',     'БДКГ-35',       ''));
    arr.push(new Device('BDKG-36',     'БДКГ-36',       ''));
    arr.push(new Device('BDKG-38',     'БДКГ-38',       ''));
    arr.push(new Device('BDKN-01',     'БДКН-01',       ''));
    arr.push(new Device('BDKN-02',     'БДКН-02',       ''));
    arr.push(new Device('BDKN-03',     'БДКН-03',       ''));
    arr.push(new Device('BDKN-04',     'БДКН-04',       ''));
    arr.push(new Device('BDKN-05',     'БДКН-05',       ''));
    arr.push(new Device('BDKN-05M',    'БДКН-05M',      ''));
    arr.push(new Device('BDKN-06',     'БДКН-06',       ''));
    arr.push(new Device('BDKN-07',     'БДКН-07',       ''));
    arr.push(new Device('BDKR-01',     'БДКР-01',       ''));
    arr.push(new Device('BDPA-01',     'БДПА-01',       ''));
    arr.push(new Device('BDPA-02',     'БДПА-02',       ''));
    arr.push(new Device('BDPA-03',     'БДПА-03',       ''));
    arr.push(new Device('BDPB-01',     'БДПБ-01',       ''));
    arr.push(new Device('BDPB-02',     'БДПБ-02',       ''));
    arr.push(new Device('BDPB-03',     'БДПБ-03',       ''));
    arr.push(new Device('BDPS-01',     'БДПС-01',       ''));
    arr.push(new Device('BDPS-02',     'БДПС-02',       ''));
    arr.push(new Device('BDRM-05',     'БДРМ-05',       ''));
    arr.push(new Device('BDRM-11',     'БДРМ-11',       ''));
    arr.push(new Device('BT-DU3',      'BT-DU3',        ''));
    arr.push(new Device('BT-DU4',      'BT-DU4',        ''));
    arr.push(new Device('PU',          'БОИ',           ''));
    arr.push(new Device('PU2',         'БОИ-2',         ''));
    arr.push(new Device('PU4',         'БОИ-4',         ''));
    arr.push(new Device('PU5',         'БОИ-5',         ''));
    arr.push(new Device('USB-DU',      'USB-БД',        ''));
    return arr;
}

function getAllLocationsFromFile() {
    let arr = [];
    console.log('...getAllLocationsFromFile');
    arr.push(new Location('adjustment',      'Участок РИР'));
    arr.push(new Location('assembly',      'Сборочный участок'));
    arr.push(new Location('graduation',      'Градуировка'));
    arr.push(new Location('repair_area',      'Группа сервиса'));
    arr.push(new Location('soldering',      'Монтаж'));
    return arr;
}

function getAllStatesFromFile() {
    let arr = [];
    console.log('...getAllStatesFromFile');
    arr.push(new State('adj_r_diagnostica',    'Диагностика'));
    arr.push(new State('adj_r_poverka',        'Поверка'));
    arr.push(new State('adj_s_poverka',        'Поверка'));
    arr.push(new State('adj_r_soglasovanie',   'Согласование'));
    arr.push(new State('adj_r_ispytania',      'Испытания'));
    arr.push(new State('adj_r_utochnenie',     'Уточнение'));
    arr.push(new State('adj_s_calibrovka',     'Калибровка'));
    arr.push(new State('adj_s_nastroika',      'Настройка'));
    arr.push(new State('adj_s_otgruzka',       'Отгрузка'));
    arr.push(new State('ass_a_razborka',       'Разборка'));
    arr.push(new State('ass_a_sborka',         'Сборка'));
    arr.push(new State('ass_a_zamena',         'Замена'));
    arr.push(new State('gra_a_graduirovka',    'Градуировка'));
    arr.push(new State('gra_a_psi',            'ПСИ'));
    arr.push(new State('rep_r_prinyat',        'Принят в ремонт'));
    arr.push(new State('rep_r_raschet',        'Расчет'));
    arr.push(new State('sol_a_montag',         'Монтаж'));
    arr.push(new State('rep_r_vydano',         'Выдано'));
    arr.push(new State('rep_r_otpravleno',     'Отправлено'));
    arr.push(new State('rep_r_ozidanie',       'Ожидание оплаты'));
    return arr;
}

function getAllEmployeesFromFile() {
    let arr = [];
    console.log('...getAllEmployeesFromFile');
    arr.push(new Employee());
    return arr;
}

function getAllDevSetsFromFile() {
    let arr = [];
    console.log('...getAllDevSetsFromFile');
    arr.push(new DeviceSet('',      ''));
    return arr;
}
