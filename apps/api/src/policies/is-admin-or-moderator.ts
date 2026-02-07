/**
 * Global policy: is-admin-or-moderator
 * Restricts access to admin and moderator roles only.
 */

export default (policyContext: any, config: any, { strapi }: any) => {
  const user = policyContext.state?.user;

  if (!user) {
    return false;
  }

  const role = user.role?.type;
  return role === 'admin' || role === 'moderator';
};
