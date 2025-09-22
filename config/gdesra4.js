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
exports.getMessages = void 0;
var normal = __importStar(require("./normal"));
// tslint:disable:max-line-length
function getMessages() {
    return __assign(__assign({}, normal.getMessages()), { HELLO_MESSAGE: 'Привет от бота Гдесрача: анонимного, небрезгливого, твоего! Анонимус, скорее жми /sendarticle чтобы чтобы поделиться свежим срачем!', SEND_ARTICLE_NOW: 'Кидай ссылку на срач! Даже Недорогая не будет знать твоего имени, Анонимус. Если у тебя есть горячие скриншоты — можешь выложить их в скрытый альбом вконтакте (эти ссылки не связаны с пользователем) или в любое другое место и дать прямую ссылку, картинки бот режет.', ARTICLE_WAITING_FOR_APPROVAL: 'Наброс готов! Жми /yes чтобы подтвердить отправку или /no чтобы отменить и попробовать набросить лучше.', NEED_SEND_ARTICLE_CMD: 'Чтоб набросить, сначала нажми /sendarticle.', NEED_ARTICLE_TEXT: 'Сначала расскажи, где срач!', THANK_YOU_FOR_ARTICLE: 'Готово! Наброс отправлен в недорогую редакцию. Спасибо за труд, Анонимус!', ARTICLE_SEND_WAS_CANCELLED: 'Ты можешь лучше! Жми /sendarticle чтобы отправить другой наброс.', ARTICLE_REQUEST_APPROVAL: 'Почти готово! Жми /yes чтобы подтвердить отправку или /no чтобы отменить отправку наброса и отправить другой.' +
            'Если нужно - можно отредактировать наброс до нажатия /yes.' });
}
exports.getMessages = getMessages;
//# sourceMappingURL=gdesra4.js.map