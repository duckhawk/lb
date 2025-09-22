"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReporterStateDatabase = exports.NewsArticlesDatabase = exports.UserStatsDatabase = exports.MessageVotesDatabase = void 0;
var datastore_1 = require("@google-cloud/datastore");
var DatastoreConnector = /** @class */ (function () {
    function DatastoreConnector(kDatastoreKind, maxRetries) {
        if (maxRetries === void 0) { maxRetries = 10; }
        this.kDatastoreKind = kDatastoreKind;
        this.maxRetries = maxRetries;
        this.datastore = new datastore_1.Datastore();
    }
    DatastoreConnector.prototype.saveDatastoreEntry = function (dbKey, entity) {
        return this.saveDatastoreEntryImpl(this.datastore, dbKey, entity);
    };
    DatastoreConnector.prototype.readDatastoreEntry = function (dbKey) {
        return this.readDatastoreEntryImpl(this.datastore, dbKey);
    };
    DatastoreConnector.prototype.updateDatastoreEntry = function (dbKey, modifier) {
        return __awaiter(this, void 0, void 0, function () {
            var i, transaction, entity, updatedEntity, commitResult, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.maxRetries)) return [3 /*break*/, 11];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 9, , 10]);
                        transaction = this.datastore.transaction();
                        return [4 /*yield*/, transaction.run()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.readDatastoreEntryImpl(transaction, dbKey)];
                    case 4:
                        entity = _a.sent();
                        updatedEntity = modifier(entity);
                        if (!!updatedEntity) return [3 /*break*/, 6];
                        return [4 /*yield*/, transaction.rollback()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, undefined];
                    case 6: return [4 /*yield*/, this.saveDatastoreEntryImpl(transaction, dbKey, updatedEntity)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, transaction.commit()];
                    case 8:
                        commitResult = _a.sent();
                        if (commitResult.length && commitResult[0].mutationResults && commitResult[0].mutationResults.length &&
                            !commitResult[0].mutationResults[0].conflictDetected)
                            return [2 /*return*/, updatedEntity];
                        console.warn('Retrying because of conflict');
                        return [3 /*break*/, 10];
                    case 9:
                        e_1 = _a.sent();
                        console.error("Caught error: " + e_1 + ", let's retry");
                        return [3 /*break*/, 10];
                    case 10:
                        ++i;
                        return [3 /*break*/, 1];
                    case 11: return [2 /*return*/, undefined];
                }
            });
        });
    };
    DatastoreConnector.prototype.saveDatastoreEntryImpl = function (dsInterface, dbKey, entity) {
        return __awaiter(this, void 0, void 0, function () {
            var task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        task = {
                            key: this.datastore.key([this.kDatastoreKind, dbKey]),
                            data: entity,
                            excludeFromIndexes: ['text', 'caption', 'message.text', 'message.caption']
                        };
                        if (!dsInterface)
                            dsInterface = this.datastore;
                        return [4 /*yield*/, dsInterface.save(task)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DatastoreConnector.prototype.readDatastoreEntryImpl = function (dsInterface, dbKey) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Querying data from Datastore');
                        return [4 /*yield*/, dsInterface.get(this.datastore.key([this.kDatastoreKind, dbKey]))];
                    case 1:
                        queryResult = _a.sent();
                        console.log("Query result: " + JSON.stringify(queryResult));
                        return [2 /*return*/, queryResult[0] ? queryResult[0] : undefined];
                }
            });
        });
    };
    return DatastoreConnector;
}());
var MessageVotesDatabase = /** @class */ (function (_super) {
    __extends(MessageVotesDatabase, _super);
    function MessageVotesDatabase() {
        return _super.call(this, 'MessageVotes') || this;
    }
    return MessageVotesDatabase;
}(DatastoreConnector));
exports.MessageVotesDatabase = MessageVotesDatabase;
var UserStatsDatabase = /** @class */ (function (_super) {
    __extends(UserStatsDatabase, _super);
    function UserStatsDatabase() {
        return _super.call(this, 'UserStats') || this;
    }
    return UserStatsDatabase;
}(DatastoreConnector));
exports.UserStatsDatabase = UserStatsDatabase;
var NewsArticlesDatabase = /** @class */ (function (_super) {
    __extends(NewsArticlesDatabase, _super);
    function NewsArticlesDatabase() {
        return _super.call(this, 'NewsArticle') || this;
    }
    return NewsArticlesDatabase;
}(DatastoreConnector));
exports.NewsArticlesDatabase = NewsArticlesDatabase;
var ReporterStateDatabase = /** @class */ (function (_super) {
    __extends(ReporterStateDatabase, _super);
    function ReporterStateDatabase() {
        return _super.call(this, 'ReporterState') || this;
    }
    return ReporterStateDatabase;
}(DatastoreConnector));
exports.ReporterStateDatabase = ReporterStateDatabase;
//# sourceMappingURL=storage.js.map