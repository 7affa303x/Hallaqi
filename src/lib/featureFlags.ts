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
} as const;
