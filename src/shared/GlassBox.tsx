const GlassBox: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="bg-black/10 border-[1px] border-black/15 backdrop-blur-md rounded-xl p-4 z-10 w-full">
            {children}
        </div>
    )
}

export default GlassBox;