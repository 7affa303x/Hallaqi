/** Ready-to-send chat templates for barbers. */
export interface MessageTemplate {
  id: string;
  label: string;
  body: string;
  labelFr: string;
  bodyFr: string;
  labelEn: string;
  bodyEn: string;
}

export type TemplateLang = 'ar' | 'fr' | 'en';

export const BARBER_MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'confirm',
    label: 'تأكيد الحجز',
    body: 'مرحباً، تم تأكيد حجزك. ننتظرك في الوقت المحدد ✂️',
    labelFr: 'Confirmer le rendez-vous',
    bodyFr: 'Bonjour, votre rendez-vous est confirmé. Nous vous attendons à l’heure prévue ✂️',
    labelEn: 'Confirm booking',
    bodyEn: 'Hi, your booking is confirmed. We look forward to seeing you at the scheduled time ✂️',
  },
  {
    id: 'delay',
    label: 'تأخير 10 دقائق',
    body: 'نعتذر، عندنا تأخير بسيط حوالي 10 دقائق. شكراً على تفهمك.',
    labelFr: 'Retard de 10 minutes',
    bodyFr: 'Désolé, nous avons un léger retard d’environ 10 minutes. Merci de votre compréhension.',
    labelEn: '10-minute delay',
    bodyEn: 'Sorry, we’re running about 10 minutes behind. Thanks for your understanding.',
  },
  {
    id: 'ready',
    label: 'جاهز الآن',
    body: 'مرحباً، صرت جاهز. تقدر تجي دابا إن أمكن.',
    labelFr: 'Prêt maintenant',
    bodyFr: 'Bonjour, je suis prêt. Vous pouvez venir maintenant si possible.',
    labelEn: 'Ready now',
    bodyEn: 'Hi, I’m ready now. You can come over if you’re available.',
  },
  {
    id: 'thanks',
    label: 'شكر بعد الزيارة',
    body: 'شكراً على زيارتك! نتمنى تكون راضي على الخدمة. تقييمك يهمنا 🙏',
    labelFr: 'Merci après la visite',
    bodyFr: 'Merci pour votre visite ! Nous espérons que le service vous a plu. Votre avis compte 🙏',
    labelEn: 'Thanks after visit',
    bodyEn: 'Thanks for visiting! We hope you were happy with the service. Your feedback means a lot 🙏',
  },
  {
    id: 'followup',
    label: 'تذكير بعد أسبوعين',
    body: 'مرحباً، مرّ وقت من آخر قصة. إذا حاب تحجز موعد جديد راني جاهز.',
    labelFr: 'Rappel après deux semaines',
    bodyFr: 'Bonjour, ça fait un moment depuis votre dernière coupe. Je suis disponible pour un nouveau rendez-vous.',
    labelEn: 'Two-week follow-up',
    bodyEn: 'Hi, it’s been a while since your last cut. I’m ready whenever you’d like to book again.',
  },
  {
    id: 'closed',
    label: 'إغلاق مؤقت',
    body: 'نبلغك أن الصالون مغلق مؤقتاً اليوم. نقدر نعيد جدولة موعدك بسهولة.',
    labelFr: 'Fermeture temporaire',
    bodyFr: 'Le salon est temporairement fermé aujourd’hui. Nous pouvons facilement reporter votre rendez-vous.',
    labelEn: 'Temporary closure',
    bodyEn: 'Just a heads-up — the shop is temporarily closed today. We can easily reschedule your appointment.',
  },
];

export function templateLabel(t: MessageTemplate, lang: TemplateLang): string {
  if (lang === 'fr') return t.labelFr;
  if (lang === 'en') return t.labelEn;
  return t.label;
}

export function templateBody(t: MessageTemplate, lang: TemplateLang): string {
  if (lang === 'fr') return t.bodyFr;
  if (lang === 'en') return t.bodyEn;
  return t.body;
}

export function fillTemplate(body: string, clientName?: string | null): string {
  if (!clientName) return body;
  return `أهلاً ${clientName}، ${body}`;
}
