import ExpressApplication from './bootstrap';

const PORT = process.env.PORT || 5000;

const app = new ExpressApplication(PORT);

app.start();
