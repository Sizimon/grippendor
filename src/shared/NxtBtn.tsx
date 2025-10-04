import Link from 'next/link'

interface NxtBtnProps {
    href?: string,
    onClick?: () => void,
    children: React.ReactNode,
    className: string,
}

const NxtBtn: React.FC<NxtBtnProps> = ({ href, onClick, children, className }) => {
    // If href is provided, render as Link
    if (href) {
        return (
            <Link href={href} className={className}>
                {children}
            </Link>
        )
    }
    
    // If onClick is provided, render as button
    if (onClick) {
        return (
            <button onClick={onClick} className={className}>
                {children}
            </button>
        )
    }
    
    // Fallback: render as button without action (shouldn't happen in practice)
    return (
        <button className={className}>
            {children}
        </button>
    )
}

export default NxtBtn