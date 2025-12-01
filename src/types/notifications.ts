// ========== Types pour notifications ==========

export type TypeNotification = 
  | 'validation_requise'
  | 'demande_approuvee'
  | 'demande_rejetee'
  | 'bc_genere'
  | 'paiement_effectue'
  | 'justificatif_requis'
  | 'rappel_validation';

export type PrioriteNotification = 'normale' | 'importante' | 'urgente';

export interface Notification {
  id: string;
  type: TypeNotification;
  priorite: PrioriteNotification;
  titre: string;
  message: string;
  demande_achat_id: string;
  demande_achat_ref: string;
  destinataire_email: string;
  destinataire_nom: string;
  created_at: string;
  lue: boolean;
  lue_at?: string;
  action_url?: string; // URL pour accéder à la DA
  donnees_complementaires?: {
    montant?: number;
    devise?: string;
    fournisseur?: string;
    niveau_validation?: number;
    valideur_precedent?: string;
  };
}

export interface NotificationEmail {
  id: string;
  notification_id: string;
  destinataire_email: string;
  sujet: string;
  corps_html: string;
  envoye: boolean;
  envoye_at?: string;
  erreur?: string;
  tentatives: number;
}

// ========== Configuration des notifications ==========

export const NOTIFICATION_CONFIG = {
  validation_requise: {
    icon: '⏳',
    color: 'orange',
    titre: 'Validation requise',
    template: (data: any) => `La demande d'achat ${data.ref} nécessite votre validation (Niveau ${data.niveau})`,
    urgente: true
  },
  demande_approuvee: {
    icon: '✅',
    color: 'green',
    titre: 'Demande approuvée',
    template: (data: any) => `Votre demande ${data.ref} a été approuvée par ${data.valideur}`,
    urgente: false
  },
  demande_rejetee: {
    icon: '❌',
    color: 'red',
    titre: 'Demande rejetée',
    template: (data: any) => `Votre demande ${data.ref} a été rejetée. Raison: ${data.raison}`,
    urgente: true
  },
  bc_genere: {
    icon: '📄',
    color: 'blue',
    titre: 'Bon de commande généré',
    template: (data: any) => `Le BC ${data.bc_ref} a été généré pour la DA ${data.ref}`,
    urgente: false
  },
  paiement_effectue: {
    icon: '💰',
    color: 'emerald',
    titre: 'Paiement effectué',
    template: (data: any) => `Le paiement de ${data.montant} ${data.devise} a été effectué`,
    urgente: false
  },
  justificatif_requis: {
    icon: '⚠️',
    color: 'yellow',
    titre: 'Justificatif requis',
    template: (data: any) => `La DA ${data.ref} payée nécessite un justificatif`,
    urgente: true
  },
  rappel_validation: {
    icon: '🔔',
    color: 'purple',
    titre: 'Rappel de validation',
    template: (data: any) => `Rappel: La DA ${data.ref} attend votre validation depuis ${data.jours} jours`,
    urgente: true
  }
} as const;

// ========== Règles de validation ==========

export interface RegleValidation {
  id: string;
  nom: string;
  description: string;
  condition: {
    type_demande?: 'agence' | 'dossier';
    montant_min?: number;
    montant_max?: number;
    devise?: string;
    service_demandeur?: string;
    impact_stock?: boolean;
  };
  niveaux_requis: {
    niveau: number;
    profil_requis: string; // profile_purchases_validation, profile_purchases_approval, etc.
    delai_max_jours: number;
    notification_rappel_jours: number;
  }[];
  validation_auto?: boolean; // Validation automatique si conditions remplies
  actif: boolean;
}

// ========== Règles par défaut ==========

export const REGLES_VALIDATION_DEFAUT: RegleValidation[] = [
  // Règle 1: Achats agence < 1000 GHS
  {
    id: 'REGLE-001',
    nom: 'Achat agence faible montant',
    description: 'Achats internes inférieurs à 1000 GHS - 1 niveau de validation',
    condition: {
      type_demande: 'agence',
      montant_max: 1000,
      devise: 'GHS'
    },
    niveaux_requis: [
      {
        niveau: 1,
        profil_requis: 'profile_purchases_validation',
        delai_max_jours: 3,
        notification_rappel_jours: 2
      }
    ],
    validation_auto: false,
    actif: true
  },
  
  // Règle 2: Achats agence > 1000 GHS
  {
    id: 'REGLE-002',
    nom: 'Achat agence montant élevé',
    description: 'Achats internes supérieurs à 1000 GHS - 2 niveaux de validation',
    condition: {
      type_demande: 'agence',
      montant_min: 1000,
      devise: 'GHS'
    },
    niveaux_requis: [
      {
        niveau: 1,
        profil_requis: 'profile_purchases_validation',
        delai_max_jours: 3,
        notification_rappel_jours: 2
      },
      {
        niveau: 2,
        profil_requis: 'profile_purchases_approval', // CFO
        delai_max_jours: 5,
        notification_rappel_jours: 3
      }
    ],
    validation_auto: false,
    actif: true
  },
  
  // Règle 3: Achats dossier (tous montants)
  {
    id: 'REGLE-003',
    nom: 'Achat dossier standard',
    description: 'Achats opérationnels liés aux dossiers - 2 niveaux obligatoires',
    condition: {
      type_demande: 'dossier'
    },
    niveaux_requis: [
      {
        niveau: 1,
        profil_requis: 'profile_purchases_validation', // Ops Manager
        delai_max_jours: 2,
        notification_rappel_jours: 1
      },
      {
        niveau: 2,
        profil_requis: 'profile_purchases_approval', // CFO
        delai_max_jours: 3,
        notification_rappel_jours: 2
      }
    ],
    validation_auto: false,
    actif: true
  },
  
  // Règle 4: Achats avec impact stock
  {
    id: 'REGLE-004',
    nom: 'Achat avec impact stock',
    description: 'Achats impactant le stock - validation magasinier requise',
    condition: {
      impact_stock: true
    },
    niveaux_requis: [
      {
        niveau: 1,
        profil_requis: 'profile_purchases_validation',
        delai_max_jours: 2,
        notification_rappel_jours: 1
      },
      {
        niveau: 2,
        profil_requis: 'profile_stock_management', // Magasinier
        delai_max_jours: 2,
        notification_rappel_jours: 1
      },
      {
        niveau: 3,
        profil_requis: 'profile_purchases_approval', // CFO
        delai_max_jours: 3,
        notification_rappel_jours: 2
      }
    ],
    validation_auto: false,
    actif: true
  },
  
  // Règle 5: Validation automatique (très faible montant)
  {
    id: 'REGLE-005',
    nom: 'Validation automatique',
    description: 'Achats agence < 100 GHS approuvés automatiquement',
    condition: {
      type_demande: 'agence',
      montant_max: 100,
      devise: 'GHS'
    },
    niveaux_requis: [],
    validation_auto: true,
    actif: false // Désactivé par défaut pour sécurité
  }
];

// ========== Helpers ==========

export function determinerNiveauxValidation(
  typeDemande: 'agence' | 'dossier',
  montant: number,
  devise: string,
  impactStock: boolean
): RegleValidation | undefined {
  // Trouver la règle applicable
  for (const regle of REGLES_VALIDATION_DEFAUT) {
    if (!regle.actif) continue;
    
    const c = regle.condition;
    
    // Vérifier type
    if (c.type_demande && c.type_demande !== typeDemande) continue;
    
    // Vérifier montant (convertir en GHS si nécessaire pour comparaison)
    // TODO: Implémenter conversion devise
    if (c.montant_min && montant < c.montant_min) continue;
    if (c.montant_max && montant > c.montant_max) continue;
    
    // Vérifier devise
    if (c.devise && c.devise !== devise) continue;
    
    // Vérifier impact stock
    if (c.impact_stock !== undefined && c.impact_stock !== impactStock) continue;
    
    return regle;
  }
  
  return undefined;
}

export function getProchainNiveauValidation(
  validationsExistantes: { niveau: number; statut: string }[],
  regleApplicable: RegleValidation
): number | null {
  const niveauxApprouves = validationsExistantes
    .filter(v => v.statut === 'approuve')
    .map(v => v.niveau);
  
  // Trouver le prochain niveau requis non encore approuvé
  for (const niveau of regleApplicable.niveaux_requis) {
    if (!niveauxApprouves.includes(niveau.niveau)) {
      return niveau.niveau;
    }
  }
  
  return null; // Tous les niveaux sont validés
}
