/**
 * Global policy: is-admin-or-moderator
 *
 * Allows the request through when:
 *   1. The caller is a users-permissions user with role.type ∈ {admin, moderator}, OR
 *   2. The caller is a Strapi API token of type "full-access" or "custom" with
 *      the underlying permission. Server-side BFFs (apps/website/src/app/api/admin/*)
 *      use this path — they validate the BetterAuth admin session themselves
 *      before forwarding with the API token.
 *
 * Strapi v5 does not populate user.role from JWT, so we fall back to a DB
 * lookup when role.type is missing.
 */

export default async (policyContext: any, _config: any, { strapi }: any) => {
  const auth = policyContext.state?.auth;
  const user = policyContext.state?.user;

  // 1) API token path — Strapi attaches the credentials object on the
  // ctx.state when the request was authenticated via Bearer token.
  // Full-access tokens implicitly authorize everything; custom tokens have
  // already been checked by Strapi's permission layer before this policy
  // runs, so reaching here means access was granted.
  const tokenType = auth?.credentials?.type;
  if (tokenType === 'api-token' || tokenType === 'full-access' || tokenType === 'custom') {
    return true;
  }

  if (!user) {
    return false;
  }

  // 2) Users-permissions user path
  if (user.role?.type) {
    const role = user.role.type;
    return role === 'admin' || role === 'moderator';
  }

  const fullUser = await strapi
    .query('plugin::users-permissions.user')
    .findOne({
      where: { id: user.id },
      populate: ['role'],
    });

  const role = fullUser?.role?.type;
  return role === 'admin' || role === 'moderator';
};
