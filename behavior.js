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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpBotBehavior = void 0;
var util_1 = require("./util");
var vk_helper_1 = require("./vk_helper");
function setUpBotBehavior(bot, votesDb, statsDb, articlesDb, reporterStatesDb, config) {
    setUpPing(bot);
    setUpReporterDialog(bot, votesDb, statsDb, articlesDb, reporterStatesDb, config);
    setUpVoting(bot, votesDb, statsDb, articlesDb, config);
}
exports.setUpBotBehavior = setUpBotBehavior;
function setUpPing(bot) {
    var _this = this;
    bot.hears('/ping', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.reply('Pong!')];
                case 1:
                    res = _a.sent();
                    console.log(JSON.stringify(res));
                    return [2 /*return*/];
            }
        });
    }); });
}
function isPrivateMessage(msg) {
    return msg.chat.type == 'private';
}
function anonymouslyForwardMessage(chatId, msg, options, tag, ctx) {
    if ('text' in msg) {
        return ctx.telegram.sendMessage(chatId, (0, util_1.preprocessMessageBeforeApproval)(msg.text, tag), options);
    }
    else if ('photo' in msg) {
        return ctx.telegram.sendPhoto(chatId, msg.photo[0].file_id, __assign(__assign({}, options), { caption: (0, util_1.preprocessMessageBeforeApproval)(msg.caption, tag) }));
    }
}
function setUpReporterDialog(bot, votesDb, statsDb, articlesDb, reporterStatesDb, config) {
    var _this = this;
    bot.hears('/start', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isPrivateMessage(ctx.message))
                        return [2 /*return*/];
                    return [4 /*yield*/, ctx.reply(config.textMessages.HELLO_MESSAGE)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    bot.hears('/sendarticle', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
        var s;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!isPrivateMessage(ctx.message))
                        return [2 /*return*/];
                    return [4 /*yield*/, reporterStatesDb.readDatastoreEntry(ctx.message.from.id.toString())];
                case 1:
                    s = (_a = (_b.sent())) !== null && _a !== void 0 ? _a : { state: 'start' };
                    if (!(s.state == 'start' || s.state == 'waiting_message')) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.reply(config.textMessages.SEND_ARTICLE_NOW)];
                case 2:
                    _b.sent();
                    s.state = 'waiting_message';
                    return [3 /*break*/, 5];
                case 3:
                    if (!(s.state == 'waiting_approval')) return [3 /*break*/, 5];
                    return [4 /*yield*/, ctx.reply(config.textMessages.ARTICLE_WAITING_FOR_APPROVAL)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5: return [4 /*yield*/, reporterStatesDb.saveDatastoreEntry(ctx.message.from.id.toString(), s)];
                case 6:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    bot.hears('/yes', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
        var s, votes, res;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!isPrivateMessage(ctx.message))
                        return [2 /*return*/];
                    return [4 /*yield*/, reporterStatesDb.readDatastoreEntry(ctx.message.from.id.toString())];
                case 1:
                    s = (_a = (_b.sent())) !== null && _a !== void 0 ? _a : { state: 'start' };
                    if (!(s.state == 'start')) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.reply(config.textMessages.NEED_SEND_ARTICLE_CMD)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 11];
                case 3:
                    if (!(s.state == 'waiting_message')) return [3 /*break*/, 5];
                    return [4 /*yield*/, ctx.reply(config.textMessages.NEED_ARTICLE_TEXT)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 11];
                case 5:
                    if (!(s.state == 'waiting_approval')) return [3 /*break*/, 11];
                    votes = new util_1.MessageVotes();
                    votes.disallowedToVote.push(ctx.message.from.id);
                    return [4 /*yield*/, anonymouslyForwardMessage(config.moderatorChatId, s.message, { reply_markup: (0, util_1.createVoteMarkup)(votes) }, config.tag, ctx)];
                case 6:
                    res = _b.sent();
                    if (!res) {
                        console.error('Failed to forward message!');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, votesDb.saveDatastoreEntry(res.chat.id + "_" + res.message_id, votes)];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, statsDb.updateDatastoreEntry((0, util_1.dbKeyForUser)(ctx.message.from), function (stats) {
                            stats = stats || new util_1.UserStats();
                            stats.articlesProposed++;
                            return stats;
                        })];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, articlesDb.saveDatastoreEntry(res.message_id.toString(), {
                            submitterId: ctx.message.from.id,
                            submitterName: ctx.message.from.username + " (" + ctx.message.from.first_name + " " + ctx.message.from.last_name + ")",
                            submissionTime: new Date(),
                            wasPublished: false,
                            text: 'text' in s.message ? s.message.text : (('caption' in s.message && s.message.caption) ? s.message.caption : '')
                        })];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, ctx.reply(config.textMessages.THANK_YOU_FOR_ARTICLE)];
                case 10:
                    _b.sent();
                    s.state = 'start';
                    s.message = undefined;
                    _b.label = 11;
                case 11: return [4 /*yield*/, reporterStatesDb.saveDatastoreEntry(ctx.message.from.id.toString(), s)];
                case 12:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    bot.hears('/no', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
        var s;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!isPrivateMessage(ctx.message))
                        return [2 /*return*/];
                    return [4 /*yield*/, reporterStatesDb.readDatastoreEntry(ctx.message.from.id.toString())];
                case 1:
                    s = (_a = (_b.sent())) !== null && _a !== void 0 ? _a : { state: 'start' };
                    s.state = 'start';
                    s.message = undefined;
                    return [4 /*yield*/, ctx.reply(config.textMessages.ARTICLE_SEND_WAS_CANCELLED)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, reporterStatesDb.saveDatastoreEntry(ctx.message.from.id.toString(), s)];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    var articleHandler = function (ctx) { return __awaiter(_this, void 0, void 0, function () {
        var s;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!isPrivateMessage(ctx.message))
                        return [2 /*return*/];
                    return [4 /*yield*/, reporterStatesDb.readDatastoreEntry(ctx.message.from.id.toString())];
                case 1:
                    s = (_a = (_b.sent())) !== null && _a !== void 0 ? _a : { state: 'start' };
                    if (!(s.state == 'start')) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.reply(config.textMessages.NEED_SEND_ARTICLE_CMD)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 3:
                    if (!(s.state == 'waiting_message')) return [3 /*break*/, 5];
                    return [4 /*yield*/, ctx.reply(config.textMessages.ARTICLE_REQUEST_APPROVAL)];
                case 4:
                    _b.sent();
                    s.state = 'waiting_approval';
                    s.message = ctx.message;
                    return [3 /*break*/, 6];
                case 5:
                    if (s.state == 'waiting_approval') {
                    }
                    _b.label = 6;
                case 6: return [4 /*yield*/, reporterStatesDb.saveDatastoreEntry(ctx.message.from.id.toString(), s)];
                case 7:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    bot.on('text', articleHandler);
    bot.on('photo', articleHandler);
    bot.on('edited_message', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
        var s;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!isPrivateMessage(ctx.editedMessage))
                        return [2 /*return*/];
                    return [4 /*yield*/, reporterStatesDb.readDatastoreEntry(ctx.from.id.toString())];
                case 1:
                    s = (_a = (_b.sent())) !== null && _a !== void 0 ? _a : { state: 'start' };
                    if (s.state != 'waiting_approval' || !s.message)
                        return [2 /*return*/];
                    if (ctx.editedMessage.message_id == s.message.message_id) {
                        s.message = ctx.editedMessage;
                    }
                    return [2 /*return*/];
            }
        });
    }); });
}
function stringToVote(s) {
    if (s == '+')
        return '+';
    if (s == '-')
        return '-';
    return undefined;
}
var kVotesToApprove = 2;
var kVotesToReject = 3;
// Returns undefined iff failed to update votes (user already participated in the vote, vote cancelled, ...).
function processVotesUpdate(db, dbKey, userId, modifier, votesLimits) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, db.updateDatastoreEntry(dbKey, function (votes) {
                    var vote = stringToVote(modifier);
                    votes = votes || new util_1.MessageVotes();
                    if (vote && (0, util_1.recalculateVotes)(votes, userId, vote, votesLimits)) {
                        return votes;
                    }
                    return undefined;
                })];
        });
    });
}
function setUpVoting(bot, votesDb, statsDb, articlesDb, config) {
    var _this = this;
    bot.on('callback_query', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
        var query, isModeratorVoting, votesToApprove, votesToReject, dbKey, maybeVotes, votesInChannel, res, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = ctx.callbackQuery;
                    if (!query.message)
                        return [2 /*return*/];
                    isModeratorVoting = query.message.chat.id == config.moderatorChatId;
                    votesToApprove = isModeratorVoting
                        ? kVotesToApprove
                        : 1000000;
                    votesToReject = isModeratorVoting
                        ? kVotesToReject
                        : 1000000;
                    dbKey = query.message.chat.id + "_" + query.message.message_id;
                    return [4 /*yield*/, processVotesUpdate(votesDb, dbKey, query.from.id, query.data, { votesToApprove: votesToApprove, votesToReject: votesToReject })];
                case 1:
                    maybeVotes = _a.sent();
                    if (!maybeVotes) return [3 /*break*/, 14];
                    return [4 /*yield*/, statsDb.updateDatastoreEntry((0, util_1.dbKeyForUser)(query.from), function (stats) {
                            stats = stats || new util_1.UserStats();
                            if (isModeratorVoting) {
                                stats.votesAsModerator++;
                            }
                            else {
                                stats.votesAsReader++;
                            }
                            return stats;
                        })];
                case 2:
                    _a.sent();
                    if (!(maybeVotes.votesAgainst.length >= votesToReject)) return [3 /*break*/, 5];
                    return [4 /*yield*/, anonymouslyForwardMessage(config.junkGroupId, query.message, {}, undefined, ctx)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, ctx.deleteMessage()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 5:
                    if (!(maybeVotes.votesFor.length >= votesToApprove)) return [3 /*break*/, 12];
                    votesInChannel = new util_1.MessageVotes();
                    return [4 /*yield*/, anonymouslyForwardMessage(config.newsChannelId, query.message, { reply_markup: (0, util_1.createVoteMarkup)(votesInChannel) }, undefined, ctx)];
                case 6:
                    res = _a.sent();
                    return [4 /*yield*/, articlesDb.updateDatastoreEntry(query.message.message_id.toString(), function (v) {
                            if (v)
                                v.wasPublished = true;
                            return v;
                        })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, ctx.deleteMessage()];
                case 8:
                    _a.sent();
                    if (!res) {
                        console.error('Failed to forward message!');
                        return [2 /*return*/];
                    }
                    if (!config.vkRepostConfig) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, vk_helper_1.forwardMessageToVk)(config.vkRepostConfig.groupId, config.vkRepostConfig.accessToken, ctx, query.message)];
                case 9:
                    res2 = _a.sent();
                    console.log(res2);
                    _a.label = 10;
                case 10: return [4 /*yield*/, votesDb.saveDatastoreEntry(res.chat.id + "_" + res.message_id, votesInChannel)];
                case 11:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, ctx.editMessageReplyMarkup((0, util_1.createVoteMarkup)(maybeVotes))];
                case 13:
                    _a.sent();
                    _a.label = 14;
                case 14: return [4 /*yield*/, ctx.answerCbQuery()];
                case 15:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
//# sourceMappingURL=behavior.js.map