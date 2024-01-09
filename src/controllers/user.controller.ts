import { ResponseToolkit,Request } from "@hapi/hapi";
// import { Request } from "hapi";
import { UserModel } from "../model/user.model";
import { deleteUserByName } from "../service/user.service";

export const getAllUser = async (request: any, h: any) => {
  try {
    const users = await UserModel.find();
    return { data: users };
  } catch (err) {
    return h.response({ err: "Internal Server error" }).code(500);
  }
};

export const getDetials = async (request: any, h: any) => {
  try {
    const data = request.query;
    console.log("data: ", data);
    return { data: data };
  } catch (err) {
    return h.response({ err: "Internal Server error" }).code(500);
  }
};

export const getRedirectedPage = (request: Request, h: ResponseToolkit) => {
  //set cookie value
  h.state("Redirect", "NewPage!");
  return h.redirect("/newPage");
};

export const newPage = (request: Request, h: ResponseToolkit) => {
  // get cookie value
  const cookieValue = request.state.Redirect;
  return h.response({
    msg: `Tada!!!You are in new Page.This is the value of cookie : ${cookieValue}`,
  });
};

export const getUserById = async (request: Request, h: ResponseToolkit) => {
  const id = request.params.name;
  try {
    console.log("id: ",id);
    const name = await UserModel.findOne({ name: id });
    if (name) {
      return { data: name };
    } else {
      return h.response({ error: `Name doesn't exist` }).code(404);
    }
  } catch (err) {
    return h.response({ err: "Internal Server error" }).code(500);
  }
};

export const addUser = async (request: Request, h: ResponseToolkit) => {
  const user: any = request.payload;
  const userName = user.name;
  try {
    console.log("params: ", request.payload);
    await UserModel.create(user);
    return { data: `${userName} is successfully added` };
  } catch (err) {
    return h.response({ err: "Internal Server error" }).code(500);
  }
};

export const updateUser = async (request: Request, h: ResponseToolkit) => {
  const userName: string = request.params.name;
  const updatedUser = request.payload;
  console.log("userName: ", userName, " updatedUser: ", updatedUser);
  try {
    const name = await UserModel.findOne({ name: userName });
    if (name) {
      name.set(updatedUser);
      const saveNew = await name.save();
      return { data: saveNew };
    } else {
      return h.response({ error: "Item not found" }).code(404);
    }
  } catch (err) {
    return h.response({ err: "Internal Server error" }).code(500);
  }
};

export const deleteUser = async (request: any, h: any) => {
  const name = request.params.name;
  console.log("params: ", name);
  try {
    const delUser = await deleteUserByName(name);
    if (delUser) {
      return { data: delUser };
    } else {
      return h.response({ error: "Item not found" }).code(404);
    }
  } catch (err) {
    return h.response({ err: "Internal Server Error" }).code(500);
  }
};

type CustomResponseToolkit = ResponseToolkit & {
  file: (path: string) => any; 
};

export const noMatchPage=async(request:Request,h:CustomResponseToolkit)=>{
  console.log("404")
  // return h.response({err:'404 Error! Page Not Found!'}).code(404)
  return h.file('error.webp');
}

export const adminLogin = async (request: Request, h: ResponseToolkit) => {
  const data: any = request.payload;
  try {
    console.log("post data: ", data);
    console.log("req auth: ",request.auth.credentials)//can access the credentials which have been set with h.authenticated,like this
    if ((await validate(request, data.name)).present) {
      let name = (await validate(request, data.name)).credentials?.name;
      return h.response({ data: `Hi ${name}` });
    } else {
      return h.response({ error: `Name doesn't exist` }).code(404);
    }
  } catch (err) {
    return h.response({ err: "Internal server error" }).code(500);
  }
};

export const validate = async (request: Request, username: string) => {
  const users = await UserModel.find();
  let present = false;
  users.forEach((user) => {
    if (user.name === username) {
      present = true;
    }
  });
  if (!present) {
    return { credentials: null, present: false };
  }

  const credentials = { name: username };
  console.log("cred: ", credentials);
  return { present, credentials };
};

export const schema = (server: any, options: any) => {
  return {
    authenticate: async (request: any, h: any) => {
      const isValid = true; 
      const credentials = { user: "sanju" }; 
      console.log("schema: ", credentials);
      if (isValid) {
        return h.authenticated({ credentials });
      } else {
        return h.unauthenticated("Authentication failed");
      }
    },
  };
};

// interface ApplicationState {
//   cache: any; 
// }

export const cacheLogic = async (request: Request, h: ResponseToolkit) => {
  console.log("params: ", request.params);
  const { fname, lname } = request.params;
  console.log("a: ", fname, " b: ", lname);
  const result = await request.server.methods.combine(fname, lname);
  console.log('res: ',result)
  // const { cache } = request.server.app as ApplicationState;
  // await cache.set('myKey',result, 5000); 
  // // Retrieving a value from cache
  // const cachedValue = await cache.get('myKey');
  // console.log("cachedValue: ",cachedValue)
  const lastModified = new Date();
  return h.response(result)
  .header('Last-modified', lastModified.toUTCString());
};


type CustomViewResponseToolkit = ResponseToolkit & {
  view: (path: string, context?: Record<string, any>) => any;
};
export const viewLogic=async(request:Request, h:CustomViewResponseToolkit) => {
  return h.view('index',{ title: 'Hapi View Example', greeting: 'Hello, Hapi!' });
}