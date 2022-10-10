const jobs = new Set<() => void>();
let process = false;

export const queueJob = (job: () => void) => {
  if (!jobs.has(job)) {
    jobs.add(job);
  }
  Promise.resolve().then(flushQueue);
};

export const flushQueue = () => {
  if (!process) {
    process = true;
    const all = [];
    const iterate = jobs.values();
    let res = null;
    while ((res = iterate.next())) {
      res.value && all.push(res.value);
      if (res.done) break;
    }
    jobs.clear();
    for (const job of all) {
      job();
    }
    process = false;
  }
};
