import { at as positionAt, buildSchedule, candidatesAt, departuresDuring, routesAtStops, timeline, undelta, peakVisibleSteps } from "./schedule.mjs?v=20261109m";

const MAPLIBRE = "https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl";

const BASEMAP = "https://tiles.openfreemap.org/styles/dark";

const BASEMAP_CREDIT = "Map: OpenFreeMap © OpenMapTiles, data © OpenStreetMap contributors";

const INTERFACE_VERSION = "2026.11.09.5";

const CSS = `\n.tr{position:relative;overflow:hidden;container-type:inline-size;background:var(--tr-bg,#0c0d10);color:var(--tr-text,#f2f3f5);\n  font:14px/1.4 var(--tr-font,system-ui,-apple-system,"Segoe UI",sans-serif);user-select:none;-webkit-user-select:none;touch-action:none}\n.tr:focus{outline:none}.tr:focus-visible{outline:2px solid var(--tr-accent,#7bd3ff);outline-offset:-2px}\n.tr canvas,.tr-map{position:absolute;inset:0;width:100%;height:100%;display:block;cursor:grab}\n.tr-map{pointer-events:none}.tr.coop canvas{touch-action:pan-y}\n.tr-hint{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#0008;font-size:15px;\n  opacity:0;transition:opacity .25s;pointer-events:none}.tr-hint.on{opacity:1}\n.tr canvas.drag{cursor:grabbing}.tr canvas.over{cursor:pointer}\n.tr button,.tr input,.tr select{font:inherit;color:inherit}\n.tr-head{position:absolute;left:14px;top:12px;width:min(300px,calc(100% - 28px));pointer-events:none}\n.tr-title{text-shadow:0 1px 3px #000,0 0 14px #000e}\n.tr-head{z-index:1}.tr-tip,.tr-panel,.tr-hint{z-index:2}\n.tr.tiles .tr-head::before{content:"";position:absolute;inset:-40px -80px -30px -40px;z-index:-1;pointer-events:none;\n  background:radial-gradient(closest-side,color-mix(in srgb,var(--tr-bg,#0c0d10) 70%,transparent),transparent)}\n.tr-title b{display:block;font-size:22px;line-height:1.1;font-weight:700}\n.tr-title span{color:var(--tr-muted,#a9adb6);font-size:13px}\n.tr-clock{font-size:30px;font-weight:600;font-variant-numeric:tabular-nums;line-height:1}\n.tr-count{color:var(--tr-muted,#a9adb6);font-size:13px;margin-top:2px}\n.tr-search{pointer-events:auto;position:relative;margin-top:10px;width:min(260px,100%)}\n.tr-search input{width:100%;box-sizing:border-box;background:var(--tr-panel,#17191fe6);border:1px solid var(--tr-line,#ffffff26);\n  border-radius:8px;padding:7px 10px;outline:none}\n.tr-search input:focus{border-color:var(--tr-accent,#7bd3ff)}\n.tr-results{position:absolute;top:100%;left:0;right:0;margin-top:4px;background:var(--tr-panel,#17191ff2);border:1px solid var(--tr-line,#ffffff26);\n  border-radius:8px;overflow:hidden;display:none;max-height:50vh;overflow-y:auto}\n.tr-results button{display:flex;gap:8px;align-items:center;width:100%;text-align:left;background:none;border:0;padding:7px 10px;cursor:pointer}\n.tr-results button:hover,.tr-results button.on{background:#ffffff14}\n.tr-results small{color:var(--tr-muted,#a9adb6)}\n.tr-legend{position:absolute;right:12px;top:12px;background:var(--tr-panel,#17191fd9);border:1px solid var(--tr-line,#ffffff1f);\n  border-radius:10px;padding:8px 6px 6px}\n.tr-legend h4{margin:0 8px 4px;font-size:10.5px;letter-spacing:.09em;color:var(--tr-muted,#a9adb6);font-weight:500}\n.tr-mode{display:flex;gap:8px;align-items:center;padding:3px 8px;border-radius:6px;cursor:pointer;font-size:13px}\n.tr-mode:hover{background:#ffffff10}\n.tr-mode i{width:9px;height:9px;border-radius:50%;display:block;flex:none}.tr-mode s{display:flex;gap:2px;text-decoration:none}\n.tr-mode span{flex:1}\n.tr-mode em{font-style:normal;color:var(--tr-muted,#a9adb6);font-variant-numeric:tabular-nums;min-width:30px;text-align:right}\n.tr-mode.off{opacity:.4}.tr-mode.off i{background:transparent!important;box-shadow:inset 0 0 0 1px #fff8}\n.tr-mode-header{font-size:10px;color:#aeb6c3;text-align:right;padding:4px 8px 0}\n.tr-foot{display:contents}.tr-panel.on ~ .tr-foot .tr-legend{display:none}\n.tr-bar{position:absolute;left:0;right:0;bottom:0;padding:8px 12px 10px;display:flex;gap:10px;align-items:center;\n  background:linear-gradient(transparent,#000a 40%)}\n.tr-bar button,.tr-bar select{background:var(--tr-panel,#17191fe6);border:1px solid var(--tr-line,#ffffff26);border-radius:7px;padding:5px 9px;cursor:pointer}\n.tr-play{min-width:34px}\n.tr-spark{flex:1;height:34px;position:relative;cursor:pointer}\n.tr-spark canvas{position:absolute;inset:0;width:100%;height:100%;cursor:pointer}\n.tr-credit{position:absolute;left:12px;right:12px;bottom:52px;font-size:10.5px;color:var(--tr-muted,#a9adb6);text-align:center;\n  text-shadow:0 1px 4px #000;pointer-events:none}\n.tr-tip{position:absolute;pointer-events:none;background:var(--tr-panel,#17191ff2);border:1px solid var(--tr-line,#ffffff26);border-radius:7px;\n  padding:5px 8px;font-size:12.5px;white-space:nowrap;display:none;transform:translate(12px,-50%)}\n.tr-panel{position:absolute;right:12px;top:12px;bottom:58px;width:min(330px,calc(100% - 24px));background:var(--tr-panel,#17191ff2);\n  border:1px solid var(--tr-line,#ffffff26);border-radius:12px;display:none;flex-direction:column;overflow:hidden;\n  box-shadow:0 10px 30px #0008;user-select:text;-webkit-user-select:text}\n.tr-panel.on{display:flex}\n.tr-ph{padding:12px 14px 10px;border-bottom:1px solid var(--tr-line,#ffffff1a);position:relative}\n.tr-ph h3{margin:0;font-size:17px;line-height:1.25;padding-right:26px}\n.tr-ph p{margin:3px 0 0;color:var(--tr-muted,#a9adb6);font-size:13px}\n.tr-x{position:absolute;right:8px;top:8px;background:none;border:0;font-size:20px;line-height:1;cursor:pointer;color:var(--tr-muted,#a9adb6);padding:4px 6px}\n.tr-acts{display:flex;gap:6px;margin-top:9px;flex-wrap:wrap}\n.tr-acts button{background:#ffffff10;border:1px solid var(--tr-line,#ffffff26);border-radius:7px;padding:4px 9px;cursor:pointer;font-size:12.5px}\n.tr-acts button.on{border-color:var(--tr-accent,#7bd3ff);color:var(--tr-accent,#7bd3ff)}\n.tr-pb{overflow-y:auto;padding:6px 0 10px;flex:1}\n.tr-row{display:flex;gap:9px;align-items:center;padding:5px 14px;font-size:13px;cursor:default}\n.tr-row.click{cursor:pointer}.tr-row.click:hover{background:#ffffff0d}\n.tr-row .t{font-variant-numeric:tabular-nums;color:var(--tr-muted,#a9adb6);min-width:44px}\n.tr-row.past{opacity:.45}.tr-row.next{font-weight:600}.tr-row.next .t{color:var(--tr-text,#fff)}\n.tr-row .n{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.tr-chip{display:inline-flex;align-items:center;justify-content:center;min-width:14px;height:20px;padding:0 6px;border-radius:5px;\n  font-size:12px;font-weight:700;box-sizing:border-box;flex:none}\n.tr-sec{padding:10px 14px 3px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--tr-muted,#a9adb6)}\n.tr-note{padding:4px 14px;color:var(--tr-muted,#a9adb6);font-size:12.5px}\n.tr-zoom{position:absolute;right:12px;bottom:58px;display:flex;flex-direction:column;gap:4px}\n.tr-zoom button{width:32px;height:32px;background:var(--tr-panel,#17191fe6);border:1px solid var(--tr-line,#ffffff26);border-radius:7px;cursor:pointer;font-size:16px}\n.tr-panel.on ~ .tr-zoom{display:none}\n@container (max-width:640px){\n  .tr-panel{top:auto;bottom:52px;right:8px;left:8px;width:auto;height:46%}\n  .tr-title b{font-size:18px}.tr-clock{font-size:24px}\n  .tr-foot{display:flex;flex-direction:column;gap:6px;position:absolute;left:8px;right:8px;bottom:50px;pointer-events:none}\n  .tr-panel.on ~ .tr-foot{display:none}\n  .tr-legend,.tr-credit{position:static}.tr-legend{background:none;border:0;padding:0;pointer-events:auto}.tr-legend h4{display:none}\n  .tr-modes{display:flex;flex-wrap:wrap;gap:4px;justify-content:center}\n  .tr-mode{font-size:12px;padding:2px 8px 2px 6px;gap:5px;background:var(--tr-panel,#17191fd9);border:1px solid var(--tr-line,#ffffff1f);border-radius:999px}\n  .tr-mode em{min-width:0}.tr-credit{font-size:9.5px}.tr-zoom{display:none}\n}\n\n.tr-legend{z-index:4;padding:0;max-width:calc(100% - 24px)}\n.tr-filter-toggle,.tr-about-open{background:#171a21ed;border:1px solid #ffffff32;border-radius:9px;padding:8px 12px;cursor:pointer}\n.tr-filter-body{width:min(330px,calc(100vw - 24px));max-height:min(72vh,680px);overflow:auto;padding:10px;box-sizing:border-box}\n.tr-filter-body[hidden]{display:none}.tr-filter-body details{border-top:1px solid #ffffff1b;padding:9px 0}\n.tr-mode{width:100%;background:none;border:0;color:inherit;text-align:left}.tr-filter-body,.tr-route-list,.tr-agencies,.tr-pb,.tr-about{touch-action:pan-y;overscroll-behavior:contain}\n.tr-filter-body summary{cursor:pointer;font-weight:600}.tr-filter-body label{display:flex;align-items:center;gap:8px;padding:4px 2px}\n.tr-filter-body input[type=checkbox]{accent-color:#6bdcca}.tr-filter-body select,.tr-route-query{width:100%;background:#11151c;border:1px solid #ffffff2a;border-radius:7px;padding:7px;box-sizing:border-box}\n.tr-agencies,.tr-route-list{max-height:190px;overflow:auto;margin-top:7px}.tr-agencies label{font-size:12px}\n.tr-filter-actions{display:flex;gap:6px;margin:6px 0}.tr-filter-actions button{background:#ffffff10;border:1px solid #ffffff26;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:12px}\n.tr-route-row{display:flex;align-items:center;gap:5px}.tr-route-row button{flex:1;min-width:0;background:none;border:0;text-align:left;padding:5px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.tr-route-row[hidden]{display:none}\n.tr-route-row button:hover{background:#ffffff10}.tr-route-row input{flex:none}.tr-filter-title{font-size:11px;color:#aeb6c3;margin:9px 0 4px;text-transform:uppercase;letter-spacing:.08em}\n.tr-timeline{flex:1;min-width:0}.tr-times{display:flex;justify-content:space-between;color:#b4bdc9;font-size:10px;font-variant-numeric:tabular-nums}\n.tr-spark{height:30px;width:100%}.tr-spark input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}\n.tr-credit{bottom:73px}.tr-zoom{bottom:83px}.tr-panel{bottom:82px}\n.tr-about{color:#eef3f5;background:#171c25;border:1px solid #ffffff2b;border-radius:14px;padding:20px;max-width:min(560px,calc(100vw - 40px));max-height:80vh;overflow:auto}\n.tr-about::backdrop{background:#000a}.tr-about h2{margin:0 0 10px}.tr-about p,.tr-about li{font-size:13px;line-height:1.5;color:#c6ced7}.tr-about a{color:#80dfd0}\n.tr-about-close{float:right;background:#ffffff12;border:1px solid #ffffff26;border-radius:7px;padding:5px 9px;cursor:pointer}\n.tr-routes-at-stop{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}.tr-routes-at-stop button{border:0;background:transparent;padding:0;cursor:pointer}\n.tr-empty-area{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);padding:9px 13px;border-radius:9px;background:#10151cdd;color:#d7dee6;display:none;pointer-events:none}\n.tr-legend{width:210px;background:#17191fed;padding:8px;box-sizing:border-box}\n.tr-legend .tr-filter-toggle,.tr-legend .tr-about-open{display:block;width:100%;text-align:left}\n.tr-legend .tr-filter-toggle{margin-top:7px}.tr-legend .tr-about-open{margin-bottom:7px}\n.tr-filter-body{width:100%;padding:8px 2px 2px}.tr-credit,.tr-empty-area{display:none!important}\n.tr-language{width:100%;margin:0 0 7px;padding:5px;background:#11151c;border:1px solid #ffffff32;border-radius:7px}\n.tr-zoom-value{min-width:45px;padding:3px 2px;text-align:center;color:#fff;background:#17191fe8;border:1px solid #ffffff26;border-radius:6px;font-size:11px;font-variant-numeric:tabular-nums}\n.tr-fps{font-size:10px;color:#b4bdc9;text-align:center;background:#17191fdb;border-radius:5px}\n.tr-panel.on ~ .tr-zoom{display:grid;left:12px;right:auto}\n.tr-time-tip{position:absolute;bottom:100%;left:0;transform:translate(-50%,-4px);background:#11151cf2;border:1px solid #ffffff40;padding:3px 6px;border-radius:5px;font-size:12px;pointer-events:none;white-space:nowrap;display:none}\n.tr-mode-note{font-size:10px;color:#aeb6c3;padding:0 8px 5px;line-height:1.25}\n.tr-city-catalog-list{max-height:210px;overflow:auto}.tr-city-entry{padding:6px 2px;border-bottom:1px solid #ffffff12;font-size:12px}\n.tr-city-entry button{background:none;border:0;color:#8be4d1;cursor:pointer;padding:0;text-align:left}.tr-city-entry small{display:block;color:#aeb6c3}\n.tr-city-catalog[hidden]{display:none}.tr-city-catalog a{color:#8be4d1;font-size:11px}\n@container (max-width:640px){\n .tr-head{width:calc(100% - 130px)}.tr-foot{display:contents;position:static}.tr-legend{position:absolute;top:8px;right:8px;bottom:auto;background:#17191fed;border:1px solid #ffffff26;padding:0}\n .tr-legend h4{display:block}.tr-modes{display:block}.tr-mode{border:0;border-radius:5px;background:none}.tr-credit{position:absolute;left:8px;right:8px;bottom:74px}\n .tr-panel{bottom:80px;height:48%}.tr-zoom{display:flex;bottom:85px}.tr-filter-body{max-height:65vh}.tr-search{width:min(230px,100%)}\n .tr-bar{gap:6px;padding-left:8px;padding-right:8px}.tr-bar button,.tr-bar select{padding:5px 6px}.tr-times{font-size:9px}.tr-times .tr-half-hour{display:none}\n .tr-legend{width:178px;max-height:60vh;overflow:auto;padding:6px}.tr-head{width:calc(100% - 200px)}\n}\n\n.tr-zoom,.tr-panel.on ~ .tr-zoom{display:grid;grid-template-columns:repeat(2,48px);gap:4px}\n.tr-zoom button{width:48px;height:34px;display:grid;place-items:center}\n.tr-zoom button svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.8}\n.tr-zoom-value,.tr-fps{min-width:0;display:grid;place-items:center;box-sizing:border-box;font-variant-numeric:tabular-nums}\n.tr-speed{position:relative;flex:none}\n.tr-speed summary{list-style:none;display:flex;align-items:center;gap:8px;min-width:61px;justify-content:space-between;background:var(--tr-panel,#17191fe6);border:1px solid var(--tr-line,#ffffff26);border-radius:7px;padding:6px 10px;cursor:pointer;font-variant-numeric:tabular-nums}\n.tr-speed summary::-webkit-details-marker{display:none}\n.tr-speed summary::after{content:"";width:6px;height:6px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg) translateY(-2px);flex:none}\n.tr-speed[open] summary::after{transform:rotate(225deg) translate(-1px,-1px)}\n.tr-speed-popover{position:absolute;right:0;bottom:calc(100% + 10px);width:238px;box-sizing:border-box;padding:14px 16px 12px;background:#171b23f5;border:1px solid #ffffff35;border-radius:10px;box-shadow:0 8px 24px #0008}\n.tr-speed-popover input{width:100%;margin:3px 0 8px;accent-color:#79dccd;cursor:pointer}\n.tr-speed-marks{display:flex;justify-content:space-between;margin:0 -8px}\n.tr-speed-marks button{padding:2px!important;background:none!important;border:0!important;color:#aebac6;font-size:10px;line-height:1;min-width:0}\n@container (max-width:640px){.tr-speed-popover{width:215px}.tr-zoom,.tr-panel.on ~ .tr-zoom{grid-template-columns:repeat(2,40px)}.tr-zoom button{width:40px}}\n.tr-topbar{position:absolute;z-index:5;top:10px;left:12px;right:12px;display:flex;align-items:center;justify-content:flex-end;gap:8px;pointer-events:none}\n.tr-topbar>*{pointer-events:auto}.tr-updated{padding:5px 8px;color:#c5ced7;font-size:11px;font-variant-numeric:tabular-nums;background:#171b23db;border-radius:7px;white-space:nowrap}\n.tr-about-open{font-size:12px;padding:6px 10px;white-space:nowrap}\n.tr-language{display:flex;width:auto;margin:0;padding:2px;gap:2px;border-radius:8px}\n.tr-language button{min-width:29px;padding:4px 5px;border:0;border-radius:5px;background:transparent;color:#aeb8c4;cursor:pointer;font-size:11px;font-weight:600}\n.tr-language button[aria-pressed=true]{background:#d8f5eb;color:#142b26}\n.tr-head,.tr-legend,.tr-panel{top:56px}\n.tr-zoom,.tr-panel.on ~ .tr-zoom{grid-template-columns:repeat(2,44px)}.tr-zoom button{width:44px;height:44px}\n.tr-speed-track{position:relative;height:32px}.tr-speed-track input{position:absolute;left:0;top:0;width:100%;margin:3px 0}\n.tr-speed-dots{position:absolute;top:23px;left:8px;right:8px;display:flex;justify-content:space-between;pointer-events:none}\n.tr-speed-dots i{width:4px;height:4px;border-radius:50%;background:#adbbb7;opacity:.65}\n@container (max-width:640px){.tr-topbar{top:8px;left:8px;right:8px;gap:5px}.tr-updated{font-size:10px;padding:5px}.tr-about-open{padding:6px 7px}.tr-head,.tr-legend{top:51px}.tr-panel{top:auto}.tr-zoom,.tr-panel.on ~ .tr-zoom{grid-template-columns:repeat(2,40px)}.tr-zoom button{width:40px;height:40px}}\n.tr:focus-visible{outline:none}.tr button:focus,.tr select:focus,.tr summary:focus{outline:none}\n.tr button:focus-visible,.tr select:focus-visible,.tr summary:focus-visible{outline:2px solid #65d7c0;outline-offset:2px}\n.tr-title .tr-area{display:block;color:#d8e4e3;font-size:15px;font-weight:600;margin-top:4px}\n.tr-title .tr-subtitle{display:block;margin-top:3px}.tr-live-badge{display:block!important;color:#8ce5cb!important;font-size:10px!important;font-weight:700;letter-spacing:.07em}\n.tr-live-badge[hidden]{display:none!important}.tr-theme{display:grid;place-items:center;width:33px;height:33px;border:1px solid #ffffff32;border-radius:8px;background:#171a21ed;cursor:pointer}\n.tr-theme svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round}\n.tr-filter-toggle{display:flex!important;align-items:center;justify-content:space-between;gap:8px;padding-right:12px}\n.tr-filter-toggle::after,.tr-filter-body summary::after{content:"";width:6px;height:6px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg) translateY(-2px);flex:none}\n.tr-filter-toggle[aria-expanded=true]::after,.tr-filter-body details[open]>summary::after{transform:rotate(225deg) translate(-1px,-1px)}\n.tr-filter-body summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:8px;padding-right:9px}.tr-filter-body summary::-webkit-details-marker{display:none}\n.tr-filter-body select{appearance:none;padding-right:28px;background-image:linear-gradient(45deg,transparent 50%,#cbd5df 50%),linear-gradient(135deg,#cbd5df 50%,transparent 50%);background-position:calc(100% - 15px) 50%,calc(100% - 10px) 50%;background-size:5px 5px;background-repeat:no-repeat}\n.tr-live-toggle{width:100%;margin:6px 0 9px;padding:8px;background:#ffffff0d;border:1px solid #ffffff30;border-radius:7px;text-align:left;cursor:pointer}\n.tr-live-toggle[aria-pressed=true]{border-color:#70dec3;color:#a2f3dd}\n.tr-bar{background:#171b23;border-top:1px solid #ffffff2b;box-shadow:0 -8px 25px #0003;z-index:3}\n.tr-scrub-head{position:absolute;top:-3px;left:0;width:10px;height:10px;border-radius:50%;background:#7bd3ff;box-shadow:0 0 0 2px #171b23;transform:translateX(-50%);pointer-events:none}\n.tr-speed summary{min-width:0;gap:7px;padding:6px 8px;justify-content:flex-start}\n.tr-light{--tr-bg:#f2f4f5;--tr-panel:#fafbfc;--tr-text:#1c2935;--tr-muted:#536474;--tr-line:#b6c2cd;--tr-accent:#245ea4;background:#f2f4f5;color:#1c2935}\n.tr-light .tr-title .tr-area{color:#34495d}\n.tr-light .tr-legend,.tr-light .tr-bar,.tr-light .tr-speed-popover,.tr-light .tr-theme,.tr-light .tr-filter-toggle,.tr-light .tr-about-open,.tr-light .tr-about{background:#fafbfc;color:#1c2935;border-color:#b6c2cd}\n.tr-light .tr-filter-body select,.tr-light .tr-route-query,.tr-light .tr-language{background-color:#edf1f5;color:#1c2935;border-color:#b6c2cd}\n.tr-light .tr-language button{color:#536474}.tr-light .tr-language button[aria-pressed=true]{background:#275e98;color:white}\n.tr-light .tr-about p,.tr-light .tr-about li,.tr-light .tr-mode-header,.tr-light .tr-mode-note,.tr-light .tr-times,.tr-light .tr-speed-marks button{color:#536474}\n.tr-light .tr-about a,.tr-light .tr-city-entry button,.tr-light .tr-city-catalog a{color:#255f9b}.tr-light .tr-live-toggle{background:#edf1f5;color:#1c2935;border-color:#b6c2cd}\n.tr-light .tr-zoom-value,.tr-light .tr-fps{background:#fafbfc;color:#1c2935;border-color:#b6c2cd}.tr-light .tr-scrub-head{background:#245ea4;box-shadow:0 0 0 2px #fafbfc}\n.tr-head{top:10px;width:min(300px,calc(100% - 28px));box-sizing:border-box;padding:12px;background:#17191f;border:1px solid #ffffff26;border-radius:10px;pointer-events:auto}\n.tr.tiles .tr-head::before{display:none}.tr-title,.tr-light .tr-title{text-shadow:none}.tr-title b{font-size:30px;letter-spacing:-.025em}\n.tr-title .tr-area{margin-top:5px}.tr-search{width:100%}.tr-search input{background:#11151c}\n.tr-light .tr-head{background:#fafbfc;border-color:#b6c2cd}.tr-light .tr-search input{background:#edf1f5;color:#1c2935;border-color:#b6c2cd}\n.tr-language,.tr-theme,.tr-about-open{box-sizing:border-box;height:40px}.tr-language{align-items:stretch}.tr-language button{min-width:31px;padding:0 6px}.tr-theme{width:40px}.tr-about-open{display:flex;align-items:center}\n.tr button:focus,.tr select:focus,.tr summary:focus{outline:none;box-shadow:none}\n.tr button:focus-visible,.tr select:focus-visible,.tr summary:focus-visible{outline:none;box-shadow:inset 0 -2px 0 currentColor}\n.tr-search input:focus,.tr-route-query:focus{outline:none;border-color:#e5efed;box-shadow:0 0 0 1px #e5efed}\n.tr-light .tr-search input:focus,.tr-light .tr-route-query:focus{border-color:#40586f;box-shadow:0 0 0 1px #40586f}\n.tr-about-close,.tr-live-close{background:#32443d;color:#f4faf7;border:1px solid #70877d;border-radius:7px;padding:7px 12px;cursor:pointer}\n.tr-live-dialog .tr-live-close{margin-top:7px;font-weight:600}.tr-light .tr-about-close,.tr-light .tr-live-close{background:#e2eaf1;color:#223e5b;border-color:#a3b4c4}\n.tr-light .tr-live-badge{color:#285c96!important}.tr-light .tr-mode.off i{box-shadow:inset 0 0 0 1px #607080}\n.tr-light .tr-route-row button:hover,.tr-light .tr-mode:hover,.tr-light .tr-row.click:hover,.tr-light .tr-results button:hover,.tr-light .tr-results button.on{background:#1c3d6017}\n.tr-light .tr-filter-body details,.tr-light .tr-city-entry,.tr-light .tr-ph{border-color:#aab8c5}.tr-light .tr-city-entry small{color:#536474}\n.tr-light .tr-acts button,.tr-light .tr-filter-actions button{background:#e9eef3;color:#263f57;border-color:#b6c2cd}\n.tr-light .tr-time-tip{background:#fafbfc;color:#1c2935;border-color:#b6c2cd}.tr-light .tr-speed-dots i{background:#65798b}\n.tr-light .tr-filter-body input[type=checkbox],.tr-light .tr-speed-popover input{accent-color:#326daf}\n.tr-light .tr-filter-body select{background-image:linear-gradient(45deg,transparent 50%,#526b82 50%),linear-gradient(135deg,#526b82 50%,transparent 50%)}\n.tr-light input::placeholder{color:#536474;opacity:1}\n.tr-bar{padding-bottom:max(10px,env(safe-area-inset-bottom))}\n.tr-zoom{bottom:calc(83px + env(safe-area-inset-bottom,0px))}.tr-panel{bottom:calc(82px + env(safe-area-inset-bottom,0px))}\n.tr-about{box-sizing:border-box;max-width:min(560px,calc(100% - 32px));max-height:min(80vh,calc(100dvh - 32px))}\n@container (max-width:640px){\n .tr-head{left:8px;top:8px;width:calc(100% - 195px);padding:9px}.tr-title b{font-size:25px}.tr-title .tr-area{font-size:13px;margin-top:22px}\n .tr-title .tr-subtitle{font-size:11px;line-height:1.25}.tr-clock{font-size:23px}.tr-count{font-size:11px;line-height:1.3}.tr-search{margin-top:7px}\n .tr-legend{top:58px;width:172px}.tr-filter-body{max-height:min(62vh,500px)}.tr-bar{padding-bottom:max(8px,env(safe-area-inset-bottom))}\n .tr-zoom{bottom:calc(85px + env(safe-area-inset-bottom,0px))}.tr-panel{bottom:calc(80px + env(safe-area-inset-bottom,0px))}\n .tr-language,.tr-theme,.tr-about-open{height:42px}.tr-theme{width:42px}.tr-language button{min-width:30px}\n}\n@container (max-width:400px){.tr-head{width:calc(100% - 176px)}.tr-legend{width:154px}.tr-mode{font-size:11px;padding:3px 5px;gap:4px}.tr-mode-note{font-size:9px}.tr-title b{font-size:23px}}\n@container (max-width:480px){.tr-about-open{width:42px;padding:0;justify-content:center;font-size:0}.tr-about-open::after{content:"i";display:grid;place-items:center;width:16px;height:16px;border:1px solid currentColor;border-radius:50%;font:600 12px/1 system-ui,sans-serif}}\n.tr-mobile-filter,.tr-drawer-backdrop,.tr-drawer-header{display:none}\n.tr-mobile .tr-mobile-filter{display:grid;place-items:center;flex:none;width:42px;height:42px;padding:0;background:#171a21;border:1px solid #ffffff32;border-radius:8px;cursor:pointer}\n.tr-mobile-filter svg,.tr-drawer-close svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}\n.tr-light.tr-mobile .tr-mobile-filter{background:#fafbfc;color:#1c2935;border-color:#b6c2cd}\n.tr-mobile .tr-topbar{left:8px;right:8px;gap:5px}.tr-mobile .tr-language button{min-width:26px;padding:0 3px}\n.tr-mobile .tr-head{top:8px;left:8px;width:min(190px,calc(100% - 16px));padding:9px}.tr-mobile .tr-title b{font-size:22px}.tr-mobile .tr-title .tr-area{margin-top:22px}\n.tr-mobile .tr-search{width:100%}.tr-mobile .tr-search input,.tr-mobile .tr-route-query,.tr-mobile .tr-city{font-size:16px}\n.tr-mobile .tr-drawer-backdrop:not([hidden]){display:block;position:absolute;inset:0;z-index:8;padding:0;border:0;background:#0009;cursor:pointer}\n.tr-mobile .tr-panel.on ~ .tr-foot{display:contents}.tr-mobile .tr-panel.on ~ .tr-foot .tr-legend{display:block}\n.tr-mobile .tr-legend{position:absolute;top:0;right:0;bottom:0;left:auto;z-index:9;width:min(360px,calc(100% - 24px));max-width:none;max-height:none;height:100%;padding:12px 14px calc(16px + env(safe-area-inset-bottom,0px));overflow-y:auto;overscroll-behavior:contain;touch-action:pan-y;border-radius:0;background:#17191f;transform:translateX(105%);visibility:hidden;transition:transform .22s ease-out,visibility 0s linear .22s}\n.tr-mobile.tr-drawer-open .tr-legend{transform:translateX(0);visibility:visible;transition:transform .22s ease-out}\n.tr-light.tr-mobile .tr-legend{background:#fafbfc}\n.tr-mobile .tr-drawer-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;padding:0 0 8px 3px;border-bottom:1px solid #ffffff26;font-size:17px}\n.tr-light.tr-mobile .tr-drawer-header{border-color:#b6c2cd}.tr-drawer-close{display:grid;place-items:center;width:44px;height:44px;background:none;border:0;border-radius:6px;cursor:pointer}\n.tr-mobile .tr-mode{min-height:44px;padding:7px 8px;font-size:14px}.tr-mobile .tr-mode-note{font-size:11px;padding:2px 8px 5px}\n.tr-mobile .tr-filter-toggle,.tr-mobile .tr-filter-body summary{min-height:44px}.tr-mobile .tr-filter-body{max-height:none;overflow:visible}\n.tr-mobile .tr-filter-body label{min-height:40px}.tr-mobile .tr-filter-body select{min-width:0;flex:1}.tr-mobile .tr-route-list,.tr-mobile .tr-agencies{max-height:35vh}\n.tr-mobile .tr-zoom,.tr-mobile .tr-panel.on ~ .tr-zoom{grid-template-columns:repeat(2,44px)}.tr-mobile .tr-zoom button{width:44px;height:44px}\n.tr-mobile .tr-play{min-width:44px;min-height:44px}.tr-mobile .tr-speed summary{min-height:44px;box-sizing:border-box}.tr-mobile .tr-spark{height:34px}\n.tr-mobile .tr-topbar{left:auto;right:8px;display:grid;grid-template-columns:repeat(3,42px);grid-auto-rows:42px;gap:4px}\n.tr-mobile .tr-language{grid-column:1 / -1;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));width:100%;height:42px;gap:0;padding:2px;box-sizing:border-box}\n.tr-mobile .tr-language button{width:100%;min-width:0;padding:0}.tr-mobile .tr-theme,.tr-mobile .tr-about-open,.tr-mobile .tr-mobile-filter{width:42px;height:42px}\n.tr-mobile .tr-about-open{padding:0;justify-content:center;font-size:0}.tr-mobile .tr-about-open::after{content:"i";display:grid;place-items:center;width:16px;height:16px;border:1px solid currentColor;border-radius:50%;font:600 12px/1 system-ui,sans-serif}\n.tr-mobile .tr-head{width:min(200px,calc(100% - 166px))}.tr-mobile .tr-title .tr-area{margin-top:5px}.tr-mobile .tr-search input::placeholder{font-size:11px}\n.tr-speed-preview{display:block;text-align:center;font-size:13px;line-height:1.2;font-variant-numeric:tabular-nums;margin-bottom:4px}\n.tr-speed-track{position:relative;height:42px}.tr-speed-track input{appearance:none;-webkit-appearance:none;box-sizing:border-box;position:absolute;top:0;left:0;width:100%;height:32px;margin:0;padding:0;border:0;background:transparent;cursor:pointer}\n.tr-speed-track input::-webkit-slider-runnable-track{height:4px;border-radius:4px;background:#87949f}\n.tr-speed-track input::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;box-sizing:border-box;width:18px;height:18px;margin-top:-7px;border:1px solid #30434f;border-radius:50%;background:#bde6db}\n.tr-speed-track input::-moz-range-track{height:4px;border-radius:4px;background:#87949f}\n.tr-speed-track input::-moz-range-thumb{box-sizing:border-box;width:18px;height:18px;border:1px solid #30434f;border-radius:50%;background:#bde6db}\n.tr-speed-dots{top:34px;left:7px;right:7px}.tr-speed-marks{display:block;position:relative;height:17px;margin:0 9px}\n.tr-speed-marks button{position:absolute;top:0;transform:translateX(-50%)}\n.tr-speed-marks button:nth-child(1){left:0%}.tr-speed-marks button:nth-child(2){left:25%}.tr-speed-marks button:nth-child(3){left:50%}.tr-speed-marks button:nth-child(4){left:75%}.tr-speed-marks button:nth-child(5){left:100%}\n.tr-light .tr-speed-track input::-webkit-slider-thumb{background:#396fa9;border-color:#244b70}.tr-light .tr-speed-track input::-moz-range-thumb{background:#396fa9;border-color:#244b70}\n@media (prefers-reduced-motion:reduce){.tr-mobile .tr-legend,.tr-mobile.tr-drawer-open .tr-legend{transition:none}}\n`;

const MODES = {
    0: "Трамвай",
    1: "Метро",
    2: "Поезда",
    3: "Автобусы",
    4: "Паром",
    5: "Канатный трамвай",
    6: "Канатная дорога",
    7: "Фуникулёр",
    11: "Троллейбус",
    12: "Монорельс",
    700: "Междугородние",
    900: "Электрички"
};

const AZ = {
    "Фуникулёр": "Funikulyor",
    "Автобусы": "Avtobuslar",
    "Метро": "Metro",
    "Поезда": "Qatarlar",
    "Электрички": "Şəhərətrafı qatarlar",
    "Междугородние": "Şəhərlərarası",
    "Другой транспорт": "Digər nəqliyyat",
    "Региональные · условия конкурса AYNA": "Regionlar · AYNA müsabiqə şərtləri",
    "междугородние": "şəhərlərarası",
    "Включить или скрыть": "Göstər və ya gizlət",
    "Другие перевозчики": "Digər daşıyıcılar",
    "Рейс ещё не начался": "Reys hələ başlamayıb",
    "Рейс завершён": "Reys başa çatıb",
    "Далее:": "Növbəti:",
    "Прибытие": "Çatır",
    "Остановки не подтверждены": "Dayanacaqlar təsdiqlənməyib",
    "Положение и время в пути рассчитаны по модели.": "Mövqe və yol vaxtı model əsasında hesablanıb.",
    "приблизительная точка": "təxmini məntəqə",
    "Центральный вокзал Тбилиси": "Tbilisi Mərkəzi vağzalı",
    "Гардабани": "Qardabani",
    "Следовать": "İzlə",
    "Весь маршрут": "Bütün marşrut",
    "Остановки рейса": "Reysin dayanacaqları",
    " в ": " saat ",
    "Время и положение рассчитаны по модели интервалов; это не фактический рейс.": "Vaxt və mövqe intervallar əsasında modelləşdirilib; bu, faktiki reys deyil.",
    "в кадре": "ekranda",
    "расчётных рейсов за сутки": "gün ərzində modelləşdirilmiş reys",
    "Рейсы по направлениям": "İstiqamətlər üzrə reyslər",
    "Направление не указано": "İstiqamət göstərilməyib",
    "Транспорт в кадре": "Ekrandakı nəqliyyat",
    "Маршруты через остановку": "Dayanacaqdan keçən marşrutlar",
    "В этом кадре транспорта нет.": "Bu görüntüdə nəqliyyat yoxdur.",
    "Расчётные отправления": "Təxmini gedişlər",
    "В этом часе отправлений нет.": "Bu saat ərzində gediş yoxdur.",
    "В кадре сейчас": "Hazırda ekranda",
    "в модели сейчас": "hazırda modeldə",
    "за сутки": "gün ərzində",
    "Показать маршрут": "Marşrutu göstər",
    "Открыть маршрут": "Marşrutu aç",
    "Маршрут или остановка": "Marşrut və ya dayanacaq",
    "Показать все": "Hamısını göstər",
    "Снять все": "Hamısını söndür",
    "Номер или название": "Nömrə və ya ad",
    "О карте и данных": "Xəritə və məlumatlar",
    "О карте": "Xəritə haqqında",
    "Закрыть": "Bağla",
    "Область": "Ərazi",
    "Перевозчики": "Daşıyıcılar",
    "Маршруты": "Marşrutlar",
    "Дополнительно ▾": "Əlavə ▾",
    "Общественный наземный транспорт · сводная модель суток": "Yerüstü ictimai nəqliyyat · ümumiləşdirilmiş gün modeli",
    "Фуникулёр: 10:00–13:00, 14:00–20:00": "Funikulyor: 10:00–13:00, 14:00–20:00",
    "Межгород: трассы и время пути приблизительные": "Şəhərlərarası: yollar və səfər vaxtı təxminidir",
    "Масштаб относительно начального вида": "İlkin görünüşə nisbətən miqyas",
    "Передвиньте время": "Vaxtı dəyişin",
    "Время суток": "Günün vaxtı",
    "Воспроизвести или остановить": "Başlat və ya dayandır",
    "Скорость": "Sürət",
    "Количество в кадре; нажмите, чтобы включить или скрыть": "Ekrandakı say; göstərmək və ya gizlətmək üçün basın",
    "Схемы маршрутов AYNA": "AYNA marşrut sxemləri",
    "Исследование и GTFS-модель Ismat Samadov": "İsmət Səmədovun araşdırması və GTFS modeli",
    "Данные OpenStreetMap": "OpenStreetMap məlumatları",
    "Подложка OpenFreeMap": "OpenFreeMap xəritə əsası",
    "Картографические тайлы OpenMapTiles": "OpenMapTiles xəritə məlumatları",
    "Схема и интервалы метро": "Metro sxemi və intervalları",
    "Об интервалах метро, 6 ноября 2026": "Metro intervalları, 6 noyabr 2026",
    "Планы развития метро": "Metronun inkişaf planı",
    "Граница Азербайджана · OpenStreetMap": "Azərbaycanın dövlət sərhədi · OpenStreetMap",
    "Часы фуникулёра": "Funikulyorun iş saatları",
    "Плеер transit-reels": "transit-reels pleyeri",
    "Гянджа: маршрут 4, схема AYNA": "Gəncə: 4 nömrəli marşrut, AYNA sxemi",
    "Гянджа: маршрут 4, геометрия и остановки OSM": "Gəncə: 4 nömrəli marşrut və dayanacaqlar, OSM",
    "Гянджа: схемы и остановки CityCard": "Gəncə: CityCard marşrut və dayanacaq sxemləri",
    "Нахичевань: маршрут 3, описание направлений": "Naxçıvan: 3 nömrəli marşrutun təsviri",
    "Нахичевань: маршрут 3, геометрия и остановки OSM": "Naxçıvan: 3 nömrəli marşrut və dayanacaqlar, OSM",
    "нет данных": "məlumat yoxdur",
    "частично": "qismən",
    "1 направление": "1 istiqamət",
    "1 маршрут": "1 marşrut",
    "2 маршрута": "2 marşrut",
    "22 маршрута": "22 marşrut",
    "межгород": "şəhərlərarası",
    "список без схем": "sxemsiz siyahı",
    "Весь Азербайджан": "Bütün Azərbaycan",
    "Маршруты города": "Şəhər marşrutları",
    "схема не найдена": "sxem tapılmadı",
    "конкурс 2026; схема не найдена": "2026-cı il müsabiqəsi; sxem tapılmadı",
    "архивная схема; трасса не оцифрована": "arxiv sxemi; xətt rəqəmsallaşdırılmayıb",
    "Исследовательская схема 2024 года": "2024-cü il tədqiqat sxemi",
    "на карте": "xəritədə",
    "Гянджа": "Gəncə",
    "Сумгаит": "Sumqayıt",
    "Шеки": "Şəki",
    "Ленкорань": "Lənkəran",
    "Нахичевань": "Naxçıvan",
    "Ханкенди": "Xankəndi",
    "Баку": "Bakı",
    "Зелёная линия": "Yaşıl xətt",
    "Красная линия": "Qırmızı xətt",
    "Фиолетовая линия": "Bənövşəyi xətt",
    "Ветка Бакмил": "Bakmil qolu",
    "Джафар Джаббарлы - Хатаи": "Cəfər Cabbarlı - Xətai",
    "Бакинский фуникулёр": "Bakı funikulyoru"
};

const EN = {
    "Фуникулёр": "Funicular",
    "Автобусы": "Buses",
    "Метро": "Metro",
    "Поезда": "Trains",
    "Электрички": "Commuter trains",
    "Междугородние": "Intercity",
    "Другой транспорт": "Other transport",
    "Региональные · условия конкурса AYNA": "Regional · AYNA tender conditions",
    "междугородние": "intercity",
    "Другие перевозчики": "Other operators",
    "Рейс ещё не начался": "Trip has not started",
    "Рейс завершён": "Trip has ended",
    "Далее:": "Next:",
    "Прибытие": "Arrival",
    "Остановки не подтверждены": "Stops are unconfirmed",
    "Положение и время в пути рассчитаны по модели.": "Position and travel time are modelled.",
    "приблизительная точка": "approximate location",
    "Центральный вокзал Тбилиси": "Tbilisi Central Station",
    "Гардабани": "Gardabani",
    "Следовать": "Follow",
    "Весь маршрут": "Full route",
    "Остановки рейса": "Stops on this trip",
    " в ": " at ",
    "Время и положение рассчитаны по модели интервалов; это не фактический рейс.": "Time and position are modelled from headways; this is not a live trip.",
    "в кадре": "in view",
    "расчётных рейсов за сутки": "modelled trips per day",
    "Рейсы по направлениям": "Trips by direction",
    "Направление не указано": "Direction unavailable",
    "Транспорт в кадре": "Vehicles in view",
    "Маршруты через остановку": "Routes at this stop",
    "В этом кадре транспорта нет.": "No vehicles in view.",
    "Расчётные отправления": "Estimated departures",
    "В этом часе отправлений нет.": "No departures in this hour.",
    "В кадре сейчас": "In view now",
    "в модели сейчас": "in the model now",
    "за сутки": "per day",
    "Показать маршрут": "Show route",
    "Открыть маршрут": "Open route",
    "Маршрут или остановка": "Route or stop",
    "Показать все": "Show all",
    "Снять все": "Clear all",
    "Номер или название": "Number or name",
    "О карте и данных": "About the map",
    "О карте": "About",
    "Закрыть": "Close",
    "Область": "Area",
    "Перевозчики": "Operators",
    "Маршруты": "Routes",
    "Дополнительно ▾": "More ▾",
    "Общественный наземный транспорт · сводная модель суток": "Public surface transport · modelled day",
    "Фуникулёр: 10:00–13:00, 14:00–20:00": "Funicular: 10:00–13:00, 14:00–20:00",
    "Межгород: трассы и время пути приблизительные": "Intercity: paths and travel times are approximate",
    "Масштаб относительно начального вида": "Zoom relative to the opening view",
    "Передвиньте время": "Change time",
    "Время суток": "Time of day",
    "Воспроизвести или остановить": "Play or pause",
    "Скорость": "Speed",
    "нет данных": "no route data",
    "частично": "partial",
    "1 направление": "1 direction",
    "1 маршрут": "1 route",
    "2 маршрута": "2 routes",
    "22 маршрута": "22 routes",
    "межгород": "intercity",
    "список без схем": "route list only",
    "Весь Азербайджан": "All Azerbaijan",
    "Маршруты города": "City routes",
    "схема не найдена": "route geometry unavailable",
    "конкурс 2026; схема не найдена": "2026 tender; route geometry unavailable",
    "архивная схема; трасса не оцифрована": "historic map; geometry not digitised",
    "Исследовательская схема 2024 года": "2024 research map",
    "на карте": "on map",
    "Гянджа": "Ganja",
    "Сумгаит": "Sumqayit",
    "Шеки": "Sheki",
    "Ленкорань": "Lankaran",
    "Нахичевань": "Nakhchivan",
    "Ханкенди": "Khankendi",
    "Баку": "Baku",
    "Зелёная линия": "Green line",
    "Красная линия": "Red line",
    "Фиолетовая линия": "Purple line",
    "Ветка Бакмил": "Bakmil branch",
    "Джафар Джаббарлы - Хатаи": "Jafar Jabbarly - Khatai",
    "Бакинский фуникулёр": "Baku funicular"
};

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
}[c]));

const hhmm = s => {
    s = Math.floor(s) % 86400;
    if (s < 0) s += 86400;
    return String(Math.floor(s / 3600)).padStart(2, "0") + ":" + String(Math.floor(s % 3600 / 60)).padStart(2, "0");
};

export function choosePixelRatio(deviceRatio, width, height, deviceMemory) {
    const native = Number.isFinite(deviceRatio) && deviceRatio > 0 ? deviceRatio : 1;
    const budget = deviceMemory > 0 && deviceMemory <= 2 ? 14e5 : 18e5;
    const area = Math.max(1, width * height);
    return Math.max(1, Math.min(native, 2, Math.sqrt(budget / area)));
}

const mix = (a, b, f) => "#" + [ 0, 2, 4 ].map(i => Math.round(parseInt(a.substr(1 + i, 2), 16) * (1 - f) + parseInt(b.substr(1 + i, 2), 16) * f).toString(16).padStart(2, "0")).join("");

const lum = hex => {
    const n = parseInt(hex.slice(1), 16);
    return (.299 * (n >> 16) + .587 * (n >> 8 & 255) + .114 * (n & 255)) / 255;
};

const relativeLuminance = color => [ 1, 3, 5 ].map(i => parseInt(color.slice(i, i + 2), 16) / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4).reduce((sum, c, i) => sum + c * [ .2126, .7152, .0722 ][i], 0);

export function colorForLightMap(color) {
    if (!/^#[0-9a-f]{6}$/i.test(color || "")) return color;
    const background = relativeLuminance("#dce8ef"), channels = [ 1, 3, 5 ].map(i => parseInt(color.slice(i, i + 2), 16) / 255);
    const max = Math.max(...channels), min = Math.min(...channels), chroma = max - min, sourceSaturation = max ? chroma / max : 0;
    const saturation = sourceSaturation < .08 ? sourceSaturation : Math.min(.9, Math.max(.68, sourceSaturation));
    for (let step = 0; step <= 25; step++) {
        const value = max * (1 - step * .035);
        const result = "#" + channels.map(c => {
            const normalized = chroma ? (c - min) / chroma : 0;
            return Math.round(255 * value * (1 - saturation + saturation * normalized)).toString(16).padStart(2, "0");
        }).join("");
        if ((background + .05) / (relativeLuminance(result) + .05) >= 3.1) return result;
    }
    return "#222222";
}

export function constrainCameraOffset(offset, start, end, scale, size) {
    const lower = size - end * scale, upper = -start * scale;
    return lower <= upper ? Math.max(lower, Math.min(upper, offset)) : (lower + upper) / 2;
}

export async function mount(el, data, opts = {}) {
    if (typeof data === "string") data = await (await fetch(data)).json();
    const D = data;
    if (!document.getElementById("tr-css")) {
        const st = document.createElement("style");
        st.id = "tr-css";
        st.textContent = CSS;
        document.head.appendChild(st);
    }
    const schedule = buildSchedule(D), {span: span, routes: routes, stops: stops, trips: trips} = schedule;
    let language = [ "az", "ru", "en" ].includes(opts.language) ? opts.language : "ru";
    const dictionaries = {
        az: Object.entries(AZ).sort((a, b) => b[0].length - a[0].length),
        en: Object.entries(EN).sort((a, b) => b[0].length - a[0].length)
    };
    const localize = value => language === "ru" ? String(value) : dictionaries[language].reduce((s, [ru, translated]) => s.split(ru).join(translated), String(value));
    const langText = (ru, az, en) => language === "az" ? az : language === "en" ? en : ru;
    const label = r => r.short || r.long || MODES[r.type] || "";
    const chip = r => {
        const c = r.line || "#3a3f49";
        const t = r.short || (r.long || "").replace(/\s+(Line|Linie|Ligne|Línea|Linha)$/i, "").split(/\s+/).slice(0, 2).join(" ");
        return `<span class="tr-chip" style="background:${c};color:${lum(c) > .6 ? "#111" : "#fff"}">${esc(t)}</span>`;
    };
    const hchip = r => r.short ? chip(r) : `<span class="tr-chip" style="background:${r.line || "#3a3f49"};min-width:6px;padding:0 3px"></span>`;
    const where = r => [ r.short && r.long ? r.long : "", MODES[r.type], r.agency ].filter(Boolean).join(" · ");
    el.classList.add("tr");
    el.tabIndex = 0;
    const w = D.words;
    const otherCities = (D.intercity_places || []).filter(p => p.coverage === "intercity" && ![ "Bakı", "Sumqayıt", "Gəncə", "Şəki", "Lənkəran", "Naxçıvan", "Xankəndi" ].includes(p.az));
    const otherCityById = new Map(otherCities.map(p => [ p.id, p ]));
    const extraCities = otherCities.map(p => `<option value="${esc(p.id)}">${esc(p.ru)} · ${p.coverage === "place" ? "нет данных" : "межгород"}</option>`).join("");
    el.innerHTML = `<div class="tr-map"></div><canvas></canvas>\n    <div class="tr-topbar"><div class="tr-language" role="group" aria-label="Language"><button data-lang="az" aria-label="Azərbaycanca" aria-pressed="false">AZ</button><button data-lang="ru" aria-label="Русский" aria-pressed="false">RU</button><button data-lang="en" aria-label="English" aria-pressed="false">EN</button></div><button class="tr-theme" aria-label="Сменить тему" title="Сменить тему"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg></button><button class="tr-about-open">О карте</button><button class="tr-mobile-filter" aria-label="Фильтры" title="Фильтры" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg></button></div>\n    <div class="tr-head"><div class="tr-title"><b>Yolda</b><span class="tr-area">Баку</span><span class="tr-subtitle">${esc(w.subtitle)}</span>\n      <div class="tr-clock" style="margin-top:8px"></div><span class="tr-live-badge" hidden></span><div class="tr-count"></div></div>\n      <div class="tr-search"><input placeholder="Маршрут или остановка" aria-label="Поиск маршрута или остановки"><div class="tr-results"></div></div></div>\n    <div class="tr-tip"></div><div class="tr-hint"></div>\n    <div class="tr-panel"></div><button class="tr-drawer-backdrop" aria-label="Закрыть фильтры" hidden tabindex="-1"></button>\n    <div class="tr-foot"><div class="tr-legend">\n      <div class="tr-drawer-header"><strong>Фильтры</strong><button class="tr-drawer-close" aria-label="Закрыть фильтры"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>\n      <div class="tr-mode-header">Сейчас в кадре:</div><div class="tr-modes"></div>\n      <div class="tr-mode-note">Фуникулёр: 10:00–13:00, 14:00–20:00</div>\n      <div class="tr-mode-note tr-intercity-note">Межгород: трассы и время пути приблизительные</div>\n      <button class="tr-filter-toggle" aria-expanded="false">Дополнительно</button><div class="tr-filter-body" hidden>\n      <button class="tr-live-toggle" aria-pressed="false">Симуляция текущего времени</button>\n      <label><span class="tr-city-label">Область</span><select class="tr-city" aria-label="Область карты"><option value="map" hidden>На карте</option><option value="baku">Баку</option><option value="sumqayit">Сумгаит · частично</option><option value="ganja">Гянджа · 22 маршрута</option><option value="sheki">Шеки · межгород</option><option value="lankaran">Ленкорань · межгород</option><option value="nakhchivan">Нахичевань · 2 маршрута</option>${extraCities}<option value="country">Весь Азербайджан</option></select></label>\n      <details class="tr-city-catalog" hidden><summary>Маршруты города</summary><div class="tr-city-catalog-list"></div></details>\n      <details class="tr-agency-details"><summary>Перевозчики</summary><div class="tr-agencies"></div></details>\n      <details class="tr-route-details"><summary>Маршруты</summary><div class="tr-filter-actions"><button data-routes="all">Показать все</button><button data-routes="none">Снять все</button></div><input class="tr-route-query" placeholder="Номер или название" aria-label="Поиск в списке маршрутов"><div class="tr-route-list"></div></details>\n      </div></div><div class="tr-credit"></div></div>\n    <div class="tr-zoom"><span class="tr-zoom-value" title="Масштаб относительно начального вида">100%</span><span class="tr-fps" title="Кадры анимации в секунду">— FPS</span>\n      <button data-z="1.6" aria-label="Приблизить" title="Приблизить">+</button><button data-z="0" aria-label="Начальный вид Баку" title="Начальный вид Баку"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5M5.5 10v10h13V10M10 20v-6h4v6"/></svg></button>\n      <button data-z="0.625" aria-label="Отдалить" title="Отдалить">−</button><button data-fullscreen aria-label="На весь экран" title="На весь экран" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5m6 0h5v5M20 15v5h-5M9 20H4v-5"/></svg></button></div>\n    <div class="tr-bar"><button class="tr-play" aria-label="Воспроизвести или остановить">❚❚</button>\n      <div class="tr-timeline"><div class="tr-times"><span>00:00</span><span class="tr-half-hour">03:00</span><span>06:00</span><span class="tr-half-hour">09:00</span><span>12:00</span><span class="tr-half-hour">15:00</span><span>18:00</span><span class="tr-half-hour">21:00</span><span>24:00</span></div>\n      <div class="tr-spark" title="Передвиньте время"><canvas></canvas><span class="tr-scrub-head"></span><span class="tr-time-tip"></span><input class="tr-range" type="range" min="0" max="86400" step="1" value="0" aria-label="Время суток"></div></div>\n      <details class="tr-speed"><summary aria-label="Скорость воспроизведения"><span class="tr-speed-value">1×</span></summary><div class="tr-speed-popover"><output class="tr-speed-preview">1×</output><div class="tr-speed-track"><input class="tr-speed-range" type="range" min="0" max="400" step="1" value="200" aria-label="Скорость воспроизведения" aria-valuetext="1×"><div class="tr-speed-dots" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div></div><div class="tr-speed-marks"><button data-speed="0">0.25×</button><button data-speed="100">0.5×</button><button data-speed="200">1×</button><button data-speed="300">2×</button><button data-speed="400">4×</button></div></div></details></div>\n    <dialog class="tr-about"><button class="tr-about-close">Закрыть</button><h2>О карте</h2><div class="tr-about-content"></div></dialog><dialog class="tr-about tr-live-dialog"><h2></h2><p></p><button class="tr-live-close"></button></dialog>`;
    const $ = s => el.querySelector(s);
    const cv = $("canvas"), cx = cv.getContext("2d");
    const spark = $(".tr-spark canvas"), sx = spark.getContext("2d");
    const panel = $(".tr-panel"), tip = $(".tr-tip"), input = $(".tr-search input"), results = $(".tr-results");
    const mapDiv = $(".tr-map");
    let map = null;
    let displayRatio = 1;
    const pixelRatio = () => displayRatio;
    let t = opts.t ?? 8 * 3600, playing = opts.autoplay ?? true, speed = 1, last = performance.now(), raf = 0, alive = true, live = false;
    let light = false, areaName = null, applyArea = () => {}, observeArea = () => {}, applyLanguage = () => {}, areaTimer = 0, liveTimer = 0;
    let peakPending = opts.t == null, peakWorker = null, peakFrame = 0, peakResult = null;
    function cancelPeak() {
        peakPending = false;
        peakWorker?.terminate();
        peakWorker = null;
        if (peakFrame) cancelAnimationFrame(peakFrame);
        peakFrame = 0;
    }
    let onScreen = true;
    const scheduleDraw = () => {
        if (alive && onScreen && !document.hidden && !raf) raf = requestAnimationFrame(draw);
    };
    let mobile = false, drawerOpen = false, openedMobileFilters = false;
    function setDrawer(value, restoreFocus = true) {
        const open = mobile && !!value, legend = $(".tr-legend"), trigger = $(".tr-mobile-filter"), backdrop = $(".tr-drawer-backdrop");
        if (drawerOpen && !open && restoreFocus && mobile) trigger.focus({
            preventScroll: true
        });
        drawerOpen = open;
        el.classList.toggle("tr-drawer-open", open);
        backdrop.hidden = !open;
        trigger.setAttribute("aria-expanded", String(open));
        legend.inert = mobile && !open;
        if (mobile) {
            legend.setAttribute("role", "dialog");
            legend.setAttribute("aria-modal", "true");
            legend.setAttribute("aria-label", langText("Фильтры", "Filtrlər", "Filters"));
            legend.setAttribute("aria-hidden", String(!open));
        } else {
            for (const attribute of [ "role", "aria-modal", "aria-label", "aria-hidden" ]) legend.removeAttribute(attribute);
        }
        if (open) {
            if (!openedMobileFilters) {
                openedMobileFilters = true;
                $(".tr-filter-body").hidden = false;
                $(".tr-filter-toggle").setAttribute("aria-expanded", "true");
            }
            $(".tr-drawer-close").focus({
                preventScroll: true
            });
        }
        scheduleDraw();
    }
    $(".tr-mobile-filter").onclick = () => setDrawer(!drawerOpen);
    $(".tr-drawer-close").onclick = () => setDrawer(false);
    $(".tr-drawer-backdrop").onclick = () => setDrawer(false);
    let view = {
        s: 1,
        x: 0,
        y: 0
    }, fitted = false, initialScale = 0, initialZoom = null;
    let sel = null;
    let hover = -1, hoverPlan = -1, hoverRoute = -1, follow = false, panelAt = 0, sparkAt = 0, fpsAt = 0, fpsFrames = 0;
    const off = new Set, offAgencies = new Set, offRoutes = new Set;
    let ensureRouteVisible = () => {}, setCity = () => {}, routePickTimer = 0;
    const capacityOrder = [ 1, 900, 2, 3, 700, 7 ];
    const present = [ ...new Set(trips.map(tr => tr.mode)) ].sort((a, b) => (capacityOrder.indexOf(a) < 0 ? 99 : capacityOrder.indexOf(a)) - (capacityOrder.indexOf(b) < 0 ? 99 : capacityOrder.indexOf(b)) || a - b);
    let pos = [], active = [];
    const F = D.frame, R0 = 6378137;
    const lonlat = (px, py) => {
        const mx = F.cx + (px - D.w / 2) * F.m, my = F.cy - (py - D.h / 2) * F.m;
        return [ mx / R0 * 180 / Math.PI, (2 * Math.atan(Math.exp(my / R0)) - Math.PI / 2) * 180 / Math.PI ];
    };
    const opening = () => [ 49.76, 40.33, 49.98, 40.47 ];
    const framePoint = (lo, la) => {
        const mx = R0 * lo * Math.PI / 180, my = R0 * Math.log(Math.tan(Math.PI / 4 + la * Math.PI / 360));
        return [ (mx - F.cx) / F.m + D.w / 2, (F.cy - my) / F.m + D.h / 2 ];
    };
    const mapPlaces = (D.map_places || []).map(p => {
        const [x, y] = framePoint(p.lon, p.lat);
        return {
            ...p,
            x: x,
            y: y
        };
    }).sort((a, b) => (b.population || 0) - (a.population || 0));
    const countryBounds = [ 44.65, 38.25, 50.8, 42 ];
    const countryScale = () => {
        const [w, s, e, n] = countryBounds, [x0, y0] = framePoint(w, n), [x1, y1] = framePoint(e, s), p = 16 * pixelRatio();
        return Math.min(Math.max(1, cv.width - 2 * p) / (x1 - x0), Math.max(1, cv.height - 2 * p) / (y1 - y0));
    };
    function constrainView() {
        const [w, s, e, n] = countryBounds, [x0, y0] = framePoint(w, n), [x1, y1] = framePoint(e, s);
        view.x = constrainCameraOffset(view.x, x0, x1, view.s, cv.width);
        view.y = constrainCameraOffset(view.y, y0, y1, view.s, cv.height);
    }
    function updateMapMinZoom(m) {
        const [w, s, e, n] = countryBounds, camera = m.cameraForBounds([ [ w, s ], [ e, n ] ], {
            padding: 16
        });
        if (camera && Number.isFinite(camera.zoom)) m.setMinZoom(camera.zoom);
    }
    const planned = (D.planned_stations || []).map(p => {
        const [x, y] = framePoint(p.lon, p.lat);
        return {
            ...p,
            x: x,
            y: y
        };
    });
    const plannedTracks = Object.fromEntries(Object.entries(D.planned_geometry || {}).map(([line, data]) => [ line, (data.points || []).map(([lon, lat]) => framePoint(lon, lat)) ]));
    function fit() {
        if (map) {
            const [w0, s0, e0, n0] = opening();
            map.fitBounds([ [ w0, s0 ], [ e0, n0 ] ], {
                padding: 0,
                animate: false
            });
            return;
        }
        const [w0, s0, e0, n0] = opening(), [x0, y0] = framePoint(w0, n0), [x1, y1] = framePoint(e0, s0);
        const W = cv.width, H = cv.height, s = Math.min(W / (x1 - x0), H / (y1 - y0));
        view = {
            s: s,
            x: W / 2 - (x0 + x1) / 2 * s,
            y: H / 2 - (y0 + y1) / 2 * s
        };
        if (!initialScale) initialScale = s;
    }
    function syncView() {
        const r = pixelRatio(), c = map.getCenter(), k = 512 * 2 ** map.getZoom() / (2 * Math.PI * R0);
        const cmx = R0 * c.lng * Math.PI / 180, cmy = R0 * Math.log(Math.tan(Math.PI / 4 + c.lat * Math.PI / 360));
        view = {
            s: F.m * k * r,
            x: (F.cx - D.w / 2 * F.m - cmx) * k * r + cv.width / 2,
            y: (cmy - F.cy - D.h / 2 * F.m) * k * r + cv.height / 2
        };
    }
    async function loadMap() {
        if (!window.maplibregl) {
            const css = document.createElement("link");
            css.rel = "stylesheet";
            css.href = MAPLIBRE + ".css";
            document.head.appendChild(css);
            await new Promise((ok, no) => {
                const sc = document.createElement("script");
                sc.src = MAPLIBRE + ".js";
                sc.onload = ok;
                sc.onerror = no;
                document.head.appendChild(sc);
            });
        }
        const [w0, s0, e0, n0] = opening();
        const [west, south, east, north] = countryBounds;
        const m = new maplibregl.Map({
            container: mapDiv,
            style: BASEMAP,
            bounds: [ [ w0, s0 ], [ e0, n0 ] ],
            maxBounds: [ [ west, south ], [ east, north ] ],
            interactive: false,
            attributionControl: false,
            renderWorldCopies: false,
            maxZoom: 17,
            fadeDuration: 0,
            pixelRatio: pixelRatio(),
            canvasContextAttributes: {
                antialias: false
            }
        });
        await new Promise((ok, no) => {
            const timer = setTimeout(() => no(new Error("timeout")), 15e3);
            m.once("load", () => {
                clearTimeout(timer);
                ok();
            });
            m.once("error", e => {
                clearTimeout(timer);
                no(e.error);
            });
        });
        paintBasemap(m);
        updateMapMinZoom(m);
        m.addSource("azerbaijan-boundary", {
            type: "geojson",
            data: new URL("azerbaijan-boundary.geojson?v=20261109m", document.baseURI).href
        });
        m.addLayer({
            id: "azerbaijan-boundary-outline",
            type: "line",
            source: "azerbaijan-boundary",
            paint: {
                "line-color": light ? "#356a9d" : "#86e2ce",
                "line-width": 2.2,
                "line-opacity": .9
            }
        });
        return m;
    }
    function paintBasemap(m) {
        const road = mix(S.land, light ? "#72818e" : "#ffffff", light ? .15 : .06), label = mix(S.land, light ? "#26384a" : "#ffffff", light ? .65 : .3);
        for (const l of m.getStyle().layers) {
            const id = l.id, set = (k, v) => m.setPaintProperty(id, k, v);
            if (id === "azerbaijan-boundary-outline") {
                set("line-color", light ? "#356a9d" : "#86e2ce");
                continue;
            }
            if (l.type === "symbol" && l["source-layer"] === "place" && /^place_(city|town)/i.test(id)) {
                m.setLayoutProperty(id, "visibility", "none");
                continue;
            }
            if (l.type === "background") set("background-color", S.land); else if (id === "water" || id === "waterway") set(l.type + "-color", S.water); else if (l.type === "fill" || /^(aeroway|railway|road_|highway_name)|casing|dashline|boundary|border|admin/i.test(id)) m.setLayoutProperty(id, "visibility", "none"); else if (l.type === "line" && id.startsWith("highway")) set("line-color", road); else if (l.type === "symbol") {
                set("text-color", label);
                set("text-halo-color", S.land);
                if (id.startsWith("water")) set("text-color", mix(S.water, light ? "#405a70" : "#ffffff", .3));
            }
        }
    }
    function resize() {
        const b = el.getBoundingClientRect(), previousRatio = displayRatio;
        displayRatio = choosePixelRatio(window.devicePixelRatio || 1, b.width, b.height, navigator.deviceMemory);
        const r = pixelRatio();
        const small = b.width <= 640;
        if (small !== mobile) {
            mobile = small;
            el.classList.toggle("tr-mobile", mobile);
            setDrawer(false, false);
        }
        const W = Math.max(1, Math.round(b.width * r)), H = Math.max(1, Math.round(b.height * r));
        if (cv.width !== W || cv.height !== H || previousRatio !== displayRatio) {
            const k = cv.width ? W / cv.width : 1;
            cv.width = W;
            cv.height = H;
            if (previousRatio !== displayRatio) {
                networkCacheKey = "";
                highlightCacheKey = "";
                cityLabelKey = "";
            }
            if (map) {
                if (previousRatio !== displayRatio) map.setPixelRatio?.(displayRatio);
                map.resize();
                updateMapMinZoom(map);
            } else if (!fitted) {
                fit();
                fitted = true;
            } else {
                view.x *= k;
                view.y *= k;
                view.s *= k;
                if (view.s < countryScale()) zoomAt(W / 2, H / 2, countryScale() / view.s);
                constrainView();
            }
            spark.width = Math.round(spark.clientWidth * r);
            spark.height = Math.round(spark.clientHeight * r);
            drawSpark();
            scheduleDraw();
        }
    }
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const at = (tr, tt) => positionAt(tr, tt);
    const routeVisible = i => !off.has(routes[i].type) && !offAgencies.has(routes[i].agency) && !offRoutes.has(i);
    const visible = tr => routeVisible(tr.r);
    const N = 289;
    let counts = new Int32Array(N);
    function tally() {
        counts = timeline(schedule, N, visible);
        drawSpark();
    }
    function drawSpark() {
        const W = spark.width, H = spark.height;
        if (!W) return;
        sx.clearRect(0, 0, W, H);
        let max = 1;
        for (const c of counts) max = Math.max(max, c);
        sx.beginPath();
        sx.moveTo(0, H);
        for (let i = 0; i < N; i++) sx.lineTo(i / (N - 1) * W, H - 2 - counts[i] / max * (H - 6));
        sx.lineTo(W, H);
        sx.closePath();
        sx.fillStyle = light ? "#496f9c2b" : "#ffffff26";
        sx.fill();
        sx.beginPath();
        for (let i = 0; i < N; i++) sx.lineTo(i / (N - 1) * W, H - 2 - counts[i] / max * (H - 6));
        sx.strokeStyle = light ? "#496f9c99" : "#ffffff8c";
        sx.lineWidth = 1.5 * pixelRatio();
        sx.stroke();
        const x = t / span * W;
        sx.fillStyle = getComputedStyle(el).getPropertyValue("--tr-accent").trim() || "#7bd3ff";
        sx.fillRect(x - 1, 0, 2 * pixelRatio(), H);
        $(".tr-scrub-head").style.left = Math.max(0, Math.min(100, 100 * t / span)) + "%";
    }
    const S = D.style, u = Math.min(D.w, D.h) / 1080;
    const lightColors = new Map;
    function mapColor(color) {
        if (!light || !/^#[0-9a-f]{6}$/i.test(color || "")) return color;
        if (lightColors.has(color)) return lightColors.get(color);
        const result = colorForLightMap(color);
        lightColors.set(color, result);
        return result;
    }
    let routeDotColors = routes.map(route => route.dot);
    let netPaths = null;
    const routeNet = new Map, networkBoxes = [];
    const decodedNet = D.net.map(([r, dx, dy]) => {
        const xs = undelta(dx, 10), ys = undelta(dy, 10);
        if (!routeNet.has(r)) routeNet.set(r, []);
        routeNet.get(r).push([ xs, ys ]);
        let networkBox = {
            x0: Infinity,
            y0: Infinity,
            x1: -Infinity,
            y1: -Infinity
        }, segmentLength = 0;
        for (let i = 0; i < xs.length; i++) {
            networkBox.x0 = Math.min(networkBox.x0, xs[i]);
            networkBox.x1 = Math.max(networkBox.x1, xs[i]);
            networkBox.y0 = Math.min(networkBox.y0, ys[i]);
            networkBox.y1 = Math.max(networkBox.y1, ys[i]);
            if (i) segmentLength += Math.hypot(xs[i] - xs[i - 1], ys[i] - ys[i - 1]) * F.m;
            if ((routes[r].type === 700 || routes[r].type === 2) && segmentLength >= 2e4 && i < xs.length - 1) {
                networkBoxes.push(networkBox);
                networkBox = {
                    x0: xs[i],
                    y0: ys[i],
                    x1: xs[i],
                    y1: ys[i]
                };
                segmentLength = 0;
            }
        }
        networkBoxes.push(networkBox);
        return [ r, xs, ys ];
    });
    function buildNet() {
        const groups = new Map;
        for (const [r, xs, ys] of decodedNet) {
            if (!routeVisible(r)) continue;
            const rt = routes[r], key = rt.tier ? rt.rank + rt.line : "0";
            if (!groups.has(key)) groups.set(key, {
                tier: rt.tier,
                rank: rt.rank,
                color: rt.tier ? mapColor(rt.line) : S.network,
                path: new Path2D
            });
            const p = groups.get(key).path;
            p.moveTo(xs[0], ys[0]);
            for (let i = 1; i < xs.length; i++) p.lineTo(xs[i], ys[i]);
        }
        netPaths = [ ...groups.values() ].sort((a, b) => a.rank - b.rank);
    }
    function drawNet(z, target = cx) {
        if (!netPaths) buildNet();
        const cx = target;
        cx.lineJoin = cx.lineCap = "round";
        for (const g of netPaths) {
            if (g.tier && S.line_glow_gain > 0) {
                cx.strokeStyle = g.color;
                for (const [k, ga] of [ [ 2.2, .05 ], [ 1.3, .09 ], [ .6, .14 ] ]) {
                    cx.globalAlpha = ga * S.line_glow_gain;
                    cx.lineWidth = Math.max(2 * k * S.line_glow_sigma * u / z, .6 / view.s);
                    cx.stroke(g.path);
                }
            }
            const [wd, a] = g.tier === 2 ? [ S.line_width, S.line_alpha ] : g.tier === 1 ? [ S.thin_width, S.thin_alpha ] : [ S.network_width, S.network_alpha ];
            cx.strokeStyle = g.color;
            cx.globalAlpha = a;
            cx.lineWidth = Math.max(wd * u / z, .6 / view.s);
            cx.stroke(g.path);
        }
        cx.globalAlpha = 1;
    }
    const networkCanvas = document.createElement("canvas"), networkCx = networkCanvas.getContext("2d");
    let networkCacheKey = "";
    function drawCachedNetwork(z, W, H) {
        const key = [ W, H, view.s, view.x, view.y ].join(":");
        if (!netPaths || key !== networkCacheKey) {
            networkCanvas.width = W;
            networkCanvas.height = H;
            networkCx.setTransform(view.s, 0, 0, view.s, view.x, view.y);
            drawNet(z, networkCx);
            networkCacheKey = key;
        }
        cx.setTransform(1, 0, 0, 1, 0, 0);
        cx.drawImage(networkCanvas, 0, 0);
        cx.setTransform(view.s, 0, 0, view.s, view.x, view.y);
    }
    const netOf = r => routeNet.get(r) || [];
    const highlightCanvas = document.createElement("canvas"), highlightCx = highlightCanvas.getContext("2d");
    let highlightCacheKey = "";
    function drawCachedHighlights(highlighted, z, W, H, focus = -1) {
        if (!highlighted.length) return;
        const key = [ W, H, view.s, view.x, view.y, highlighted.join(","), focus ].join(":");
        if (key !== highlightCacheKey) {
            highlightCanvas.width = W;
            highlightCanvas.height = H;
            highlightCx.setTransform(view.s, 0, 0, view.s, view.x, view.y);
            highlightCx.lineJoin = highlightCx.lineCap = "round";
            for (const routeId of highlighted) {
                highlightCx.globalAlpha = focus >= 0 && routeId !== focus ? .3 : .95;
                highlightCx.strokeStyle = mapColor(routes[routeId].line || "#e8e9ec");
                highlightCx.lineWidth = Math.max(2.5, S.line_width || 4) * u / z * (routeId === focus ? 1.8 : 1.2);
                for (const [xs, ys] of netOf(routeId)) {
                    highlightCx.beginPath();
                    highlightCx.moveTo(xs[0], ys[0]);
                    for (let i = 1; i < xs.length; i++) highlightCx.lineTo(xs[i], ys[i]);
                    highlightCx.stroke();
                }
            }
            highlightCacheKey = key;
        }
        cx.setTransform(1, 0, 0, 1, 0, 0);
        cx.drawImage(highlightCanvas, 0, 0);
        cx.setTransform(view.s, 0, 0, view.s, view.x, view.y);
    }
    function focusRoute() {
        return !sel ? -1 : sel.kind === "route" ? sel.i : sel.kind === "trip" ? trips[sel.i].r : -1;
    }
    const cityLabelCanvas = document.createElement("canvas"), cityLabelCx = cityLabelCanvas.getContext("2d");
    let cityLabelKey = "";
    function drawCityLabels(W, H, r) {
        const key = [ W, H, view.s, view.x, view.y, language ].join("|");
        if (key !== cityLabelKey) {
            cityLabelCanvas.width = W;
            cityLabelCanvas.height = H;
            const c = cityLabelCx, cells = new Set;
            c.font = `600 ${12 * r}px system-ui, sans-serif`;
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.fillStyle = light ? "#26384a" : "#e6eceb";
            let count = 0;
            const limit = Math.max(8, Math.min(80, Math.floor(W * H / (12e3 * r * r))));
            for (const p of mapPlaces) {
                const x = p.x * view.s + view.x, y = p.y * view.s + view.y;
                if (x < 0 || x > W || y < 0 || y > H) continue;
                const cell = `${Math.floor(x / (95 * r))}:${Math.floor(y / (28 * r))}`;
                if (cells.has(cell)) continue;
                cells.add(cell);
                const name = p[language] || p.az;
                c.fillText(name, x, y);
                if (++count >= limit) break;
            }
            cityLabelKey = key;
        }
        cx.setTransform(1, 0, 0, 1, 0, 0);
        cx.drawImage(cityLabelCanvas, 0, 0);
    }
    function stopGroup(si) {
        const st = stops[si], lim = 120 / (F.m * Math.cos(40.4 * Math.PI / 180)), g = new Set;
        stops.forEach((s, i) => {
            if (s.name === st.name && Math.hypot(s.x - st.x, s.y - st.y) < lim) g.add(i);
        });
        return g;
    }
    const stopRoutes = g => new Set([ ...routesAtStops(schedule, g) ].filter(routeVisible));
    let stopRouteSet = null, group = null, renderedStopHour = -1, renderedPanelMinute = -1;
    const badgeSprites = new Map;
    function badgeFor(route, r) {
        const text = String(route.short || "").trim();
        if (!text) return null;
        const color = light ? "#f2f4f5" : route.dot || "#fff", key = text + "|" + color + "|" + r;
        if (badgeSprites.has(key)) return badgeSprites.get(key);
        const sprite = document.createElement("canvas");
        sprite.width = Math.ceil((7 * text.length + 7) * r);
        sprite.height = Math.ceil(14 * r);
        const c = sprite.getContext("2d");
        c.font = `600 ${11 * r}px system-ui, sans-serif`;
        c.textBaseline = "middle";
        c.fillStyle = "#111821d9";
        c.fillRect(0, 0, sprite.width, sprite.height);
        c.fillStyle = color;
        c.fillText(text, 3 * r, 7 * r);
        if (badgeSprites.size >= 512) badgeSprites.clear();
        badgeSprites.set(key, sprite);
        return sprite;
    }
    function draw(now) {
        raf = 0;
        if (!alive || !onScreen || document.hidden) return;
        const W = cv.width, H = cv.height, r = pixelRatio();
        if (!fpsAt) fpsAt = now;
        fpsFrames++;
        if (now - fpsAt >= 2e3) {
            $(".tr-fps").textContent = Math.round(fpsFrames * 1e3 / (now - fpsAt)) + " FPS";
            fpsAt = now;
            fpsFrames = 0;
        }
        if (map) syncView();
        observeArea();
        let x0 = -view.x / view.s, y0 = -view.y / view.s, x1 = x0 + W / view.s, y1 = y0 + H / view.s;
        let inNetwork = false;
        for (const b of networkBoxes) if (x1 >= b.x0 && x0 <= b.x1 && y1 >= b.y0 && y0 <= b.y1) {
            inNetwork = true;
            break;
        }
        const zoomPercent = map && initialZoom != null ? 100 * 2 ** (map.getZoom() - initialZoom) : 100 * view.s / (initialScale || view.s);
        const zoomText = Math.round(zoomPercent) + "%";
        if ($(".tr-zoom-value").textContent !== zoomText) $(".tr-zoom-value").textContent = zoomText;
        const dt = Math.min(.1, Math.max(0, (now - last) / 1e3));
        last = now;
        if (live && playing && !scrub) t = liveTime(); else if (playing && inNetwork && !scrub && !peakPending) {
            t += dt * speed * span / D.seconds;
            if (t > span) t = 0;
        }
        if (!inNetwork) {
            cx.setTransform(1, 0, 0, 1, 0, 0);
            cx.clearRect(0, 0, W, H);
            active = [];
            pos = [];
            drawCityLabels(W, H, r);
            $(".tr-fps").textContent = "— FPS";
            fpsAt = 0;
            fpsFrames = 0;
            const clockText = hhmm(D.start + t);
            $(".tr-clock").textContent = clockText;
            $(".tr-range").value = Math.round(t);
            $(".tr-range").setAttribute("aria-valuetext", clockText);
            status();
            drawSpark();
            if (live && playing) {
                clearTimeout(liveTimer);
                liveTimer = setTimeout(scheduleDraw, 1e3);
            }
            return;
        }
        clearTimeout(liveTimer);
        liveTimer = 0;
        if (follow && sel?.kind === "trip") {
            const tr = trips[sel.i];
            if (t >= tr.t0 && t <= tr.t1) {
                const [x, y] = at(tr, t);
                if (map) {
                    const c = map.getCenter(), [lo, la] = lonlat(x, y);
                    map.jumpTo({
                        center: [ c.lng + (lo - c.lng) * .12, c.lat + (la - c.lat) * .12 ]
                    });
                } else {
                    view.x += (W / 2 - (x * view.s + view.x)) * .12;
                    view.y += (H / 2 - (y * view.s + view.y)) * .12;
                    constrainView();
                }
            }
        }
        if (map) syncView();
        x0 = -view.x / view.s;
        y0 = -view.y / view.s;
        x1 = x0 + W / view.s;
        y1 = y0 + H / view.s;
        const hoveredRoute = hoverRoute >= 0 && routeVisible(hoverRoute) ? hoverRoute : -1;
        const fr = focusRoute(), z = Math.max(1, Math.sqrt(view.s / r)), planFocus = hoveredRoute >= 0 ? -1 : hoverPlan >= 0 ? hoverPlan : sel?.kind === "planned" ? sel.i : -1;
        const dim = sel != null || planFocus >= 0 || hoveredRoute >= 0;
        cx.setTransform(1, 0, 0, 1, 0, 0);
        if (map) cx.clearRect(0, 0, W, H); else {
            cx.fillStyle = light ? "#f2f4f5" : "#0c0d10";
            cx.fillRect(0, 0, W, H);
        }
        cx.setTransform(view.s, 0, 0, view.s, view.x, view.y);
        cx.save();
        drawCachedNetwork(z, W, H);
        if (dim) {
            cx.save();
            cx.setTransform(1, 0, 0, 1, 0, 0);
            cx.fillStyle = light ? "#f2f4f5d0" : "#0c0d10b3";
            cx.fillRect(0, 0, W, H);
            cx.restore();
        }
        let highlighted = planFocus >= 0 ? routes.map((route, i) => route.type === 1 && (route.short === planned[planFocus].line || planned[planFocus].line === "M2" && route.short === "M2B") ? i : -1).filter(i => i >= 0) : sel?.kind === "stop" ? [ ...stopRouteSet || [] ] : hoveredRoute >= 0 ? [ hoveredRoute ] : fr >= 0 ? [ fr ] : [];
        if (planFocus < 0 && hoveredRoute >= 0 && !highlighted.includes(hoveredRoute)) highlighted.push(hoveredRoute);
        drawCachedHighlights(highlighted, z, W, H, planFocus < 0 ? hoveredRoute : -1);
        if (planFocus >= 0 && !off.has(1)) {
            const line = planned[planFocus].line, segments = [ plannedTracks[line + "_connector"] || [], plannedTracks[line] || [], ...line === "M2" ? [ plannedTracks.M2_closed || [] ] : [] ];
            for (const pts of segments) if (pts.length > 1) {
                cx.save();
                cx.globalAlpha = light ? .7 : .48;
                cx.strokeStyle = mapColor(line === "M3" ? "#b79af6" : "#73d58f");
                cx.lineWidth = 2.3 * r / view.s;
                cx.setLineDash([ 6 * r / view.s, 5 * r / view.s ]);
                cx.beginPath();
                cx.moveTo(pts[0][0], pts[0][1]);
                for (let i = 1; i < pts.length; i++) cx.lineTo(pts[i][0], pts[i][1]);
                cx.stroke();
                cx.restore();
            }
        }
        if (!off.has(1)) for (let i = 0; i < planned.length; i++) {
            const p = planned[i];
            if (p.x < x0 || p.x > x1 || p.y < y0 || p.y > y1) continue;
            const radius = (i === planFocus ? 6 : 4) * r / view.s;
            cx.beginPath();
            cx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            cx.fillStyle = light ? "#f2f4f5" : "#141b19";
            cx.fill();
            cx.lineWidth = 2 * r / view.s;
            cx.strokeStyle = mapColor(p.line === "M3" ? "#b79af6" : "#73d58f");
            cx.stroke();
        }
        if (view.s / r > 2.5 || sel?.kind === "stop") {
            const x0 = -view.x / view.s, y0 = -view.y / view.s, x1 = x0 + W / view.s, y1 = y0 + H / view.s, sr = 2.2 * u / z;
            cx.strokeStyle = light ? "#344e6699" : "#ffffff73";
            cx.lineWidth = 1 / view.s * r;
            cx.beginPath();
            if (view.s / r > 2.5) for (const st of stops) if (st.x > x0 && st.x < x1 && st.y > y0 && st.y < y1) {
                cx.moveTo(st.x + sr, st.y);
                cx.arc(st.x, st.y, sr, 0, 7);
            }
            cx.stroke();
            if (sel?.kind === "stop") {
                const st = stops[sel.i];
                cx.strokeStyle = light ? "#273e58" : "#fff";
                cx.lineWidth = 2.5 / view.s * r;
                cx.beginPath();
                cx.arc(st.x, st.y, 9 * r / view.s, 0, 7);
                cx.stroke();
            }
        }
        pos = [];
        active = [];
        const margin = 20 * r / view.s;
        for (const i of candidatesAt(schedule, t)) {
            const tr = trips[i];
            if (t < tr.t0 || t > tr.t1 || !visible(tr)) continue;
            active.push(i);
            const b = tr.bounds;
            if (b.x1 < x0 - margin || b.x0 > x1 + margin || b.y1 < y0 - margin || b.y0 > y1 + margin) continue;
            const [x, y] = at(tr, t);
            if (x >= x0 - margin && x <= x1 + margin && y >= y0 - margin && y <= y1 + margin) pos.push([ i, x, y ]);
        }
        const lit = i => !dim || (planFocus >= 0 ? highlighted.includes(trips[i].r) : hoveredRoute >= 0 ? trips[i].r === hoveredRoute : fr >= 0 ? trips[i].r === fr : stopRouteSet?.has(trips[i].r));
        for (const pass of dim ? [ 0, 1 ] : [ 1 ]) {
            const list = dim ? pos.filter(p => lit(p[0]) === !!pass) : pos;
            if (!list.length) continue;
            cx.globalAlpha = pass ? 1 : dim ? .28 : 1;
            const byColor = new Map;
            for (const p of list) {
                const tr = trips[p[0]], key = routeDotColors[tr.r] + (tr.isLine ? "|line" : "|bus");
                if (!byColor.has(key)) byColor.set(key, []);
                byColor.get(key).push(p);
            }
            if (!dim || pass) {
                cx.globalCompositeOperation = light ? "multiply" : "lighten";
                for (const [key, ps] of byColor) {
                    const sp = key.endsWith("|line") ? S.line_dot : S.dot;
                    if (!(sp.glow_gain > 0)) continue;
                    cx.globalAlpha = Math.min(sp.glow_max ?? S.glow_max, sp.glow_gain * .5);
                    cx.fillStyle = key.split("|")[0];
                    cx.beginPath();
                    for (const [, x, y] of ps) {
                        const rr = sp.glow_sigma * u / z * 1.5;
                        cx.moveTo(x + rr, y);
                        cx.arc(x, y, rr, 0, 7);
                    }
                    cx.fill();
                }
                cx.globalCompositeOperation = "source-over";
                cx.globalAlpha = pass ? 1 : dim ? .28 : 1;
            }
            if (S.outline) {
                cx.fillStyle = S.outline;
                const a = cx.globalAlpha;
                cx.globalAlpha = a * S.outline_alpha;
                cx.beginPath();
                for (const [i, x, y] of list) {
                    const sp = trips[i].isLine ? S.line_dot : S.dot, rr = (sp.radius + S.outline_width) * u / z;
                    cx.moveTo(x + rr, y);
                    cx.arc(x, y, rr, 0, 7);
                }
                cx.fill();
                cx.globalAlpha = a;
            }
            for (const [key, ps] of byColor) {
                cx.fillStyle = key.split("|")[0];
                cx.beginPath();
                for (const [i, x, y] of ps) {
                    const sp = trips[i].isLine ? S.line_dot : S.dot, rr = sp.radius * u / z;
                    cx.moveTo(x + rr, y);
                    cx.arc(x, y, rr, 0, 7);
                }
                cx.fill();
            }
        }
        cx.globalAlpha = 1;
        const ring = (i, c, wdt) => {
            const tr = trips[i];
            if (t < tr.t0 || t > tr.t1) return;
            const [x, y] = at(tr, t);
            cx.strokeStyle = c;
            cx.lineWidth = wdt / view.s * r;
            cx.beginPath();
            cx.arc(x, y, 8 * r / view.s, 0, 7);
            cx.stroke();
        };
        if (hover >= 0) ring(hover, light ? "#2c4157b3" : "#ffffffb3", 1.5);
        if (sel?.kind === "trip") ring(sel.i, getComputedStyle(el).getPropertyValue("--tr-accent").trim() || "#7bd3ff", 2.5);
        cx.restore();
        if (zoomPercent >= 220) {
            const cells = new Set;
            let drawn = 0;
            cx.save();
            cx.setTransform(1, 0, 0, 1, 0, 0);
            for (const busPass of [ false, true ]) {
                for (const [i, x, y] of pos) {
                    const tr = trips[i], route = routes[tr.r];
                    if (route.type === 3 !== busPass || dim && !lit(i)) continue;
                    const text = String(route.short || "").trim();
                    if (!text) continue;
                    const width = Math.ceil((7 * text.length + 7) * r), height = Math.ceil(14 * r);
                    const sx = x * view.s + view.x + 7 * r, sy = y * view.s + view.y;
                    let bx = sx - 3 * r, by = sy - 7 * r;
                    if (bx + width > W) bx = sx - width - 4 * r;
                    if (bx < 0 || by < 0 || bx + width > W || by + height > H) continue;
                    const xStart = Math.floor(bx / (40 * r)), xEnd = Math.floor((bx + width) / (40 * r)), yStart = Math.floor(by / (18 * r)), yEnd = Math.floor((by + height) / (18 * r));
                    let occupied = false;
                    for (let xx = xStart; xx <= xEnd && !occupied; xx++) for (let yy = yStart; yy <= yEnd; yy++) if (cells.has(`${xx}:${yy}`)) {
                        occupied = true;
                        break;
                    }
                    if (occupied) continue;
                    for (let xx = xStart; xx <= xEnd; xx++) for (let yy = yStart; yy <= yEnd; yy++) cells.add(`${xx}:${yy}`);
                    cx.drawImage(badgeFor(route, r), bx, by);
                    if (++drawn >= 180) break;
                }
                if (drawn >= 180) break;
            }
            cx.restore();
        }
        drawCityLabels(W, H, r);
        const clockText = peakPending ? "…" : t >= span ? "24:00" : hhmm(D.start + t);
        if ($(".tr-clock").textContent !== clockText) $(".tr-clock").textContent = clockText;
        $(".tr-range").value = Math.round(t);
        $(".tr-range").setAttribute("aria-valuetext", clockText);
        if (now - panelAt > 750) {
            panelAt = now;
            status();
            const minute = Math.floor(Math.min(t, span - 1) / 60);
            if (sel && (sel.kind === "stop" ? Math.floor(minute / 60) !== renderedStopHour : minute !== renderedPanelMinute)) {
                renderedPanelMinute = minute;
                renderPanel(false);
            }
        }
        if (now - sparkAt > 100) {
            sparkAt = now;
            drawSpark();
        }
        if (playing) scheduleDraw();
    }
    const modeBox = $(".tr-modes");
    function status() {
        const by = {};
        for (const [i] of pos) by[trips[i].mode] = (by[trips[i].mode] || 0) + 1;
        const totals = {};
        for (const i of candidatesAt(schedule, t)) {
            const tr = trips[i], route = routes[tr.r];
            if (tr.t0 <= t && tr.t1 >= t && !offAgencies.has(route.agency) && !offRoutes.has(tr.r)) totals[tr.mode] = (totals[tr.mode] || 0) + 1;
        }
        $(".tr-count").textContent = active.length.toLocaleString() + langText(" в модели · в кадре ", " modeldə · ekranda ", " modelled · in view ") + pos.length.toLocaleString();
        modeBox.querySelectorAll(".tr-mode").forEach(b => {
            const m = +b.dataset.m, shown = off.has(m) ? 0 : by[m] || 0, total = totals[m] || 0;
            b.querySelector("em").textContent = off.has(m) ? "" : shown.toLocaleString();
            b.title = langText(`В кадре сейчас: ${shown}; в модели сейчас: ${total}. Двойной щелчок: только этот вид`, `Hazırda ekranda: ${shown}; hazırda modeldə: ${total}. İki dəfə basın: yalnız bu növ`, `In view: ${shown}; in the model: ${total}. Double-click to show only this type`);
        });
    }
    function modeColors(m) {
        const n = new Map;
        for (const rt of routes.filter(r => r.type === m)) {
            const c = rt.line || rt.dot;
            n.set(c, (n.get(c) || 0) + 1);
        }
        return [ ...n ].sort((a, b) => b[1] - a[1]).slice(0, 4).map(a => a[0]);
    }
    function filtersChanged() {
        if (peakPending) cancelPeak();
        netPaths = null;
        if (group) {
            stopRouteSet = stopRoutes(group);
            if (sel?.kind === "stop") renderPanel(false);
        }
        if (sel?.kind === "route" && !routeVisible(sel.i)) select(null);
        if (sel?.kind === "trip" && !visible(trips[sel.i])) select(null);
        tally();
        scheduleDraw();
    }
    function setupFilters() {
        modeBox.innerHTML = present.map(m => `<button class="tr-mode" data-m="${m}" aria-pressed="true" title="Количество в кадре; нажмите, чтобы включить или скрыть">\n      <s>${modeColors(m).map(c => `<i style="background:${c}"></i>`).join("")}</s><span>${esc(localize(MODES[m] || "Другой транспорт"))}</span><em></em></button>`).join("");
        modeBox.querySelectorAll(".tr-mode").forEach(b => b.onclick = () => {
            const m = +b.dataset.m;
            off.has(m) ? off.delete(m) : off.add(m);
            b.classList.toggle("off", off.has(m));
            b.setAttribute("aria-pressed", !off.has(m));
            filtersChanged();
        });
        modeBox.addEventListener("dblclick", e => {
            const b = e.target.closest("[data-m]");
            if (!b) return;
            const selected = +b.dataset.m;
            off.clear();
            for (const m of present) if (m !== selected) off.add(m);
            modeBox.querySelectorAll(".tr-mode").forEach(item => {
                const hidden = off.has(+item.dataset.m);
                item.classList.toggle("off", hidden);
                item.setAttribute("aria-pressed", String(!hidden));
            });
            filtersChanged();
        });
        const agencies = $(".tr-agencies");
        const busAgencies = D.agencies.filter(name => routes.some(r => r.type === 3 && r.agency === name));
        const groupMembers = key => busAgencies.filter(name => key === "bakubus" ? /bakubus/i.test(name) : !/bakubus/i.test(name));
        const orderedAgencies = [ ...busAgencies ].sort((a, b) => Number(/bakubus/i.test(b)) - Number(/bakubus/i.test(a)) || a.localeCompare(b));
        agencies.innerHTML = `<label><input type="checkbox" data-group="bakubus" checked><b>BakuBus</b></label><label><input type="checkbox" data-group="other" checked><b>Другие перевозчики</b></label>` + orderedAgencies.map(name => {
            const i = D.agencies.indexOf(name);
            const own = routes.filter(r => r.agency === name), color = own[0]?.line || "#aab6c2";
            return `<label><input type="checkbox" data-agency="${i}" checked><i style="width:9px;height:9px;border-radius:50%;background:${color};flex:none"></i><span>${esc(name)}</span><small>${own.length}</small></label>`;
        }).join("");
        const syncAgencyGroups = () => {
            for (const box of agencies.querySelectorAll("[data-group]")) {
                const names = groupMembers(box.dataset.group), enabled = names.filter(name => !offAgencies.has(name)).length;
                box.checked = enabled === names.length;
                box.indeterminate = enabled > 0 && enabled < names.length;
            }
            for (const box of agencies.querySelectorAll("[data-agency]")) box.checked = !offAgencies.has(D.agencies[+box.dataset.agency]);
        };
        agencies.addEventListener("change", e => {
            const key = e.target.dataset.group, i = e.target.dataset.agency;
            if (key != null) for (const name of groupMembers(key)) e.target.checked ? offAgencies.delete(name) : offAgencies.add(name); else if (i != null) {
                const name = D.agencies[+i];
                e.target.checked ? offAgencies.delete(name) : offAgencies.add(name);
            } else return;
            syncAgencyGroups();
            filtersChanged();
        });
        agencies.addEventListener("dblclick", e => {
            const box = e.target.closest("input[data-agency],input[data-group]") || e.target.closest("label")?.querySelector("input[data-agency],input[data-group]");
            if (!box) return;
            const allowed = box.dataset.group != null ? groupMembers(box.dataset.group) : [ D.agencies[+box.dataset.agency] ];
            for (const name of busAgencies) allowed.includes(name) ? offAgencies.delete(name) : offAgencies.add(name);
            syncAgencyGroups();
            filtersChanged();
        });
        const routeList = $(".tr-route-list");
        const order = [ ...routes.keys() ].sort((a, b) => label(routes[a]).localeCompare(label(routes[b]), "ru", {
            numeric: true
        }));
        routeList.innerHTML = order.map(i => `<div class="tr-route-row" data-rid="${i}" data-search="${esc((label(routes[i]) + " " + routes[i].long + " " + routes[i].agency).toLowerCase())}">\n      <input type="checkbox" data-route-toggle="${i}" checked aria-label="Показать маршрут ${esc(label(routes[i]))}"><button data-route-pick="${i}">${chip(routes[i])} ${esc(routes[i].long || label(routes[i]))}</button></div>`).join("");
        const namedPlaces = {
            baku: {
                az: "Bakı",
                ru: "Баку",
                en: "Baku",
                lon: 49.86,
                lat: 40.39
            },
            sumqayit: {
                az: "Sumqayıt",
                ru: "Сумгаит",
                en: "Sumqayit",
                lon: 49.668,
                lat: 40.589
            },
            ganja: {
                az: "Gəncə",
                ru: "Гянджа",
                en: "Ganja",
                lon: 46.36,
                lat: 40.68
            },
            sheki: {
                az: "Şəki",
                ru: "Шеки",
                en: "Sheki",
                lon: 47.17,
                lat: 41.19
            },
            lankaran: {
                az: "Lənkəran",
                ru: "Ленкорань",
                en: "Lankaran",
                lon: 48.85,
                lat: 38.75
            },
            nakhchivan: {
                az: "Naxçıvan",
                ru: "Нахичевань",
                en: "Nakhchivan",
                lon: 45.41,
                lat: 39.21
            }
        };
        const idsByName = new Map([ ...Object.entries(namedPlaces).map(([id, p]) => [ p.az, id ]), ...otherCities.map(p => [ p.az, p.id ]) ]);
        let areaRoutes = null, areaId = "baku";
        const cityRouteCache = new Map;
        function routesNear(place) {
            if (!place) return null;
            const key = place.az || `${place.lon}:${place.lat}`;
            if (cityRouteCache.has(key)) return cityRouteCache.get(key);
            const [px, py] = framePoint(place.lon, place.lat), radius = 18e3 / (F.m * Math.cos(place.lat * Math.PI / 180)), found = new Set;
            for (const [id, lines] of routeNet) {
                outer: for (const [xs, ys] of lines) for (let j = 0; j < xs.length; j++) {
                    if (Math.hypot(xs[j] - px, ys[j] - py) <= radius) {
                        found.add(id);
                        break outer;
                    }
                    if (j) {
                        const dx = xs[j] - xs[j - 1], dy = ys[j] - ys[j - 1], den = dx * dx + dy * dy;
                        const a = den ? Math.max(0, Math.min(1, ((px - xs[j - 1]) * dx + (py - ys[j - 1]) * dy) / den)) : 0;
                        if (Math.hypot(xs[j - 1] + a * dx - px, ys[j - 1] + a * dy - py) <= radius) {
                            found.add(id);
                            break outer;
                        }
                    }
                }
            }
            cityRouteCache.set(key, found);
            return found;
        }
        function filterRouteRows() {
            const q = $(".tr-route-query").value.trim().toLowerCase();
            routeList.querySelectorAll(".tr-route-row").forEach(row => row.hidden = !row.dataset.search.includes(q) || areaRoutes && !areaRoutes.has(+row.dataset.rid));
        }
        applyArea = (id, place) => {
            areaId = id;
            areaName = place || null;
            areaRoutes = routesNear(place);
            const city = $(".tr-city"), hasOption = [ ...city.querySelectorAll("option") ].some(o => o.value === id);
            if (city.value !== (hasOption ? id : "map")) city.value = hasOption ? id : "map";
            updateCityTitle();
            filterRouteRows();
            renderCityCatalog();
        };
        let cameraKey = "";
        observeArea = () => {
            const key = [ Math.round(view.s * 1e4), Math.round(view.x), Math.round(view.y), cv.width, cv.height ].join(":");
            if (key === cameraKey) return;
            cameraKey = key;
            clearTimeout(areaTimer);
            areaTimer = setTimeout(() => {
                if (!alive) return;
                const [lo, la] = lonlat((cv.width / 2 - view.x) / view.s, (cv.height / 2 - view.y) / view.s);
                const groundWidth = cv.width / view.s * F.m * Math.cos(la * Math.PI / 180), groundHeight = cv.height / view.s * F.m * Math.cos(la * Math.PI / 180);
                if (Math.max(groundWidth, groundHeight) > 15e4) {
                    if (areaId !== "country") applyArea("country", null);
                    return;
                }
                const [x, y] = framePoint(lo, la), candidates = [ ...Object.entries(namedPlaces).map(([id, p]) => ({
                    ...p,
                    id: id,
                    ...Object.fromEntries([ [ "x", framePoint(p.lon, p.lat)[0] ], [ "y", framePoint(p.lon, p.lat)[1] ] ])
                })), ...mapPlaces.map(p => ({
                    ...p,
                    id: idsByName.get(p.az) || `place-${p.osm}`
                })) ];
                let nearest = null, distance = Infinity;
                for (const p of candidates) {
                    const d = Math.hypot(p.x - x, p.y - y) * F.m * Math.cos(la * Math.PI / 180);
                    if (d < distance) {
                        distance = d;
                        nearest = p;
                    }
                }
                if (nearest && distance < 22e3) {
                    if (areaId !== nearest.id) applyArea(nearest.id, nearest);
                } else if (areaId !== "country") applyArea("country", null);
            }, 220);
        };
        routeList.addEventListener("change", e => {
            const i = e.target.dataset.routeToggle;
            if (i == null) return;
            e.target.checked ? offRoutes.delete(+i) : offRoutes.add(+i);
            filtersChanged();
        });
        ensureRouteVisible = i => {
            const route = routes[i];
            offRoutes.delete(i);
            off.delete(route.type);
            offAgencies.delete(route.agency);
            const box = routeList.querySelector(`[data-route-toggle="${i}"]`);
            if (box) box.checked = true;
            const mode = modeBox.querySelector(`[data-m="${route.type}"]`);
            if (mode) {
                mode.classList.remove("off");
                mode.setAttribute("aria-pressed", "true");
            }
            syncAgencyGroups();
            filtersChanged();
        };
        routeList.addEventListener("dblclick", e => {
            const item = e.target.closest("[data-route-toggle],[data-route-pick]");
            if (!item) return;
            clearTimeout(routePickTimer);
            routePickTimer = 0;
            const selected = +(item.dataset.routeToggle ?? item.dataset.routePick);
            offRoutes.clear();
            for (const i of routes.keys()) if (i !== selected) offRoutes.add(i);
            routeList.querySelectorAll("[data-route-toggle]").forEach(item => item.checked = +item.dataset.routeToggle === selected);
            ensureRouteVisible(selected);
        });
        routeList.addEventListener("click", e => {
            const b = e.target.closest("[data-route-pick]");
            if (!b) return;
            const i = +b.dataset.routePick;
            clearTimeout(routePickTimer);
            routePickTimer = setTimeout(() => {
                routePickTimer = 0;
                if (!alive) return;
                select({
                    kind: "route",
                    i: i
                }, true);
                if (mobile) setDrawer(false); else {
                    $(".tr-filter-body").hidden = true;
                    $(".tr-filter-toggle").setAttribute("aria-expanded", "false");
                }
                scheduleDraw();
            }, 300);
        });
        $(".tr-filter-actions").addEventListener("click", e => {
            const action = e.target.closest("[data-routes]")?.dataset.routes;
            if (!action) return;
            offRoutes.clear();
            if (action === "none") for (const i of routes.keys()) offRoutes.add(i);
            routeList.querySelectorAll("[data-route-toggle]").forEach(box => box.checked = action === "all");
            filtersChanged();
        });
        $(".tr-route-query").addEventListener("input", filterRouteRows);
        const toggle = $(".tr-filter-toggle"), body = $(".tr-filter-body");
        toggle.onclick = () => {
            body.hidden = !body.hidden;
            toggle.setAttribute("aria-expanded", String(!body.hidden));
        };
        const about = $(".tr-about"), meta = D.meta || {};
        const aboutContent = () => {
            const paragraphs = language === "az" ? [ "Bu, canlı izləmə və rəsmi hərəkət cədvəli deyil. Avtobusların mövqeyi və gediş intervalları model əsasında hesablanır.", "Bu, müxtəlif günlərdə işləyən marşrutların birləşdirilmiş model günüdür; iş və istirahət günləri barədə mövcud məlumat gələcək seçim üçün saxlanılır.", "Marşrutlar və dayanacaqlar AYNA xəritəsinin 2026-cı ilin oktyabr ayındakı məlumatlarına əsaslanır; bəzi son dəyişikliklər çatışmaya bilər. Daşıyıcı adları 8 noyabr tarixli AYNA məlumatları ilə tutuşdurulub.", "İsmət Səmədovun açıq tədqiqatında AYNA məlumatlarından hazırlanan GTFS modelinin təxmini intervallarından istifadə olunub. Araşdırmanın yerləşdirildiyi vakansiya saytı ilkin məlumat mənbəyi deyil.", "Metro və funikulyor xətləri OpenStreetMap məlumatlarına əsaslanır. 28 May–Nizami qatar hərəkəti müvəqqəti dayandırılıb. Xətai–Cəfər Cabbarlı Yaşıl xəttin ayrıca işləyən qoludur. Fəaliyyətdə olmayan stansiyalar açıq xətlə göstərilmir.", "Funikulyorun hərəkəti 10:00–13:00 və 14:00–20:00, 10 dəqiqəlik təxmini intervalla modelləşdirilir. Gecə son metro reyslərinin dəqiq vaxtı rəsmi olaraq təsdiqlənməyib.", "Gəncədə 22 şəhər və şəhərətrafı marşrut göstərilir. 4 nömrə OpenStreetMap, qalan 21 xətt və dayanacaqlar CityCard məlumatlarındandır. Dayanacaqların ardıcıllığı təxminən hesablanıb. İş saatlarının çoxu BakuBus-un 2025-ci il məlumatındandır; 2 və 8 nömrələr üçün iş saatları, bütün marşrutlar üçün interval və sürət modelləşdirilib.", "Naxçıvanda 1 və 3 nömrəli marşrutlar OpenStreetMap əsasında göstərilir və 2026-cı ildə yenilənmiş şəbəkədən fərqlənə bilər. 1 nömrənin dayanacaqları təsdiqlənməyib; 12 metrlik boşluq yol şəbəkəsinə görə tamamlanıb. Daşıyıcı BakuBus, iş saatları AYNA-nın 2026-cı il müsabiqə şərtlərinə, intervallar isə modelə əsaslanır.", "ADY: Bakı–Qazax, Bakı–Tbilisi, Bakı–Qəbələ və Gəncə–Qəbələ qatarlarının bəzi dərc olunmuş saatları istifadə edilir. Abşeron elektrik qatarlarının intervalları modelləşdirilib, tam cədvəl deyil. Aralıq stansiya vaxtları OpenStreetMap xəttinə görə hesablanıb.", "Şəhərlərarası regional xətlər hər iki istiqamətdə göstərilir. Gediş saatları AYNA-nın 2026-cı il müsabiqə şərtlərindəndir; hazırkı reyslər təsdiqlənməyib. Yollar və səfər müddəti təxminidir. Xankəndinin 3 şəhər marşrutu siyahıdadır; sxemləri tapılmadığından xəritədə göstərilmir. Mingəçevirin 5 nömrəli marşrutu AYNA-nın 2026-cı il müsabiqəsində elan edilib; xəritəsi tapılmayıb.", `Şəhərlərarası: Bakı Avtovağzalının 9 noyabr 2026 tarixli qismən siyahısından ${meta.intercity_stats?.directions || 0} istiqamət və ${meta.intercity_stats?.departures || 0} gediş. Bu, tam cədvəl və ya canlı izləmə deyil. Xətlər OSM/OSRM yolları ilə təxmini qurulub; ${meta.intercity_stats?.locality_references || 0} istiqamətdə son nöqtə təsdiqlənmiş avtovağzal deyil, yaşayış məntəqəsində təxmini oriyentirdir. Çatma vaxtı və avtobusların mövqeyi təxminidir.`, "Bakı–Naxçıvan avtobus reysləri barədə AYNA 28 fevral 2026-cı ildə müvəqqəti dayandırılma elan edib; bərpa təsdiqlənmədiyindən bu xətt göstərilmir.", "9 noyabr yoxlamasında AYNA siyahısındakı 110, 137, 200, 446, 150A, 539 və 556 nömrəli marşrutların xətti və dayanacaqları mövcud deyildi; 144 nömrəli marşrut üzrə sorğu xəta qaytarırdı.", "Bakı və Abşeron üzrə məlumat tam olmaya bilər. Sumqayıt qismən əhatə olunur. Naxçıvan və digər şəhərlərin tam xəritəsi hələ əlavə edilməyib. Dövlət sərhədi OpenStreetMap məlumatlarındandır (ODbL)." ] : language === "en" ? [ "This is a model of a day, not live tracking or an official journey planner. Routes operating on different days are combined; available service-day information is retained for a future selector.", "Baku and Absheron routes and stops are based on an October 2026 AYNA map snapshot used by Ismat Samadov's research. Carrier names were matched against AYNA data from 8 November 2026. Most bus headways are estimates and recent changes may be missing.", "Ganja: 22 city and suburban routes are shown. Route 4 uses OpenStreetMap; the other 21 routes and stops use CityCard. Stop ordering, speed and most intervals are modelled. Published operating hours are mostly from 2025.", "Nakhchivan: routes 1 and 3 use OpenStreetMap and may differ from the updated 2026 network. Route 1 has no confirmed stop list. Operating hours derive from AYNA tender conditions; headways are modelled.", `Intercity: ${meta.intercity_stats?.directions || 0} outbound directions and ${meta.intercity_stats?.departures || 0} departures from a partial Baku bus terminal snapshot dated 9 November 2026. Regional departures come from AYNA tender conditions and may no longer apply. Roads, journey times and vehicle positions are estimates.`, "Metro, funicular and rail paths use OpenStreetMap. Published train departures are combined across service days. Suburban headways, intermediate station times and vehicle positions are modelled; rail coverage is incomplete.", "Khankendi's three routes are listed from AYNA but do not yet have route geometry. AYNA announced a tender for Mingachevir route 5 in September 2026; its route geometry has not been found.", "A place in the city selector does not imply that its city bus routes or current timetable are available. Land borders use OpenStreetMap (ODbL)." ] : [ "Это сводная модель суток: в ней вместе показаны маршруты, которые могут работать в разные дни недели. Данные о днях работы сохранены для будущего переключателя.", meta.bus_model, meta.colors, meta.h1_model, meta.rail_model, meta.funicular_model, meta.ganja_model, meta.nakh_model, meta.intercity_model, meta.regional_intercity_model, meta.train_model, "В Ханкенди приведён список трёх городских маршрутов AYNA, но схемы не найдены и на карте не показаны. Для Мингечевира указан маршрут № 5 из конкурса AYNA сентября 2026 года; его трасса не найдена, актуальная работа не подтверждена.", "Рейсы Баку–Нахичевань были временно приостановлены по сообщению AYNA от 28 февраля 2026 года; подтверждения возобновления не найдено, поэтому линия не показана.", "Это модель, а не фактическое движение. Сумгаит покрыт частично; схемы Нахичевани и других городов неполные. Граница: OpenStreetMap, ODbL.", "При проверке AYNA 9 ноября в списке были 110, 137, 200, 446, 150A, 539 и 556 без доступной трассы и остановок; запрос маршрута 144 возвращал ошибку. Кроме того, исследователь отмечал отсутствие части обновлений сети в данных.", "Данные для исследования взяты из карты AYNA; сайт вакансий разместил описание исследования и не является источником маршрутов. Точное время завершения последних поездок метро после полуночи не подтверждено." ];
            const date = meta.dataset_compiled_on || "2026-11-09", displayDate = date.split("-").reverse().join(".");
            const updated = langText(`Данные собраны: ${displayDate}. Источники относятся к разным датам; это не дата обновления каждого маршрута.`, `Məlumatlar ${displayDate} tarixində toplanıb. Mənbələrin tarixləri fərqlidir; bu, hər marşrutun yenilənmə tarixi deyil.`, `Dataset compiled: ${displayDate}. Sources have different dates; this is not an update date for every route.`);
            const version = langText(`Версия интерфейса: ${INTERFACE_VERSION}`, `İnterfeys versiyası: ${INTERFACE_VERSION}`, `Interface version: ${INTERFACE_VERSION}`);
            $(".tr-about-content").innerHTML = `<p>${esc(updated)}</p><p>${esc(version)}</p>` + paragraphs.filter(Boolean).map(s => `<p>${esc(s)}</p>`).join("") + `<p><a href="sources.html?lang=${language}">${langText("Источники", "Mənbələr", "Sources")} →</a></p>`;
        };
        aboutContent();
        const updateCityTitle = () => {
            $(".tr-area").textContent = areaName ? areaName[language] || areaName.az : langText("Азербайджан", "Azərbaycan", "Azerbaijan");
        };
        const catalogBox = $(".tr-city-catalog"), catalogList = $(".tr-city-catalog-list");
        function renderCityCatalog() {
            const selectedCity = $(".tr-city").value;
            const city = otherCityById.get(selectedCity)?.az === "Mingəçevir" ? "mingechevir" : selectedCity;
            const catalog = D.city_catalog?.[city];
            catalogBox.hidden = !catalog;
            if (!catalog) {
                catalogList.innerHTML = "";
                return;
            }
            const agencyPrefix = city === "ganja" ? "Gəncə ·" : city === "nakhchivan" ? "Naxçıvan ·" : null;
            catalogList.innerHTML = catalog.routes.map(item => {
                const i = agencyPrefix ? routes.findIndex(r => r.type === 3 && r.short === item.number && r.agency.startsWith(agencyPrefix)) : -1;
                const number = esc(item.number), description = esc(localize(item.description)), state = localize(i >= 0 ? "на карте" : catalog.unmapped_state || "схема не найдена");
                return `<div class="tr-city-entry">${i >= 0 ? `<button data-city-route="${i}"><b>${number}</b> · ${description}</button>` : `<b>${number}</b> · ${description}`}<small>${esc(state)}</small></div>`;
            }).join("") + `<a href="${esc(catalog.source)}" target="_blank" rel="noopener noreferrer">${langText("Источник списка", "Mənbə", "Source")} · ${esc(catalog.source_date)}</a>`;
        }
        catalogList.addEventListener("click", e => {
            const b = e.target.closest("[data-city-route]");
            if (!b) return;
            select({
                kind: "route",
                i: +b.dataset.cityRoute
            }, true);
            if (mobile) setDrawer(false); else {
                body.hidden = true;
                toggle.setAttribute("aria-expanded", "false");
            }
        });
        applyLanguage = value => {
            if (![ "az", "ru", "en" ].includes(value)) return;
            language = value;
            document.documentElement.lang = language;
            if (opts.localeUrls && window.history?.replaceState) {
                const url = new URL(window.location?.href || document.baseURI), root = new URL("./", document.baseURI);
                url.pathname = root.pathname;
                url.searchParams.set("lang", language);
                window.history.replaceState(null, "", url.pathname + url.search + url.hash);
            }
            $(".tr-language").querySelectorAll("[data-lang]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === language)));
            const replaceText = (selector, ru) => {
                const n = $(selector);
                if (n) n.textContent = localize(ru);
            };
            replaceText(".tr-subtitle", "Общественный наземный транспорт · сводная модель суток");
            if (peakResult) $(".tr-clock").title = langText(`Пик в начальном кадре: ${hhmm(peakResult.time)}`, `İlkin görünüşdə pik: ${hhmm(peakResult.time)}`, `Opening-view peak: ${hhmm(peakResult.time)}`);
            updateCityTitle();
            replaceText(".tr-about-open", "О карте");
            $(".tr-filter-toggle").textContent = langText("Дополнительно", "Əlavə", "More");
            const filterName = langText("Фильтры", "Filtrlər", "Filters"), closeFilters = langText("Закрыть фильтры", "Filtrləri bağla", "Close filters");
            $(".tr-drawer-header strong").textContent = filterName;
            $(".tr-mobile-filter").setAttribute("aria-label", filterName);
            $(".tr-mobile-filter").title = filterName;
            $(".tr-drawer-close").setAttribute("aria-label", closeFilters);
            $(".tr-drawer-backdrop").setAttribute("aria-label", closeFilters);
            if (mobile) $(".tr-legend").setAttribute("aria-label", filterName);
            $(".tr-mode-header").textContent = langText("Сейчас в кадре:", "Hazırda ekranda:", "Currently in view:");
            $(".tr-theme").title = langText("Сменить тему", "Temanı dəyiş", "Change theme");
            $(".tr-theme").setAttribute("aria-label", $(".tr-theme").title);
            $(".tr-live-toggle").textContent = langText("Симуляция текущего времени", "Cari vaxtın simulyasiyası", "Simulate current time");
            $(".tr-live-badge").textContent = langText("СИМУЛЯЦИЯ", "SİMULYASİYA", "SIMULATION");
            $(".tr-live-dialog h2").textContent = langText("Симуляция текущего времени", "Cari vaxtın simulyasiyası", "Current-time simulation");
            $(".tr-live-dialog p").textContent = langText("Это симуляция движения на текущее время. Живые данные о местоположении транспорта пока не поступают.", "Bu, cari vaxt üçün hərəkət simulyasiyasıdır. Nəqliyyatın canlı məkan məlumatları hələ alınmır.", "This simulates movement at the current time. Live vehicle-location data is not available.");
            $(".tr-live-close").textContent = langText("Понятно", "Aydındır", "Got it");
            replaceText(".tr-mode-note", "Фуникулёр: 10:00–13:00, 14:00–20:00");
            replaceText(".tr-city-label", "Область");
            replaceText(".tr-intercity-note", "Межгород: трассы и время пути приблизительные");
            replaceText(".tr-agency-details summary", "Перевозчики");
            replaceText(".tr-route-details summary", "Маршруты");
            replaceText(".tr-city-catalog summary", "Маршруты города");
            replaceText('[data-routes="all"]', "Показать все");
            replaceText('[data-routes="none"]', "Снять все");
            replaceText(".tr-about h2", "О карте");
            replaceText(".tr-about-close", "Закрыть");
            input.placeholder = localize("Маршрут или остановка");
            $(".tr-route-query").placeholder = localize("Номер или название");
            input.setAttribute("aria-label", localize("Маршрут или остановка"));
            $(".tr-route-query").setAttribute("aria-label", langText("Поиск в списке маршрутов", "Marşrut siyahısında axtarış", "Search the route list"));
            $(".tr-city").setAttribute("aria-label", langText("Область карты", "Xəritə ərazisi", "Map area"));
            $(".tr-range").setAttribute("aria-label", localize("Время суток"));
            $(".tr-play").setAttribute("aria-label", localize("Воспроизвести или остановить"));
            $(".tr-spark").title = localize("Передвиньте время");
            $(".tr-zoom-value").title = localize("Масштаб относительно начального вида");
            $(".tr-fps").title = langText("Кадры анимации в секунду", "Animasiyanın saniyədə kadr sayı", "Animation frames per second");
            $(".tr-hint").textContent = (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl") + langText(" + прокрутка для масштаба", " + miqyas üçün sürüşdürün", " + scroll to zoom");
            for (const [selector, ru, az, en] of [ [ '[data-z="1.6"]', "Приблизить", "Yaxınlaşdır", "Zoom in" ], [ '[data-z="0.625"]', "Отдалить", "Uzaqlaşdır", "Zoom out" ], [ '[data-z="0"]', "Начальный вид Баку", "Bakının ilkin görünüşü", "Home view of Baku" ] ]) {
                const b = $(selector);
                b.title = langText(ru, az, en);
                b.setAttribute("aria-label", b.title);
            }
            $(".tr-speed summary").setAttribute("aria-label", langText("Скорость воспроизведения", "Oynatma sürəti", "Playback speed"));
            $(".tr-speed-range").setAttribute("aria-label", langText("Скорость воспроизведения", "Oynatma sürəti", "Playback speed"));
            fullscreenChange();
            modeBox.querySelectorAll(".tr-mode").forEach(b => {
                b.querySelector("span").textContent = localize(MODES[+b.dataset.m] || "Другой транспорт");
                b.title = localize("Количество в кадре; нажмите, чтобы включить или скрыть");
            });
            const otherGroup = $("[data-group=other]")?.parentNode?.querySelector("b");
            if (otherGroup) otherGroup.textContent = localize("Другие перевозчики");
            routeList.querySelectorAll("[data-route-pick]").forEach(b => {
                const r = routes[+b.dataset.routePick];
                b.innerHTML = chip(r) + " " + esc(localize(r.long || label(r)));
            });
            const cityNames = {
                map: langText("На карте", "Xəritədə", "On map"),
                baku: "Баку",
                sumqayit: "Сумгаит · частично",
                ganja: "Гянджа · 22 маршрута",
                sheki: "Шеки · межгород",
                lankaran: "Ленкорань · межгород",
                nakhchivan: "Нахичевань · 2 маршрута",
                country: "Весь Азербайджан"
            };
            $(".tr-city").querySelectorAll("option").forEach(n => {
                const other = otherCityById.get(n.value);
                n.textContent = other ? `${other[language] || other.az} · ${other.coverage === "place" ? langText("нет данных", "məlumat yoxdur", "no route data") : langText("межгород", "şəhərlərarası", "intercity")}` : localize(cityNames[n.value] || "");
            });
            renderCityCatalog();
            aboutContent();
            status();
            if (sel) renderPanel(true);
            scheduleDraw();
        };
        $(".tr-language").addEventListener("click", e => {
            const button = e.target.closest("[data-lang]");
            if (button) applyLanguage(button.dataset.lang);
        });
        $(".tr-about-open").onclick = () => about.showModal();
        $(".tr-about-close").onclick = () => about.close();
        $(".tr-city").onchange = e => {
            const selected = e.target.value;
            applyArea(selected, selected === "country" ? null : namedPlaces[selected] || otherCityById.get(selected));
            if (!catalogBox.hidden) catalogBox.open = true;
            const places = {
                sumqayit: [ 49.668, 40.589 ],
                ganja: [ 46.36, 40.68 ],
                sheki: [ 47.17, 41.19 ],
                lankaran: [ 48.85, 38.75 ],
                nakhchivan: [ 45.41, 39.21 ],
                xankendi: [ 46.75, 39.82 ]
            };
            const other = otherCityById.get(e.target.value);
            const place = places[e.target.value] || (other ? [ other.lon, other.lat ] : null);
            if (e.target.value === "country") {
                const [w0, s0, e0, n0] = countryBounds;
                if (map) map.fitBounds([ [ w0, s0 ], [ e0, n0 ] ], {
                    padding: 16,
                    duration: 450
                }); else {
                    const [x0, y0] = framePoint(w0, n0), [x1, y1] = framePoint(e0, s0), s = countryScale();
                    view = {
                        s: s,
                        x: cv.width / 2 - (x0 + x1) * s / 2,
                        y: cv.height / 2 - (y0 + y1) * s / 2
                    };
                }
            } else if (e.target.value === "baku") fit(); else if (map && place) map.easeTo({
                center: place,
                zoom: 11,
                duration: 450
            }); else {
                const [lo, la] = place || places.sumqayit;
                const mx = R0 * lo * Math.PI / 180, my = R0 * Math.log(Math.tan(Math.PI / 4 + la * Math.PI / 360));
                const x = (mx - F.cx) / F.m + D.w / 2, y = (F.cy - my) / F.m + D.h / 2;
                const s = 2 * Math.min(cv.width / D.w, cv.height / D.h);
                view = {
                    s: s,
                    x: cv.width / 2 - x * s,
                    y: cv.height / 2 - y * s
                };
                constrainView();
            }
            last = performance.now();
            scheduleDraw();
        };
        setCity = value => {
            const city = $(".tr-city");
            city.value = value;
            city.dispatchEvent(new window.Event("change", {
                bubbles: true
            }));
        };
        applyArea("baku", namedPlaces.baku);
    }
    function nextIndex(tr) {
        let k = 0;
        while (k < tr.stops.length && tr.arr[k] + tr.shift < t) k++;
        return k;
    }
    const timeOf = (tr, k) => (tr.dwell[k] < 0 ? "~" : "") + hhmm(D.start + tr.arr[k] + tr.shift);
    function renderPanel(full = true) {
        if (!sel) {
            panel.classList.remove("on");
            return;
        }
        const body = panel.querySelector(".tr-pb");
        const keep = body ? body.scrollTop : 0;
        let head = "", rows = "";
        if (sel.kind === "planned") {
            const p = planned[sel.i];
            const line = p.line === "M3" ? langText("Фиолетовая линия", "Bənövşəyi xətt", "Purple line") : langText("Зелёная линия", "Yaşıl xətt", "Green line");
            head = `<h3>${esc(p.name)}</h3><p>${line} · ${langText("планируется", "planlaşdırılır", "planned")}</p>`;
            rows = `<div class="tr-note">${langText("Пунктир — приблизительная схема OpenStreetMap. Станция ещё не открыта.", "Punktir xətt OpenStreetMap-ə əsasən təxminidir. Stansiya hələ açılmayıb.", "Dashed alignment is an OpenStreetMap estimate. The station is not open yet.")}</div>`;
        } else if (sel.kind === "trip") {
            const tr = trips[sel.i], r = routes[tr.r], k = nextIndex(tr), live = t >= tr.t0 && t <= tr.t1;
            head = `<h3>${hchip(r)} ${esc(label(r))}${tr.head ? " → " + esc(tr.head) : ""}</h3><p>${esc(where(r))}</p>\n        <p>${!live ? t < tr.t0 ? "Рейс ещё не начался" : "Рейс завершён" : !tr.stops.length ? "Остановки не подтверждены" : k < tr.stops.length ? `Далее: <b>${esc(stops[tr.stops[k]].name)}</b> в ${timeOf(tr, k)}` : "Прибытие"}</p>\n        <div class="tr-acts"><button data-a="follow" class="${follow ? "on" : ""}">Следовать</button><button data-a="route">Весь маршрут</button></div>`;
            rows = `<div class="tr-sec">Остановки рейса</div>` + Array.from(tr.stops, (s, j) => `<div class="tr-row click ${j < k ? "past" : j === k ? "next" : ""}" data-s="${s}"><span class="t">${timeOf(tr, j)}</span><span class="n">${esc(stops[s].name)}</span></div>`).join("") + `<div class="tr-note">Положение и время в пути рассчитаны по модели.</div>`;
        } else if (sel.kind === "route") {
            const r = routes[sel.i], mine = schedule.runsByRoute[sel.i].map(i => [ trips[i], i ]);
            const inWin = mine.filter(([tr]) => tr.t1 >= 0 && tr.t0 <= span), now = pos.filter(p => trips[p[0]].r === sel.i);
            const heads = {};
            for (const [tr] of inWin) heads[tr.head] = (heads[tr.head] || 0) + 1;
            head = `<h3>${hchip(r)} ${esc(r.long && r.short ? r.long : label(r))}</h3><p>${esc([ MODES[r.type], r.agency ].filter(Boolean).join(" · "))}</p>\n        <p><b>${now.length}</b> в кадре · <b>${inWin.length}</b> расчётных рейсов за сутки</p>`;
            rows = `<div class="tr-sec">Рейсы по направлениям</div>` + Object.entries(heads).sort((a, b) => b[1] - a[1]).map(([h, n]) => `<div class="tr-row"><span class="n">${esc(h || "Направление не указано")}</span><span class="t" style="text-align:right">${n}</span></div>`).join("") + `<div class="tr-sec">Транспорт в кадре</div>` + (now.map(([i]) => {
                const tr = trips[i], k = nextIndex(tr);
                return `<div class="tr-row click" data-t="${i}"><span class="n">${tr.head ? "→ " + esc(tr.head) : esc(label(r))}</span><span class="t" style="text-align:right">${k < tr.stops.length ? esc(stops[tr.stops[k]].name) : ""}</span></div>`;
            }).join("") || `<div class="tr-note">В этом кадре транспорта нет.</div>`);
        } else {
            const st = stops[sel.i], hour = Math.floor(Math.min(t, span - 1) / 3600), start = hour * 3600, end = start + 3600;
            if (renderedStopHour >= 0 && renderedStopHour !== hour) hoverRoute = -1;
            renderedStopHour = hour;
            const deps = departuresDuring(schedule, group, start, end, visible);
            const served = [ ...stopRouteSet || [] ].sort((a, b) => label(routes[a]).localeCompare(label(routes[b]), "ru", {
                numeric: true
            }));
            head = `<h3>${esc(st.name)}</h3><p>Маршруты через остановку:</p><div class="tr-routes-at-stop">${served.map(i => `<button data-r="${i}" title="Открыть маршрут ${esc(label(routes[i]))}">${chip(routes[i])}</button>`).join("")}</div>`;
            rows = `<div class="tr-sec">Расчётные отправления · ${hhmm(start)}–${end === span ? "24:00" : hhmm(end)}</div>` + (deps.map(([a, i]) => {
                const tr = trips[i], r = routes[tr.r];
                return `<div class="tr-row click" data-t="${i}" data-route-hover="${tr.r}"><span class="t">${hhmm(D.start + a)}</span>${chip(r)}<span class="n">${esc(tr.head || label(r))}</span></div>`;
            }).join("") || `<div class="tr-note">В этом часе отправлений нет.</div>`);
        }
        const noteRoute = sel.kind === "route" ? sel.i : sel.kind === "trip" ? trips[sel.i].r : -1;
        const sourceNote = D.route_notes?.[String(noteRoute)];
        if (sourceNote) rows += `<div class="tr-note">${esc(sourceNote[language] || sourceNote.ru)}</div>`;
        if (full || !body) {
            panel.innerHTML = localize(`<div class="tr-ph"><button class="tr-x" aria-label="Close">×</button>${head}</div><div class="tr-pb">${rows}</div>`);
            panel.classList.add("on");
        } else {
            panel.querySelector(".tr-ph").innerHTML = localize(`<button class="tr-x" aria-label="Close">×</button>${head}`);
            body.innerHTML = localize(rows);
            body.scrollTop = keep;
        }
        if (full && sel.kind === "trip") {
            const nx = panel.querySelector(".tr-row.next");
            if (nx) nx.scrollIntoView({
                block: "center"
            });
        }
    }
    panel.addEventListener("click", e => {
        const b = e.target.closest("button,[data-s],[data-t],[data-r]");
        if (!b) return;
        if (b.classList.contains("tr-x")) return select(null);
        if (b.dataset.a === "follow") {
            follow = !follow;
            renderPanel(false);
            return;
        }
        if (b.dataset.a === "route") return select({
            kind: "route",
            i: trips[sel.i].r
        }, true);
        if (b.dataset.r != null) return select({
            kind: "route",
            i: +b.dataset.r
        }, true);
        if (b.dataset.s != null) return select({
            kind: "stop",
            i: +b.dataset.s
        }, true);
        if (b.dataset.t != null) return select({
            kind: "trip",
            i: +b.dataset.t
        }, true);
    });
    function select(s, center = false) {
        if (s?.kind === "route" && !routeVisible(s.i)) ensureRouteVisible(s.i);
        sel = s;
        follow = false;
        hoverRoute = -1;
        renderedStopHour = -1;
        renderedPanelMinute = -1;
        group = s?.kind === "stop" ? stopGroup(s.i) : null;
        stopRouteSet = group ? stopRoutes(group) : null;
        renderPanel(true);
        if (center && s?.kind === "route") {
            const paths = netOf(s.i), box = {
                x0: Infinity,
                y0: Infinity,
                x1: -Infinity,
                y1: -Infinity
            };
            for (const [xs, ys] of paths) for (let i = 0; i < xs.length; i++) {
                box.x0 = Math.min(box.x0, xs[i]);
                box.x1 = Math.max(box.x1, xs[i]);
                box.y0 = Math.min(box.y0, ys[i]);
                box.y1 = Math.max(box.y1, ys[i]);
            }
            if (Number.isFinite(box.x0)) {
                const r = pixelRatio(), cssW = cv.width / r, cssH = cv.height / r, wide = cssW > 640;
                const padding = wide ? {
                    top: Math.min(90, cssH * .18),
                    right: Math.min(370, cssW * .4),
                    bottom: Math.min(100, cssH * .18),
                    left: 35
                } : {
                    top: Math.min(120, cssH * .18),
                    right: 25,
                    bottom: Math.min(260, cssH * .38),
                    left: 25
                };
                if (map) map.fitBounds([ lonlat(box.x0, box.y1), lonlat(box.x1, box.y0) ], {
                    padding: padding,
                    duration: 450,
                    maxZoom: 14
                }); else {
                    const W = cv.width, H = cv.height, dx = Math.max(30, box.x1 - box.x0), dy = Math.max(30, box.y1 - box.y0);
                    const scale = Math.min(Math.max(60 * r, W - (padding.left + padding.right) * r) / dx, Math.max(60 * r, H - (padding.top + padding.bottom) * r) / dy);
                    const cx0 = (box.x0 + box.x1) / 2, cy0 = (box.y0 + box.y1) / 2;
                    view = {
                        s: Math.max(.01, scale),
                        x: (W + (padding.left - padding.right) * r) / 2 - cx0 * scale,
                        y: (H + (padding.top - padding.bottom) * r) / 2 - cy0 * scale
                    };
                }
            }
        } else if (center && s) {
            let x, y;
            if (s.kind === "planned") ({x: x, y: y} = planned[s.i]); else if (s.kind === "stop") ({x: x, y: y} = stops[s.i]); else if (s.kind === "trip") {
                const tr = trips[s.i];
                [x, y] = at(tr, Math.min(Math.max(t, tr.t0), tr.t1));
            }
            if (x != null) {
                const r = pixelRatio(), k = Math.max(view.s, 3 * Math.min(cv.width / D.w, cv.height / D.h));
                const wide = cv.width > 640 * r, side = wide ? 170 * r : 0, up = wide ? 0 : cv.height * .22;
                if (map) map.easeTo({
                    center: lonlat(x, y),
                    zoom: map.getZoom() + Math.log2(k / view.s),
                    offset: [ -side / r, -up / r ],
                    duration: 450
                }); else view = {
                    s: k,
                    x: cv.width / 2 - side - x * k,
                    y: cv.height / 2 - up - y * k
                };
            }
        }
    }
    const index = [ ...routes.map((r, i) => ({
        kind: "route",
        i: i,
        text: (r.short + " " + r.long).toLowerCase(),
        r: r
    })), ...(() => {
        const seen = new Map;
        stops.forEach((s, i) => {
            const k = s.name.toLowerCase();
            if (s.name && !seen.has(k)) seen.set(k, i);
        });
        return [ ...seen ].map(([text, i]) => ({
            kind: "stop",
            i: i,
            text: text
        }));
    })() ];
    let hits = [], hi = 0;
    input.addEventListener("input", () => {
        const q = input.value.trim().toLowerCase();
        if (!q) {
            results.style.display = "none";
            return;
        }
        const score = x => x.text === q ? 0 : x.text.startsWith(q) || x.r && x.r.short.toLowerCase() === q ? 1 : x.text.includes(" " + q) ? 2 : x.text.includes(q) ? 3 : 9;
        hits = index.map(x => [ score(x), x ]).filter(a => a[0] < 9).sort((a, b) => a[0] - b[0] || a[1].text.length - b[1].text.length).slice(0, 8).map(a => a[1]);
        hi = 0;
        paintHits();
    });
    function paintHits() {
        results.innerHTML = hits.map((x, j) => x.kind === "route" ? `<button class="${j === hi ? "on" : ""}" data-j="${j}">${chip(x.r)}<span>${esc(x.r.long || label(x.r))}</span></button>` : `<button class="${j === hi ? "on" : ""}" data-j="${j}"><span>${esc(stops[x.i].name)}</span><small>${langText("остановка", "dayanacaq", "stop")}</small></button>`).join("") || `<div class="tr-note" style="padding:8px 10px">${langText("Ничего не найдено", "Heç nə tapılmadı", "No results")}</div>`;
        results.style.display = "block";
    }
    input.addEventListener("keydown", e => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            hi = (hi + (e.key === "ArrowDown" ? 1 : hits.length - 1)) % Math.max(1, hits.length);
            paintHits();
            e.preventDefault();
        }
        if (e.key === "Enter" && hits[hi]) pick(hits[hi]);
        if (e.key === "Escape") {
            input.value = "";
            results.style.display = "none";
            el.focus({
                preventScroll: true
            });
        }
        e.stopPropagation();
    });
    results.addEventListener("click", e => {
        const b = e.target.closest("button");
        if (b) pick(hits[+b.dataset.j]);
    });
    function pick(x) {
        results.style.display = "none";
        input.value = "";
        el.focus({
            preventScroll: true
        });
        select({
            kind: x.kind,
            i: x.i
        }, true);
    }
    const ptrs = new Map;
    let moved = 0, pinch = 0;
    const toWorld = (px, py) => [ (px - view.x) / view.s, (py - view.y) / view.s ];
    function hitAt(cxp, cyp) {
        const [wx, wy] = toWorld(cxp, cyp), r = pixelRatio(), lim = 12 * r / view.s;
        if (!off.has(1)) for (let i = 0; i < planned.length; i++) if ((planned[i].x - wx) ** 2 + (planned[i].y - wy) ** 2 < lim * lim) return {
            kind: "planned",
            i: i
        };
        let best = -1, bd = lim * lim;
        if (view.s / r > 2.5) {
            let bs = -1;
            bd = (8 * r / view.s) ** 2;
            stops.forEach((s, i) => {
                const d = (s.x - wx) ** 2 + (s.y - wy) ** 2;
                if (d < bd) {
                    bd = d;
                    bs = i;
                }
            });
            if (bs >= 0) return {
                kind: "stop",
                i: bs
            };
        }
        bd = lim * lim;
        for (const [i, x, y] of pos) {
            const d = (x - wx) ** 2 + (y - wy) ** 2;
            if (d < bd) {
                bd = d;
                best = i;
            }
        }
        if (best >= 0) return {
            kind: "trip",
            i: best
        };
        if (view.s / r > 2.5) {
            let bs = -1;
            bd = lim * lim;
            stops.forEach((s, i) => {
                const d = (s.x - wx) ** 2 + (s.y - wy) ** 2;
                if (d < bd) {
                    bd = d;
                    bs = i;
                }
            });
            if (bs >= 0) return {
                kind: "stop",
                i: bs
            };
        }
        return null;
    }
    const local = e => {
        const b = cv.getBoundingClientRect(), r = pixelRatio();
        return [ (e.clientX - b.left) * r, (e.clientY - b.top) * r ];
    };
    cv.addEventListener("pointerdown", e => {
        if (peakPending) cancelPeak();
        cv.setPointerCapture(e.pointerId);
        ptrs.set(e.pointerId, local(e));
        moved = 0;
        pinch = 0;
        el.focus({
            preventScroll: true
        });
    });
    cv.addEventListener("pointermove", e => {
        const p = local(e);
        if (!ptrs.has(e.pointerId)) {
            if (e.pointerType !== "mouse") return;
            const h = hitAt(...p);
            hover = h?.kind === "trip" ? h.i : -1;
            hoverPlan = h?.kind === "planned" ? h.i : -1;
            cv.classList.toggle("over", !!h);
            if (h) {
                const b = cv.getBoundingClientRect();
                tip.innerHTML = h.kind === "planned" ? `${esc(planned[h.i].name)} · ${langText("планируется", "planlaşdırılır", "planned")}` : h.kind === "trip" ? `${chip(routes[trips[h.i].r])} ${esc(trips[h.i].head ? "→ " + trips[h.i].head : label(routes[trips[h.i].r]))}` : esc(stops[h.i].name);
                tip.style.left = e.clientX - b.left + "px";
                tip.style.top = e.clientY - b.top + "px";
                tip.style.display = "block";
            } else tip.style.display = "none";
            return;
        }
        const q = ptrs.get(e.pointerId);
        ptrs.set(e.pointerId, p);
        if (ptrs.size === 1) {
            pan(p[0] - q[0], p[1] - q[1]);
            moved += Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]);
            if (moved > 6) {
                cv.classList.add("drag");
                follow = false;
            }
        } else if (ptrs.size === 2) {
            const [a, b] = [ ...ptrs.values() ], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
            if (pinch) zoomAt((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, d / pinch);
            pinch = d;
            moved = 99;
        }
    });
    const up = e => {
        if (!ptrs.has(e.pointerId)) return;
        ptrs.delete(e.pointerId);
        cv.classList.remove("drag");
        if (moved < 6 && !ptrs.size) {
            const h = hitAt(...local(e));
            select(h);
        }
        if (ptrs.size < 2) pinch = 0;
    };
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", e => {
        ptrs.delete(e.pointerId);
        cv.classList.remove("drag");
        pinch = 0;
    });
    cv.addEventListener("pointerleave", () => {
        hover = -1;
        hoverPlan = -1;
        tip.style.display = "none";
        scheduleDraw();
    });
    function pan(dx, dy) {
        const r = pixelRatio();
        if (map) {
            map.panBy([ -dx / r, -dy / r ], {
                animate: false
            });
            syncView();
        } else {
            view.x += dx;
            view.y += dy;
            constrainView();
        }
    }
    function zoomAt(px, py, k) {
        const r = pixelRatio(), base = Math.min(cv.width / D.w, cv.height / D.h);
        if (map) {
            map.jumpTo({
                zoom: map.getZoom() + Math.log2(k),
                around: map.unproject([ px / r, py / r ])
            });
            syncView();
            return;
        }
        const s = Math.min(base * 60, Math.max(countryScale(), view.s * k));
        k = s / view.s;
        view.x = px - (px - view.x) * k;
        view.y = py - (py - view.y) * k;
        view.s = s;
        constrainView();
    }
    const coop = opts.cooperative ?? el.getBoundingClientRect().height < innerHeight * .95;
    el.classList.toggle("coop", coop);
    const hint = $(".tr-hint");
    let hintT = 0;
    hint.textContent = (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl") + " + прокрутка для масштаба";
    cv.addEventListener("wheel", e => {
        if (coop && !e.ctrlKey && !e.metaKey) {
            hint.classList.add("on");
            clearTimeout(hintT);
            hintT = setTimeout(() => hint.classList.remove("on"), 900);
            return;
        }
        e.preventDefault();
        const [px, py] = local(e);
        zoomAt(px, py, Math.exp(-e.deltaY / (e.ctrlKey ? 100 : 400)));
    }, {
        passive: false
    });
    cv.addEventListener("dblclick", e => {
        const [px, py] = local(e);
        zoomAt(px, py, 2);
    });
    $(".tr-zoom").addEventListener("click", e => {
        const b = e.target.closest("button");
        if (!b) return;
        if (b.hasAttribute("data-fullscreen")) {
            const operation = document.fullscreenElement === el ? document.exitFullscreen?.() : el.requestFullscreen?.();
            operation?.catch?.(err => console.warn("Fullscreen:", err));
            return;
        }
        const z = +b.dataset.z;
        if (!z) setCity("baku"); else zoomAt(cv.width / 2, cv.height / 2, z);
    });
    const fullscreenChange = () => {
        const b = $("[data-fullscreen]"), active = document.fullscreenElement === el;
        b.setAttribute("aria-pressed", String(active));
        b.title = active ? langText("Выйти из полноэкранного режима", "Tam ekrandan çıx", "Exit full screen") : langText("На весь экран", "Tam ekran", "Full screen");
        b.setAttribute("aria-label", b.title);
    };
    document.addEventListener("fullscreenchange", fullscreenChange);
    const bakuClock = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Baku",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23"
    });
    let liveSecond = -1, liveBase = 0;
    function liveTime() {
        const ms = (opts.now || Date.now)(), second = Math.floor(ms / 1e3);
        if (second !== liveSecond) {
            const parts = Object.fromEntries(bakuClock.formatToParts(new Date(ms)).map(p => [ p.type, p.value ]));
            liveBase = +parts.hour * 3600 + +parts.minute * 60 + +parts.second;
            liveSecond = second;
        }
        return ((liveBase + ms % 1e3 / 1e3 - D.start) % span + span) % span;
    }
    function setLive(value) {
        live = value;
        $(".tr-live-toggle").setAttribute("aria-pressed", String(value));
        $(".tr-live-badge").hidden = !value;
        if (value) {
            if (peakPending) cancelPeak();
            t = liveTime();
            setPlay(true);
            $(".tr-live-dialog").showModal();
        }
        scheduleDraw();
    }
    $(".tr-live-toggle").onclick = () => setLive(!live);
    $(".tr-live-close").onclick = () => $(".tr-live-dialog").close();
    const darkStyle = {
        land: S.land,
        water: S.water,
        network: S.network
    };
    $(".tr-theme").onclick = () => {
        light = !light;
        el.classList.toggle("tr-light", light);
        Object.assign(S, light ? {
            land: "#f2f4f5",
            water: "#dce8ef",
            network: "#71818f"
        } : darkStyle);
        routeDotColors = routes.map(route => mapColor(route.dot));
        $(".tr-modes").querySelectorAll(".tr-mode").forEach(button => {
            const colors = modeColors(+button.dataset.m);
            button.querySelectorAll("i").forEach((dot, i) => dot.style.background = mapColor(colors[i]));
        });
        $(".tr-agencies").querySelectorAll("[data-agency]").forEach(box => {
            const dot = box.parentNode.querySelector("i"), route = routes.find(item => item.agency === D.agencies[+box.dataset.agency]);
            if (dot && route) dot.style.background = mapColor(route.line || "#aab6c2");
        });
        netPaths = null;
        networkCacheKey = "";
        highlightCacheKey = "";
        cityLabelKey = "";
        if (map) paintBasemap(map);
        drawSpark();
        scheduleDraw();
    };
    const playBtn = $(".tr-play");
    const setPlay = p => {
        playing = p;
        last = performance.now();
        playBtn.textContent = p ? "❚❚" : "▶";
        fpsAt = 0;
        fpsFrames = 0;
        if (!p) $(".tr-fps").textContent = "— FPS";
        scheduleDraw();
    };
    setPlay(playing);
    playBtn.onclick = () => {
        if (live && playing) setLive(false);
        setPlay(!playing);
    };
    const speedRange = $(".tr-speed-range"), speedControl = $(".tr-speed"), speedAnchors = [ .25, .5, 1, 2, 4 ];
    let speedKeyboard = false, committedSpeedPosition = 200;
    function setSpeedSlider(raw, snap = false, commit = false) {
        let x = Math.max(0, Math.min(400, +raw));
        const nearest = Math.round(x / 100) * 100;
        if (snap && Math.abs(x - nearest) <= 4) x = nearest;
        const i = Math.min(3, Math.floor(x / 100)), fraction = (x - i * 100) / 100;
        const next = +(speedAnchors[i] + (speedAnchors[i + 1] - speedAnchors[i]) * fraction).toFixed(2);
        speedRange.value = String(x);
        speedRange.setAttribute("aria-valuetext", next + "×");
        $(".tr-speed-preview").textContent = next + "×";
        if (commit) {
            speed = next;
            committedSpeedPosition = x;
            $(".tr-speed-value").textContent = next + "×";
        }
    }
    speedRange.addEventListener("keydown", () => speedKeyboard = true);
    speedRange.addEventListener("pointerdown", () => speedKeyboard = false);
    speedRange.addEventListener("input", e => setSpeedSlider(e.target.value, !speedKeyboard));
    speedRange.addEventListener("change", e => {
        if (live) setLive(false);
        setSpeedSlider(e.target.value, !speedKeyboard, true);
        speedKeyboard = false;
        speedControl.open = false;
    });
    speedControl.addEventListener("toggle", () => {
        if (!speedControl.open) setSpeedSlider(committedSpeedPosition, false, false);
    });
    $(".tr-speed-marks").addEventListener("click", e => {
        const b = e.target.closest("[data-speed]");
        if (b) {
            if (live) setLive(false);
            setSpeedSlider(b.dataset.speed, true, true);
            speedControl.open = false;
        }
    });
    let scrub = false;
    const range = $(".tr-range");
    range.max = String(span);
    const timeTip = $(".tr-time-tip");
    range.addEventListener("pointermove", e => {
        const b = range.getBoundingClientRect(), f = Math.min(1, Math.max(0, (e.clientX - b.left) / (b.width || 1)));
        timeTip.textContent = f >= .9999 ? "24:00" : hhmm(D.start + f * span);
        timeTip.style.left = 100 * f + "%";
        timeTip.style.display = "block";
    });
    range.addEventListener("pointerleave", () => timeTip.style.display = "none");
    range.addEventListener("pointerdown", () => {
        if (live) setLive(false);
        if (peakPending) cancelPeak();
        scrub = true;
    });
    range.addEventListener("input", e => {
        if (live) setLive(false);
        if (peakPending) cancelPeak();
        t = +e.target.value;
        last = performance.now();
        scheduleDraw();
    });
    const endScrub = () => {
        scrub = false;
        last = performance.now();
        scheduleDraw();
    };
    range.addEventListener("pointerup", endScrub);
    range.addEventListener("pointercancel", endScrub);
    el.addEventListener("keydown", e => {
        if (drawerOpen && e.key === "Escape" && !e.target.closest("dialog[open]")) {
            setDrawer(false);
            e.preventDefault();
            return;
        }
        if (drawerOpen && e.key === "Tab") {
            const controls = [ ...$(".tr-legend").querySelectorAll("button,select,input,a[href],summary") ].filter(item => !item.disabled && item.getClientRects().length && !item.closest("[hidden]"));
            if (controls.length) {
                const first = controls[0], last = controls[controls.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        }
        if (e.target.closest("input,select,textarea,button,summary,a,[role=button]")) return;
        if (e.key === " ") {
            if (live && playing) setLive(false);
            setPlay(!playing);
            e.preventDefault();
        } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            if (live) setLive(false);
            if (peakPending) cancelPeak();
            t = Math.min(span, Math.max(0, t + (e.key === "ArrowRight" ? 30 : -30)));
            e.preventDefault();
        } else if (e.key === "Escape") select(null); else if (e.key === "/") {
            input.focus();
            e.preventDefault();
        }
    });
    setupFilters();
    resize();
    tally();
    applyLanguage(language);
    const routeFromTarget = target => {
        const b = target?.closest?.("[data-route-hover],[data-route-pick],[data-city-route],[data-r]");
        if (!b || !el.contains(b)) return -1;
        const value = b.dataset.routeHover ?? b.dataset.routePick ?? b.dataset.cityRoute ?? b.dataset.r;
        const i = Number(value);
        return Number.isInteger(i) && i >= 0 && i < routes.length ? i : -1;
    };
    const changeHoveredRoute = i => {
        if (hoverRoute !== i) {
            hoverRoute = i;
            scheduleDraw();
        }
    };
    el.addEventListener("pointerover", e => changeHoveredRoute(routeFromTarget(e.target)));
    el.addEventListener("pointerout", e => {
        if (routeFromTarget(e.target) !== routeFromTarget(e.relatedTarget)) changeHoveredRoute(routeFromTarget(e.relatedTarget));
    });
    el.addEventListener("focusin", e => changeHoveredRoute(routeFromTarget(e.target)));
    el.addEventListener("focusout", e => changeHoveredRoute(routeFromTarget(e.relatedTarget)));
    function pickInitialPeak() {
        const bounds = {
            x0: -view.x / view.s,
            y0: -view.y / view.s,
            x1: (cv.width - view.x) / view.s,
            y1: (cv.height - view.y) / view.s
        };
        const finish = result => {
            if (!alive || !peakPending) return;
            peakResult = result;
            t = (result.time - 1800 + span) % span;
            peakPending = false;
            $(".tr-clock").title = langText(`Пик в начальном кадре: ${hhmm(result.time)}`, `İlkin görünüşdə pik: ${hhmm(result.time)}`, `Opening-view peak: ${hhmm(result.time)}`);
            last = performance.now();
            peakWorker?.terminate();
            peakWorker = null;
            scheduleDraw();
        };
        const fallback = () => {
            const scan = peakVisibleSteps(schedule, bounds);
            const step = () => {
                if (!alive || !peakPending) return;
                const deadline = performance.now() + 4;
                let iterations = 0;
                while (iterations++ < 12 && performance.now() < deadline) {
                    const result = scan.next();
                    if (result.done) {
                        peakFrame = 0;
                        finish(result.value);
                        return;
                    }
                }
                peakFrame = requestAnimationFrame(step);
            };
            peakFrame = requestAnimationFrame(step);
        };
        if (typeof Worker === "function") {
            try {
                peakWorker = new Worker(new URL("./peak-worker.mjs?v=20261109m", import.meta.url), {
                    type: "module"
                });
                peakWorker.onmessage = e => {
                    if (e.data?.ok) finish(e.data); else {
                        peakWorker?.terminate();
                        peakWorker = null;
                        fallback();
                    }
                };
                peakWorker.onerror = () => {
                    peakWorker?.terminate();
                    peakWorker = null;
                    fallback();
                };
                peakWorker.postMessage({
                    data: D,
                    bounds: bounds
                });
            } catch (_) {
                peakWorker = null;
                fallback();
            }
        } else fallback();
    }
    if (peakPending) pickInitialPeak();
    const credit = $(".tr-credit");
    credit.textContent = w.credit;
    for (const event of [ "pointerdown", "pointermove", "pointerup", "wheel", "click", "input", "change", "keydown" ]) el.addEventListener(event, scheduleDraw, {
        passive: true
    });
    const visibility = () => {
        if (!onScreen || document.hidden) {
            if (raf) cancelAnimationFrame(raf);
            raf = 0;
        } else {
            last = performance.now();
            fpsAt = 0;
            fpsFrames = 0;
            scheduleDraw();
        }
    };
    document.addEventListener("visibilitychange", visibility);
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => {
        onScreen = !!entries[0]?.isIntersecting;
        visibility();
    }, {
        threshold: .01
    });
    observer?.observe(el);
    last = performance.now();
    scheduleDraw();
    if (opts.basemap !== "plate" && D.frame) loadMap().then(m => {
        if (!alive) return m.remove();
        map = m;
        initialZoom = m.getZoom();
        el.classList.add("tiles");
        map.on("move", scheduleDraw);
        map.on("resize", scheduleDraw);
        scheduleDraw();
        const own = /Map(: Natural Earth| © OpenStreetMap contributors)/;
        credit.textContent = own.test(w.credit) ? w.credit.replace(own, BASEMAP_CREDIT) : w.credit + "  ·  " + BASEMAP_CREDIT;
    }).catch(e => console.warn("transit-reels: no tiled base map, using the still map", e));
    return {
        play: () => setPlay(true),
        pause: () => setPlay(false),
        seek: clock => {
            if (peakPending) cancelPeak();
            t = Math.min(span, Math.max(0, clock - D.start));
            last = performance.now();
            scheduleDraw();
        },
        destroy: () => {
            alive = false;
            clearTimeout(routePickTimer);
            clearTimeout(areaTimer);
            clearTimeout(liveTimer);
            cancelPeak();
            cancelAnimationFrame(raf);
            ro.disconnect();
            observer?.disconnect();
            document.removeEventListener("visibilitychange", visibility);
            document.removeEventListener("fullscreenchange", fullscreenChange);
            map?.remove();
            el.innerHTML = "";
            el.classList.remove("tr", "tiles", "tr-light", "tr-mobile", "tr-drawer-open");
        }
    };
}
