import MetadataKeys from '../../utils/metadata.keys';

export enum Methods {
  GET = 'get',
  PUT = 'put',
  POST = 'post',
  DELETE = 'delete',
}

export interface IRouter {
  method: Methods;
  middlewares?: any[];
  handlerPath: string;
  handlerName: string | symbol;
}

const methodDecoratorFactory =
  (method: Methods) =>
  (path: string, middlewares?: any[]): MethodDecorator =>
  (target, propertyKey) => {
    const controllerClass = target.constructor;

    const routers: IRouter[] = Reflect.hasMetadata(MetadataKeys.ROUTERS, controllerClass)
      ? Reflect.getMetadata(MetadataKeys.ROUTERS, controllerClass)
      : [];

    routers.push({
      method,
      middlewares,
      handlerPath: path,
      handlerName: propertyKey,
    });

    Reflect.defineMetadata(MetadataKeys.ROUTERS, routers, controllerClass);
  };

export const Get = methodDecoratorFactory(Methods.GET);
export const Post = methodDecoratorFactory(Methods.POST);
export const Put = methodDecoratorFactory(Methods.PUT);
export const Delete = methodDecoratorFactory(Methods.DELETE);
