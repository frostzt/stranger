// import { Router } from 'express';

function Get(): any {
  return function (target: any) {
    console.log(target);
  };
}

export default Get;
