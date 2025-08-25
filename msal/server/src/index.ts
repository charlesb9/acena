// SharePointGraphService.ts
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ClientSecretCredential, TokenCredential } from '@azure/identity';
import 'dotenv/config';

const GRAPH_BASE = 'https://graph.microsoft.com/v1.0';

// Lisez ces valeurs depuis vos variables d'env (recommandé)
const TENANT_ID   = process.env.AZURE_TENANT_ID!;
const CLIENT_ID   = process.env.AZURE_CLIENT_ID!;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET!;
const HOSTNAME    = process.env.SP_HOSTNAME ?? 'acena.sharepoint.com'; // ex: contoso.sharepoint.com
const SITE_PATH   = process.env.SP_SITE_PATH ?? '/ACENA';              // chemin serveur relatif du site

type Guid = string;

export type SitePermissionRole = 'read' | 'write' | 'manage' | 'fullControl';

type AnyDict = Record<string, any>;

function extractBody<T extends AnyDict>(payload: AnyDict | { body: T }): T {
  return (payload && typeof payload === 'object' && 'body' in payload)
    ? (payload as { body: T }).body
    : (payload as T);
}

type OldHdvBody = {
  date: string;
  AC_id?: number;   // parfois non fourni en postHdv (on reçoit plane en param)
  H?: number; M?: number; HC?: number; MC?: number;
  message?: string;
  ident?: number;   // = rep_id dans l'ancien front
  rep_id?: number;  // alias → ident
  carburant?: number;
  huile?: number;
  ATT?: number;
  pilote?: string;
  // champs éventuels laissés par le front :
  saisie?: string;
  immat: string;
  ATTC?: number;
};

export interface GraphListItem<TFields = Record<string, any>> {
  id: string;            // item id (string)
  fields: TFields;       // vos colonnes
}

export interface RepertoireFields {
  id: number;
  designation?: string;
  password_web?: string;
  first_name?: string;
  last_name?: string;
  adresse1?: string;
  adresse2?: string;
  fax?: string;
  Email?: string;
  telephone1?: string;
}

export interface AccesWebFields {
  rep_id: number;
  AC_id: number;
}

export interface CelluleFields {
  immatriculation?: string;
  type_id: number;
}

export interface TypeFields {
  type_x0020_cellule?: string;
  constructeur?: string;
}

export interface ACLogWebFields {
  date: string;        // ISO 8601 recommandé
  AC_id: number;
  H?: number;
  M?: number;
  HC?: number;
  MC?: number;
  message?: string;
  ident?: number;
  carburant?: number;
  huile?: number;
  ATT?: number;
  pilote?: string;
}

export interface JobFields {
  Id: number;
  action?: string;
  repH?: number;
  repJ?: number;
  repC?: number;
  Hlast?: number;
  Clast?: number;
  Dlast?: string;
  forecaste?: string;
  Dnext?: string;
  Cnext?: number;
  JHTnext?: number;
  immatriculation?: string;
  AC_id: number;
  schedule?: string;
}

class SharePointGraphService {
  private static credential: TokenCredential = new ClientSecretCredential(
    TENANT_ID, CLIENT_ID, CLIENT_SECRET
  );

  private static tokenCache?: { token: string; exp: number };
  private static siteId?: string;
  private static listIdCache = new Map<string, string>();

  // ----------- AUTH -----------
  private static async getToken(): Promise<string> {
    const now = Date.now();
    if (this.tokenCache && this.tokenCache.exp - now > 60_000) {
      return this.tokenCache.token;
    }
    const tok = await this.credential.getToken('https://graph.microsoft.com/.default');
    if (!tok?.token || !tok.expiresOnTimestamp) {
      throw new Error('Failed to acquire Graph token');
    }
    this.tokenCache = { token: tok.token, exp: tok.expiresOnTimestamp };
    return tok.token;
  }

  // ----------- HTTP helper -----------
  private static async graph<T = any>(
    path: string,
    opts: Omit<AxiosRequestConfig, 'url' | 'headers'> & { headers?: Record<string, string> } = {}
  ): Promise<T> {
    const accessToken = await this.getToken();
    try {
      const res = await axios.request<T>({
        url: `${GRAPH_BASE}${path}`,
        ...opts,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(opts.headers ?? {}),
        },
      });
      return res.data;
    } catch (e) {
      const err = e as AxiosError<any>;
      // <-- c’est ce que tu voulais voir
      const status = err.response?.status;
      const data = err.response?.data;

      console.error('GRAPH ERROR', {
        method: (opts.method ?? 'GET'),
        path,
        status,
        data: JSON.stringify(data, null, 2), // <= err.response.data
        // infos utiles en diag; présentes quand Graph les renvoie
        requestId: err.response?.headers?.['request-id'],
        clientRequestId: err.response?.headers?.['client-request-id'],
      });

      // on relance l'erreur Axios d'origine pour que l'appelant puisse la gérer
      throw err;
    }
  }

  // ----------- SITE & LISTS -----------
  private static async getSiteId(): Promise<string> {
    if (this.siteId) return this.siteId;
    const data = await this.graph<{ id: string }>(`/sites/${HOSTNAME}:${SITE_PATH}?$select=id`);
    if (!data?.id) throw new Error(`Site introuvable pour ${HOSTNAME}:${SITE_PATH}`);
    this.siteId = data.id;
    return this.siteId;
  }

  private static async getListIdByName(displayName: string): Promise<string> {
    if (this.listIdCache.has(displayName)) return this.listIdCache.get(displayName)!;
    const siteId = await this.getSiteId();
    const data = await this.graph<{ value: { id: string; displayName: string }[] }>(
      `/sites/${siteId}/lists`,
      { params: { '$select': 'id,displayName', '$filter': `displayName eq '${displayName.replace(/'/g,"''")}'`, '$top': 999 } }
    );
    const list = (data.value ?? []).find(l => l.displayName === displayName);
    if (!list) throw new Error(`Liste introuvable: "${displayName}"`);
    this.listIdCache.set(displayName, list.id);
    return list.id;
  }

  private static toFilterField(field: string, value: string | number): string {
    return typeof value === 'number'
      ? `fields/${field} eq ${value}`
      : `fields/${field} eq '${String(value).replace(/'/g, "''")}'`;
  }

  private static buildExpandSelect(select?: string[]): string | undefined {
    return (select && select.length) ? `fields($select=${select.join(',')})` : undefined;
  }

  // ----------- LIST ITEMS -----------
  private static async getItems<TFields = Record<string, any>>(listName: string, opt?: {
    select?: string[];
    filter?: string;
    orderby?: string;
    top?: number;
  }): Promise<Array<GraphListItem<TFields>>> {
    const siteId = await this.getSiteId();
    const listId = await this.getListIdByName(listName);
    const params: Record<string, string | number> = {};
    const expand = this.buildExpandSelect(opt?.select ?? []);
    if (expand) params['$expand'] = expand;
    if (opt?.filter) params['$filter'] = opt.filter;
    if (opt?.orderby) params['$orderby'] = opt.orderby;
    params['$top'] = opt?.top ?? 1000;

    const data = await this.graph<{ value: Array<{ id: string; fields: TFields }> }>(
      `/sites/${siteId}/lists/${listId}/items`,
      { params }
    );
    return data.value ?? [];
  }

  private static async getItemById<TFields = Record<string, any>>(listName: string, itemId: number | string, opt?: {
    select?: string[];
  }): Promise<GraphListItem<TFields>> {
    const siteId = await this.getSiteId();
    const listId = await this.getListIdByName(listName);
    const params: Record<string, string> = {};
    const expand = this.buildExpandSelect(opt?.select ?? []);
    if (expand) params['$expand'] = expand;

    return this.graph<GraphListItem<TFields>>(
      `/sites/${siteId}/lists/${listId}/items/${itemId}`,
      { params }
    );
  }

  private static async addItem<TFields = Record<string, any>>(listName: string, fields: TFields) {
    const siteId = await this.getSiteId();
    const listId = await this.getListIdByName(listName);
    return this.graph<GraphListItem<TFields>>(`/sites/${siteId}/lists/${listId}/items`, {
      method: 'POST',
      data: { fields }
    });
  }

  private static async updateItemFields(listName: string, itemId: number | string, fieldsPatch: Record<string, any>) {
    const siteId = await this.getSiteId();
    const listId = await this.getListIdByName(listName);
    await this.graph<void>(`/sites/${siteId}/lists/${listId}/items/${itemId}/fields`, {
      method: 'PATCH',
      data: fieldsPatch
    });
  }

  private static async deleteItem(listName: string, itemId: number | string) {
    const siteId = await this.getSiteId();
    const listId = await this.getListIdByName(listName);
    await this.graph<void>(`/sites/${siteId}/lists/${listId}/items/${itemId}`, { method: 'DELETE' });
  }

  // ----------- MÉTHODES MÉTIER -----------
  static async getRepertoire(): Promise<RepertoireFields[]> {
    const items = await this.getItems<RepertoireFields>('repertoire', {
      select: ['id','Titre', 'designation','password_web','first_name','last_name','adresse1','adresse2','fax','Email','telephone1'],
      top: 1000
    });
    return items.map(i => i.fields);
  }

  static async getMe(userId: string) {
    const items = await this.getItems<RepertoireFields>('repertoire', {
      select: ['id','Titre', 'designation','password_web','first_name','last_name','adresse1','adresse2','fax','Email','telephone1'],
      top: 1000
    });
    let datas = items.map(i => i.fields);
    let me = datas.find(e => e['id'] == parseInt(userId))
    return me
  }

  static async getUserData(userId: number) {
    const acces = await this.getItems<AccesWebFields>('acces_web', {
      select: ['rep_id','AC_id'],
      filter: this.toFilterField('rep_id', userId),
      top: 2000
    });
    const ACs = acces.map(a => a.fields.AC_id);

    const results: Array<{
      id: number;
      immatriculation?: string;
      type_id: number;
      type_cellule?: string;
      constructeur?: string;
    }> = [];

    for (const id of ACs) {
      const cellule = (await this.getItemById<CelluleFields>('cellule', id, { select: ['immatriculation','type_id'] })).fields;
      const type = (await this.getItemById<TypeFields>('type', cellule.type_id, { select: ['type_x0020_cellule','constructeur'] })).fields;
      results.push({
        id,
        immatriculation: cellule.immatriculation,
        type_id: cellule.type_id,
        type_cellule: type.type_x0020_cellule,
        constructeur: type.constructeur
      });
    }
    return results;
  }

  static async postHdv(planeId: number, dataOrBody: AnyDict) {
    const b = extractBody<OldHdvBody>(dataOrBody);

    // compat: si ident absent mais rep_id fourni par le front, on mappe
    const ident = (b.ident ?? b.rep_id);

    await this.addItem('AC_log_web', {
      // on respecte exactement les clés attendues par ta liste
      date: b.date,
      AC_id: planeId,               // on force à partir du param plane
      H: b.H, 
      M: b.M, 
      HC: b.HC, 
      MC: b.MC,
      message: b.message,
      ident,                        // <- ident rempli depuis rep_id si besoin
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
  }

  static async updateHdv(itemId: number, data: ACLogWebFields & { AC_ID?: number }) {
    await this.updateItemFields('AC_log_web', itemId, {
      date: data.date,
      AC_id: data.AC_ID ?? data.AC_id,
      H: data.H, 
      M: data.M, 
      HC: data.HC, 
      MC: data.MC,
      message: data.message, ident: data.ident,
      carburant: data.carburant, huile: data.huile,
      ATT: data.ATT, pilote: data.pilote
    });
    return true;
  }

  static async deleteHdv(itemId: number) {
    await this.deleteItem('AC_log_web', itemId);
    return true;
  }

  static async getPlaneData(planeId: number) {
    const items = await this.getItems<ACLogWebFields>('AC_log_web', {
      select: ['date','AC_id','H','M','HC','MC','message','ident','carburant','huile','ATT','pilote'],
      filter: this.toFilterField('AC_id', planeId),
      orderby: 'fields/date desc',
      top: 2000
    });
    return items.map(i => ({ id: i.id, ...i.fields }));
  }

  static async getPlanePrevisions(planeId: number) {
    const jobs = await this.getItems<JobFields>('job', {
      select: ['Id','action','repH','repJ','repC','Hlast','Clast','Dlast','forecaste','Dnext','Cnext','JHTnext','immatriculation','AC_id','schedule'],
      filter: this.toFilterField('AC_id', planeId),
      top: 2000
    });

    const augmented: Array<JobFields & { log: Array<{ date: string; AC_JHT?: number; AC_C?: number; AC_id: number }> }> = [];
    for (const j of jobs) {
      const last = await this.getItems<{ date: string; AC_JHT?: number; AC_C?: number; AC_id: number }>('AC_log', {
        select: ['date','AC_JHT','AC_C','AC_id'],
        filter: this.toFilterField('AC_id', j.fields.AC_id),
        orderby: 'fields/date desc', 
        top: 1
      });
      augmented.push({ ...j.fields, log: last.map(x => x.fields) });
    }
    return augmented;
  }

  static async updateUserData(id: number, data: {
    lastName?: string; firstName?: string; address?: string; address_b?: string;
    phone?: string; mobile?: string; email?: string; password?: string;
  }) {
    await this.updateItemFields('repertoire', id, {
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
  }

  static async updateScheduledDate(itemId: number, newDateISO: string) {
    await this.updateItemFields('job', itemId, { schedule: newDateISO });
    return true;
  }

static async hasExpiredForecaste(planeId: number): Promise<'error' | 'warning' | 'ok'> {
  // Récupère les jobs du plane
  const jobs = await this.getItems<JobFields>('job', {
    select: ['Id','forecaste','immatriculation','AC_id'],
    filter: this.toFilterField('AC_id', planeId),
    top: 2000
  });

  // Helpers date
  const parseDateMs = (input?: string): number | null => {
    if (!input) return null;
    const t = Date.parse(input);
    if (!Number.isNaN(t)) return t;

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
    .filter((t): t is number => t !== null);

  // 1) Expiré ?
  const hasExpired = times.some(t => t <= now);
  if (hasExpired) return 'error';

  // 2) Bientôt (≤ 30 jours) ?
  const hasWarning = times.some(t => t <= in30Days);
  if (hasWarning) return 'warning';

  // 3) Tout va bien
  return 'ok';
}
}

export default SharePointGraphService;
