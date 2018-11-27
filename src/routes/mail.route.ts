import express from 'express';
import {MailService} from '../services';

export const mailRouter = express.Router();
mailRouter.route('/')
  .post((req, res) => {
    const mail = new MailService({
      from: <string>process.env.GOOGLE_MAIL_USER,
      to: <string>process.env.MAIL_TO,
      subject: req.body.subject,
      content: '<b>From:</b> ' + req.body.from + '<br><b>Content:</b> ' + req.body.content
    });
    mail.send()
      .then(() => {
        res.status(201).send();
      })
      .catch(error => {
        res.status(500).send(error);
      });
  });
