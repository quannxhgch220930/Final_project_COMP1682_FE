export function normalizeUserResponse(user) {
  if (!user) {
    return null
  }

  return {
    ...user,
    isLocked: user.isLocked ?? user.locked ?? false,
    isVerified: user.isVerified ?? user.verified ?? false,
  }
}
