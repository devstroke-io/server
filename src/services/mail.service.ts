import {Transporter} from 'nodemailer';

interface IMail {
  from: string;
  to: string;
  subject: string;
  content: string;
}

class AlreadySetupError extends Error {
  public code: string;

  constructor(message?: string) {
    super(message);
    this.code = 'ESETUP';
    Error.captureStackTrace(this, AlreadySetupError);
  }
}

export class MailService {
  private static transporter: Transporter;
  private readonly from: string;
  private readonly to: string;
  private readonly subject: string;
  private readonly content: string;

  public static setup(transporter: Transporter) {
    if (MailService.transporter) {
      throw new AlreadySetupError('MailService already setup');
    }
    MailService.transporter = transporter;
  }

  constructor(data: IMail) {
    this.from = data.from;
    this.to = data.to;
    this.subject = data.subject;
    this.content = data.content;
  }

  public send(): Promise<any> {
    const message = {
      'from': this.from,
      'to': this.to,
      'subject': this.subject,
      'text': this.content,
      'html': this.content
    };
    return new Promise((resolve, reject) => {
      MailService.transporter.sendMail(message, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  }
}
