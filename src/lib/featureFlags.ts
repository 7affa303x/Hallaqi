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
} as const;

/** User-facing label for deferred launch features. */
export const COMING_SOON_LABEL = 'قريباً';

