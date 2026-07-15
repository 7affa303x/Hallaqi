/**
 * Payment Module - Public API
 * 
 * Provider Architecture:
 * - PaymentProvider interface defines the contract
 * - StripeProvider implements Stripe integration
 * - CCPProvider implements CCP/BaridiMob manual proof-of-payment
 * - PaymentManager orchestrates provider selection
 * 
 * To add a new provider (e.g., PayTabs, HyperPay):
 * 1. Create provider-file.ts implementing PaymentProvider
 * 2. Register it: paymentManager.registerProvider(new ProviderClass())
 * 3. Use it: paymentManager.createCheckoutSession('provider_name', params)
 */
export * from './types';
export { stripeProvider, StripeProvider } from './stripe-provider';
export { ccpProvider, CCPProvider } from './ccp-provider';
export type { CCPPaymentParams, ReceiptUploadResult, CCPPaymentRecord } from './ccp-provider';
export { paymentManager } from './payment-manager';
