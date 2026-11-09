# Yolda

Интерактивная карта моделирует движение общественного транспорта Азербайджана в течение суток. Положение транспорта и большая часть интервалов рассчитаны; это не данные GPS и не сервис для планирования поездки. Маршруты разных дней объединены в один модельный день, сведения о днях обслуживания сохранены там, где они доступны.

Данные для этой сборки собраны **9 ноября 2026 года**. Исходные источники относятся к разным датам и могут быть неполными или устаревшими.

- **Баку и Абшерон:** схемы AYNA, использованные в исследовательском GTFS Исмата Самедова; большинство интервалов в исследовании оценочные. Названия перевозчиков сопоставлены с данными AYNA от 8 ноября 2026 года.
- **Гянджа:** 22 маршрута. Геометрия маршрута 4 — OpenStreetMap, остальных 21 маршрута и остановок — CityCard. Порядок остановок и интервалы приблизительны; условия повторного использования CityCard не были независимо установлены.
- **Нахичевань:** маршруты 1 и 3 по OpenStreetMap; сеть 2026 года может отличаться, часть остановок не подтверждена.
- **Междугородние автобусы:** 22 направлений из выборки Бакинского автовокзала от 9 ноября 2026 года и 42 региональных направлений по условиям конкурсов AYNA. Последние не подтверждают актуальное выполнение рейсов. Трассы по OSM/OSRM, промежуточное положение и время прибытия приблизительны; часть концов — ориентиры в населённых пунктах.
- **Метро, фуникулёр, поезда и электрички:** линии из OpenStreetMap, часть отправлений опубликована ADY; интервалы электричек и движение между станциями смоделированы. Железнодорожное покрытие неполное.
- **Города:** справочник содержит 75 городов и райцентров. Наличие города в списке не означает, что найдены схемы его городских маршрутов.

Проект использует плеер [transit-reels Аарона Беккера](https://github.com/aaronjbecker/transit-reels); его лицензия MIT сохранена в [LICENSE](LICENSE). Картографические данные: [OpenStreetMap и участники](https://www.openstreetmap.org/copyright), ODbL; подложка — [OpenFreeMap](https://openfreemap.org/) и [OpenMapTiles](https://openmaptiles.org/). У других источников могут быть собственные условия использования.

## Источники

- [Схемы маршрутов AYNA](https://map.ayna.gov.az/)
- [Исследование и GTFS-модель Ismat Samadov](https://zenodo.org/doi/10.5281/zenodo.23604370)
- [GitHub: исследование Ismat Samadov](https://github.com/ismatsamadov/route_efficiency)
- [Данные OpenStreetMap](https://www.openstreetmap.org/copyright)
- [Подложка OpenFreeMap](https://openfreemap.org/)
- [Картографические тайлы OpenMapTiles](https://openmaptiles.org/)
- [Схема и интервалы метро](https://metro.gov.az/en/route-change)
- [Об интервалах метро, 6 ноября 2026](https://metro.gov.az/news/369)
- [Планы развития метро](https://metro.gov.az/metro-development-plan)
- [Граница Азербайджана · OpenStreetMap](https://www.openstreetmap.org/relation/364110)
- [H1 Airport Express](https://www.airport.az/en/press-release/h1-airport-express-route-will-now-operate-24-7-for-the-convenience-of-passengers/)
- [Часы фуникулёра](https://touristo.az/en/s/baku-funicular-guide)
- [Плеер transit-reels](https://github.com/aaronjbecker/transit-reels)
- [Гянджа: маршрут 4, схема AYNA](https://ayna.gov.az/az/news/gencede-22-muntezem-avtobus-marsrutu-musabiqeye-cixarilir-752)
- [Гянджа: маршрут 4, геометрия и остановки OSM](https://www.openstreetmap.org/relation/21462371)
- [Гянджа: схемы и остановки CityCard](https://citycard.az/maps)
- [Нахичевань: маршрут 3, описание направлений](https://www.serqqapisi.az/butun-xeberler/naxcivanda-avtobus-marsrutlarinda-deyisiklik-hereket-hansi-istiqametler-uzre-olacaq)
- [Нахичевань: маршрут 3, геометрия и остановки OSM](https://www.openstreetmap.org/relation/21380992)
- [Нахичевань: условия конкурса AYNA 2026](https://ayna.gov.az/az/media/announcements/musabiqe-elani-70)
- [Нахичевань: маршруты BakuBus, август 2026](https://www.naxcivanxeberleri.az/bloq/bakubusun-naxcivan-seherinde-yeni-marsrut-xettleri-85233)
- [Нахичевань: маршрут 1, геометрия OSM](https://www.openstreetmap.org/relation/21380921)
- [Гянджа: часы работы BakuBus, 2025](https://gencexeber.az/butun-xeberler/bakubus-marsrutlarinin-is-qrafikleri-aciqlanib)
- [Регулярные рейсы Бакинского автовокзала, выборка 09.11.2026](https://www.avtovagzal.az/az/marsrutlar)
- [Список автовокзалов AYNA](https://ayna.gov.az/az/bus-stations)
- [Дорожная геометрия OSM / OSRM (расчёт)](https://project-osrm.org/)
- [AYNA: Bakı–Ağdam, через Quzanlı](https://ayna.gov.az/az/news/bakidan-agdama-muntezem-avtobus-reysi-fealiyyete-baslayir-868)
- [AYNA: Bakı–Laçın, через Ağalı](https://ayna.gov.az/az/news/baki-lacin-reysi-uzre-ilk-avtobus-yola-dusub-1027)
- [AYNA: приостановка Bakı–Naxçıvan, февраль 2026](https://ayna.gov.az/az/news/baki-naxcivan-baki-avtobus-reysleri-fealiyyetini-dayandirib-1031)
- [AYNA: конкурсные отправления региональных маршрутов, июнь 2026](https://ayna.gov.az/az/media/announcements/musabiqe-elani-77)
- [AYNA: конкурсные отправления, июль 2026](https://ayna.gov.az/az/media/announcements/musabiqe-elani-79)
- [AYNA: объявленные победители по региональным маршрутам](https://ayna.gov.az/az/news/daha-bir-nece-istiqamet-uzre-kecirilen-musabiqelerin-qalibleri-mueyyen-edilib-1168)
- [AYNA: Гянджа–Кедабек, победитель](https://ayna.gov.az/az/news/seherlerarasi-seheretrafi-ve-seherdaxili-marsrutlar-uzre-musabiqelerin-qalibleri-mueyyen-edilib-1187)
- [ADY: дополнительные поезда Баку–Тбилиси, ноябрь 2026](https://dailybaku.az/az/article/baki-tbilisi-marsrutu-uzre-elave-qatar-reysleri-istifadeye-verilib)
- [ADY: расписание электричек, сентябрь 2026](https://sesxeber.com/xirdalan-baki-qatarlarinin-s%C9%99f%C9%99r-mudd%C9%99ti-qisaldilir-v%C9%99-reysl%C9%99rin-sayi-artirilir/)
- [ADY: Гянджа–Габала](https://t.me/s/azerbaycandemiryollari?before=3293)
- [Поезда Баку–Газах и Баку–Габала, октябрь 2026](https://xeber.azeri.net/olke/qatar-biletleri-baki-gence-qazax-qebele-tbilisi-qrafik-qiymetler-onlayn-alis)
- [Данные линий и станций OSM](https://www.openstreetmap.org/copyright)
- [ADY: Балакен, восстановление с 20 ноября 2026](https://report.az/infrastruktur/baki-balaken-baki-qatarinin-hereketi-berpa-edilir)
- [AYNA: автовокзалы и автостанции](https://ayna.gov.az/az/bus-stations)
- [AYNA: Мингечевир, городской маршрут 5, конкурс 2026](https://ayna.gov.az/az/news/muxtelif-istiqametlerde-muntezem-avtobus-marsrutlari-musabiqeye-cixarilir-1235)
