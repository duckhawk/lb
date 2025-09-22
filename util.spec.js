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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var util_1 = require("./util");
describe('Utils tests', function () {
    describe('preprocessMessageBeforeApproval', function () {
        it('Returns message if no tag provided', function () {
            expect((0, util_1.preprocessMessageBeforeApproval)('Hello world!', undefined)).toBe('Hello world!');
        });
        it('Concatenates tag if provided', function () {
            expect((0, util_1.preprocessMessageBeforeApproval)('Hello world!', '#example')).toBe('Hello world!\n#example');
        });
    });
    describe('createVoteMarkup', function () {
        it('Returns 2 buttons with proper numbers', function () {
            var keyboard = (0, util_1.createVoteMarkup)({
                votesFor: [1, 2, 3],
                votesAgainst: [4],
                disallowedToVote: [],
                finished: false,
            }).inline_keyboard;
            expect(keyboard).toHaveLength(1);
            var buttons = keyboard[0];
            expect(buttons).toHaveLength(2);
            var forButton = buttons[0];
            expect(forButton.text).toContain('3');
            expect(forButton).toMatchObject({ callback_data: '+' });
            var againstButton = buttons[1];
            expect(againstButton.text).toContain('1');
            expect(againstButton).toMatchObject({ callback_data: '-' });
        });
    });
    // TODO: Add better tests for votes.finished calculation
    describe('recalculateVotes', function () {
        var votes = { votesFor: [1, 2, 3], votesAgainst: [4], disallowedToVote: [6, 7], finished: false };
        it('Returns false and doesn\'t modify votes if disallowed to vote', function () {
            var maybeModifiedVotes = lodash_1.default.cloneDeep(votes);
            var success = (0, util_1.recalculateVotes)(maybeModifiedVotes, 7, '+', { votesToApprove: 2, votesToReject: 2 });
            expect(success).toBe(false);
            expect(maybeModifiedVotes).toEqual(votes);
        });
        it('Returns false and doesn\'t modify votes if already voted for', function () {
            var maybeModifiedVotes = lodash_1.default.cloneDeep(votes);
            var success = (0, util_1.recalculateVotes)(maybeModifiedVotes, 2, '+', { votesToApprove: 2, votesToReject: 2 });
            expect(success).toBe(false);
            expect(maybeModifiedVotes).toEqual(votes);
        });
        it('Returns false and doesn\'t modify votes if already voted against', function () {
            var maybeModifiedVotes = lodash_1.default.cloneDeep(votes);
            var success = (0, util_1.recalculateVotes)(maybeModifiedVotes, 4, '-', { votesToApprove: 2, votesToReject: 2 });
            expect(success).toBe(false);
            expect(maybeModifiedVotes).toEqual(votes);
        });
        it('Returns true and adds vote for', function () {
            var maybeModifiedVotes = lodash_1.default.cloneDeep(votes);
            var success = (0, util_1.recalculateVotes)(maybeModifiedVotes, 10, '+', { votesToApprove: 2, votesToReject: 2 });
            expect(success).toBe(true);
            expect(maybeModifiedVotes).toEqual(__assign(__assign({}, votes), { votesFor: [1, 2, 3, 10], finished: true }));
        });
        it('Returns true and adds vote against', function () {
            var maybeModifiedVotes = lodash_1.default.cloneDeep(votes);
            var success = (0, util_1.recalculateVotes)(maybeModifiedVotes, 10, '-', { votesToApprove: 2, votesToReject: 2 });
            expect(success).toBe(true);
            expect(maybeModifiedVotes).toEqual(__assign(__assign({}, votes), { votesAgainst: [4, 10], finished: true }));
        });
        it('Returns true moves vote to for', function () {
            var maybeModifiedVotes = lodash_1.default.cloneDeep(votes);
            var success = (0, util_1.recalculateVotes)(maybeModifiedVotes, 4, '+', { votesToApprove: 2, votesToReject: 2 });
            expect(success).toBe(true);
            expect(maybeModifiedVotes).toEqual(__assign(__assign({}, votes), { votesFor: [1, 2, 3, 4], votesAgainst: [], finished: true }));
        });
        it('Returns true moves vote to against', function () {
            var maybeModifiedVotes = lodash_1.default.cloneDeep(votes);
            var success = (0, util_1.recalculateVotes)(maybeModifiedVotes, 2, '-', { votesToApprove: 2, votesToReject: 2 });
            expect(success).toBe(true);
            expect(maybeModifiedVotes).toEqual(__assign(__assign({}, votes), { votesFor: [1, 3], votesAgainst: [4, 2], finished: true }));
        });
    });
    describe('extractFirstUrl', function () {
        it('Can extract normal link', function () {
            expect((0, util_1.extractFirstUrl)('Something whatever http://example.com/foo magic pony')).toBe('http://example.com/foo');
        });
        it('Can extract link in parenthesis', function () {
            expect((0, util_1.extractFirstUrl)('Something whatever (http://example.com/foo) magic pony')).toBe('http://example.com/foo');
        });
        it('Can extract link in the end of line', function () {
            expect((0, util_1.extractFirstUrl)('Something whatever http://example.com/foo')).toBe('http://example.com/foo');
        });
    });
});
//# sourceMappingURL=util.spec.js.map