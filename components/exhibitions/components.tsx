import Image from "next/image";

// Types
import type { ExhibitionCardProps } from "./types";

// Images
import { ArrowTopRight } from "../svg/svg";

// Components
export const ExhibitionCard: React.FC<ExhibitionCardProps> = ({
  date,
  image,
  title,
  description,
}) => (
  <div className="flex items-center justify-between gap-12">
    <div className="flex items-center gap-12">
      <div className="relative size-57.5 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="400px"
          className="object-cover"
        />
      </div>

      <div className="custom-flex-col gap-5">
        <div className="custom-flex-col gap-2">
          <p className="leading-[160%]">New York — Town Hall — 2022</p>

          <p className="text-[40px] leading-[110%] uppercase">
            {title.split(" ").map((word, index) =>
              index === title.split(" ").length - 1 ? (
                <span key={index} className="text-text-primary capitalize">
                  {word}
                </span>
              ) : (
                word + " "
              ),
            )}
          </p>
        </div>

        <p className="max-w-[40vw] leading-[160%]">{description}</p>
      </div>
    </div>

    <div className="flex items-center gap-3 text-text-primary">
      <p className="text-lg leading-[120%] whitespace-nowrap">Buy Ticket</p>

      <ArrowTopRight />
    </div>

    <div className="flex flex-col items-end text-text-primary">
      <p className="text-3xl capitalize leading-[110%]">{date.month}</p>
      <p className="text-[min(6vw,100px)] leading-[110%]">
        {String(date.day).padStart(2, "0")}
      </p>
    </div>
  </div>
);
