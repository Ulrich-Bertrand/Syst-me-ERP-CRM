import path from 'path';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';

import type {
  DashboardAchats,
  KPIsGlobaux,
  RapportFournisseur,
  RapportBudget,
  RapportDelais,
  RepartitionCategories,
  TopFournisseurs,
  ConfigExport,
  RapportGenere,
  ComparaisonPeriode
} from '../../../types/reporting';
import {
  mockDashboardAchats,
  mockRapportFournisseur,
  mockRapportBudget,
  mockRapportDelais
} from '../../../data/mockReporting';

type DashboardFilters = {
  periode_debut?: string;
  periode_fin?: string;
  agence?: string;
};

const EXPORT_EXTENSIONS: Record<string, string> = {
  excel: 'xlsx',
  pdf: 'pdf',
  csv: 'csv'
};

export class ReportingService {
  private readonly exportsDir = path.resolve(__dirname, '../../exports');
  private readonly historyLimit = 25;
  private exportsHistory: RapportGenere[] = [];
  private exportFiles = new Map<string, { filePath: string; fileName: string }>();

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
  }

  async getDashboard(filters: DashboardFilters = {}): Promise<DashboardAchats> {
    void filters; // Placeholder until real filters are implemented
    return this.clone(mockDashboardAchats);
  }

  async getKPIs(filters: DashboardFilters = {}): Promise<KPIsGlobaux> {
    void filters;
    return this.clone(mockDashboardAchats.kpis_globaux);
  }

  async getRapportFournisseur(code: string): Promise<RapportFournisseur> {
    const rapport = this.clone(mockRapportFournisseur);
    const normalizedCode = (code || '').toUpperCase();

    if (normalizedCode) {
      rapport.fournisseur.code = normalizedCode;
    }

    const fournisseurFromTop = mockDashboardAchats.graphiques.top_fournisseurs.fournisseurs
      .find((fournisseur) => fournisseur.code === normalizedCode);

    if (fournisseurFromTop) {
      rapport.fournisseur.nom = fournisseurFromTop.nom;
      rapport.statistiques.nombre_commandes = fournisseurFromTop.nombre_commandes;
      rapport.statistiques.montant_total = fournisseurFromTop.montant_total;
      rapport.statistiques.montant_moyen = fournisseurFromTop.montant_moyen;
      rapport.statistiques.delai_moyen_livraison = fournisseurFromTop.delai_moyen_livraison;
      rapport.note_performance.note_globale = fournisseurFromTop.note_performance;
    } else if (normalizedCode) {
      rapport.fournisseur.nom = `Fournisseur ${normalizedCode}`;
    }

    return rapport;
  }

  async getRapportBudget(): Promise<RapportBudget> {
    return this.clone(mockRapportBudget);
  }

  async getRapportDelais(): Promise<RapportDelais> {
    return this.clone(mockRapportDelais);
  }

  async getEvolution(): Promise<DashboardAchats['graphiques']['evolution_achats']> {
    return this.clone(mockDashboardAchats.graphiques.evolution_achats);
  }

  async getTopFournisseurs(limite: number = 5): Promise<TopFournisseurs> {
    const top = this.clone(mockDashboardAchats.graphiques.top_fournisseurs);

    if (limite > 0) {
      top.fournisseurs = top.fournisseurs.slice(0, limite);
      top.limite = limite;
    }

    return top;
  }

  async getRepartitionCategories(): Promise<RepartitionCategories> {
    return this.clone(mockDashboardAchats.graphiques.repartition_categories);
  }

  async getComparaison(): Promise<ComparaisonPeriode> {
    return this.clone(mockDashboardAchats.comparaisons);
  }

  async getExports(): Promise<RapportGenere[]> {
    return this.clone(this.exportsHistory);
  }

  async getExportById(id: string): Promise<RapportGenere | undefined> {
    return this.exportsHistory.find((exportItem) => exportItem.id === id);
  }

  async getExportFile(id: string): Promise<{ filePath: string; fileName: string } | null> {
    const fileInfo = this.exportFiles.get(id);

    if (!fileInfo) {
      return null;
    }

    try {
      await fs.access(fileInfo.filePath);
      return fileInfo;
    } catch {
      this.exportFiles.delete(id);
      return null;
    }
  }

  async generateExport(config: ConfigExport, user?: { name?: string; email?: string }): Promise<RapportGenere> {
    await this.ensureExportsDirectory();

    const exportId = randomUUID();
    const extension = EXPORT_EXTENSIONS[config.format] ?? 'dat';
    const fileName = `${config.type_rapport}-${exportId}.${extension}`;
    const filePath = path.join(this.exportsDir, fileName);

    const dataset = await this.buildDatasetForExport(config.type_rapport);
    const fileContent = JSON.stringify({
      generated_at: new Date().toISOString(),
      generated_by: user?.email || user?.name || 'system',
      type: config.type_rapport,
      format: config.format,
      periode: config.periode,
      filtres: config.filtres,
      options: config.options,
      data: dataset
    }, null, 2);

    await fs.writeFile(filePath, fileContent, 'utf-8');

    const fileSize = Buffer.byteLength(fileContent, 'utf-8');
    const exportRecord: RapportGenere = {
      id: exportId,
      type: config.type_rapport,
      titre: `Rapport ${config.type_rapport.toUpperCase()}`,
      date_generation: new Date().toISOString(),
      genere_par: user?.name || 'Système',
      periode: config.periode,
      format: config.format,
      taille: fileSize,
      url: `/exports/${fileName}`
    };

    this.exportsHistory = [exportRecord, ...this.exportsHistory].slice(0, this.historyLimit);
    this.exportFiles.set(exportId, { filePath, fileName });

    return this.clone(exportRecord);
  }

  private async ensureExportsDirectory(): Promise<void> {
    await fs.mkdir(this.exportsDir, { recursive: true });
  }

  private async buildDatasetForExport(type: ConfigExport['type_rapport']): Promise<any> {
    switch (type) {
      case 'achats_global':
        return this.getDashboard();
      case 'fournisseurs':
        return this.getTopFournisseurs(10);
      case 'budget':
        return this.getRapportBudget();
      case 'delais':
        return this.getRapportDelais();
      default:
        return {};
    }
  }
}
