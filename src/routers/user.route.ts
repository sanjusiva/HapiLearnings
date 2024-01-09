import * as Hapi from '@hapi/hapi';
import * as router from '../controllers/user.controller';
import Joi from 'joi';

const outputSchema=Joi.object({
    _id:Joi.string().alphanum(),
    name:Joi.string(),
    age:Joi.number(),
    phoneNumber:Joi.number(),
    email:Joi.string()
})

export const userRoutes:Hapi.ServerRoute[]=[
    {
        method:'GET',
        path:'/users',
        handler:router.getAllUser
    },
    {
        method:'GET',
        path:'/query',
        handler:router.getDetials,
        options:{
            validate:{
                query:Joi.object({
                    fname:Joi.string().required(),
                    lname:Joi.string().required()  //must specify a validator for all possible query parameters 
                })
            }
        }
    },
    {
        method:'GET',
        path:'/redirect',
        handler:router.getRedirectedPage
    },
    {
        method:'GET',
        path:'/newPage',
        handler:router.newPage
    },
    {
        method:'GET',
        path:'/user/{name}',
        handler:router.getUserById,
        options:{
            validate:{
                params:Joi.object({
                    name:Joi.string().regex(/^[a-zA-Z]+$/).min(3).max(20).required()
                })
            }
        }
    },
    {
        method:'POST',
        path:'/add',
        handler:router.addUser,
        options:{
            validate:{
                payload:Joi.object({
                    name:Joi.string().regex(/^[a-zA-Z]+$/).min(3).max(20),
                    age:Joi.number().integer().min(5).max(80),
                    phoneNumber:Joi.number(),
                    email:Joi.string().email()
                })
            }
        }
    },
    {
        method:'PUT',
        path:'/update/{name}',
        handler:router.updateUser
    },
    {
        method:'DELETE',
        path:'/del/{name}',
        handler:router.deleteUser,
        options:{
            response:{
                schema:outputSchema,
                failAction:'log'
            }
            
        }
    },
    {
        method:'GET',
        path:'/cache/{fname}/{lname}',
        handler:router.cacheLogic
    },
    {
        method: 'GET',
        path: '/view',
        handler: router.viewLogic
    },
    {
        method: '*',
        path: '/{any*}',
        handler:router.noMatchPage
        //we can also use like this
        // handler:{
        //     file:'error.webp'
        // }
    }
]