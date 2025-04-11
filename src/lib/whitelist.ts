// This is a list of approved email domains and specific emails
// In a production environment, this should be stored in a database
export const EMAIL_WHITELIST = [
  'johborge@gmail.com',
  'johannbor@hotmail.com',
  // Add more emails as needed
]

// List of admin emails that get automatic admin access
export const ADMIN_EMAILS = [
  'johborge@gmail.com'
]

export function isEmailWhitelisted(email: string): boolean {
  return EMAIL_WHITELIST.includes(email.toLowerCase())
}

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase())
} 