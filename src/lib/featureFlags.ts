/** Feature flags for launch-scope exclusions from the monetization brief. */
export const FEATURE_FLAGS = {
  /**
   * Brief §18 excludes loyalty at launch.
   * Keep code paths but hide entry points when false.
   */
  loyaltyEnabled: false,
  /**
   * In-app product checkout — permanently off at launch.
   */
  marketplaceInAppCheckout: false,
  /**
   * Commission / affiliate — permanently off at launch.
   */
  marketplaceCommissions: false,
  /**
   * Heavy shipping logistics — not in launch scope.
   */
  shippingLogistics: false,
  /**
   * Affiliate system — not in launch scope.
   */
  affiliates: false,
  /**
   * When Supabase is configured, do NOT fall back to Unsplash seed catalog.
   * Set true only for local demos without a live marketplace DB.
   */
  marketplaceSeedFallback: false,
  /**
   * Card (Stripe) payments paused until live keys + webhook are verified.
   */
  cardPaymentsEnabled: false,
  /**
   * CCP / Baridi Mob paused until commercial collection account env is set AND flag on.
   * Even with env vars, launch keeps these paused unless explicitly enabled.
   */
  ccpPaymentsEnabled: false,
  /**
   * Paid subscription upgrades paused at soft launch (free plan remains).
   */
  paidSubscriptionsEnabled: false,
  /**
   * Marketplace paid placement requests paused (UI shows متوقف).
   */
  paidPlacementsEnabled: false,
} as const;

/** User-facing label for deferred launch features. */
export const COMING_SOON_LABEL = 'قريباً';

/** User-facing label for intentionally paused launch features. */
export const PAUSED_LABEL = 'متوقف';

export function isCashOnlyPayments(): boolean {
  return !FEATURE_FLAGS.cardPaymentsEnabled && !FEATURE_FLAGS.ccpPaymentsEnabled;
}
