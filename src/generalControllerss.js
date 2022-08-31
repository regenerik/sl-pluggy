var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var axios = require("axios");
var cheerio = require("cheerio");
var Quotes = require("./db").Quotes;
var ambitoUrl = "https://mercados.ambito.com//dolar/informal/variacion";
var dolarHoyUrl = "https://dolarhoy.com/cotizaciondolarblue";
var cronistaUrl = "https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB";
var scraping = function () { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        try {
            setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var ambito, dolarHoy, cronista, quotes, concat;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, getAmbitoData()];
                        case 1:
                            ambito = _a.sent();
                            return [4 /*yield*/, getDolarHoyData()];
                        case 2:
                            dolarHoy = _a.sent();
                            return [4 /*yield*/, getCronistaData()];
                        case 3:
                            cronista = _a.sent();
                            return [4 /*yield*/, Quotes.findAll()];
                        case 4:
                            quotes = (_a.sent());
                            concat = [ambito, dolarHoy, cronista];
                            if (!!quotes.length) return [3 /*break*/, 6];
                            return [4 /*yield*/, Quotes.bulkCreate(concat)];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            Quotes.update(ambito, { where: { source: ambitoUrl } });
                            Quotes.update(dolarHoy, { where: { source: dolarHoyUrl } });
                            Quotes.update(cronista, { where: { source: cronistaUrl } });
                            _a.label = 7;
                        case 7:
                            console.log("Scraped");
                            return [2 /*return*/];
                    }
                });
            }); }, 4000);
        }
        catch (err) {
            console.log(err.message);
        }
        return [2 /*return*/];
    });
}); };
function getAmbitoData() {
    return __awaiter(this, void 0, void 0, function () {
        var ambitoData, articulo, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get(ambitoUrl)];
                case 1:
                    ambitoData = (_a.sent()).data;
                    articulo = {
                        buy_price: parseFloat(ambitoData.compra.replace(",", ".")),
                        sell_price: parseFloat(ambitoData.venta.replace(",", ".")),
                        source: ambitoUrl
                    };
                    return [2 /*return*/, articulo];
                case 2:
                    err_1 = _a.sent();
                    console.log(err_1.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getDolarHoyData() {
    return __awaiter(this, void 0, void 0, function () {
        var dolarHoyData, $, dolarHoyStr, articulo, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get(dolarHoyUrl)];
                case 1:
                    dolarHoyData = (_a.sent()).data;
                    $ = cheerio.load(dolarHoyData);
                    dolarHoyStr = $(".value", dolarHoyData).text();
                    articulo = {
                        buy_price: parseFloat(dolarHoyStr.slice(1, 7)),
                        sell_price: parseFloat(dolarHoyStr.slice(8, 14)),
                        source: dolarHoyUrl
                    };
                    return [2 /*return*/, articulo];
                case 2:
                    err_2 = _a.sent();
                    console.log(err_2.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getCronistaData() {
    return __awaiter(this, void 0, void 0, function () {
        var cronistaData, $, cronistaBuy, cronistaSell, articulo, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get(cronistaUrl)];
                case 1:
                    cronistaData = (_a.sent()).data;
                    $ = cheerio.load(cronistaData);
                    cronistaBuy = $(".buy-value", cronistaData).text().replace(",", ".");
                    cronistaSell = $(".sell-value", cronistaData).text().replace(",", ".");
                    articulo = {
                        buy_price: parseFloat(cronistaBuy.slice(1, 7)),
                        sell_price: parseFloat(cronistaSell.slice(1, 7)),
                        source: cronistaUrl
                    };
                    return [2 /*return*/, articulo];
                case 2:
                    err_3 = _a.sent();
                    console.log(err_3.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
//------------------------Promedio-------------------------
var averageForAll = function () { return __awaiter(_this, void 0, void 0, function () {
    var quotes, acum, average_buy_price, average_sell_price, average;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Quotes.findAll()];
            case 1:
                quotes = _a.sent();
                acum = 0;
                average_buy_price = parseFloat(((quotes.reduce(function (sum, ele) { return sum += ele.dataValues.buy_price; }, acum)) / 3).toFixed(2));
                average_sell_price = parseFloat(((quotes.reduce(function (sum, ele) { return sum += ele.dataValues.sell_price; }, acum)) / 3).toFixed(2));
                average = {
                    average_buy_price: average_buy_price,
                    average_sell_price: average_sell_price
                };
                return [2 /*return*/, average];
        }
    });
}); };
module.exports = {
    scraping: scraping,
    averageForAll: averageForAll
};
