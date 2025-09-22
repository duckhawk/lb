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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
var gdesra4 = __importStar(require("./gdesra4"));
var normal = __importStar(require("./normal"));
function getVkRepostConfig() {
    if (process.env.VK_ACCESS_TOKEN && process.env.VK_GROUP_ID) {
        return {
            groupId: Number(process.env.VK_GROUP_ID),
            accessToken: process.env.VK_ACCESS_TOKEN,
        };
    }
    return undefined;
}
function getConfig() {
    var commonConfig = {
        moderatorChatId: Number(process.env.TELEGRAM_BOT_MODERATOR_CHAT_ID),
        newsChannelId: Number(process.env.TELEGRAM_BOT_NEWS_CHANNEL_ID),
        junkGroupId: Number(process.env.TELEGRAM_BOT_JUNK_CHANNEL_ID),
        vkRepostConfig: getVkRepostConfig(),
    };
    if (process.env.CONFIG_MODE === 'gdesra4') {
        return __assign(__assign({}, commonConfig), { textMessages: gdesra4.getMessages(), tag: '#ПодгонАнонимуса' });
    }
    else {
        return __assign(__assign({}, commonConfig), { textMessages: normal.getMessages(), tag: undefined });
    }
}
exports.getConfig = getConfig;
//# sourceMappingURL=config.js.map