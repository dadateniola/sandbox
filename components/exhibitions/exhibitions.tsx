import React from "react";

// Images
import { ArrowDownLong } from "../svg/svg";

// Imports
import { EXHIBITIONS } from "./data";
import { ExhibitionCard } from "./components";

const Exhibitions = () => {
  return (
    <div className="pt-51 pb-20 custom-flex-col gap-48">
      {/* Hero Section */}
      <section id="hero">
        <div className="flex flex-col items-center justify-center gap-23">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-text-primary text-[min(11vw,200px)] leading-[90%]">
              Exhibitions
            </h1>

            <p className="max-w-150 text-[22px] leading-[160%]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt.
            </p>
          </div>

          <div className="flex items-end gap-5">
            <ArrowDownLong />

            <p className="pb-4 leading-[160%]">
              Check Out <br />
              The Dates
            </p>
          </div>
        </div>
      </section>

      {/* Exhibitions Section */}
      <section id="exhibitions">
        <div className="custom-flex-col gap-12.5">
          {EXHIBITIONS.map((exhibition, index) => (
            <React.Fragment key={index}>
              <ExhibitionCard {...exhibition} />
              {index !== EXHIBITIONS.length - 1 && <hr />}
            </React.Fragment>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Exhibitions;
