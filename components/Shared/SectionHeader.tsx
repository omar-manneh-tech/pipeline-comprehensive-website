/**
 * SectionHeader Component
 * Reusable section header with consistent styling
 * Server Component wrapper with client-side animation
 */

import { ReactNode } from "react";
import { AnimatedSectionHeader } from "./AnimatedSectionHeader";

interface SectionHeaderProps {
  title: string;
  description?: string | ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

/**
 * Server Component wrapper for SectionHeader
 * Splits server and client logic for better performance
 */
export function SectionHeader({
  title,
  description,
  className = "",
  titleClassName = "",
  descriptionClassName = "",
}: SectionHeaderProps) {
  return (
    <AnimatedSectionHeader
      title={title}
      description={description}
      className={className}
      titleClassName={titleClassName}
      descriptionClassName={descriptionClassName}
    />
  );
}

