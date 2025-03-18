var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import { Process, Processor } from '@nestjs/bull';
let QueueService = (() => {
    let _classDecorators = [Processor('POSITIONS')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _processMakeBalancesSnapshotJob_decorators;
    var QueueService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _processMakeBalancesSnapshotJob_decorators = [Process({ name: 'job_name' })];
            __esDecorate(this, null, _processMakeBalancesSnapshotJob_decorators, { kind: "method", name: "processMakeBalancesSnapshotJob", static: false, private: false, access: { has: obj => "processMakeBalancesSnapshotJob" in obj, get: obj => obj.processMakeBalancesSnapshotJob }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            QueueService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        appConfig = __runInitializers(this, _instanceExtraInitializers);
        positionsJobsQueue;
        appHasLaunched = false;
        constructor(appConfig, positionsJobsQueue) {
            this.appConfig = appConfig;
            this.positionsJobsQueue = positionsJobsQueue;
        }
        async pauseAllQueues() {
            await this.positionsJobsQueue.pause();
            console.log(`[x] Queue "POSITIONS" has been paused`);
        }
        async resumeAllQueues() {
            await this.positionsJobsQueue.resume();
            console.log(`[v] Queue "POSITIONS" has been resumed`);
        }
        async removeJobById(id) {
            const allExistingJob = await this.positionsJobsQueue.getJob(id);
            if (!allExistingJob) {
                console.log(`Job with ID ${id} has not been found. Deletion is not possible.`);
                return;
            }
            try {
                await allExistingJob.remove();
            }
            catch (e) {
                console.log(`Remove job ${id} with error ${e}`);
            }
        }
        async setRecurringJob() {
            const job = await this.positionsJobsQueue.add('job_name', null, {
                attempts: 1,
                removeOnComplete: false,
                jobId: 'make_balances_snapshot',
                repeat: {
                    every: 10_000,
                },
            });
        }
        async processMakeBalancesSnapshotJob(job) {
            await job.takeLock();
            try {
                const result = 'some job handler run here';
                await job.moveToCompleted(JSON.stringify(result), true);
                await job.releaseLock();
                return result;
            }
            catch (e) {
                console.log(e);
                await job.moveToFailed({
                    message: e.message || 'Something went wrong.',
                });
                await job.releaseLock();
                console.log(`released failed - ${job.id}`);
                return 'failed';
            }
        }
    };
    return QueueService = _classThis;
})();
export { QueueService };
