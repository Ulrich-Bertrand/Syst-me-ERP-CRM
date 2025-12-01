import { Notification } from '../types/notifications';

export const mockNotifications: Notification[] = [
  // Notifications pour Consultant IC (Manager)
  {
    id: 'NOTIF-001',
    type: 'validation_requise',
    priorite: 'urgente',
    titre: 'Validation requise - Niveau 1',
    message: 'La demande d\'achat DA-2025-001 nécessite votre validation (Niveau 1)',
    demande_achat_id: 'DA-001',
    demande_achat_ref: 'DA-2025-001',
    destinataire_email: 'consultantic@jocyderklogistics.com',
    destinataire_nom: 'Consultant IC',
    created_at: '2025-01-20T09:30:00',
    lue: false,
    donnees_complementaires: {
      montant: 1250.00,
      devise: 'GHS',
      fournisseur: 'Office Supplies Ghana',
      niveau_validation: 1
    }
  },
  
  {
    id: 'NOTIF-002',
    type: 'validation_requise',
    priorite: 'urgente',
    titre: 'Validation requise - Niveau 1',
    message: 'La demande d\'achat DA-2025-002 (URGENTE) nécessite votre validation immédiate',
    demande_achat_id: 'DA-002',
    demande_achat_ref: 'DA-2025-002',
    destinataire_email: 'consultantic@jocyderklogistics.com',
    destinataire_nom: 'Consultant IC',
    created_at: '2025-01-22T14:15:00',
    lue: false,
    donnees_complementaires: {
      montant: 8500.00,
      devise: 'USD',
      fournisseur: 'Tech Solutions Ghana',
      niveau_validation: 1
    }
  },
  
  {
    id: 'NOTIF-003',
    type: 'rappel_validation',
    priorite: 'importante',
    titre: 'Rappel de validation',
    message: 'Rappel: La DA DA-2025-001 attend votre validation depuis 2 jours',
    demande_achat_id: 'DA-001',
    demande_achat_ref: 'DA-2025-001',
    destinataire_email: 'consultantic@jocyderklogistics.com',
    destinataire_nom: 'Consultant IC',
    created_at: '2025-01-22T10:00:00',
    lue: false,
    donnees_complementaires: {
      jours: 2,
      niveau_validation: 1
    }
  },
  
  {
    id: 'NOTIF-004',
    type: 'demande_approuvee',
    priorite: 'normale',
    titre: 'Demande approuvée',
    message: 'Votre demande DA-2025-003 a été approuvée (Niveau 1) par Consultant IC',
    demande_achat_id: 'DA-003',
    demande_achat_ref: 'DA-2025-003',
    destinataire_email: 'ops.manager@jocyderklogistics.com',
    destinataire_nom: 'Operations Manager',
    created_at: '2025-01-18T16:45:00',
    lue: true,
    lue_at: '2025-01-18T17:20:00',
    donnees_complementaires: {
      valideur_precedent: 'Consultant IC',
      niveau_validation: 1
    }
  },
  
  {
    id: 'NOTIF-005',
    type: 'demande_rejetee',
    priorite: 'urgente',
    titre: 'Demande rejetée',
    message: 'Votre demande DA-2025-005 a été rejetée. Raison: Budget non disponible pour ce service',
    demande_achat_id: 'DA-005',
    demande_achat_ref: 'DA-2025-005',
    destinataire_email: 'maintenance@jocyderklogistics.com',
    destinataire_nom: 'Maintenance Team',
    created_at: '2025-01-19T11:30:00',
    lue: true,
    lue_at: '2025-01-19T14:00:00',
    donnees_complementaires: {
      valideur_precedent: 'Finance Manager',
      niveau_validation: 1,
      montant: 3200.00,
      devise: 'GHS'
    }
  },
  
  {
    id: 'NOTIF-006',
    type: 'justificatif_requis',
    priorite: 'urgente',
    titre: 'Justificatif de paiement requis',
    message: 'La DA DA-2025-006 payée nécessite l\'upload d\'un justificatif',
    demande_achat_id: 'DA-006',
    demande_achat_ref: 'DA-2025-006',
    destinataire_email: 'consultantic@jocyderklogistics.com',
    destinataire_nom: 'Consultant IC',
    created_at: '2025-01-23T08:00:00',
    lue: false,
    donnees_complementaires: {
      montant: 1850.00,
      devise: 'USD',
      fournisseur: 'Global Transport Services'
    }
  },
  
  {
    id: 'NOTIF-007',
    type: 'bc_genere',
    priorite: 'normale',
    titre: 'Bon de commande généré',
    message: 'Le BC BC-2025-003 a été généré pour la DA DA-2025-003',
    demande_achat_id: 'DA-003',
    demande_achat_ref: 'DA-2025-003',
    destinataire_email: 'ops.manager@jocyderklogistics.com',
    destinataire_nom: 'Operations Manager',
    created_at: '2025-01-19T09:15:00',
    lue: true,
    lue_at: '2025-01-19T10:00:00',
    donnees_complementaires: {
      bc_ref: 'BC-2025-003'
    }
  },
  
  {
    id: 'NOTIF-008',
    type: 'paiement_effectue',
    priorite: 'normale',
    titre: 'Paiement effectué',
    message: 'Le paiement de 2700.00 GHS a été effectué pour la DA DA-2025-004',
    demande_achat_id: 'DA-004',
    demande_achat_ref: 'DA-2025-004',
    destinataire_email: 'ops.manager@jocyderklogistics.com',
    destinataire_nom: 'Operations Manager',
    created_at: '2025-01-20T15:30:00',
    lue: true,
    lue_at: '2025-01-20T16:00:00',
    donnees_complementaires: {
      montant: 2700.00,
      devise: 'GHS'
    }
  },
  
  // Notifications CFO (Niveau 2)
  {
    id: 'NOTIF-009',
    type: 'validation_requise',
    priorite: 'urgente',
    titre: 'Validation décaissement - Niveau 2',
    message: 'La demande DA-2025-002 (8,500 USD) nécessite votre approbation pour décaissement',
    demande_achat_id: 'DA-002',
    demande_achat_ref: 'DA-2025-002',
    destinataire_email: 'cfo@jocyderklogistics.com',
    destinataire_nom: 'CFO Ghana',
    created_at: '2025-01-23T10:00:00',
    lue: false,
    donnees_complementaires: {
      montant: 8500.00,
      devise: 'USD',
      fournisseur: 'Tech Solutions Ghana',
      niveau_validation: 2,
      valideur_precedent: 'Consultant IC'
    }
  },
  
  {
    id: 'NOTIF-010',
    type: 'validation_requise',
    priorite: 'importante',
    titre: 'Validation décaissement - Niveau 2',
    message: 'La demande DA-2025-003 nécessite votre approbation pour décaissement',
    demande_achat_id: 'DA-003',
    demande_achat_ref: 'DA-2025-003',
    destinataire_email: 'cfo@jocyderklogistics.com',
    destinataire_nom: 'CFO Ghana',
    created_at: '2025-01-19T08:30:00',
    lue: true,
    lue_at: '2025-01-19T09:00:00',
    donnees_complementaires: {
      montant: 850.00,
      devise: 'GHS',
      fournisseur: 'Total Ghana',
      niveau_validation: 2,
      valideur_precedent: 'Consultant IC'
    }
  }
];

// ========== Helpers ==========

export function getNotificationsNonLues(email: string): Notification[] {
  return mockNotifications.filter(
    n => n.destinataire_email === email && !n.lue
  );
}

export function getNotificationsByType(
  email: string,
  type: Notification['type']
): Notification[] {
  return mockNotifications.filter(
    n => n.destinataire_email === email && n.type === type
  );
}

export function getNotificationsValidationEnAttente(email: string): Notification[] {
  return mockNotifications.filter(
    n => n.destinataire_email === email && 
        n.type === 'validation_requise' && 
        !n.lue
  );
}

export function marquerCommeLue(notificationId: string): void {
  const notif = mockNotifications.find(n => n.id === notificationId);
  if (notif) {
    notif.lue = true;
    notif.lue_at = new Date().toISOString();
  }
}

export function getStatistiquesNotifications(email: string) {
  const notifications = mockNotifications.filter(n => n.destinataire_email === email);
  
  return {
    total: notifications.length,
    non_lues: notifications.filter(n => !n.lue).length,
    validation_requise: notifications.filter(n => n.type === 'validation_requise' && !n.lue).length,
    justificatifs: notifications.filter(n => n.type === 'justificatif_requis' && !n.lue).length,
    rappels: notifications.filter(n => n.type === 'rappel_validation' && !n.lue).length,
    urgentes: notifications.filter(n => n.priorite === 'urgente' && !n.lue).length
  };
}
