interface BrandLogoProps {
  variant?: 'symbol' | 'wordmark' | 'icon';
  className?: string;
  priority?: boolean;
}

const sources = {
  symbol: '/logo-symbol.png',
  wordmark: '/logo-wordmark.png',
  icon: '/logo-icon.png',
};

export default function BrandLogo({
  variant = 'symbol',
  className = '',
  priority = false,
}: BrandLogoProps) {
  return (
    <img
      src={sources[variant]}
      alt="Hallaqi"
      className={`object-contain bg-white ${variant === 'wordmark' ? 'rounded-xl' : 'rounded-lg'} ${className}`}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
