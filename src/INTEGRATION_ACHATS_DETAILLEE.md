# 🎯 INTÉGRATION MODULE ACHATS - GUIDE DÉTAILLÉ

Guide ultra-rigoureux pour intégrer chaque interface du module Achats avec l'API

---

## 📋 STRUCTURE MODULE ACHATS

```
/components/views/
├── AchatsViewNew.tsx         → Liste demandes + Dashboard
├── AchatsDemandeForm.tsx     → Formulaire création/modification
└── AchatsDemandeDetail.tsx   → Détail demande avec actions
```

---

## 🔄 WORKFLOW COMPLET MODULE ACHATS

### **1. CRÉATION DEMANDE**

```
USER ACTION                     API CALL                              BACKEND
────────────────────────────────────────────────────────────────────────────
1. Clic "Nouvelle demande"      N/A                                  N/A
   → Modal s'ouvre

2. Remplit formulaire           N/A                                  N/A
   - Agence: GHANA
   - Type: NORMALE
   - Objet: "Achat fournitures"
   - Justification: "..."
   - Date besoin: 2025-12-31
   - Lignes: [...]

3. Clic "Créer"                 POST /api/demandes                   CREATE demandes_achat
                                                                     + CREATE lignes_demande_achat
                                Headers:                             
                                  Authorization: Bearer {token}      
                                                                     TRANSACTION:
                                Body:                                1. Generate reference
                                {                                    2. INSERT demandes_achat
                                  "agence": "GHANA",                 3. INSERT lignes (loop)
                                  "type": "NORMALE",                 4. UPDATE montant_total
                                  "objet": "...",                    5. COMMIT
                                  "justification": "...",
                                  "date_besoin": "2025-12-31",
                                  "lignes": [...]
                                }

                                Response 201:
                                {
                                  "message": "Demande créée",
                                  "data": {
                                    "id": 123,
                                    "reference": "DA-2025-001",
                                    "statut": "brouillon",
                                    ...
                                  }
                                }

4. Affiche toast succès         N/A                                  N/A
   → "Demande créée avec succès!"

5. Recharge liste               GET /api/demandes                    SELECT demandes_achat
                                ?agence=GHANA&page=1&limit=20        + JOIN utilisateurs
                                                                     + COUNT(*)

6. Ferme modal                  N/A                                  N/A
```

---

### **2. AFFICHAGE LISTE DEMANDES**

```
USER ACTION                     API CALL                              BACKEND
────────────────────────────────────────────────────────────────────────────
1. Accède page Achats          GET /api/demandes                     SELECT da.*,
                               ?agence=GHANA                            u.nom, u.prenom,
                               &page=1                                  COUNT(*) nb_lignes
                               &limit=20                             FROM demandes_achat da
                                                                     LEFT JOIN utilisateurs u 
                                Headers:                             WHERE da.agence = 'GHANA'
                                  Authorization: Bearer {token}      ORDER BY date_demande DESC
                                                                     LIMIT 20 OFFSET 0

                               Response 200:
                               {
                                 "data": [
                                   {
                                     "id": 123,
                                     "reference": "DA-2025-001",
                                     "objet": "...",
                                     "statut": "brouillon",
                                     "montant_total_estime": 275.00,
                                     "date_demande": "2025-11-30",
                                     "demandeur_nom": "DOE",
                                     "demandeur_prenom": "John",
                                     "nombre_lignes": 2
                                   }
                                 ],
                                 "total": 45,
                                 "page": 1,
                                 "limit": 20
                               }

2. Affiche tableau              N/A                                  N/A
   - 20 demandes
   - Pagination (45 total)

3. Change filtre                GET /api/demandes                    SELECT ... WHERE
   → Statut "Validée"           ?agence=GHANA                           statut = 'validee'
                               &statut=validee
                               &page=1

4. Recherche "fournitures"     GET /api/demandes                    SELECT ... WHERE
                               ?search=fournitures                      objet ILIKE '%fournitures%'
                                                                        OR reference ILIKE ...

5. Page suivante               GET /api/demandes                    OFFSET 20
   → Page 2                    ?page=2&limit=20
```

---

### **3. DÉTAIL DEMANDE**

```
USER ACTION                     API CALL                              BACKEND
────────────────────────────────────────────────────────────────────────────
1. Clic ligne tableau          GET /api/demandes/123                 SELECT da.*,
   → Demande ID 123                                                     u.nom, u.prenom
                                                                     FROM demandes_achat da
                               Headers:                              LEFT JOIN utilisateurs u
                                 Authorization: Bearer {token}       WHERE da.id = 123

                                                                     + SELECT * FROM lignes_demande_achat
                                                                       WHERE demande_achat_id = 123

                                                                     + SELECT hv.*, u.nom, u.prenom
                                                                       FROM historique_validations hv
                                                                       LEFT JOIN utilisateurs u
                                                                       WHERE hv.demande_achat_id = 123
                                                                       ORDER BY date_validation DESC

                               Response 200:
                               {
                                 "id": 123,
                                 "reference": "DA-2025-001",
                                 "agence": "GHANA",
                                 "objet": "Achat fournitures",
                                 "statut": "validee",
                                 "montant_total_estime": 275.00,
                                 "lignes": [
                                   {
                                     "id": 1,
                                     "designation": "Ramettes A4",
                                     "quantite": 50,
                                     "prix_unitaire_estime": 5.50,
                                     ...
                                   }
                                 ],
                                 "historique_validations": [
                                   {
                                     "niveau": 1,
                                     "action": "VALIDER",
                                     "date_validation": "2025-11-30",
                                     "validateur_nom": "Smith"
                                   }
                                 ]
                               }

2. Modal affiche               N/A                                   N/A
   - Infos demande
   - Lignes (2)
   - Historique validations (1)
```

---

### **4. MODIFICATION DEMANDE (brouillon)**

```
USER ACTION                     API CALL                              BACKEND
────────────────────────────────────────────────────────────────────────────
1. Clic "Modifier"             N/A                                   N/A
   → Si statut = "brouillon"   (Button disabled si pas brouillon)

2. Modal édition s'ouvre       N/A                                   N/A
   - Prérempli avec données

3. Modifie objet              N/A                                    N/A
   "Achat fournitures bureau"

4. Ajoute une ligne           N/A                                    N/A

5. Clic "Enregistrer"         PUT /api/demandes/123                 CHECK statut = 'brouillon'
                                                                     CHECK demandeur_id = user.id
                              Headers:
                                Authorization: Bearer {token}        BEGIN TRANSACTION

                              Body:                                  UPDATE demandes_achat
                              {                                      SET objet = '...',
                                "objet": "...",                          updated_at = NOW()
                                "lignes": [...]                      WHERE id = 123
                              }
                                                                     DELETE FROM lignes_demande_achat
                                                                     WHERE demande_achat_id = 123

                                                                     INSERT INTO lignes_demande_achat (...)

                                                                     UPDATE demandes_achat
                                                                     SET montant_total_estime = (SUM...)

                                                                     COMMIT

                              Response 200:
                              {
                                "message": "Demande mise à jour",
                                "data": {...}
                              }

6. Toast succès              N/A                                    N/A
7. Recharge liste            GET /api/demandes
```

---

### **5. SUPPRESSION DEMANDE (brouillon)**

```
USER ACTION                     API CALL                              BACKEND
────────────────────────────────────────────────────────────────────────────
1. Clic "Supprimer"            N/A                                   N/A
   → Confirmation modal

2. Confirme suppression       DELETE /api/demandes/123              DELETE FROM demandes_achat
                                                                     WHERE id = 123
                              Headers:                                 AND demandeur_id = user.id
                                Authorization: Bearer {token}          AND statut = 'brouillon'
                                                                     RETURNING id

                                                                     (CASCADE delete lignes)

                              Response 200:
                              {
                                "message": "Demande supprimée"
                              }

3. Toast succès              N/A                                    N/A
4. Retire de liste (local)   N/A                                    N/A
```

---

### **6. SOUMISSION DEMANDE**

```
USER ACTION                     API CALL                              BACKEND
────────────────────────────────────────────────────────────────────────────
1. Clic "Soumettre"           POST /api/demandes/123/submit         CHECK statut = 'brouillon'
   → Demande brouillon                                               CHECK demandeur_id = user.id
                              Headers:
                                Authorization: Bearer {token}        UPDATE demandes_achat
                                                                     SET statut = 'en_validation_niveau_1',
                              (Pas de body)                              date_soumission = NOW()
                                                                     WHERE id = 123

                              Response 200:
                              {
                                "message": "Demande soumise",
                                "data": {
                                  "id": 123,
                                  "statut": "en_validation_niveau_1",
                                  ...
                                }
                              }

2. Toast succès              N/A                                    N/A
   "Demande soumise!"

3. Statut change dans UI     N/A                                    N/A
   brouillon → en_validation_niveau_1
   (Badge orange)

4. Boutons changent          N/A                                    N/A
   - "Modifier" disabled
   - "Supprimer" disabled
   - "Soumettre" hidden
```

---

### **7. VALIDATION NIVEAU 1**

```
USER ACTION                     API CALL                              BACKEND
────────────────────────────────────────────────────────────────────────────
USER = Validateur N1

1. Accède "Validations"       GET /api/validations/demandes         CHECK user profils:
                              ?agence=GHANA                           - profile_purchases_validate_level_1
                                                                      - profile_purchases_validate_level_2
                              Headers:                                - profile_purchases_validate_level_3
                                Authorization: Bearer {token}
                                                                     SELECT demandes
                                                                     WHERE statut IN (
                                                                       niveaux autorisés pour user
                                                                     )
                                                                     ORDER BY
                                                                       CASE type
                                                                         WHEN 'URGENTE' THEN 1
                                                                         ELSE 2
                                                                       END

                              Response 200:
                              {
                                "data": [
                                  {
                                    "id": 123,
                                    "reference": "DA-2025-001",
                                    "statut": "en_validation_niveau_1",
                                    "type": "NORMALE",
                                    ...
                                  }
                                ],
                                "total": 12
                              }

2. Affiche liste             N/A                                    N/A
   - 12 demandes à valider
   - Urgentes en premier

3. Clic "Valider"            POST /api/validations/123/valider      CHECK statut = 'en_validation_niveau_1'
   → Demande ID 123                                                  CHECK user.profile_purchases_validate_level_1
                              Headers:
                                Authorization: Bearer {token}        BEGIN TRANSACTION

                              Body:                                  INSERT INTO historique_validations
                              {                                      (demande_achat_id, validateur_id,
                                "commentaire": "Approuvé"             niveau, action, commentaire)
                              }                                      VALUES (123, user.id, 1, 'VALIDER', '...')

                                                                     UPDATE demandes_achat
                                                                     SET statut = 'en_validation_niveau_2',
                                                                         validateur_niveau_1_id = user.id,
                                                                         date_validation_niveau_1 = NOW()
                                                                     WHERE id = 123

                                                                     COMMIT

                              Response 200:
                              {
                                "message": "Demande validée",
                                "data": {
                                  "id": 123,
                                  "statut": "en_validation_niveau_2",
                                  ...
                                }
                              }

4. Toast succès              N/A                                    N/A
5. Retire de liste (local)   N/A                                    N/A
```

---

### **8. REJET**

```
USER ACTION                     API CALL                              BACKEND
────────────────────────────────────────────────────────────────────────────
1. Clic "Rejeter"             POST /api/validations/123/rejeter     CHECK commentaire NOT NULL
   → Modal commentaire
                              Headers:                               BEGIN TRANSACTION
2. Saisit commentaire           Authorization: Bearer {token}
   "Budget insuffisant"                                              INSERT INTO historique_validations
                              Body:                                  (..., action, commentaire)
3. Confirme                   {                                      VALUES (..., 'REJETER', '...')
                                "commentaire": "Budget insuffisant"
                              }                                      UPDATE demandes_achat
                                                                     SET statut = 'rejetee'
                                                                     WHERE id = 123

                                                                     COMMIT

                              Response 200:
                              {
                                "message": "Demande rejetée",
                                "data": {...}
                              }

4. Toast succès              N/A                                    N/A
5. Retire de liste           N/A                                    N/A
```

---

## 🎯 MAPPING EXACT BDD ↔ FRONTEND

### **Table: demandes_achat**

| Champ BDD                  | Type BDD        | Frontend Type | Formulaire Champ | API Request Key |
|----------------------------|-----------------|---------------|------------------|-----------------|
| `id`                       | SERIAL          | number        | N/A (auto)       | N/A             |
| `reference`                | VARCHAR(50)     | string        | N/A (auto)       | N/A             |
| `agence`                   | VARCHAR(50)     | enum          | `agence`         | `agence`        |
| `demandeur_id`             | INTEGER         | number        | N/A (from token) | N/A             |
| `type`                     | VARCHAR(50)     | enum          | `type`           | `type`          |
| `objet`                    | TEXT            | string        | `objet`          | `objet`         |
| `justification`            | TEXT            | string        | `justification`  | `justification` |
| `date_demande`             | TIMESTAMP       | string (ISO)  | N/A (auto NOW)   | N/A             |
| `date_besoin`              | DATE            | string        | `date_besoin`    | `date_besoin`   |
| `date_soumission`          | TIMESTAMP       | string/null   | N/A              | N/A             |
| `statut`                   | VARCHAR(50)     | enum          | N/A (auto)       | N/A             |
| `budget_id`                | INTEGER         | number/null   | `budget_id`      | `budget_id`     |
| `centre_cout_id`           | INTEGER         | number/null   | `centre_cout_id` | `centre_cout_id`|
| `montant_total_estime`     | DECIMAL(15,2)   | number        | N/A (calculé)    | N/A             |
| `validateur_niveau_1_id`   | INTEGER         | number/null   | N/A              | N/A             |
| `validateur_niveau_2_id`   | INTEGER         | number/null   | N/A              | N/A             |
| `validateur_niveau_3_id`   | INTEGER         | number/null   | N/A              | N/A             |
| `date_validation_niveau_1` | TIMESTAMP       | string/null   | N/A              | N/A             |
| `date_validation_niveau_2` | TIMESTAMP       | string/null   | N/A              | N/A             |
| `date_validation_niveau_3` | TIMESTAMP       | string/null   | N/A              | N/A             |
| `created_at`               | TIMESTAMP       | string        | N/A              | N/A             |
| `updated_at`               | TIMESTAMP       | string        | N/A              | N/A             |

### **Table: lignes_demande_achat**

| Champ BDD              | Type BDD        | Frontend Type | Formulaire Champ     | API Request Key       |
|------------------------|-----------------|---------------|----------------------|-----------------------|
| `id`                   | SERIAL          | number        | N/A (auto)           | N/A                   |
| `demande_achat_id`     | INTEGER         | number        | N/A (from parent)    | N/A                   |
| `article_id`           | INTEGER         | number/null   | `article_id`         | `lignes[].article_id` |
| `designation`          | VARCHAR(255)    | string        | `designation`        | `lignes[].designation`|
| `quantite`             | DECIMAL(15,3)   | number        | `quantite`           | `lignes[].quantite`   |
| `unite`                | VARCHAR(50)     | string        | `unite`              | `lignes[].unite`      |
| `prix_unitaire_estime` | DECIMAL(15,2)   | number        | `prix_unitaire`      | `lignes[].prix_unitaire_estime` |
| `montant_estime`       | DECIMAL(15,2)   | number        | N/A (calculé)        | N/A                   |
| `description`          | TEXT            | string/null   | `description`        | `lignes[].description`|
| `created_at`           | TIMESTAMP       | string        | N/A                  | N/A                   |

---

## ✅ CHECKLIST INTÉGRATION PAR INTERFACE

### **1. AchatsViewNew.tsx (Liste + Dashboard)**

- [x] **Hook useDemandesAchats** créé
- [ ] **Intégration fetchDemandes()**
  - Endpoint: `GET /api/demandes`
  - Params: `{ agence, page, limit }`
  - Au montage: `useEffect(() => fetchDemandes(), [])`
  - Au changement agence: `useEffect(() => fetchDemandes({ agence }), [agence])`
  - Remplacer `mockDemandesAchats` par `demandes` from hook

- [ ] **Intégration filtres**
  - onChange select statut → `fetchDemandes({ statut: value })`
  - onChange select type → `fetchDemandes({ type: value })`
  - onSubmit recherche → `fetchDemandes({ search: query })`

- [ ] **Intégration pagination**
  - onChange page → `fetchDemandes({ page: newPage })`
  - Afficher total: `{pagination.total} demandes`

- [ ] **Bouton "Nouvelle demande"**
  - onClick → `setShowNewForm(true)`
  - Modal `<AchatsDemandeForm onSubmit={createDemande} />`

- [ ] **Suppression**
  - onClick "Supprimer" → Confirmation
  - onConfirm → `deleteDemande(id)` puis `refresh()`

- [ ] **Soumission**
  - onClick "Soumettre" → `submitDemande(id)` puis `refresh()`

- [ ] **Clic ligne tableau**
  - onClick → `fetchDemandeById(id)` puis `setSelectedDemande(result)`
  - Modal `<AchatsDemandeDetail demande={selectedDemande} />`

### **2. AchatsDemandeForm.tsx (Formulaire)**

- [ ] **Validation frontend**
  - Zod schema local (optionnel)
  - Vérifier champs requis avant submit

- [ ] **Calcul montant automatique**
  - onChange quantité/prix → Recalculer montant ligne
  - onChange lignes → Recalculer montant total

- [ ] **Submit**
  - onSubmit → Formatter data selon `CreateDemandeRequest`
  - Appeler `createDemande(data)` from hook
  - Si succès → Fermer modal + callback parent

- [ ] **Gestion erreurs**
  - Catch erreur API → Afficher messages champs invalides

### **3. AchatsDemandeDetail.tsx (Détail)**

- [ ] **Affichage historique validations**
  - useEffect → `fetchHistorique(demande.id)`
  - Afficher timeline avec noms validateurs

- [ ] **Boutons actions**
  - Si brouillon:
    - "Modifier" → Ouvrir formulaire édition
    - "Supprimer" → Confirmer puis `deleteDemande(id)`
    - "Soumettre" → `submitDemande(id)`
  - Si en_validation:
    - Disabled (sauf si user = validateur)
  - Si validée/rejetée:
    - Tous disabled

---

## 🎨 PROCHAINES ÉTAPES

1. ✅ Types créés (`achats-api.types.ts`)
2. ✅ Hooks créés (`useDemandesAchats`, `useValidationsAchats`)
3. ⏳ Intégrer `AchatsViewNew.tsx`
4. ⏳ Intégrer `AchatsDemandeForm.tsx`
5. ⏳ Intégrer `AchatsDemandeDetail.tsx`
6. ⏳ Créer page Validations
7. ⏳ Tests complets

---

**Voulez-vous que je commence l'intégration des interfaces maintenant ?**
