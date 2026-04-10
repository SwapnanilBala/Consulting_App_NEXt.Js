import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  title?: string;
  excerpt?: string;
  category?: string;
  imageUrl?: string;
  className?: string;
}

export function ContentCard({
  title = "Untitled",
  excerpt = "",
  category = "",
  imageUrl,
  className,
}: ContentCardProps) {
  return (
    <Card variant="glass" className={cn("overflow-hidden p-0", className)}>
      {imageUrl && (
        <div className="h-40 bg-rose-200/30 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      {!imageUrl && <div className="h-40 bg-gradient-to-br from-rose-200/40 to-cream-100" />}
      <div className="p-5">
        {category && (
          <Badge variant="muted" className="mb-2">
            {category}
          </Badge>
        )}
        <h3 className="font-playfair text-lg font-semibold text-rose-900 mb-1">
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm font-dmsans text-cream-700 line-clamp-2">
            {excerpt}
          </p>
        )}
      </div>
    </Card>
  );
}
