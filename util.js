"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFirstUrl = exports.dbKeyForUser = exports.recalculateVotes = exports.UserStats = exports.MessageVotes = exports.createVoteMarkup = exports.preprocessMessageBeforeApproval = void 0;
function preprocessMessageBeforeApproval(messageText, tag) {
    if (!messageText)
        messageText = '';
    if (tag) {
        return messageText + "\n" + tag;
    }
    else {
        return messageText;
    }
}
exports.preprocessMessageBeforeApproval = preprocessMessageBeforeApproval;
function createVoteMarkup(votes) {
    return {
        inline_keyboard: [[
                {
                    text: "\uD83D\uDC4D (" + votes.votesFor.length + ")",
                    callback_data: '+',
                },
                {
                    text: "\uD83D\uDC4E (" + votes.votesAgainst.length + ")",
                    callback_data: '-',
                },
            ]],
    };
}
exports.createVoteMarkup = createVoteMarkup;
var MessageVotes = /** @class */ (function () {
    function MessageVotes() {
        // ID is {chat_id}_{message_id}.
        // Therefore there is no relation between message on moderation stage (in moderator's chat)
        // and "same" message in public channel. Their votes  are completely separate.
        this.votesFor = [];
        this.votesAgainst = [];
        // At the moment only used to prevent moderators from submitting their post
        // for moderation and (dis)approving it.
        this.disallowedToVote = [];
        this.finished = false;
    }
    return MessageVotes;
}());
exports.MessageVotes = MessageVotes;
var UserStats = /** @class */ (function () {
    function UserStats() {
        // ID is {user_id}_{user_nickname}. Which is rather bad
        // as user nickname can change. Most probably user_nickname should
        // go into separate field.
        this.articlesProposed = 0;
        // Number of votes in the moderator chat.
        this.votesAsModerator = 0;
        // Number of votes in public channel.
        this.votesAsReader = 0;
    }
    return UserStats;
}());
exports.UserStats = UserStats;
function recalculateVotes(votes, userId, vote, votesLimits) {
    if (votes.finished)
        return false;
    if (votes.disallowedToVote.includes(userId))
        return false;
    if (vote == '+') {
        if (!votes.votesFor.includes(userId)) {
            votes.votesFor.push(userId);
            votes.votesAgainst = votes.votesAgainst.filter(function (v) { return v != userId; });
            votes.finished = votes.votesFor.length >= votesLimits.votesToApprove;
            return true;
        }
    }
    else if (vote == '-') {
        if (!votes.votesAgainst.includes(userId)) {
            votes.votesAgainst.push(userId);
            votes.votesFor = votes.votesFor.filter(function (v) { return v != userId; });
            votes.finished = votes.votesAgainst.length >= votesLimits.votesToReject;
            return true;
        }
    }
    return false;
}
exports.recalculateVotes = recalculateVotes;
function dbKeyForUser(user) {
    return user.id + "_" + user.username;
}
exports.dbKeyForUser = dbKeyForUser;
function extractFirstUrl(msg) {
    var httpRe = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/;
    var reMatch = msg.match(httpRe);
    if (reMatch) {
        return reMatch[0];
    }
    else {
        return undefined;
    }
}
exports.extractFirstUrl = extractFirstUrl;
//# sourceMappingURL=util.js.map