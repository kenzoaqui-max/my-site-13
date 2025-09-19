import { contacts, triggeredEmails } from 'wix-crm-backend';

const DELIVERY_EMAIL_ID = 'letterDelivery'; // <-- replace with your ID
const SENDER_CONFIRM_ID = 'letterDeliveredConfirmation'; // <-- replace with your ID

export async function sendRecipientEmail(letter) {
  const {
    recipientEmail, recipientName,
    senderName, senderEmail, title,
    body, deliverAt
  } = letter;

  // Ensure a contact for recipient (required for triggered emails)
  const { contact } = await contacts.appendOrCreateContact({
    emails: [{ email: recipientEmail }],
    name: { first: recipientName || 'Friend' }
  });

  await triggeredEmails.emailContact(DELIVERY_EMAIL_ID, contact.contactId, {
    variables: {
      recipientName: recipientName || 'Friend',
      senderName: senderName || 'Someone from the past',
      senderEmail: senderEmail || '',
      title: title || 'A letter from your past',
      bodyHtml: body || '',
      deliverDate: new Date(deliverAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })
    }
  });
}

export async function sendSenderConfirmation(letter) {
  const {
    senderEmail, senderName,
    title, deliverAt, recipientEmail
  } = letter;

  if (!senderEmail) return; // optional; skip if not provided

  const { contact } = await contacts.appendOrCreateContact({
    emails: [{ email: senderEmail }],
    name: { first: senderName || 'You' }
  });

  await triggeredEmails.emailContact(SENDER_CONFIRM_ID, contact.contactId, {
    variables: {
      senderName: senderName || 'You',
      title: title || 'Your scheduled letter',
      deliverDate: new Date(deliverAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' }),
      recipientEmail
    }
  });
}
