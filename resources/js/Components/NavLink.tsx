import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-[var(--pa-primary)] text-[var(--pa-primary)]'
                    : 'border-transparent text-[var(--pa-text-muted)] hover:text-[var(--pa-text-main)] hover:border-[var(--pa-outline-variant)]') +
                ' ' + className
            }
        >
            {children}
        </Link>
    );
}
