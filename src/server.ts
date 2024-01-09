import hapi from '@hapi/hapi';
import { userRoutes } from './routers/user.route';
import { connectDb,disconnectDb } from './db';
import simplePlugin from './plugins/simplePlugin';
import * as dotenv from 'dotenv';
dotenv.config();
import { combine } from './controllers/cache.controller';
import Qs from 'qs'
import * as Path from 'path';

const server=hapi.server({
    port:process.env.PORT,
    host:process.env.HOST,
    query: {
        parser: (query) => Qs.parse(query)
    },
    routes: {
        files: {
            relativeTo: Path.join(__dirname, '../public')
        }
    }
}) as any;

export const init = async()=>{
    await connectDb();
    await server.register(require('@hapi/inert'));
    await server.register(require('@hapi/vision'));
    server.method({
        name: 'combine',
        method: combine,
        options: {
            cache: {
                expiresIn: 10 * 1000,
                generateTimeout: 2000
            }
        },
    });
    //multiple plugin register
    await server.register([
        {plugin:simplePlugin,options:{name:'sanju'}},
        {plugin:require('./routers/admin/index'), routes: { prefix: '/admin' } }
    ])
    server.views({
        engines: {
          html: require('handlebars'),
        },
        relativeTo: __dirname,
        path: 'views'
      });
    server.route(userRoutes);
    await server.start();
    console.log('Server is running at ',server.info.uri)
}

export const test=async()=>{
    await server.initialize();
    return server;
}
//SIGINT signal is typically sent to a process when the user 
//presses Ctrl+C in the terminal to interrupt or stop the running process.
process.on('SIGINT', async () => {
    await disconnectDb();
    process.exit(0);
  });
init();