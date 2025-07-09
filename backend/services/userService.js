const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const { generateToken } = require('../middleware/auth');

class UserService {
  
  // Register a new user
  async registerUser(userData) {
    const { firstName, lastName, email, birthDate, phoneNumber, password } = userData;
    
    try {
      // Check if user already exists
      const existingUser = await query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Insert new user
      const result = await query(
        `INSERT INTO users (first_name, last_name, email, birth_date, phone_number, password_hash)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, first_name, last_name, email, birth_date, phone_number, created_at, is_active, email_verified`,
        [firstName, lastName, email, birthDate || null, phoneNumber || null, passwordHash]
      );

      const newUser = result.rows[0];

      // Generate verification token
      const verificationToken = uuidv4();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await query(
        'INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [newUser.id, verificationToken, expiresAt]
      );

      // Log user registration
      await this.logUserAction(newUser.id, 'USER_REGISTERED', {
        email: newUser.email,
        registration_date: newUser.created_at
      });

      // Generate JWT token
      const token = generateToken(newUser.id);

      return {
        user: {
          id: newUser.id,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          email: newUser.email,
          birthDate: newUser.birth_date,
          phoneNumber: newUser.phone_number,
          createdAt: newUser.created_at,
          isActive: newUser.is_active,
          emailVerified: newUser.email_verified
        },
        token,
        verificationToken // In production, this would be sent via email
      };

    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async loginUser(email, password, ipAddress, userAgent) {
    try {
      // Find user by email
      const userResult = await query(
        'SELECT id, first_name, last_name, email, password_hash, is_active, email_verified FROM users WHERE email = $1',
        [email]
      );

      if (userResult.rows.length === 0) {
        throw new Error('Invalid email or password');
      }

      const user = userResult.rows[0];

      // Check if account is active
      if (!user.is_active) {
        throw new Error('Account is deactivated');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = generateToken(user.id);

      // Create user session
      const sessionToken = uuidv4();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await query(
        'INSERT INTO user_sessions (user_id, session_token, expires_at, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
        [user.id, sessionToken, expiresAt, ipAddress, userAgent]
      );

      // Log user login
      await this.logUserAction(user.id, 'USER_LOGIN', {
        login_time: new Date(),
        ip_address: ipAddress
      }, ipAddress, userAgent);

      return {
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          isActive: user.is_active,
          emailVerified: user.email_verified
        },
        token
      };

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      const result = await query(
        'SELECT id, first_name, last_name, email, birth_date, phone_number, created_at, is_active, email_verified FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = result.rows[0];
      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        birthDate: user.birth_date,
        phoneNumber: user.phone_number,
        createdAt: user.created_at,
        isActive: user.is_active,
        emailVerified: user.email_verified
      };

    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      const tokenResult = await query(
        'SELECT user_id, expires_at, used_at FROM email_verification_tokens WHERE token = $1',
        [token]
      );

      if (tokenResult.rows.length === 0) {
        throw new Error('Invalid verification token');
      }

      const tokenData = tokenResult.rows[0];

      if (tokenData.used_at) {
        throw new Error('Verification token already used');
      }

      if (new Date() > tokenData.expires_at) {
        throw new Error('Verification token expired');
      }

      // Mark email as verified
      await query(
        'UPDATE users SET email_verified = true WHERE id = $1',
        [tokenData.user_id]
      );

      // Mark token as used
      await query(
        'UPDATE email_verification_tokens SET used_at = CURRENT_TIMESTAMP WHERE token = $1',
        [token]
      );

      // Log email verification
      await this.logUserAction(tokenData.user_id, 'EMAIL_VERIFIED', {
        verification_time: new Date()
      });

      return { success: true, message: 'Email verified successfully' };

    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  // Log user actions
  async logUserAction(userId, action, details, ipAddress = null, userAgent = null) {
    try {
      await query(
        'INSERT INTO user_audit_log (user_id, action, details, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
        [userId, action, JSON.stringify(details), ipAddress, userAgent]
      );
    } catch (error) {
      console.error('Audit log error:', error);
      // Don't throw error for audit log failures
    }
  }
}

module.exports = new UserService();