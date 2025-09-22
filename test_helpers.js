"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReaderVoteUpdate = exports.createModeratorVoteUpdate = exports.createPrivateImageMessageUpdate = exports.createPrivateMessageUpdate = exports.kChannelMessageId = exports.kChannelId = exports.kModeratorChatMessageId = exports.kModeratorChatId = exports.kUsername = exports.kUserId = exports.kPrivateChatId = void 0;
var gUpdateId = 0;
var gMessageId = 0;
exports.kPrivateChatId = 17;
exports.kUserId = 123;
exports.kUsername = 'kool_xakep';
exports.kModeratorChatId = 18;
exports.kModeratorChatMessageId = 27;
exports.kChannelId = 40;
exports.kChannelMessageId = 41;
function createPrivateMessageUpdate(text) {
    return {
        update_id: gUpdateId++,
        message: {
            from: {
                id: exports.kUserId,
                is_bot: false,
                username: exports.kUsername,
                first_name: '',
                last_name: undefined,
            },
            text: text,
            message_id: gMessageId++,
            date: new Date().valueOf(),
            chat: {
                id: exports.kPrivateChatId,
                type: 'private',
                first_name: ''
            },
        },
    };
}
exports.createPrivateMessageUpdate = createPrivateMessageUpdate;
function createPrivateImageMessageUpdate(caption) {
    return {
        update_id: gUpdateId++,
        message: {
            caption: caption,
            photo: [{
                    width: 100,
                    height: 100,
                    file_id: 'abcde',
                    file_unique_id: ''
                }],
            from: {
                id: exports.kUserId,
                is_bot: false,
                username: exports.kUsername,
                first_name: '',
                last_name: undefined,
            },
            message_id: gMessageId++,
            date: new Date().valueOf(),
            chat: {
                id: exports.kPrivateChatId,
                type: 'private',
                first_name: '',
            },
        },
    };
}
exports.createPrivateImageMessageUpdate = createPrivateImageMessageUpdate;
function createVoteUpdate(userId, messageId, chatId, messageText, modifier) {
    return {
        update_id: gUpdateId++,
        callback_query: {
            id: (gMessageId++).toString(),
            data: modifier,
            from: {
                id: userId,
                is_bot: false,
                first_name: '',
            },
            message: {
                message_id: messageId,
                date: new Date().valueOf(),
                text: messageText,
                chat: {
                    id: chatId,
                    type: 'group',
                    title: '',
                },
            },
            chat_instance: '',
        },
    };
}
function createModeratorVoteUpdate(userId, messageText, modifier) {
    return createVoteUpdate(userId, exports.kModeratorChatMessageId, exports.kModeratorChatId, messageText, modifier);
}
exports.createModeratorVoteUpdate = createModeratorVoteUpdate;
function createReaderVoteUpdate(userId, messageText, modifier) {
    return createVoteUpdate(userId, exports.kChannelMessageId, exports.kChannelId, messageText, modifier);
}
exports.createReaderVoteUpdate = createReaderVoteUpdate;
//# sourceMappingURL=test_helpers.js.map