import { config } from 'dotenv';
import * as express from 'express';
import * as path from 'path';
import { registerControllers } from './app/controllers';
import registerServices from './app/services';
config();
const app = express();
app.use('/assets', express.static(path.join(__dirname, 'assets')));
registerServices(app);
registerControllers(app);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
