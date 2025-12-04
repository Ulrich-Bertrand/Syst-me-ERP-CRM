"use client"

import { useState } from 'react';
import { User, Mail, Phone, Building2, Shield, Key, Save, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ProfilePage() {
   const { user, updateProfile } = useAuth();
   const [loading, setLoading] = useState(false);
   const [showChangePassword, setShowChangePassword] = useState(false);

   const [profileData, setProfileData] = useState({
      nom: user?.nom || '',
      prenom: user?.prenom || '',
      telephone: user?.telephone || '',
      email: user?.email || ''
   });

   const [passwordData, setPasswordData] = useState({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
   });

   // Mise à jour profil
   const handleUpdateProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
         await updateProfile(profileData);
         toast.success('Profil mis à jour avec succès');
      } catch (err: any) {
         toast.error(err.message || 'Erreur lors de la mise à jour');
      } finally {
         setLoading(false);
      }
   };

   // Changement mot de passe
   const handleChangePassword = async (e: React.FormEvent) => {
      e.preventDefault();

      if (passwordData.newPassword !== passwordData.confirmPassword) {
         toast.error('Les mots de passe ne correspondent pas');
         return;
      }

      if (passwordData.newPassword.length < 8) {
         toast.error('Le mot de passe doit contenir au moins 8 caractères');
         return;
      }

      setLoading(true);

      try {
         // TODO: API changement mot de passe
         toast.success('Mot de passe modifié avec succès');
         setShowChangePassword(false);
         setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } catch (err: any) {
         toast.error(err.message || 'Erreur lors du changement de mot de passe');
      } finally {
         setLoading(false);
      }
   };

   return (
      <ProtectedRoute>
         <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
               <h1 className="text-2xl font-semibold">Mon profil</h1>
               <p className="text-sm text-gray-600 mt-1">
                  Gérer vos informations personnelles et vos paramètres
               </p>
            </div>

            {/* Avatar + Infos principales */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
               <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
                     <span className="text-white text-3xl font-bold">
                        {user?.prenom?.[0]}{user?.nom?.[0]}
                     </span>
                  </div>

                  <div className="flex-1">
                     <h2 className="text-xl font-semibold text-gray-900">
                        {user?.prenom} {user?.nom}
                     </h2>
                     <p className="text-gray-600">{user?.email}</p>
                     <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                           <Building2 className="h-4 w-4" />
                           {user?.agence}
                        </div>
                        {user?.is_admin && (
                           <div className="flex items-center gap-2 text-sm text-blue-600">
                              <Shield className="h-4 w-4" />
                              Administrateur
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>

            {/* Informations personnelles */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
               <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
               </h3>

               <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Prénom
                        </label>
                        <input
                           type="text"
                           value={profileData.prenom}
                           onChange={(e) => setProfileData({ ...profileData, prenom: e.target.value })}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Nom
                        </label>
                        <input
                           type="text"
                           value={profileData.nom}
                           onChange={(e) => setProfileData({ ...profileData, nom: e.target.value })}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                     </label>
                     <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                           type="email"
                           value={profileData.email}
                           onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                           className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                     </label>
                     <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                           type="tel"
                           value={profileData.telephone}
                           onChange={(e) => setProfileData({ ...profileData, telephone: e.target.value })}
                           className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           placeholder="+233 XX XXX XXXX"
                        />
                     </div>
                  </div>

                  <div className="flex justify-end">
                     <Button type="submit" disabled={loading}>
                        {loading ? (
                           <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Enregistrement...
                           </>
                        ) : (
                           <>
                              <Save className="h-4 w-4 mr-2" />
                              Enregistrer les modifications
                           </>
                        )}
                     </Button>
                  </div>
               </form>
            </div>

            {/* Sécurité */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
               <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Sécurité
               </h3>

               {!showChangePassword ? (
                  <div>
                     <p className="text-sm text-gray-600 mb-4">
                        Modifier votre mot de passe pour sécuriser votre compte
                     </p>
                     <Button
                        variant="outline"
                        onClick={() => setShowChangePassword(true)}
                     >
                        Changer le mot de passe
                     </Button>
                  </div>
               ) : (
                  <form onSubmit={handleChangePassword} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Mot de passe actuel
                        </label>
                        <input
                           type="password"
                           value={passwordData.oldPassword}
                           onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           required
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Nouveau mot de passe
                        </label>
                        <input
                           type="password"
                           value={passwordData.newPassword}
                           onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           required
                           minLength={8}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                           Au moins 8 caractères
                        </p>
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Confirmer le nouveau mot de passe
                        </label>
                        <input
                           type="password"
                           value={passwordData.confirmPassword}
                           onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           required
                        />
                     </div>

                     <div className="flex gap-3 justify-end">
                        <Button
                           type="button"
                           variant="outline"
                           onClick={() => {
                              setShowChangePassword(false);
                              setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                           }}
                        >
                           Annuler
                        </Button>
                        <Button type="submit" disabled={loading}>
                           {loading ? (
                              <>
                                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                 Modification...
                              </>
                           ) : (
                              'Modifier le mot de passe'
                           )}
                        </Button>
                     </div>
                  </form>
               )}
            </div>

            {/* Profils et permissions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
               <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Profils et permissions
               </h3>

               <div className="grid grid-cols-2 gap-3">
                  {user?.profile_purchases_create && (
                     <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Créer demandes d'achat</span>
                     </div>
                  )}
                  {user?.profile_purchases_validate_level_1 && (
                     <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Validation niveau 1</span>
                     </div>
                  )}
                  {user?.profile_purchases_validate_level_2 && (
                     <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Validation niveau 2</span>
                     </div>
                  )}
                  {user?.profile_purchases_validate_level_3 && (
                     <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Validation niveau 3</span>
                     </div>
                  )}
                  {user?.profile_purchases_manage_po && (
                     <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Gérer bons de commande</span>
                     </div>
                  )}
                  {user?.profile_purchases_manage_invoices && (
                     <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Gérer factures</span>
                     </div>
                  )}
                  {user?.profile_purchases_manage_payments && (
                     <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Gérer paiements</span>
                     </div>
                  )}
                  {user?.profile_stock_manage && (
                     <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Gérer stock</span>
                     </div>
                  )}
               </div>

               {!user?.profile_purchases_create &&
                  !user?.profile_purchases_validate_level_1 &&
                  !user?.profile_purchases_validate_level_2 &&
                  !user?.profile_purchases_validate_level_3 && (
                     <p className="text-sm text-gray-500">
                        Aucun profil spécifique. Contactez l'administrateur pour obtenir des permissions.
                     </p>
                  )}
            </div>
         </div>
      </ProtectedRoute>
   );
}
