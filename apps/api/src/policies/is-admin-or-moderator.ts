/**
 * Global policy: is-admin-or-moderator
 * Restricts access to admin and moderator roles only.
 * Fetches the user's role from the database since Strapi v5
 * does not populate relations on the JWT-loaded user object.
 */

export default async (policyContext: any, config: any, { strapi }: any) => {
  const user = policyContext.state?.user;

  if (!user) {
    return false;
  }

  // Role may already be populated
  if (user.role?.type) {
    const role = user.role.type;
    return role === 'admin' || role === 'moderator';
  }

  // Strapi v5 doesn't populate role from JWT — fetch it
  const fullUser = await strapi
    .query('plugin::users-permissions.user')
    .findOne({
      where: { id: user.id },
      populate: ['role'],
    });

  const role = fullUser?.role?.type;
  return role === 'admin' || role === 'moderator';
};
