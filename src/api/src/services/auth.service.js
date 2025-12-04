const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

class AuthService {
  /**
   * Connexion utilisateur
   */
  async login(email, password) {
    // Récupérer utilisateur avec mot de passe
    const result = await query(
      `SELECT 
        id, email, password, nom, prenom, agence, telephone,
        is_admin, active,
        profile_purchases_create,
        profile_purchases_validate_level_1,
        profile_purchases_validate_level_2,
        profile_purchases_validate_level_3,
        profile_purchases_manage_po,
        profile_purchases_manage_invoices,
        profile_purchases_manage_payments,
        profile_stock_manage,
        profile_stock_view,
        profile_dossiers_manage,
        profile_cotations_manage,
        profile_finance_view
      FROM users 
      WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      throw { statusCode: 401, message: 'Email ou mot de passe incorrect' };
    }

    const user = result.rows[0];

    // Vérifier si actif
    if (!user.active) {
      throw { statusCode: 403, message: 'Compte désactivé. Contactez l\'administrateur.' };
    }

    // Vérifier mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw { statusCode: 401, message: 'Email ou mot de passe incorrect' };
    }

    // Mettre à jour last_login
    await query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    // Générer token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Retirer le mot de passe avant de renvoyer
    delete user.password;

    return { user, token };
  }

  /**
   * Obtenir profil utilisateur
   */
  async getProfile(userId) {
    const result = await query(
      `SELECT 
        id, email, nom, prenom, agence, telephone,
        is_admin, active,
        profile_purchases_create,
        profile_purchases_validate_level_1,
        profile_purchases_validate_level_2,
        profile_purchases_validate_level_3,
        profile_purchases_manage_po,
        profile_purchases_manage_invoices,
        profile_purchases_manage_payments,
        profile_stock_manage,
        profile_stock_view,
        profile_dossiers_manage,
        profile_cotations_manage,
        profile_finance_view,
        last_login,
        created_at
      FROM users 
      WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw { statusCode: 404, message: 'Utilisateur non trouvé' };
    }

    return result.rows[0];
  }

  /**
   * Mettre à jour profil
   */
  async updateProfile(userId, data) {
    const updates = [];
    const values = [];
    let paramIndex = 1;

    // Champs modifiables
    const allowedFields = ['nom', 'prenom', 'telephone', 'email'];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updates.push(`${field} = $${paramIndex}`);
        values.push(field === 'email' ? data[field].toLowerCase() : data[field]);
        paramIndex++;
      }
    }

    if (updates.length === 0) {
      throw { statusCode: 400, message: 'Aucune donnée à mettre à jour' };
    }

    values.push(userId);

    const result = await query(
      `UPDATE users 
       SET ${updates.join(', ')}, updated_at = NOW()
       WHERE id = $${paramIndex}
       RETURNING id, email, nom, prenom, agence, telephone, is_admin, active`,
      values
    );

    return result.rows[0];
  }

  /**
   * Changer mot de passe
   */
  async changePassword(userId, oldPassword, newPassword) {
    // Récupérer mot de passe actuel
    const result = await query(
      'SELECT password FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw { statusCode: 404, message: 'Utilisateur non trouvé' };
    }

    // Vérifier ancien mot de passe
    const isValid = await bcrypt.compare(oldPassword, result.rows[0].password);
    
    if (!isValid) {
      throw { statusCode: 401, message: 'Ancien mot de passe incorrect' };
    }

    // Hasher nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour
    await query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, userId]
    );

    return { message: 'Mot de passe modifié avec succès' };
  }
}

module.exports = new AuthService();
