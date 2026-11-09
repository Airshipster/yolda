export function undelta(values, scale = 1) {
    const result = new Float64Array(values.length);
    let total = 0;
    for (let i = 0; i < values.length; i++) {
        total += values[i];
        result[i] = total / scale;
    }
    return result;
}

export function buildSchedule(D, binSeconds = 300) {
    if (!Array.isArray(D.schedules) || D.schedules.length !== D.trips.length) throw new Error("Schedule and template counts differ");
    const span = D.end - D.start;
    const routes = D.routes.map(([short, long, type, line, dot, agency, tier, rank = tier]) => ({
        short: short,
        long: long,
        type: type,
        line: line,
        dot: dot,
        tier: tier,
        rank: rank,
        drawn: tier > 0,
        agency: D.agencies[agency] || ""
    }));
    const stops = D.stops.map(([name, x, y]) => ({
        name: name,
        x: x / 10,
        y: y / 10
    }));
    const templates = D.trips.map(([r, isLine, dx, dy, dt, head, ds, da, dwell]) => {
        const xs = undelta(dx, 10), ys = undelta(dy, 10), bounds = {
            x0: Infinity,
            y0: Infinity,
            x1: -Infinity,
            y1: -Infinity
        };
        for (let i = 0; i < xs.length; i++) {
            bounds.x0 = Math.min(bounds.x0, xs[i]);
            bounds.x1 = Math.max(bounds.x1, xs[i]);
            bounds.y0 = Math.min(bounds.y0, ys[i]);
            bounds.y1 = Math.max(bounds.y1, ys[i]);
        }
        return {
            r: r,
            isLine: !!isLine,
            xs: xs,
            ys: ys,
            bounds: bounds,
            ts: undelta(dt),
            head: D.headsigns[head] || "",
            stops: undelta(ds),
            arr: undelta(da),
            dwell: dwell,
            mode: routes[r].type
        };
    });
    const bins = Array.from({
        length: Math.ceil(span / binSeconds)
    }, () => []);
    const trips = [], runsByRoute = Array.from({
        length: routes.length
    }, () => []);
    const runsByPattern = Array.from({
        length: templates.length
    }, () => []);
    const stopIndex = Array.from({
        length: stops.length
    }, () => []);
    templates.forEach((base, pi) => {
        if (base.ts.length < 2 || base.xs.length !== base.ts.length || base.ys.length !== base.ts.length) throw new Error(`Invalid shape ${pi}`);
        for (let k = 0; k < base.stops.length; k++) {
            const stop = base.stops[k];
            if (!Number.isInteger(stop) || stop < 0 || stop >= stops.length) throw new Error(`Invalid stop in template ${pi}`);
            stopIndex[stop].push([ pi, k ]);
        }
        const schedule = D.schedules[pi], departures = [];
        if (Array.isArray(schedule.departures)) {
            for (const d of schedule.departures) {
                if (!Number.isFinite(d) || d < 0 || d >= 86400) throw new Error(`Invalid departure ${pi}`);
                if (schedule.repeat_yesterday) departures.push(d - 86400);
                departures.push(d);
            }
        } else {
            const windows = (schedule.windows || []).flatMap(w => schedule.repeat_yesterday ? [ {
                ...w,
                start: w.start - 86400,
                end: w.end - 86400
            }, w ] : [ w ]);
            for (const win of windows) {
                if (!(win.headway > 0 && win.end > win.start)) throw new Error(`Invalid frequency ${pi}`);
                for (let departure = win.start; departure < win.end; departure += win.headway) departures.push(departure);
            }
        }
        for (const departure of departures) {
            const shift = departure - schedule.base, t0 = base.ts[0] + shift, t1 = base.ts[base.ts.length - 1] + shift;
            if (t1 < 0 || t0 > span) continue;
            const index = trips.length;
            const trip = {
                ...base,
                shift: shift,
                t0: t0,
                t1: t1,
                pattern: pi,
                departure: departure,
                k: 0
            };
            trips.push(trip);
            runsByRoute[trip.r].push(index);
            runsByPattern[pi].push(index);
            const first = Math.max(0, Math.floor(t0 / binSeconds));
            const last = Math.min(bins.length - 1, Math.floor(Math.min(span - 1e-6, t1) / binSeconds));
            for (let b = first; b <= last; b++) bins[b].push(index);
        }
        runsByPattern[pi].sort((a, b) => trips[a].departure - trips[b].departure);
    });
    for (const bin of bins) bin.sort((a, b) => routes[trips[a].r].rank - routes[trips[b].r].rank);
    return {
        span: span,
        routes: routes,
        stops: stops,
        templates: templates,
        trips: trips,
        bins: bins,
        binSeconds: binSeconds,
        runsByRoute: runsByRoute,
        runsByPattern: runsByPattern,
        stopIndex: stopIndex
    };
}

export function candidatesAt(schedule, time) {
    if (time < 0 || time > schedule.span || !schedule.bins.length) return [];
    return schedule.bins[Math.min(schedule.bins.length - 1, Math.floor(time / schedule.binSeconds))];
}

export function at(trip, time) {
    const ts = trip.ts, local = time - trip.shift;
    let lo = 0, hi = ts.length - 1;
    while (lo + 1 < hi) {
        const mid = lo + hi >> 1;
        if (ts[mid] <= local) lo = mid; else hi = mid;
    }
    const i = Math.min(lo, ts.length - 2), dt = ts[i + 1] - ts[i];
    const f = dt > 0 ? Math.max(0, Math.min(1, (local - ts[i]) / dt)) : 0;
    return [ trip.xs[i] + (trip.xs[i + 1] - trip.xs[i]) * f, trip.ys[i] + (trip.ys[i + 1] - trip.ys[i]) * f ];
}

export function visibleCountAt(schedule, time, bounds, visible = () => true) {
    let count = 0;
    for (const i of candidatesAt(schedule, time)) {
        const tr = schedule.trips[i], b = tr.bounds;
        if (time < tr.t0 || time > tr.t1 || !visible(tr) || b.x1 < bounds.x0 || b.x0 > bounds.x1 || b.y1 < bounds.y0 || b.y0 > bounds.y1) continue;
        const [x, y] = at(tr, time);
        if (x >= bounds.x0 && x <= bounds.x1 && y >= bounds.y0 && y <= bounds.y1) count++;
    }
    return count;
}

export function* peakVisibleSteps(schedule, bounds, visible = () => true) {
    const events = new Map, add = (t, n) => events.set(t, (events.get(t) || 0) + n);
    for (let pi = 0; pi < schedule.templates.length; pi++) {
        const base = schedule.templates[pi];
        const b = base.bounds;
        if (b.x1 < bounds.x0 || b.x0 > bounds.x1 || b.y1 < bounds.y0 || b.y0 > bounds.y1) {
            yield;
            continue;
        }
        const intervals = [];
        for (let i = 0; i < base.ts.length - 1; i++) {
            const duration = base.ts[i + 1] - base.ts[i];
            if (duration <= 0) continue;
            let lo = 0, hi = 1;
            for (const [p, d, min, max] of [ [ base.xs[i], base.xs[i + 1] - base.xs[i], bounds.x0, bounds.x1 ], [ base.ys[i], base.ys[i + 1] - base.ys[i], bounds.y0, bounds.y1 ] ]) {
                if (d === 0) {
                    if (p < min || p > max) {
                        lo = 1;
                        hi = 0;
                        break;
                    }
                    continue;
                }
                const a = (min - p) / d, z = (max - p) / d;
                lo = Math.max(lo, Math.min(a, z));
                hi = Math.min(hi, Math.max(a, z));
                if (lo > hi) break;
            }
            if (lo > hi || hi < 0 || lo > 1) continue;
            const start = base.ts[i] + duration * Math.max(0, lo), end = base.ts[i] + duration * Math.min(1, hi);
            const last = intervals[intervals.length - 1];
            if (last && start <= last[1] + 1e-7) last[1] = Math.max(last[1], end); else intervals.push([ start, end ]);
        }
        if (!intervals.length) {
            yield;
            continue;
        }
        for (const idx of schedule.runsByPattern[pi]) {
            const run = schedule.trips[idx];
            if (!visible(run)) continue;
            for (const [a, b] of intervals) {
                const start = Math.max(0, Math.ceil(a + run.shift - 1e-7));
                const end = Math.min(schedule.span - 1, Math.floor(b + run.shift + 1e-7));
                if (start <= end) {
                    add(start, 1);
                    add(end + 1, -1);
                }
            }
        }
        yield;
    }
    let count = 0, bestCount = 0, bestTime = 0;
    for (const t of [ ...events.keys() ].sort((a, b) => a - b)) {
        count += events.get(t);
        if (t < schedule.span && count > bestCount) {
            bestCount = count;
            bestTime = t;
        }
    }
    return {
        time: bestTime,
        count: bestCount
    };
}

export function peakVisibleAt(schedule, bounds, visible = () => true) {
    const scan = peakVisibleSteps(schedule, bounds, visible);
    let result;
    do {
        result = scan.next();
    } while (!result.done);
    return result.value;
}

export function timeline(schedule, samples, visible = () => true) {
    const diff = new Int32Array(samples + 1), out = new Int32Array(samples);
    for (const tr of schedule.trips) if (visible(tr)) {
        const a = Math.max(0, Math.ceil(tr.t0 / schedule.span * (samples - 1)));
        const b = Math.min(samples - 1, Math.floor(tr.t1 / schedule.span * (samples - 1)));
        if (a <= b) {
            diff[a]++;
            diff[b + 1]--;
        }
    }
    let current = 0;
    for (let i = 0; i < samples; i++) {
        current += diff[i];
        out[i] = current;
    }
    return out;
}

export function routesAtStops(schedule, group) {
    const routes = new Set;
    for (const stop of group) for (const [pi] of schedule.stopIndex[stop] || []) routes.add(schedule.templates[pi].r);
    return routes;
}

export function nextDepartures(schedule, group, time, visible = () => true, limit = 40) {
    const entries = [], seen = new Set;
    for (const stop of group) for (const [pi, k] of schedule.stopIndex[stop] || []) {
        const key = `${pi}:${k}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const template = schedule.templates[pi], runs = schedule.runsByPattern[pi];
        if (k >= template.stops.length - 1 || !runs.length || !visible(schedule.trips[runs[0]])) continue;
        const departureAt = idx => {
            const tr = schedule.trips[idx];
            return tr.arr[k] + tr.shift + Math.max(0, tr.dwell[k] || 0);
        };
        let lo = 0, hi = runs.length;
        while (lo < hi) {
            const mid = lo + hi >> 1;
            if (departureAt(runs[mid]) < time - 30) lo = mid + 1; else hi = mid;
        }
        for (let i = lo; i < Math.min(runs.length, lo + 3); i++) {
            const when = departureAt(runs[i]);
            if (when > schedule.span) break;
            entries.push([ when, runs[i], k ]);
        }
    }
    return entries.sort((a, b) => a[0] - b[0]).slice(0, limit);
}

export function departuresDuring(schedule, group, start, end, visible = () => true, limit = 2e3) {
    const entries = [], seen = new Set;
    for (const stop of group) for (const [pi, k] of schedule.stopIndex[stop] || []) {
        const key = `${pi}:${k}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const template = schedule.templates[pi], runs = schedule.runsByPattern[pi];
        if (k >= template.stops.length - 1 || !runs.length || !visible(schedule.trips[runs[0]])) continue;
        const departureAt = idx => {
            const tr = schedule.trips[idx];
            return tr.arr[k] + tr.shift + Math.max(0, tr.dwell[k] || 0);
        };
        let lo = 0, hi = runs.length;
        while (lo < hi) {
            const mid = lo + hi >> 1;
            if (departureAt(runs[mid]) < start) lo = mid + 1; else hi = mid;
        }
        for (let i = lo; i < runs.length; i++) {
            const when = departureAt(runs[i]);
            if (when >= end || when > schedule.span) break;
            entries.push([ when, runs[i], k ]);
        }
    }
    return entries.sort((a, b) => a[0] - b[0]).slice(0, limit);
}
