import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRightIcon } from "@radix-ui/react-icons"

interface Error404Props {
  postcardImage?: string
  postcardAlt?: string
  curvedTextTop?: string
  curvedTextBottom?: string
  heading?: string
  subtext?: string
  backButtonLabel?: string
  backButtonHref?: string
}

export function Error404({
  postcardImage = "/statue-of-liberty-oil-pastel.jpg",
  postcardAlt = "New York City Postcard",
  curvedTextTop = "The General Intelligence",
  curvedTextBottom = "Company of New York",
  heading = "(404) Looks like the page you're looking for got lost somewhere.",
  subtext = "But hey — in New York, even the unexpected detours lead somewhere.",
  backButtonLabel = "Back to Home",
  backButtonHref = "/",
}: Error404Props) {
  return (
    <div className= "min-h-screen flex items-center justify-center px-4 py-16" >
    <link rel="preconnect" href = "https://fonts.googleapis.com" />
      <link rel="preconnect" href = "https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Doto:wght@100..900&display=swap" rel = "stylesheet" />
          <div className="flex flex-col items-center" >
            <div className="relative mb-16" >
              <svg
            className="absolute -top-16 -left-12 w-[140px] h-[140px] pointer-events-none z-20 animate-spin-slow"
  viewBox = "0 0 140 140"
  style = {{ animationDuration: "20s" }
}
          >
  <defs>
  {/* Full circle path with smaller radius */ }
  < path id = "circlePath" d = "M 70,70 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0" fill = "transparent" />
    </defs>
{/* Combined circular text */ }
<text
              className="text-[11px] fill-foreground font-serif uppercase"
style = {{ fontWeight: 400, letterSpacing: "0.15em" }}
            >
  <textPath href="#circlePath" startOffset = "0%" >
    { curvedTextTop } • { curvedTextBottom } •
</textPath>
  < /text>
  < /svg>

  < div className = "relative z-10" >
    <div
              className="relative p-3 shadow-2xl rotate-[4deg] hover:rotate-0 transition-transform duration-300 bg-white"
            >
  <div className="relative overflow-hidden bg-white" >
    <img
                  src={ postcardImage || "/placeholder.svg" }
alt = { postcardAlt }
className = "w-[360px] h-[220px] object-cover"
  />
  </div>
  < /div>

{/* Postal cancellation marks */ }
<svg className="absolute -right-16 top-1/2 -translate-y-1/2 w-28 h-20" viewBox = "0 0 100 60" >
  <path
                d="M 10 15 Q 20 10 30 15 Q 40 20 50 15 Q 60 10 70 15 Q 80 20 90 15"
stroke = "#888"
strokeWidth = "1.5"
fill = "none"
opacity = "0.6"
  />
  <path
                d="M 10 25 Q 20 20 30 25 Q 40 30 50 25 Q 60 20 70 25 Q 80 30 90 25"
stroke = "#888"
strokeWidth = "1.5"
fill = "none"
opacity = "0.6"
  />
  <path
                d="M 10 35 Q 20 30 30 35 Q 40 40 50 35 Q 60 30 70 35 Q 80 40 90 35"
stroke = "#888"
strokeWidth = "1.5"
fill = "none"
opacity = "0.6"
  />
  </svg>
  < /div>
  < /div>

  < div className = "text-center max-w-2xl" >
    <h1 className="text-4xl md:text-5xl font-doto mb-6 text-balance leading-tight" > { heading } < /h1>
      < p className = "text-muted-foreground text-base md:text-lg mb-10 font-sans" > { subtext } < /p>
        < Button asChild className = "rounded-lg px-6 py-3 font-sans" >
          <Link href={ backButtonHref } className = "flex items-center gap-2" >
            { backButtonLabel }
            < ArrowRightIcon className = "w-4 h-4" />
              </Link>
              < /Button>
              < /div>
              < /div>
              < /div>
  )
}
