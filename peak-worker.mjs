import { buildSchedule, peakVisibleAt } from "./schedule.mjs?v=20261109l";

self.onmessage = event => {
    try {
        const {data: data, bounds: bounds} = event.data, model = buildSchedule(data);
        self.postMessage({
            ok: true,
            ...peakVisibleAt(model, bounds)
        });
    } catch (error) {
        self.postMessage({
            ok: false,
            error: String(error)
        });
    }
};
