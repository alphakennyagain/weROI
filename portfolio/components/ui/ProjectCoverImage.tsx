import Image from "next/image";

import { cn } from "@/lib/utils";

interface ProjectCoverImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function ProjectCoverImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: ProjectCoverImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
      sizes={sizes}
      priority={priority}
    />
  );
}
