import express from 'express';
import bodyParser from 'body-parser';
import {config as dotEnvConfig} from 'dotenv';
import {createTransport} from 'nodemailer';
import {mailRouter} from './routes';
import {MailService} from './services';
import {NextFunction, Request, Response} from 'express-serve-static-core';

const result = dotEnvConfig();
if (result.error) {
  console.warn(result.error.message);
}

MailService.setup(createTransport({
  'service': 'gmail',
  'auth': {
    type: 'OAuth2',
    user: process.env.GOOGLE_MAIL_USER,
    serviceClient: process.env.GOOGLE_CLIENT_ID,
    privateKey: process.env.GOOGLE_PRIVATE_KEY
  }
}));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// override Express markup
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Powered-By', 'DevStroke.io');
  next();
});

// routes
app.get('/', (req, res) => {
  res.json({text: 'Awesome! We\'re live debugging this!'});
});

app.use('/api/mail', mailRouter);

// errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.setHeader('X-Powered-By', 'DevStroke.io');
  res.status(500).json({error: err.message});
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    error: 'Unknown path',
    path: req.method + ' ' + req.path
  });
});

// let's run
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on ' + PORT));
