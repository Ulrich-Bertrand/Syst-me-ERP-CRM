import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  agence: string;
}

export class AuthService {
  constructor(private db: Pool) {}

  /**
   * Login utilisateur
   */
  async login(credentials: LoginCredentials): Promise<{
    user: any;
    token: string;
    expiresIn: number;
  }> {
    const { email, password } = credentials;

    // Chercher utilisateur
    const result = await this.db.query(
      'SELECT * FROM users WHERE email = $1 AND active = true',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const user = result.rows[0];

    // Vérifier mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Générer token JWT
    const token = this.generateToken(user.id, user.email);

    // Supprimer password du résultat
    delete user.password_hash;

    // Mettre à jour last_login
    await this.db.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    return {
      user,
      token,
      expiresIn: 24 * 60 * 60 // 24 heures en secondes
    };
  }

  /**
   * Register nouvel utilisateur
   */
  async register(data: RegisterData): Promise<{
    user: any;
    token: string;
  }> {
    const { email, password, nom, prenom, agence } = data;

    // Vérifier si email existe déjà
    const existingUser = await this.db.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('Cet email est déjà utilisé');
    }

    // Hasher mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Créer utilisateur
    const result = await this.db.query(
      `INSERT INTO users (
        email, password_hash, nom, prenom, agence, active,
        profile_purchases_create
      ) VALUES ($1, $2, $3, $4, $5, true, true)
      RETURNING *`,
      [email.toLowerCase(), passwordHash, nom, prenom, agence]
    );

    const user = result.rows[0];

    // Générer token
    const token = this.generateToken(user.id, user.email);

    // Supprimer password
    delete user.password_hash;

    return {
      user,
      token
    };
  }

  /**
   * Changer mot de passe
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    // Récupérer utilisateur
    const result = await this.db.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Utilisateur non trouvé');
    }

    const user = result.rows[0];

    // Vérifier ancien mot de passe
    const passwordMatch = await bcrypt.compare(oldPassword, user.password_hash);

    if (!passwordMatch) {
      throw new Error('Ancien mot de passe incorrect');
    }

    // Hasher nouveau mot de passe
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Mettre à jour
    await this.db.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [newPasswordHash, userId]
    );
  }

  /**
   * Réinitialiser mot de passe (admin uniquement)
   */
  async resetPassword(userId: string, newPassword: string): Promise<void> {
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.db.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [passwordHash, userId]
    );
  }

  /**
   * Vérifier token
   */
  verifyToken(token: string): any {
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET non configuré');
    }

    return jwt.verify(token, jwtSecret);
  }

  /**
   * Générer token JWT
   */
  private generateToken(userId: string, email: string): string {
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET non configuré');
    }

    return jwt.sign(
      {
        userId,
        email
      },
      jwtSecret,
      {
        expiresIn: '24h'
      }
    );
  }

  /**
   * Refresh token
   */
  async refreshToken(oldToken: string): Promise<{
    token: string;
    expiresIn: number;
  }> {
    try {
      const decoded = this.verifyToken(oldToken);

      // Vérifier que l'utilisateur existe toujours
      const result = await this.db.query(
        'SELECT id, email FROM users WHERE id = $1 AND active = true',
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Utilisateur non trouvé ou inactif');
      }

      const user = result.rows[0];

      // Générer nouveau token
      const token = this.generateToken(user.id, user.email);

      return {
        token,
        expiresIn: 24 * 60 * 60
      };
    } catch (error) {
      throw new Error('Token invalide ou expiré');
    }
  }

  /**
   * Récupérer profil utilisateur
   */
  async getProfile(userId: string): Promise<any> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Utilisateur non trouvé');
    }

    const user = result.rows[0];
    delete user.password_hash;

    return user;
  }

  /**
   * Mettre à jour profil
   */
  async updateProfile(userId: string, data: Partial<{
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
  }>): Promise<any> {
    const allowedFields = ['nom', 'prenom', 'telephone', 'email'];
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (updates.length === 0) {
      throw new Error('Aucune donnée à mettre à jour');
    }

    values.push(userId);

    const result = await this.db.query(
      `UPDATE users SET ${updates.join(', ')}, updated_at = NOW()
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    const user = result.rows[0];
    delete user.password_hash;

    return user;
  }
}
