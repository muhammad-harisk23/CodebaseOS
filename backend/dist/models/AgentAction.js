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
exports.AgentAction = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const agentActionSchema = new mongoose_1.Schema({
    repositoryId: { type: String, required: true, index: true },
    actionType: {
        type: String,
        enum: ['create_documentation', 'create_gitlab_issue', 'create_learning_mission', 'generate_report', 'transfer_knowledge'],
        required: true,
    },
    reasoning: { type: String, required: true },
    confidence: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'failed'],
        default: 'pending',
    },
    result: { type: String },
    createdAt: { type: Date, default: Date.now },
});
agentActionSchema.index({ repositoryId: 1, actionType: 1 });
agentActionSchema.index({ repositoryId: 1, status: 1 });
exports.AgentAction = mongoose_1.default.model('AgentAction', agentActionSchema);
//# sourceMappingURL=AgentAction.js.map