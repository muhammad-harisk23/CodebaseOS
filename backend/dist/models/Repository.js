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
exports.Repository = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const repositorySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String },
    source: { type: String, enum: ['github', 'gitlab', 'zip'], required: true },
    repositoryUrl: { type: String },
    branch: { type: String, default: 'main' },
    framework: { type: String },
    languages: { type: [String], default: [] },
    packageManager: { type: String, default: 'unknown' },
    dependencies: { type: [String], default: [] },
    database: { type: String },
    authentication: { type: String },
    totalFiles: { type: Number, default: 0 },
    totalFolders: { type: Number, default: 0 },
    readmePresent: { type: Boolean, default: false },
    services: { type: Number, default: 0 },
    apis: { type: Number, default: 0 },
    modules: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['pending', 'analyzing', 'analyzed', 'failed'],
        default: 'pending',
    },
    errorMessage: { type: String },
}, {
    timestamps: true,
});
repositorySchema.index({ repositoryUrl: 1 });
repositorySchema.index({ name: 1 });
repositorySchema.index({ status: 1 });
exports.Repository = mongoose_1.default.model('Repository', repositorySchema);
//# sourceMappingURL=Repository.js.map