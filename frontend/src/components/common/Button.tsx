import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = BaseProps &
  Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    | "className"
    | "onDrag"
    | "onDragStart"
    | "onDragEnd"
    | "onDragEnter"
    | "onDragLeave"
    | "onDragOver"
    | "onAnimationStart"
    | "onAnimationEnd"
    | "onAnimationIteration"
  > & {
    to?: undefined;
    href?: undefined;
  };

type ButtonAsLink = BaseProps & {
  to: string;
  href?: undefined;
};

type ButtonAsAnchor = BaseProps & {
  href: string;
  to?: undefined;
};

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-gold text-ink shadow-soft hover:shadow-lifted hover:bg-gold-soft",
  secondary:
    "bg-transparent text-paper border border-paper/40 hover:bg-paper/10",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const BASE_STYLES =
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", icon, className = "", children } = props;
  const classes = `${BASE_STYLES} ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`;

  const content = (
    <>
      {children}
      {icon}
    </>
  );

  if ("to" in props && props.to) {
    return (
      <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="inline-block">
        <Link to={props.to} className={classes}>
          {content}
        </Link>
      </motion.div>
    );
  }

  if ("href" in props && props.href) {
    return (
      <motion.a
        href={props.href}
        className={classes}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
    );
  }

  const { to: _to, href: _href, ...buttonProps } = props as ButtonAsButton;

  return (
    <motion.button
      {...buttonProps}
      className={classes}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      {content}
    </motion.button>
  );
}
