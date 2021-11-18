import logger from '../lib/logger';

export default class EnvironmentalVariableNotFound extends Error {
  constructor(public variableName: string) {
    super(`${variableName} not found, make sure you have defined all the environmental variables`);
    Object.setPrototypeOf(this, EnvironmentalVariableNotFound.prototype);

    this.shutdownApplication();
  }

  shutdownApplication() {
    logger.error(`${this.variableName} was not found, SIGTERM fired, the application will now close.`);
    process.kill(process.pid, 'SIGTERM');
  }
}
