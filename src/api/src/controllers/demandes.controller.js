import service from "../services/demandes.service";

export default {
   async create(req, res) {
      try {
         const demande = await service.createDemande(req.body, req.user.id);
         res.status(201).json({ message: "Demande créée", data: demande });
      } catch (err) {
         res.status(500).json({ error: err.message });
      }
   },

   async getAll(req, res) {
      try {
         const demandes = await service.getAllDemandes();
         res.json(demandes);
      } catch (err) {
         res.status(500).json({ error: err.message });
      }
   },

   async getOne(req, res) {
      try {
         const data = await service.getDemandeById(req.params.id);
         if (!data) return res.status(404).json({ message: "Demande introuvable" });
         res.json(data);
      } catch (err) {
         res.status(500).json({ error: err.message });
      }
   },

   async update(req, res) {
      try {
         const result = await service.updateDemande(
            req.params.id,
            req.body,
            req.user.id
         );
         res.json({ message: "Demande mise à jour", data: result });
      } catch (err) {
         res.status(500).json({ error: err.message });
      }
   },

   async remove(req, res) {
      try {
         await service.deleteDemande(req.params.id);
         res.json({ message: "Demande supprimée" });
      } catch (err) {
         res.status(500).json({ error: err.message });
      }
   },
};
