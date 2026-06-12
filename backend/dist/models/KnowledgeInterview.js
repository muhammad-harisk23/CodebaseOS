"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeInterview = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const knowledgeInterviewSchema = new mongoose_1.Schema({
    repositoryId: { type: String, required: true, index: true },
    questions: [{
            question: { type: String, required: true },
            answer: { type: String },
            correctAnswer: { type: String },
            score: { type: Number },
            category: { type: String, enum: ['authentication', 'database', 'architecture', 'security'], required: true },
        }],
    authenticationScore: { type: Number, default: 0 },
    databaseScore: { type: Number, default: 0 },
    architectureScore: { type: Number, default: 0 },
    securityScore: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 },
    status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
    createdAt: { type: Date, default: Date.now },
});
exports.KnowledgeInterview = mongoose_1.default.model('KnowledgeInterview', knowledgeInterviewSchema);
//# sourceMappingURL=KnowledgeInterview.js.map