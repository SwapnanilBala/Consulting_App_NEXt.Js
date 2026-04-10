import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: number;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = "", fallback = "?", size = 40, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-rose-200 text-rose-900 font-dmsans font-medium overflow-hidden shrink-0",
        className
      )}
      style={{ width: size, height: size }}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-sm">{fallback}</span>
      )}
    </div>
  )
);
Avatar.displayName = "Avatar";

export { Avatar };
