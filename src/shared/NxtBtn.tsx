import Link from 'next/link'

interface NxtBtnProps {
    href: string,
    children: React.ReactNode,
    className: string,
}

const NxtBtn: React.FC<NxtBtnProps> = ({ href, children, className }) => {
    return (
        <Link href={href} className={className}>
            {children}
        </Link>
    )
}

export default NxtBtn