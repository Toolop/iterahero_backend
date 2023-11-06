"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuthorization = void 0;
const boom_1 = __importDefault(require("@hapi/boom"));
const publicRoute = [
    "/",
    "/login",
    "/logout",
    "/register"
];
const adminRoute = [
    "/monitoring",
    "/controlling",
];
const userAuthorization = (request, h) => {
    const target = request.route.path;
    if (!publicRoute.includes(target)) {
        const user = request.auth.credentials;
        if (adminRoute.includes(target) && user.role !== "admin") {
            return boom_1.default.unauthorized("Hanya bisa diakses admin");
        }
    }
    return h.continue;
};
exports.userAuthorization = userAuthorization;