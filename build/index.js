"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var admin = __importStar(require("firebase-admin"));
var fs_1 = __importDefault(require("fs"));
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var https_1 = __importDefault(require("https"));
var cors_1 = __importDefault(require("cors"));
var PORT = 80;
var SERVER_KEY = fs_1.default.readFileSync('/server.key');
var SERVER_CERT = fs_1.default.readFileSync('/server.cert');
var CREDENTIALS = { key: SERVER_KEY, cert: SERVER_CERT };
var app = express_1.default();
app.use(express_1.default.static('config'));
app.use(cors_1.default());
app.use(body_parser_1.default.json());
admin.initializeApp({
    credential: admin.credential.cert('../serviceAccountKey.json'),
    databaseURL: 'https://notif-a9307.firebaseio.com',
});
var messaging = admin.messaging();
app.get('/', function (req, res) {
    res.status(200).send('Server is running...');
});
app.post('/', function (req, res) {
    if (!req.body)
        return res.status(400).send({ error: 'Bad Input' });
    if (!req.body.token)
        return res.status(422).send({ error: 'Bad Input (Missing Token)' });
    console.log(req);
});
var httpsServer = https_1.default.createServer(CREDENTIALS, app);
httpsServer.listen(8088);
app.listen(PORT, function () { return console.log("Server listening on Port, " + PORT); });
// app.listen(8000, () => {
//   console.log(`Server listening on Port, ${PORT}`);
// });
