
import { Product, Province, AuditStatus, UserIdentity, UserRole, AuditLogEntry } from '../types';
import { SHRINKFLATION_ITEMS } from '../constants';

const DB_KEY = 'cpci_infrastructure_vault_v3';
const AUTH_KEY = 'cpci_active_session_secure';
const AUDIT_KEY = 'cpci_compliance_log';

interface DatabaseSchema {
  products: Product[];
  regionalDivergence: Record<string, number>;
  authorizedUsers: UserIdentity[];
  systemConfig: {
    protocolVersion: string;
    deploymentId: string;
    integrityStatus: string;
  };
}

class CPCIDistributedDB {
  private data: DatabaseSchema;
  private auditLogs: AuditLogEntry[] = [];

  constructor() {
    const saved = localStorage.getItem(DB_KEY);
    const savedLogs = localStorage.getItem(AUDIT_KEY);
    
    this.auditLogs = savedLogs ? JSON.parse(savedLogs) : [];

    if (saved) {
      this.data = JSON.parse(saved);
    } else {
      this.data = {
        products: SHRINKFLATION_ITEMS.map(p => ({ 
          ...p, 
          status: AuditStatus.VERIFIED, 
          signatures: ['SYS-ROOT'],
          contentHash: this.generateHash(JSON.stringify(p))
        })),
        regionalDivergence: {
          [Province.BC]: 8.2, [Province.AB]: 6.9, [Province.SK]: 7.2,
          [Province.MB]: 7.5, [Province.ON]: 7.8, [Province.QC]: 7.1,
          [Province.NS]: 8.5, [Province.NATIONAL]: 7.4
        },
        authorizedUsers: [
          { 
            id: 'ADMIN-001', 
            name: 'Compliance Officer', 
            role: UserRole.AUDITOR, 
            institution: 'CPCI Infrastructure', 
            authorizedAt: '2024-01-01', 
            mfaEnabled: true,
            status: 'ACTIVE'
          }
        ],
        systemConfig: {
          protocolVersion: '3.1.0-STABLE',
          deploymentId: 'CAN-PRODUCTION-EDGE-01',
          integrityStatus: 'NOMINAL'
        }
      };
      this.logAudit('SYS-ROOT', 'SYSTEM_INIT', 'Infrastructure initialized with institutional defaults', 'INFO');
      this.save();
    }
  }

  private generateHash(str: string): string {
    return 'sha256-' + btoa(str).substring(0, 16);
  }

  private save() {
    localStorage.setItem(DB_KEY, JSON.stringify(this.data));
    localStorage.setItem(AUDIT_KEY, JSON.stringify(this.auditLogs));
  }

  private logAudit(actorId: string, action: string, details: string, severity: 'INFO' | 'WARN' | 'CRITICAL') {
    const entry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      actorId,
      action,
      details,
      severity,
      checksum: this.generateHash(actorId + action + details)
    };
    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 500) this.auditLogs.pop();
    this.save();
  }

  getAuditLogs() { return this.auditLogs; }

  getRawState() { return this.data; }

  getActiveUser(): UserIdentity | null {
    const session = localStorage.getItem(AUTH_KEY);
    return session ? JSON.parse(session) : null;
  }

  login(id: string): boolean {
    const user = this.data.authorizedUsers.find(u => u.id === id);
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      this.logAudit(user.id, 'USER_LOGIN', `Authenticated session started for ${user.id}`, 'INFO');
      return true;
    }
    this.logAudit('ANONYMOUS', 'LOGIN_FAILURE', `Unauthorized access attempt with ID: ${id}`, 'WARN');
    return false;
  }

  logout() {
    const user = this.getActiveUser();
    if (user) this.logAudit(user.id, 'USER_LOGOUT', 'Terminated authenticated session', 'INFO');
    localStorage.removeItem(AUTH_KEY);
  }

  getAuthorizedUsers() { return this.data.authorizedUsers; }

  addUser(user: UserIdentity) {
    const actor = this.getActiveUser();
    if (actor?.role !== UserRole.AUDITOR) return;
    this.data.authorizedUsers.push(user);
    this.logAudit(actor.id, 'IDENTITY_PROVISION', `Authorized new identity: ${user.id} (${user.role})`, 'INFO');
    this.save();
  }

  getProducts(): Product[] { return this.data.products; }

  addProduct(product: Omit<Product, 'id' | 'status' | 'signatures' | 'contentHash'>) {
    const user = this.getActiveUser();
    if (!user || user.role === UserRole.OBSERVER) return null;

    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      status: AuditStatus.PENDING,
      signatures: [user.id],
      contentHash: this.generateHash(JSON.stringify(product))
    };
    this.data.products.push(newProduct);
    this.logAudit(user.id, 'LEDGER_COMMIT', `New volume audit submitted: ${newProduct.id}`, 'INFO');
    this.save();
    return newProduct;
  }

  castVote(productId: string) {
    const user = this.getActiveUser();
    if (!user || user.role === UserRole.OBSERVER) return;

    const product = this.data.products.find(p => p.id === productId);
    if (product && !product.signatures.includes(user.id)) {
      product.signatures.push(user.id);
      this.logAudit(user.id, 'CONSENSUS_SIGN', `Signed off on product audit: ${productId}`, 'INFO');
      
      if (product.signatures.length >= 2 || user.role === UserRole.AUDITOR) {
        product.status = AuditStatus.VERIFIED;
        this.logAudit('SYSTEM', 'AUDIT_VERIFIED', `Threshold reached for ${productId}. Moving to VERIFIED_CONSENSUS.`, 'INFO');
      }
      this.save();
    }
  }

  getRegionalData() { return this.data.regionalDivergence; }
}

export const db = new CPCIDistributedDB();
