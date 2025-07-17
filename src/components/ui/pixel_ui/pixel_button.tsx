// src/components/ui/pixel_ui/pixel_button.tsx
//使用：
//<PixelButton variant="success" size="lg" isLoading={false}>
//   Start Game
// </PixelButton>


"use client";

import { cn } from "~/lib/utils";
import React from "react";
import { StarIcon } from "lucide-react"; // 可换成 NES 图标或 emoji

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const sizeMap = {
  sm: "px-2 py-1 text-[10px]",
  md: "px-3 py-2 text-xs",
  lg: "px-4 py-3 text-sm",
};

const variantMap: Record<string, string> = {
  default: "bg-gray-100 text-black hover:bg-gray-200 after:shadow-[inset_-4px_-4px_gray] hover:after:shadow-[inset_-6px_-6px_gray]",
  primary: "bg-blue-500 text-white hover:bg-blue-600 after:shadow-[inset_-4px_-4px_#1e3a8a] hover:after:shadow-[inset_-6px_-6px_#1e3a8a]",
  success: "bg-green-500 text-white hover:bg-green-600 after:shadow-[inset_-4px_-4px_#065f46] hover:after:shadow-[inset_-6px_-6px_#065f46]",
  warning: "bg-yellow-400 text-black hover:bg-yellow-500 after:shadow-[inset_-4px_-4px_#92400e] hover:after:shadow-[inset_-6px_-6px_#92400e]",
  error: "bg-red-500 text-white hover:bg-red-600 after:shadow-[inset_-4px_-4px_#7f1d1d] hover:after:shadow-[inset_-6px_-6px_#7f1d1d]",
};
export const PixelButton = ({
  children,
  className,
  variant = "default",
  size = "md",
  isLoading,
  disabled,
  icon,
  ...props
}: PixelButtonProps) => {
  return (
    <button
      disabled={disabled || isLoading}
      {...props}
      className={cn(
        "relative inline-flex items-center gap-2 font-pixel border border-black text-shadow tracking-tight",
        "after:content-[''] after:absolute after:inset-[-4px] after:pointer-events-none after:z-[-1]",
        "active:after:inset-[2px]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        sizeMap[size],
        variantMap[variant],
        className
      )}
    >
      {isLoading ? (
        <span className="animate-pulse">⏳</span>
      ) : (
        <>
          {icon ?? <StarIcon className="w-3 h-3" />}
          {children}
        </>
      )}
    </button>
  );
};


// buttons.template.js

// import { select } from '@storybook/addon-knobs';

// import sharedOption from '../_helpers/shared';

// export default () => {
//   const buttonType = select('Button Type', {
//     button: 'button',
//     file: 'file',
//   }, 'button');

//   const buttonClasses = select('Button Classes', {
//     default: '',
//     'is-primary': 'is-primary',
//     ...sharedOption,
//     'is-disabled': 'is-disabled',
//   }, '');

//   return buttonType === 'button' ? `
//     <button type="button" class="nes-btn ${buttonClasses}">Normal</button>
//   ` : `
//     <label class="nes-btn ${buttonClasses}">
//       <span>Select your file</span>
//       <input type="file">
//     </label>
//   `;
// };


//NES.css/scss/elements/buttons.scss

// @mixin btn-style($color, $background, $hover-background, $shadow) {
//   color: $color;
//   background-color: $background;

//   &::after {
//     position: absolute;
//     top: -$border-size;
//     right: -$border-size;
//     bottom: -$border-size;
//     left: -$border-size;
//     content: "";
//     box-shadow: inset -4px -4px $shadow;
//   }

//   &:hover {
//     color: $color;
//     text-decoration: none;
//     background-color: $hover-background;

//     &::after {
//       box-shadow: inset -6px -6px $shadow;
//     }
//   }

//   &:focus {
//     box-shadow: 0 0 0 6px rgba($shadow, 0.3);
//   }

//   &:active:not(.is-disabled)::after {
//     box-shadow: inset 4px 4px $shadow;
//   }
// }

// // Default style
// .nes-btn {
//   @include compact-rounded-corners();

//   position: relative;
//   display: inline-block;
//   padding: 6px 8px;
//   margin: $border-size;
//   text-align: center;
//   vertical-align: middle;
//   cursor: $cursor-click-url, pointer;
//   user-select: none;

//   @include btn-style(
//     $base-color,
//     map-get($default-colors, "normal"),
//     map-get($default-colors, "hover"),
//     map-get($default-colors, "shadow")
//   );

//   &:focus {
//     outline: 0;
//   }

//   &.is-disabled,
//   &.is-disabled:hover,
//   &.is-disabled:focus {
//     color: $base-color;
//     cursor: not-allowed;
//     background-color: map-get($disabled-colors, "normal");
//     box-shadow: inset -4px -4px map-get($disabled-colors, "shadow");
//     opacity: 0.6;
//   }

//   &.is-disabled:hover::after {
//     box-shadow: inset -4px -4px map-get($disabled-colors, "shadow");
//   }

//   // Other styles
//   // prettier-ignore
//   $types:
//     "primary" $background-color map-get($primary-colors, "normal") map-get($primary-colors, "hover") map-get($primary-colors, "shadow"),
//     "success" $background-color map-get($success-colors, "normal") map-get($success-colors, "hover") map-get($success-colors, "shadow"),
//     "warning" $base-color map-get($warning-colors, "normal") map-get($warning-colors, "hover") map-get($warning-colors, "shadow"),
//     "error" $background-color map-get($error-colors, "normal") map-get($error-colors, "hover") map-get($error-colors, "shadow");

//   @each $type in $types {
//     &.is-#{nth($type, 1)} {
//       @include btn-style(nth($type, 2), nth($type, 3), nth($type, 4), nth($type, 5));
//     }
//   }

//   input[type="file"] {
//     position: absolute;
//     pointer-events: none;
//     opacity: 0;
//   }
// }
