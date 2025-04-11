// This is a list of approved email domains and specific emails
// In a production environment, this should be stored in a database
export const EMAIL_WHITELIST = [
  'johborge@gmail.com',
  // Add more emails as needed
]

export function isEmailWhitelisted(email: string): boolean {
  return EMAIL_WHITELIST.includes(email.toLowerCase())
} 