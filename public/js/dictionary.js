let dictionary = new Map();

dictionary.set('adj_r_diagnostica',        'Диагностика'         );
dictionary.set('adj_r_ispytania',          'Испытания'           );
dictionary.set('adj_r_utochnenie',         'Уточнение'           );
dictionary.set('adj_s_calibrovka',         'Калибровка'          );
dictionary.set('adj_s_nastroika',          'Настройка'           );
dictionary.set('adj_s_otgruzka',           'Отгрузка'            );
dictionary.set('adjustment',               'Участок РИР'         );
dictionary.set('ass_a_razborka',           'Разборка'            );
dictionary.set('ass_a_sborka',             'Сборка'              );
dictionary.set('ass_a_zamena',             'Замена'              );
dictionary.set('assembly',                 'Сборочный участок'   );
dictionary.set('AT2503',                   'AT2503'              );
dictionary.set('AT6130',                   'МКС-AT6130'          );
dictionary.set('AT6130C',                  'МКС-AT6130С'         );
dictionary.set('BDKG01',                   'БДКГ-01'             );
dictionary.set('BDKG04',                   'БДКГ-04'             );
dictionary.set('gra_a_graduirovka',        'Градуировка'         );
dictionary.set('gra_a_psi',                'ПСИ'                 );
dictionary.set('graduation',               'Градуировка'         );
dictionary.set('rep_r_prinyat',            'Принят в ремонт'     );
dictionary.set('rep_r_raschet',            'Расчет'              );
dictionary.set('rep_r_soglasovanie',       'Согласование'        );
dictionary.set('repair_area',              'Группа сервиса'      );
dictionary.set('serial_number_prefix',     '№'                  );
dictionary.set('sol_a_montag',             'Монтаж'              );
dictionary.set('soldering',                'Монтаж'              );
dictionary.set('rep_r_vydano',             'Выдано'              );
dictionary.set('rep_r_otpravleno',         'Отправлено'          );
dictionary.set('rep_r_ozidanie',           'Ожидание оплаты'     );

dictionary.set('find_number',              'Найти'               );
dictionary.set('nothing_found',            'Ничего не найдено'   );
dictionary.set('no_states_found',          'Событий не найдено'  );
dictionary.set('days_under_repair',        'Дней в ремонте'      );
dictionary.set('version_text',             'Версия — '          );
dictionary.set('accepted_for_repair',      'Принят в ремонт'     );
dictionary.set('Repair Service',           'Группа Сервиса'      );

dictionary.set('serial_number',            'Серийный номер'      );
dictionary.set('serial_number_text',       'Серийный номер:'     );

function getNameFromDictionary(id) {
    if (dictionary.has(id)) return dictionary.get(id);
    else return id;
}
