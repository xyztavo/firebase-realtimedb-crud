export default function Layout({ children } : { children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 bg-zinc-950 text-white h-dvh">
            {children}
        </div>
    )
}   