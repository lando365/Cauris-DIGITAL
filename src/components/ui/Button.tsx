import { Link } from '@/i18n/navigation';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'tertiary';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton
  extends BaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  href?: undefined;
}

interface ButtonAsLink extends BaseProps {
  href: string;
  external?: boolean;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  tertiary: 'btn-tertiary',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-[13px] px-4 py-2',
  md: '',
  lg: 'text-base px-9 py-4',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { variant = 'primary', size = 'md', className, children } = props;

  const classes = cn(variantClasses[variant], sizeClasses[size], className);

  if ('href' in props && props.href) {
    const isExternal = props.external || /^https?:\/\//.test(props.href);
    if (isExternal) {
      return (
        <a href={props.href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { href: _h, ...rest } = props as ButtonAsButton;
  return (
    <button ref={ref} className={classes} {...rest}>
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
