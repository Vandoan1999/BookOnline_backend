"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeWildcards = exports.trimString = void 0;
const trimString = (raw) => String(raw).trim();
exports.trimString = trimString;
function escapeWildcards(raw, escapeChar = "\\") {
    return (0, exports.trimString)(raw).replace(/[\\%_]/g, (match) => escapeChar + match);
}
exports.escapeWildcards = escapeWildcards;
