/**
 * users-permissions extension
 *
 * Overrides the /api/users/me controller to include the user's role relation,
 * which Strapi v5's default implementation strips out.
 */

export default (plugin: any) => {
  const originalMe = plugin.controllers.user.me;

  plugin.controllers.user.me = async (ctx: any) => {
    // Call the original handler to get the base user
    await originalMe(ctx);

    // If the response has a user, populate the role
    if (ctx.body && ctx.body.id) {
      const userWithRole = await strapi
        .query('plugin::users-permissions.user')
        .findOne({
          where: { id: ctx.body.id },
          populate: ['role'],
        });

      if (userWithRole?.role) {
        ctx.body.role = {
          id: userWithRole.role.id,
          name: userWithRole.role.name,
          type: userWithRole.role.type,
        };
      }
    }
  };

  return plugin;
};
