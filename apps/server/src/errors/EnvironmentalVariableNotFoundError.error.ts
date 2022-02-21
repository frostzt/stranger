import logger from '../utils/logger';

export default class EnvironmentalVariableNotFound extends Error {
  constructor() {
    super(`Required ENVs not found, make sure you have defined all the environmental variables`);
    Object.setPrototypeOf(this, EnvironmentalVariableNotFound.prototype);

    this.shutdownApplication();
  }

  shutdownApplication() {
    logger.error(`Required ENVs were not found, SIGTERM fired, the application will now close.`);
    process.kill(process.pid, 'SIGTERM');
  }
}
