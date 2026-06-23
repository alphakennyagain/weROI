export const CALENDLY_30MIN_URL = 'https://calendly.com/contact-weroi/30min';

/** E.164 digits only (no +) for wa.me links. Set REACT_APP_WHATSAPP_NUMBER in production. */
export const WHATSAPP_NUMBER =
  (process.env.REACT_APP_WHATSAPP_NUMBER || '18765550123').replace(/\D/g, '');

export const WHATSAPP_BOOK_CALL_MESSAGE =
  "Hi weROI, I'd like to book a 30-minute call about a project.";

export function getWhatsAppBookCallUrl() {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_BOOK_CALL_MESSAGE)}`;
}
