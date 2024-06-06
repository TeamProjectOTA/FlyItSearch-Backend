import { Address } from 'nodemailer/lib/mailer';
export type sendEmaildto = {
    from?: Address;
    recipeants: Address[];
    subject: string;
    html: string;
    text?: string;
    placeholderReplcaement?: Record<string, string>;
};
