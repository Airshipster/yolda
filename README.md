# Yolda

Yolda is an interactive model of public transport in Azerbaijan over the course of a day. Vehicle positions and most service intervals are estimated. It is not live GPS tracking or a journey planner.

[Open Yolda](https://airshipster.github.io/yolda/) · [Sources and attribution](SOURCES.md)

The dataset was compiled on **9 November 2026**. Its sources have different publication dates and may be incomplete or out of date. Routes serving different days are combined into one model day; available day-of-service information is retained in the data.

## Coverage and limitations

- **Baku and Absheron:** AYNA route geometry used in Ismat Samadov's research GTFS model; most headways are estimates. Operator names were cross-checked against AYNA data from 8 November 2026.
- **Ganja:** 22 routes. Route 4 uses OpenStreetMap geometry; the other 21 routes and stops use CityCard data. Stop order and headways are approximate. CityCard's reuse conditions have not been independently established.
- **Nakhchivan:** routes 1 and 3 use OpenStreetMap geometry. Some stops are unconfirmed and the current network may differ.
- **Intercity buses:** 22 directions from a Baku bus terminal snapshot and 42 regional directions from AYNA tender conditions. Tender documents do not confirm that services are currently operating. Paths and intermediate times are approximate.
- **Metro, funicular and rail:** OpenStreetMap geometry and selected published railway departures. Commuter headways and intermediate positions are modelled; rail coverage is incomplete.

The city selector includes places with mapped services, including intercity routes. This does not imply that local bus coverage is complete.

The transit player is adapted from Aaron Becker's transit-reels project; the original MIT license is preserved in [LICENSE](LICENSE). Maps use OpenStreetMap data, OpenFreeMap and OpenMapTiles; other source terms may also apply. The favicon uses the [GitHub Octicons mark](https://github.com/primer/octicons/blob/main/icons/mark-github-24.svg) under the [MIT license](OCTICONS-LICENSE).
