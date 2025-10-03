import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
}

export default function Logo({ width = 100, height = 100 }: LogoProps) {
  const logoPath = '/images/hivemarketok-logo.svg'; // Use static path for now
  const logoAlt = "HiveMarketOK Logo";
  return (
    <div className="logo-container">
      <Image
        src={logoPath}
        alt={logoAlt}
        width={width}
        height={height}
        priority
      />
    </div>
  );
} 