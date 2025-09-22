"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.TELEGRAM_BOT_MODERATOR_CHAT_ID = '129';
var sinon_1 = __importDefault(require("sinon"));
var telegraf_1 = require("telegraf");
var behavior_1 = require("./behavior");
var config_1 = require("./config/config");
var storage_1 = require("./storage");
var test_helpers_1 = require("./test_helpers");
var util_1 = require("./util");
var InMemoryReporterState = /** @class */ (function () {
    function InMemoryReporterState() {
        this.storage = {};
    }
    InMemoryReporterState.prototype.readDatastoreEntry = function (dbKey) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.storage[dbKey]];
            });
        });
    };
    InMemoryReporterState.prototype.saveDatastoreEntry = function (dbKey, entity) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.storage[dbKey] = entity;
                return [2 /*return*/];
            });
        });
    };
    InMemoryReporterState.prototype.updateDatastoreEntry = function (dbKey, modifier) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('not implemented');
            });
        });
    };
    return InMemoryReporterState;
}());
describe('Behaviour test', function () {
    var bot;
    var datastoreVotes = new storage_1.MessageVotesDatabase();
    var datastoreStats = new storage_1.UserStatsDatabase();
    var datastoreArticles = new storage_1.NewsArticlesDatabase();
    var botMocker;
    var votesDatastoreMocker;
    var statsDatastoreMocker;
    var articlesDatastoreMocker;
    var kJunkGroupId = 20;
    beforeEach(function () {
        bot = new telegraf_1.Telegraf('111');
        bot.telegram.callApi = (function (method, data) { });
        // @ts-ignore
        bot.context.tg = bot.telegram;
        botMocker = sinon_1.default.mock(bot.telegram);
        votesDatastoreMocker = sinon_1.default.mock(datastoreVotes);
        statsDatastoreMocker = sinon_1.default.mock(datastoreStats);
        articlesDatastoreMocker = sinon_1.default.mock(datastoreArticles);
        (0, behavior_1.setUpBotBehavior)(bot, datastoreVotes, datastoreStats, datastoreArticles, new InMemoryReporterState(), __assign(__assign({}, (0, config_1.getConfig)()), { moderatorChatId: test_helpers_1.kModeratorChatId, junkGroupId: kJunkGroupId, newsChannelId: test_helpers_1.kChannelId }));
    });
    afterEach(function () {
        botMocker.verify();
        votesDatastoreMocker.verify();
        statsDatastoreMocker.verify();
        articlesDatastoreMocker.verify();
    });
    describe('Reporter interaction', function () {
        it('Text message without /sendarticle reaction', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectation = botMocker.expects('sendMessage').withArgs(test_helpers_1.kPrivateChatId, sinon_1.default.match(/сначала .*\/sendarticle/));
                        return [4 /*yield*/, bot.handleUpdate((0, test_helpers_1.createPrivateMessageUpdate)('Hello brother'))];
                    case 1:
                        _a.sent();
                        expectation.verify();
                        return [2 /*return*/];
                }
            });
        }); });
        it('/start reaction', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectation = botMocker.expects('sendMessage').withArgs(test_helpers_1.kPrivateChatId, sinon_1.default.match(/Привет.* \/sendarticle/));
                        return [4 /*yield*/, bot.handleUpdate((0, test_helpers_1.createPrivateMessageUpdate)('/start'))];
                    case 1:
                        _a.sent();
                        expectation.verify();
                        return [2 /*return*/];
                }
            });
        }); });
        it('/sendarticle flow - finished', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectation, expectation, expectation, expectation2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectation = botMocker.expects('sendMessage').withExactArgs(test_helpers_1.kPrivateChatId, sinon_1.default.match(/Кидай текст/));
                        return [4 /*yield*/, bot.handleUpdate((0, test_helpers_1.createPrivateMessageUpdate)('/sendarticle'))];
                    case 1:
                        _a.sent();
                        expectation.verify();
                        expectation = botMocker.expects('sendMessage').withExactArgs(test_helpers_1.kPrivateChatId, sinon_1.default.match(/готово.*\/yes.*\/no/));
                        return [4 /*yield*/, bot.handleUpdate((0, test_helpers_1.createPrivateMessageUpdate)('Awesome news article: http://example.com'))];
                    case 2:
                        _a.sent();
                        expectation.verify();
                        expectation = botMocker.expects('sendMessage').withArgs(test_helpers_1.kModeratorChatId, sinon_1.default.match('Awesome news article: http://example.com'));
                        expectation.returns({ chat: { id: test_helpers_1.kModeratorChatId }, message_id: 13 });
                        expectation2 = botMocker.expects('sendMessage').withArgs(test_helpers_1.kPrivateChatId, sinon_1.default.match(/отправлена/));
                        votesDatastoreMocker.expects('saveDatastoreEntry').withArgs(test_helpers_1.kModeratorChatId + "_13", sinon_1.default.match({ disallowedToVote: [test_helpers_1.kUserId], finished: false, votesAgainst: [], votesFor: [] }));
                        statsDatastoreMocker.expects('updateDatastoreEntry');
                        articlesDatastoreMocker.expects('saveDatastoreEntry').withArgs('13', sinon_1.default.match({
                            submitterId: test_helpers_1.kUserId,
                            submitterName: 'kool_xakep ( undefined)',
                            wasPublished: false,
                            text: 'Awesome news article: http://example.com',
                        }));
                        return [4 /*yield*/, bot.handleUpdate((0, test_helpers_1.createPrivateMessageUpdate)('/yes'))];
                    case 3:
                        _a.sent();
                        expectation.verify();
                        expectation2.verify();
                        return [2 /*return*/];
                }
            });
        }); });
        it('/sendarticle flow with image - finished', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectation, expectation, expectation, expectation2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectation = botMocker.expects('sendMessage').withExactArgs(test_helpers_1.kPrivateChatId, sinon_1.default.match(/Кидай текст/));
                        return [4 /*yield*/, bot.handleUpdate((0, test_helpers_1.createPrivateMessageUpdate)('/sendarticle'))];
                    case 1:
                        _a.sent();
                        expectation.verify();
                        expectation = botMocker.expects('sendMessage').withExactArgs(test_helpers_1.kPrivateChatId, sinon_1.default.match(/готово.*\/yes.*\/no/));
                        return [4 /*yield*/, bot.handleUpdate((0, test_helpers_1.createPrivateImageMessageUpdate)('Awesome picture'))];
                    case 2:
                        _a.sent();
                        expectation.verify();
                        expectation = botMocker.expects('sendPhoto').withArgs(test_helpers_1.kModeratorChatId, sinon_1.default.match.any, sinon_1.default.match({ caption: 'Awesome picture' }));
                        expectation.returns({ chat: { id: test_helpers_1.kModeratorChatId }, message_id: 13 });
                        expectation2 = botMocker.expects('sendMessage').withArgs(test_helpers_1.kPrivateChatId, sinon_1.default.match(/отправлена/));
                        votesDatastoreMocker.expects('saveDatastoreEntry').withArgs(test_helpers_1.kModeratorChatId + "_13", sinon_1.default.match({ disallowedToVote: [test_helpers_1.kUserId], finished: false, votesAgainst: [], votesFor: [] }));
                        statsDatastoreMocker.expects('updateDatastoreEntry');
                        articlesDatastoreMocker.expects('saveDatastoreEntry').withArgs('13', sinon_1.default.match({
                            submitterId: test_helpers_1.kUserId,
                            submitterName: 'kool_xakep ( undefined)',
                            wasPublished: false,
                            text: 'Awesome picture',
                        }));
                        return [4 /*yield*/, bot.handleUpdate((0, test_helpers_1.createPrivateMessageUpdate)('/yes'))];
                    case 3:
                        _a.sent();
                        expectation.verify();
                        expectation2.verify();
                        return [2 /*return*/];
                }
            });
        }); });
        it('/sendarticle flow - cancelled', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectation, expectation, expectation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectation = botMocker.expects('sendMessage').withExactArgs(test_helpers_1.kPrivateChatId, sinon_1.default.match(/Кидай текст/));
                        return [4 /*yield*/, bot.handleUpdate((0, test_helpers_1.createPrivateMessageUpdate)('/sendarticle'))];
                    case 1:
                        _a.sent();
                        expectation.verify();
                        expectation = botMocker.expects('sendMessage').withExactArgs(test_helpers_1.kPrivateChatId, sinon_1.default.match(/готово.*\/yes.*\/no/));
                        return [4 /*yield*/, bot.handleUpdate((0, test_helpers_1.createPrivateMessageUpdate)('Dumb news article: http://example.com'))];
                    case 2:
                        _a.sent();
                        expectation.verify();
                        expectation = botMocker.expects('sendMessage').withArgs(test_helpers_1.kPrivateChatId, sinon_1.default.match(/Отменяю/));
                        return [4 /*yield*/, bot.handleUpdate((0, test_helpers_1.createPrivateMessageUpdate)('/no'))];
                    case 3:
                        _a.sent();
                        expectation.verify();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Moderator interaction', function () {
        it('Got positive votes, posting to news channel', function () { return __awaiter(void 0, void 0, void 0, function () {
            var votes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        votes = new util_1.MessageVotes();
                        votesDatastoreMocker.expects('updateDatastoreEntry').twice().callsFake(function (_, modifier) { return modifier(votes) ? votes : undefined; });
                        statsDatastoreMocker.expects('updateDatastoreEntry').twice();
                        botMocker.expects('editMessageReplyMarkup').once().withExactArgs(test_helpers_1.kModeratorChatId, test_helpers_1.kModeratorChatMessageId, undefined, sinon_1.default.match.any);
                        botMocker.expects('answerCbQuery').twice();
                        return [4 /*yield*/, bot.handleUpdate((0, test_helpers_1.createModeratorVoteUpdate)(1, 'Good news article', '+'))];
                    case 1:
                        _a.sent();
                        expect(votes).toEqual({ disallowedToVote: [], votesFor: [1], votesAgainst: [], finished: false });
                        botMocker.expects('sendMessage')
                            .withArgs(test_helpers_1.kChannelId, sinon_1.default.match('Good news article'), sinon_1.default.match({ reply_markup: {} }))
                            .returns({ chat: { id: 999 }, message_id: 111 });
                        botMocker.expects('deleteMessage').withArgs(test_helpers_1.kModeratorChatId, test_helpers_1.kModeratorChatMessageId);
                        votesDatastoreMocker.expects('saveDatastoreEntry').withArgs('999_111', sinon_1.default.match({ disallowedToVote: [], finished: false, votesAgainst: [], votesFor: [] }));
                        articlesDatastoreMocker.expects('updateDatastoreEntry');
                        return [4 /*yield*/, bot.handleUpdate((0, test_helpers_1.createModeratorVoteUpdate)(2, 'Good news article', '+'))];
                    case 2:
                        _a.sent();
                        expect(votes).toEqual({ disallowedToVote: [], votesFor: [1, 2], votesAgainst: [], finished: true });
                        return [2 /*return*/];
                }
            });
        }); });
        it('Got negative votes, posting to junk group', function () { return __awaiter(void 0, void 0, void 0, function () {
            var votes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        votes = { disallowedToVote: [], votesFor: [], votesAgainst: [], finished: false };
                        votesDatastoreMocker.expects('updateDatastoreEntry').thrice().callsFake(function (_, modifier) { return modifier(votes) ? votes : undefined; });
                        statsDatastoreMocker.expects('updateDatastoreEntry').thrice();
                        botMocker.expects('editMessageReplyMarkup').twice().withExactArgs(test_helpers_1.kModeratorChatId, test_helpers_1.kModeratorChatMessageId, undefined, sinon_1.default.match.any);
                        botMocker.expects('answerCbQuery').thrice();
                        return [4 /*yield*/, bot.handleUpdate((0, test_helpers_1.createModeratorVoteUpdate)(1, 'Bad news article', '-'))];
                    case 1:
                        _a.sent();
                        expect(votes).toEqual({ disallowedToVote: [], votesFor: [], votesAgainst: [1], finished: false });
                        botMocker.expects('sendMessage').withArgs(kJunkGroupId, sinon_1.default.match('Bad news article'));
                        botMocker.expects('deleteMessage').withArgs(test_helpers_1.kModeratorChatId, test_helpers_1.kModeratorChatMessageId);
                        return [4 /*yield*/, bot.handleUpdate((0, test_helpers_1.createModeratorVoteUpdate)(2, 'Bad news article', '-'))];
                    case 2:
                        _a.sent();
                        expect(votes).toEqual({ disallowedToVote: [], votesFor: [], votesAgainst: [1, 2], finished: false });
                        return [4 /*yield*/, bot.handleUpdate((0, test_helpers_1.createModeratorVoteUpdate)(3, 'Bad news article', '-'))];
                    case 3:
                        _a.sent();
                        expect(votes).toEqual({ disallowedToVote: [], votesFor: [], votesAgainst: [1, 2, 3], finished: true });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Reader interaction', function () {
        it('Many readers can vote', function () { return __awaiter(void 0, void 0, void 0, function () {
            var votes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        votes = new util_1.MessageVotes();
                        votesDatastoreMocker.expects('updateDatastoreEntry').thrice().callsFake(function (_, modifier) { return modifier(votes) ? votes : undefined; });
                        botMocker.expects('editMessageReplyMarkup').thrice().withExactArgs(test_helpers_1.kChannelId, test_helpers_1.kChannelMessageId, undefined, sinon_1.default.match.any);
                        botMocker.expects('answerCbQuery').thrice();
                        statsDatastoreMocker.expects('updateDatastoreEntry').thrice();
                        return [4 /*yield*/, bot.handleUpdate((0, test_helpers_1.createReaderVoteUpdate)(1, 'Bad news article', '-'))];
                    case 1:
                        _a.sent();
                        expect(votes).toEqual({ disallowedToVote: [], votesFor: [], votesAgainst: [1], finished: false });
                        return [4 /*yield*/, bot.handleUpdate((0, test_helpers_1.createReaderVoteUpdate)(2, 'Bad news article', '-'))];
                    case 2:
                        _a.sent();
                        expect(votes).toEqual({ disallowedToVote: [], votesFor: [], votesAgainst: [1, 2], finished: false });
                        return [4 /*yield*/, bot.handleUpdate((0, test_helpers_1.createReaderVoteUpdate)(3, 'Bad news article', '-'))];
                    case 3:
                        _a.sent();
                        expect(votes).toEqual({ disallowedToVote: [], votesFor: [], votesAgainst: [1, 2, 3], finished: false });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=behavior.spec.js.map