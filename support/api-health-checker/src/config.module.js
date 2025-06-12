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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { Global, Logger, Module } from '@nestjs/common';
import { transformAndValidateSync } from 'class-transformer-validator';
import { IsNotEmpty, ValidationError } from 'class-validator';
import * as dotenv from 'dotenv';
import { Transform } from 'class-transformer';
dotenv.config({
    path: (() => {
        const envFileName = '.env';
        return `${__dirname}/../${envFileName}`;
    })(),
});
let AppConfig = (() => {
    let _REDIS_QUEUE_HOST_decorators;
    let _REDIS_QUEUE_HOST_initializers = [];
    let _REDIS_QUEUE_HOST_extraInitializers = [];
    let _REDIS_QUEUE_PORT_decorators;
    let _REDIS_QUEUE_PORT_initializers = [];
    let _REDIS_QUEUE_PORT_extraInitializers = [];
    let _REDIS_QUEUE_PASSWORD_decorators;
    let _REDIS_QUEUE_PASSWORD_initializers = [];
    let _REDIS_QUEUE_PASSWORD_extraInitializers = [];
    let _REDIS_QUEUE_PREFIX_decorators;
    let _REDIS_QUEUE_PREFIX_initializers = [];
    let _REDIS_QUEUE_PREFIX_extraInitializers = [];
    let _REDIS_QUEUE_ENABLE_SSL_decorators;
    let _REDIS_QUEUE_ENABLE_SSL_initializers = [];
    let _REDIS_QUEUE_ENABLE_SSL_extraInitializers = [];
    let _NODE_ENV_decorators;
    let _NODE_ENV_initializers = [];
    let _NODE_ENV_extraInitializers = [];
    let _APP_TERMINATED_decorators;
    let _APP_TERMINATED_initializers = [];
    let _APP_TERMINATED_extraInitializers = [];
    let _RPC_CALLS_HTTP_URL_decorators;
    let _RPC_CALLS_HTTP_URL_initializers = [];
    let _RPC_CALLS_HTTP_URL_extraInitializers = [];
    let _WSS_URL_decorators;
    let _WSS_URL_initializers = [];
    let _WSS_URL_extraInitializers = [];
    return class AppConfig {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _REDIS_QUEUE_HOST_decorators = [IsNotEmpty()];
            _REDIS_QUEUE_PORT_decorators = [IsNotEmpty()];
            _REDIS_QUEUE_PASSWORD_decorators = [IsNotEmpty()];
            _REDIS_QUEUE_PREFIX_decorators = [IsNotEmpty()];
            _REDIS_QUEUE_ENABLE_SSL_decorators = [Transform(({ value }) => value === 'true'), IsNotEmpty()];
            _NODE_ENV_decorators = [IsNotEmpty()];
            _APP_TERMINATED_decorators = [Transform(({ value }) => value === 'true'), IsNotEmpty()];
            _RPC_CALLS_HTTP_URL_decorators = [IsNotEmpty({
                    message: `Env var RPC_CALLS_HTTP_URL has invalid value or not provided.`,
                })];
            _WSS_URL_decorators = [IsNotEmpty({
                    message: `Env var WSS_URL has invalid value or not provided.`,
                })];
            __esDecorate(null, null, _REDIS_QUEUE_HOST_decorators, { kind: "field", name: "REDIS_QUEUE_HOST", static: false, private: false, access: { has: obj => "REDIS_QUEUE_HOST" in obj, get: obj => obj.REDIS_QUEUE_HOST, set: (obj, value) => { obj.REDIS_QUEUE_HOST = value; } }, metadata: _metadata }, _REDIS_QUEUE_HOST_initializers, _REDIS_QUEUE_HOST_extraInitializers);
            __esDecorate(null, null, _REDIS_QUEUE_PORT_decorators, { kind: "field", name: "REDIS_QUEUE_PORT", static: false, private: false, access: { has: obj => "REDIS_QUEUE_PORT" in obj, get: obj => obj.REDIS_QUEUE_PORT, set: (obj, value) => { obj.REDIS_QUEUE_PORT = value; } }, metadata: _metadata }, _REDIS_QUEUE_PORT_initializers, _REDIS_QUEUE_PORT_extraInitializers);
            __esDecorate(null, null, _REDIS_QUEUE_PASSWORD_decorators, { kind: "field", name: "REDIS_QUEUE_PASSWORD", static: false, private: false, access: { has: obj => "REDIS_QUEUE_PASSWORD" in obj, get: obj => obj.REDIS_QUEUE_PASSWORD, set: (obj, value) => { obj.REDIS_QUEUE_PASSWORD = value; } }, metadata: _metadata }, _REDIS_QUEUE_PASSWORD_initializers, _REDIS_QUEUE_PASSWORD_extraInitializers);
            __esDecorate(null, null, _REDIS_QUEUE_PREFIX_decorators, { kind: "field", name: "REDIS_QUEUE_PREFIX", static: false, private: false, access: { has: obj => "REDIS_QUEUE_PREFIX" in obj, get: obj => obj.REDIS_QUEUE_PREFIX, set: (obj, value) => { obj.REDIS_QUEUE_PREFIX = value; } }, metadata: _metadata }, _REDIS_QUEUE_PREFIX_initializers, _REDIS_QUEUE_PREFIX_extraInitializers);
            __esDecorate(null, null, _REDIS_QUEUE_ENABLE_SSL_decorators, { kind: "field", name: "REDIS_QUEUE_ENABLE_SSL", static: false, private: false, access: { has: obj => "REDIS_QUEUE_ENABLE_SSL" in obj, get: obj => obj.REDIS_QUEUE_ENABLE_SSL, set: (obj, value) => { obj.REDIS_QUEUE_ENABLE_SSL = value; } }, metadata: _metadata }, _REDIS_QUEUE_ENABLE_SSL_initializers, _REDIS_QUEUE_ENABLE_SSL_extraInitializers);
            __esDecorate(null, null, _NODE_ENV_decorators, { kind: "field", name: "NODE_ENV", static: false, private: false, access: { has: obj => "NODE_ENV" in obj, get: obj => obj.NODE_ENV, set: (obj, value) => { obj.NODE_ENV = value; } }, metadata: _metadata }, _NODE_ENV_initializers, _NODE_ENV_extraInitializers);
            __esDecorate(null, null, _APP_TERMINATED_decorators, { kind: "field", name: "APP_TERMINATED", static: false, private: false, access: { has: obj => "APP_TERMINATED" in obj, get: obj => obj.APP_TERMINATED, set: (obj, value) => { obj.APP_TERMINATED = value; } }, metadata: _metadata }, _APP_TERMINATED_initializers, _APP_TERMINATED_extraInitializers);
            __esDecorate(null, null, _RPC_CALLS_HTTP_URL_decorators, { kind: "field", name: "RPC_CALLS_HTTP_URL", static: false, private: false, access: { has: obj => "RPC_CALLS_HTTP_URL" in obj, get: obj => obj.RPC_CALLS_HTTP_URL, set: (obj, value) => { obj.RPC_CALLS_HTTP_URL = value; } }, metadata: _metadata }, _RPC_CALLS_HTTP_URL_initializers, _RPC_CALLS_HTTP_URL_extraInitializers);
            __esDecorate(null, null, _WSS_URL_decorators, { kind: "field", name: "WSS_URL", static: false, private: false, access: { has: obj => "WSS_URL" in obj, get: obj => obj.WSS_URL, set: (obj, value) => { obj.WSS_URL = value; } }, metadata: _metadata }, _WSS_URL_initializers, _WSS_URL_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        REDIS_QUEUE_HOST = __runInitializers(this, _REDIS_QUEUE_HOST_initializers, void 0);
        REDIS_QUEUE_PORT = (__runInitializers(this, _REDIS_QUEUE_HOST_extraInitializers), __runInitializers(this, _REDIS_QUEUE_PORT_initializers, void 0));
        REDIS_QUEUE_PASSWORD = (__runInitializers(this, _REDIS_QUEUE_PORT_extraInitializers), __runInitializers(this, _REDIS_QUEUE_PASSWORD_initializers, void 0));
        REDIS_QUEUE_PREFIX = (__runInitializers(this, _REDIS_QUEUE_PASSWORD_extraInitializers), __runInitializers(this, _REDIS_QUEUE_PREFIX_initializers, void 0));
        REDIS_QUEUE_ENABLE_SSL = (__runInitializers(this, _REDIS_QUEUE_PREFIX_extraInitializers), __runInitializers(this, _REDIS_QUEUE_ENABLE_SSL_initializers, void 0));
        NODE_ENV = (__runInitializers(this, _REDIS_QUEUE_ENABLE_SSL_extraInitializers), __runInitializers(this, _NODE_ENV_initializers, void 0));
        APP_TERMINATED = (__runInitializers(this, _NODE_ENV_extraInitializers), __runInitializers(this, _APP_TERMINATED_initializers, void 0));
        RPC_CALLS_HTTP_URL = (__runInitializers(this, _APP_TERMINATED_extraInitializers), __runInitializers(this, _RPC_CALLS_HTTP_URL_initializers, void 0));
        WSS_URL = (__runInitializers(this, _RPC_CALLS_HTTP_URL_extraInitializers), __runInitializers(this, _WSS_URL_initializers, void 0));
        constructor() {
            __runInitializers(this, _WSS_URL_extraInitializers);
        }
    };
})();
export { AppConfig };
let EnvModule = (() => {
    let _classDecorators = [Global(), Module({
            providers: [
                {
                    provide: AppConfig,
                    useFactory: () => {
                        try {
                            return transformAndValidateSync(AppConfig, process.env, {
                                validator: { stopAtFirstError: true },
                            });
                        }
                        catch (errors) {
                            const logger = new Logger('ConfigModule');
                            if (Array.isArray(errors) && errors[0] instanceof ValidationError) {
                                errors.forEach((error) => {
                                    // @ts-ignore
                                    Object.values(error.constraints).forEach((msg) => logger.error(msg));
                                });
                            }
                            else {
                                logger.error('Unexpected error during the environment validation');
                            }
                            throw new Error('Failed to validate environment variables');
                        }
                    },
                },
            ],
            exports: [AppConfig],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EnvModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            EnvModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return EnvModule = _classThis;
})();
export { EnvModule };
