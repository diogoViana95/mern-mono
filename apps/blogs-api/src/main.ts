import * as dotenv from 'dotenv';
import * as express from 'express';
import 'express-async-errors';
import * as path from 'path';
import { registerControllers } from './app/controllers';
import { globalErrorHandler } from './app/handlers';
import registerServices from './app/services';
import * as morgan from 'morgan';
dotenv.config();

const app = express();

app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(morgan('dev'));

// register everything here
registerServices(app);
registerControllers(app);

app.use(globalErrorHandler);

const port = process.env.port || 8080;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
