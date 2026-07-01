import { TurnstileWidget } from '@/components/turnstile-widget';
import { createNewsletterSignupAction } from '@/features/forms/forms-actions';

type NewsletterSignupFormProps = {
  compact?: boolean;
  returnPath: '/' | '/contact' | '/newsletter';
};

export function NewsletterSignupForm({ compact = false, returnPath }: NewsletterSignupFormProps) {
  return (
    <form action={createNewsletterSignupAction} className={compact ? 'newsletter-form newsletter-form--compact' : 'form-grid'}>
      <input type="hidden" name="returnPath" value={returnPath} />
      <label className="form-label">
        <span>Email</span>
        <input type="email" name="email" required maxLength={320} placeholder="name@example.com" autoComplete="email" />
      </label>

      <label className="checkbox-label">
        <input type="checkbox" name="marketingConsent" required />
        <span>Wyrażam zgodę na otrzymywanie newslettera i komunikacji marketingowej eGen Labs.</span>
      </label>

      <TurnstileWidget action="newsletter_signup" />

      <button type="submit">Zapisz się</button>
    </form>
  );
}
