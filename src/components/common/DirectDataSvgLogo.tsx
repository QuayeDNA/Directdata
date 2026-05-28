import React, { type ImgHTMLAttributes } from "react";

export interface DirectDataSvgLogoProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt"
> {
  width?: number | string;
  height?: number | string;
  className?: string;
}

const LOGO_FULL_SRC = "/logo-512.png";
const LOGO_COMPACT_SRC = "/logo-192.png";

export const DirectDataSvgLogo: React.FC<DirectDataSvgLogoProps> = ({
  width = 200,
  height = 180,
  className = "",
  ...props
}) => {
  return (
    <img
      src={LOGO_FULL_SRC}
      alt="DirectData Logo"
      width={width}
      height={height}
      className={`object-contain ${className}`}
      loading="eager"
      {...props}
    />
  );
};

// Horizontal compact version for headers/navbars
export const DirectDataSvgLogoCompact: React.FC<DirectDataSvgLogoProps> = ({
  width = 220,
  height = 60,
  className = "",
  ...props
}) => {
  return (
    <img
      src={LOGO_COMPACT_SRC}
      alt="DirectData Logo"
      width={width}
      height={height}
      className={`object-contain ${className}`}
      loading="lazy"
      {...props}
    />
  );
};

// Modern icon-only version
export const DirectDataSvgIcon: React.FC<DirectDataSvgLogoProps> = ({
  width = 48,
  height = 48,
  className = "",
  ...props
}) => {
  return (
    <img
      src={LOGO_COMPACT_SRC}
      alt="DirectData Icon"
      width={width}
      height={height}
      className={`object-contain ${className}`}
      loading="lazy"
      {...props}
    />
  );
};

// Minimal badge version for very small spaces
export const DirectDataBadge: React.FC<DirectDataSvgLogoProps> = ({
  width = 32,
  height = 32,
  className = "",
  ...props
}) => {
  return (
    <img
      src={LOGO_COMPACT_SRC}
      alt="DirectData Badge"
      width={width}
      height={height}
      className={`object-contain ${className}`}
      loading="lazy"
      {...props}
    />
  );
};
