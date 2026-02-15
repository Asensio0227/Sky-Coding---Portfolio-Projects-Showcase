// Centralized RBAC checks for the application

export type UserRole = 'admin' | 'client';
export type Action =
  | 'READ_CONVERSATION'
  | 'SEND_MESSAGE'
  | 'MANAGE_CLIENT'
  | 'ADMIN_ONLY';

const permissionMap: Record<Action, UserRole[]> = {
  READ_CONVERSATION: ['admin', 'client'],
  SEND_MESSAGE: ['admin', 'client'],
  MANAGE_CLIENT: ['admin'],
  ADMIN_ONLY: ['admin'],
};

/**
 * Throws a 403 error if the supplied role does not have permission for the action.
 *
 * @param role - current user's role
 * @param action - action being performed
 */
export function checkPermission(role: UserRole, action: Action): void {
  const permitted = permissionMap[action];
  if (!permitted) {
    throw new Error(`Unknown RBAC action "${action}"`);
  }
  if (!permitted.includes(role)) {
    const err: any = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
}
