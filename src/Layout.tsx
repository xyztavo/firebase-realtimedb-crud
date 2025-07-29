export default function Layout({ children } : { children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 bg-zinc-950 text-white h-dvh">
            <img src="https://i.pinimg.com/originals/95/9f/b1/959fb1f51bc1026ace27acede55e1bc8.gif" className="absolute z-[0] bg-repeat  w-dvw " />
            <div className="z-1">
             {children}
            </div >
        </div>
    )
}   