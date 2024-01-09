import { Server} from '@hapi/hapi';

const simplePlugin = {
    name: 'simplePlugin',
    version: '1.0.0',
    register: (server:Server, options:any) => {
        // Plugin logic
        console.log('Plugin has been registered!Hello',options.name);
    }
};

export default simplePlugin;
