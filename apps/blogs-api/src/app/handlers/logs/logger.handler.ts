import * as morgan from 'morgan';
import { Req } from '../../models';

morgan.token('body', function getId(req: Req) {
  const body = { ...req.body };
  if (body.password) {
    body.password = '***';
  }
  return JSON.stringify(body);
});

morgan.token('splitter', () => {
  return '\x1b[36m--------------------------------------------\x1b[0m\n';
});

export const loggerHandler = morgan(
  ':splitter :method :url :status :user-agent :body :response-time ms'
);
