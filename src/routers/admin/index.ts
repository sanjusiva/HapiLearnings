import { Server } from "@hapi/hapi";
import * as router from '../../controllers/user.controller';
import {validate,schema} from '../../controllers/user.controller'

module.exports = {
  name: "admin",
  async register(server: Server) {
    server.auth.scheme('custom',schema)
    server.auth.strategy('simple', 'custom', { validate });
    server.route({
      method: "get",
      path: "/",///admin
      async handler(request, h) {
        console.log('admin')
        return "admin base";
      },
    });
    server.route({
        method: "post",
        path: "/login",///admin/login
        handler:router.adminLogin,
        options: {
          auth: 'simple'
      },
      });
    server.route({
        method: "get",
        path: "/profile",///admin/profile
        async handler(request, h) {
          return "admin profile";
        },
      });
  },
};
