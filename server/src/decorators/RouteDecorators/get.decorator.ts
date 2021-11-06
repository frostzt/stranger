import { Router } from 'express';

function Get(router: Router) {
  return function (target: any) {
    console.log(router);
    console.log('--------');
    console.log(target);
  };
}

export default Get;
