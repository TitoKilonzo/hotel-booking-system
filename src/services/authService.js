import { account, databases, DB_ID, USERS_COL, ID, USER_ROLES } from '../config/appwrite'

// ─── Auth Service ─────────────────────────────────────────────────────────────

export const authService = {
  // Register a new user
  async register({ name, email, password, role = USER_ROLES.CUSTOMER }) {
    const userId = ID.unique()
    // 1. Create Appwrite Auth account
    await account.create(userId, email, password, name)
    // 2. Create session immediately
    const session = await account.createEmailPasswordSession(email, password)
    // 3. Store user profile with role in DB
    await databases.createDocument(DB_ID, USERS_COL, userId, {
      userId,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
      avatar: null,
      phone: null,
    })
    return session
  },

  // Login
  async login(email, password) {
    return account.createEmailPasswordSession(email, password)
  },

  // Logout
  async logout() {
    return account.deleteSession('current')
  },

  // Get current auth user
  async getCurrentUser() {
    try {
      return await account.get()
    } catch {
      return null
    }
  },

  // Get user profile from DB (includes role)
  async getUserProfile(userId) {
    try {
      return await databases.getDocument(DB_ID, USERS_COL, userId)
    } catch {
      return null
    }
  },

  // Update user profile
  async updateProfile(userId, data) {
    return databases.updateDocument(DB_ID, USERS_COL, userId, data)
  },

  // Password reset
  async resetPassword(email) {
    return account.createRecovery(email, `${window.location.origin}/reset-password`)
  },

  // Confirm password reset
  async confirmReset(userId, secret, password, confirmPassword) {
    return account.updateRecovery(userId, secret, password, confirmPassword)
  },

  // Check if admin
  isAdmin(userProfile) {
    return userProfile?.role === USER_ROLES.ADMIN
  },
}
