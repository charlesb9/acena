var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
// SharePointGraphService.ts
import axios from 'axios';
import { ClientSecretCredential } from '@azure/identity';
import 'dotenv/config';
const GRAPH_BASE = 'https://graph.microsoft.com/v1.0';
// Lisez ces valeurs depuis vos variables d'env (recommandé)
const TENANT_ID = process.env.AZURE_TENANT_ID;
const CLIENT_ID = process.env.AZURE_CLIENT_ID;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;
const HOSTNAME = (_a = process.env.SP_HOSTNAME) !== null && _a !== void 0 ? _a : 'acena.sharepoint.com'; // ex: contoso.sharepoint.com
const SITE_PATH = (_b = process.env.SP_SITE_PATH) !== null && _b !== void 0 ? _b : '/ACENA'; // chemin serveur relatif du site
function extractBody(payload) {
    return (payload && typeof payload === 'object' && 'body' in payload)
        ? payload.body
        : payload;
}
class SharePointGraphService {
    // ----------- AUTH -----------
    static getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            if (this.tokenCache && this.tokenCache.exp - now > 60000) {
                return this.tokenCache.token;
            }
            const tok = yield this.credential.getToken('https://graph.microsoft.com/.default');
            if (!(tok === null || tok === void 0 ? void 0 : tok.token) || !tok.expiresOnTimestamp) {
                throw new Error('Failed to acquire Graph token');
            }
            this.tokenCache = { token: tok.token, exp: tok.expiresOnTimestamp };
            return tok.token;
        });
    }
    // ----------- HTTP helper -----------
    static graph(path_1) {
        return __awaiter(this, arguments, void 0, function* (path, opts = {}) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const accessToken = yield this.getToken();
            try {
                const res = yield axios.request(Object.assign(Object.assign({ url: `${GRAPH_BASE}${path}` }, opts), { headers: Object.assign({ Authorization: `Bearer ${accessToken}`, Accept: 'application/json', 'Content-Type': 'application/json' }, ((_a = opts.headers) !== null && _a !== void 0 ? _a : {})) }));
                return res.data;
            }
            catch (e) {
                const err = e;
                // <-- c’est ce que tu voulais voir
                const status = (_b = err.response) === null || _b === void 0 ? void 0 : _b.status;
                const data = (_c = err.response) === null || _c === void 0 ? void 0 : _c.data;
                console.error('GRAPH ERROR', {
                    method: ((_d = opts.method) !== null && _d !== void 0 ? _d : 'GET'),
                    path,
                    status,
                    data: JSON.stringify(data, null, 2), // <= err.response.data
                    // infos utiles en diag; présentes quand Graph les renvoie
                    requestId: (_f = (_e = err.response) === null || _e === void 0 ? void 0 : _e.headers) === null || _f === void 0 ? void 0 : _f['request-id'],
                    clientRequestId: (_h = (_g = err.response) === null || _g === void 0 ? void 0 : _g.headers) === null || _h === void 0 ? void 0 : _h['client-request-id'],
                });
                // on relance l'erreur Axios d'origine pour que l'appelant puisse la gérer
                throw err;
            }
        });
    }
    // ----------- SITE & LISTS -----------
    static getSiteId() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.siteId)
                return this.siteId;
            const data = yield this.graph(`/sites/${HOSTNAME}:${SITE_PATH}?$select=id`);
            if (!(data === null || data === void 0 ? void 0 : data.id))
                throw new Error(`Site introuvable pour ${HOSTNAME}:${SITE_PATH}`);
            this.siteId = data.id;
            return this.siteId;
        });
    }
    static getListIdByName(displayName) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (this.listIdCache.has(displayName))
                return this.listIdCache.get(displayName);
            const siteId = yield this.getSiteId();
            const data = yield this.graph(`/sites/${siteId}/lists`, { params: { '$select': 'id,displayName', '$filter': `displayName eq '${displayName.replace(/'/g, "''")}'`, '$top': 999 } });
            const list = ((_a = data.value) !== null && _a !== void 0 ? _a : []).find(l => l.displayName === displayName);
            if (!list)
                throw new Error(`Liste introuvable: "${displayName}"`);
            this.listIdCache.set(displayName, list.id);
            return list.id;
        });
    }
    static toFilterField(field, value) {
        return typeof value === 'number'
            ? `fields/${field} eq ${value}`
            : `fields/${field} eq '${String(value).replace(/'/g, "''")}'`;
    }
    static buildExpandSelect(select) {
        return (select && select.length) ? `fields($select=${select.join(',')})` : undefined;
    }
    // ----------- LIST ITEMS -----------
    static getItems(listName, opt) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const siteId = yield this.getSiteId();
            const listId = yield this.getListIdByName(listName);
            const params = {};
            const expand = this.buildExpandSelect((_a = opt === null || opt === void 0 ? void 0 : opt.select) !== null && _a !== void 0 ? _a : []);
            if (expand)
                params['$expand'] = expand;
            if (opt === null || opt === void 0 ? void 0 : opt.filter)
                params['$filter'] = opt.filter;
            if (opt === null || opt === void 0 ? void 0 : opt.orderby)
                params['$orderby'] = opt.orderby;
            params['$top'] = (_b = opt === null || opt === void 0 ? void 0 : opt.top) !== null && _b !== void 0 ? _b : 1000;
            const data = yield this.graph(`/sites/${siteId}/lists/${listId}/items`, { params });
            return (_c = data.value) !== null && _c !== void 0 ? _c : [];
        });
    }
    static getItemById(listName, itemId, opt) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const siteId = yield this.getSiteId();
            const listId = yield this.getListIdByName(listName);
            const params = {};
            const expand = this.buildExpandSelect((_a = opt === null || opt === void 0 ? void 0 : opt.select) !== null && _a !== void 0 ? _a : []);
            if (expand)
                params['$expand'] = expand;
            return this.graph(`/sites/${siteId}/lists/${listId}/items/${itemId}`, { params });
        });
    }
    static addItem(listName, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const siteId = yield this.getSiteId();
            const listId = yield this.getListIdByName(listName);
            return this.graph(`/sites/${siteId}/lists/${listId}/items`, {
                method: 'POST',
                data: { fields }
            });
        });
    }
    static updateItemFields(listName, itemId, fieldsPatch) {
        return __awaiter(this, void 0, void 0, function* () {
            const siteId = yield this.getSiteId();
            const listId = yield this.getListIdByName(listName);
            yield this.graph(`/sites/${siteId}/lists/${listId}/items/${itemId}/fields`, {
                method: 'PATCH',
                data: fieldsPatch
            });
        });
    }
    static deleteItem(listName, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const siteId = yield this.getSiteId();
            const listId = yield this.getListIdByName(listName);
            yield this.graph(`/sites/${siteId}/lists/${listId}/items/${itemId}`, { method: 'DELETE' });
        });
    }
    // ----------- MÉTHODES MÉTIER -----------
    static getRepertoire() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.getItems('repertoire', {
                select: ['id', 'Titre', 'designation', 'password_web', 'first_name', 'last_name', 'adresse1', 'adresse2', 'fax', 'Email', 'telephone1'],
                top: 1000
            });
            return items.map(i => i.fields);
        });
    }
    static getMe(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.getItems('repertoire', {
                select: ['id', 'Titre', 'designation', 'password_web', 'first_name', 'last_name', 'adresse1', 'adresse2', 'fax', 'Email', 'telephone1'],
                top: 1000
            });
            let datas = items.map(i => i.fields);
            let me = datas.find(e => e['id'] == parseInt(userId));
            return me;
        });
    }
    static getUserData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const acces = yield this.getItems('acces_web', {
                select: ['rep_id', 'AC_id'],
                filter: this.toFilterField('rep_id', userId),
                top: 2000
            });
            const ACs = acces.map(a => a.fields.AC_id);
            const results = [];
            for (const id of ACs) {
                const cellule = (yield this.getItemById('cellule', id, { select: ['immatriculation', 'type_id'] })).fields;
                const type = (yield this.getItemById('type', cellule.type_id, { select: ['type_x0020_cellule', 'constructeur'] })).fields;
                results.push({
                    id,
                    immatriculation: cellule.immatriculation,
                    type_id: cellule.type_id,
                    type_cellule: type.type_x0020_cellule,
                    constructeur: type.constructeur
                });
            }
            return results;
        });
    }
    static postHdv(planeId, dataOrBody) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const b = extractBody(dataOrBody);
            // compat: si ident absent mais rep_id fourni par le front, on mappe
            const ident = ((_a = b.ident) !== null && _a !== void 0 ? _a : b.rep_id);
            yield this.addItem('AC_log_web', {
                // on respecte exactement les clés attendues par ta liste
                date: b.date,
                AC_id: planeId, // on force à partir du param plane
                H: b.H,
                M: b.M,
                HC: b.HC,
                MC: b.MC,
                message: b.message,
                ident, // <- ident rempli depuis rep_id si besoin
                carburant: b.carburant,
                huile: b.huile,
                ATT: b.ATT,
                pilote: b.pilote,
                // si ta liste a réellement ces colonnes, on les relaie aussi
                saisie: b.saisie,
                ATTC: b.ATTC,
                situation: "en cours",
                immatriculation: b.immat
            });
            return true;
        });
    }
    static updateHdv(itemId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.updateItemFields('AC_log_web', itemId, {
                date: data.date,
                AC_id: (_a = data.AC_ID) !== null && _a !== void 0 ? _a : data.AC_id,
                H: data.H,
                M: data.M,
                HC: data.HC,
                MC: data.MC,
                message: data.message, ident: data.ident,
                carburant: data.carburant, huile: data.huile,
                ATT: data.ATT, pilote: data.pilote
            });
            return true;
        });
    }
    static deleteHdv(itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.deleteItem('AC_log_web', itemId);
            return true;
        });
    }
    static getPlaneData(planeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.getItems('AC_log_web', {
                select: ['date', 'AC_id', 'H', 'M', 'HC', 'MC', 'message', 'ident', 'carburant', 'huile', 'ATT', 'pilote'],
                filter: this.toFilterField('AC_id', planeId),
                orderby: 'fields/date desc',
                top: 2000
            });
            return items.map(i => (Object.assign({ id: i.id }, i.fields)));
        });
    }
    static getPlanePrevisions(planeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const jobs = yield this.getItems('job', {
                select: ['Id', 'action', 'repH', 'repJ', 'repC', 'Hlast', 'Clast', 'Dlast', 'forecaste', 'Dnext', 'Cnext', 'JHTnext', 'immatriculation', 'AC_id', 'schedule'],
                filter: this.toFilterField('AC_id', planeId),
                top: 2000
            });
            const augmented = [];
            for (const j of jobs) {
                const last = yield this.getItems('AC_log', {
                    select: ['date', 'AC_JHT', 'AC_C', 'AC_id'],
                    filter: this.toFilterField('AC_id', j.fields.AC_id),
                    orderby: 'fields/date desc',
                    top: 1
                });
                augmented.push(Object.assign(Object.assign({}, j.fields), { log: last.map(x => x.fields) }));
            }
            return augmented;
        });
    }
    static updateUserData(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateItemFields('repertoire', id, {
                last_name: data.lastName,
                first_name: data.firstName,
                adresse1: data.address,
                adresse2: data.address_b,
                telephone1: data.phone,
                fax: data.mobile,
                Email: data.email,
                password_web: data.password
            });
            return true;
        });
    }
    static updateScheduledDate(itemId, newDateISO) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateItemFields('job', itemId, { schedule: newDateISO });
            return true;
        });
    }
    static hasExpiredForecaste(planeId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Récupère les jobs du plane
            const jobs = yield this.getItems('job', {
                select: ['Id', 'forecaste', 'immatriculation', 'AC_id'],
                filter: this.toFilterField('AC_id', planeId),
                top: 2000
            });
            // Helpers date
            const parseDateMs = (input) => {
                if (!input)
                    return null;
                const t = Date.parse(input);
                if (!Number.isNaN(t))
                    return t;
                // tolérance formats type "dd/MM/yyyy" ou "dd-MM-yyyy"
                const m = /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/.exec(input.trim());
                if (m) {
                    const [, d, mo, y] = m;
                    const year = y.length === 2 ? Number(`20${y}`) : Number(y);
                    const dt = new Date(year, Number(mo) - 1, Number(d));
                    return Number.isNaN(dt.getTime()) ? null : dt.getTime();
                }
                return null; // illisible => on ignore (considéré OK)
            };
            const now = Date.now();
            const in30Days = (() => {
                const d = new Date();
                d.setDate(d.getDate() + 30);
                return d.getTime();
            })();
            // On extrait les timestamps valides (les null/invalides sont ignorés)
            const times = jobs
                .map(j => parseDateMs(j.fields.forecaste))
                .filter((t) => t !== null);
            // 1) Expiré ?
            const hasExpired = times.some(t => t <= now);
            if (hasExpired)
                return 'error';
            // 2) Bientôt (≤ 30 jours) ?
            const hasWarning = times.some(t => t <= in30Days);
            if (hasWarning)
                return 'warning';
            // 3) Tout va bien
            return 'ok';
        });
    }
}
SharePointGraphService.credential = new ClientSecretCredential(TENANT_ID, CLIENT_ID, CLIENT_SECRET);
SharePointGraphService.listIdCache = new Map();
export default SharePointGraphService;
