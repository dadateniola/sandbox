import Image from "next/image";

// Images
import Hernandez from "@/public/images/hernandez.png";

const About = () => {
  return (
    <div className="pt-51 pb-20 custom-flex-col gap-32">
      {/* Hero Section */}
      <section id="hero">
        <div className="relative flex justify-start">
          <Image
            src={Hernandez}
            alt="Hernandez"
            className="w-1/2 h-auto object-cover"
          />

          <div className="absolute top-1/2 right-0 -translate-y-1/2 flex flex-col items-center gap-2.5">
            <p className="text-[min(3.5vw,60px)] leading-[110%] uppercase translate-x-[-40%]">
              About
            </p>

            <h1 className="text-text-primary text-[min(11vw,200px)] text-center leading-[90%]">
              Jacob <br /> Grønberg
            </h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section id="content">
        <div className="px-25 flex items-start gap-25">
          <p className="w-75 text-3xl leading-[120%] uppercase">About</p>

          <p className="flex-1 text-lg leading-[160%]">
            Massa vitae tortor condimentum lacinia quis vel eros donec. In
            fermentum et sollicitudin ac orci phasellus egestas tellus rutrum.
            Congue nisi vitae suscipit tellus mauris a diam maecenas. Vestibulum
            morbi blandit cursus risus at ultrices mi tempus imperdiet.
            <br />
            <br />
            Sit amet aliquam id diam maecenas ultricies mi eget. Tortor id
            aliquet lectus proin. Varius quam quisque id diam vel quam elementum
            pulvinar.
            <br />
            <br />
            Nisi porta lorem mollis aliquam ut. Pulvinar pellentesque habitant
            morbi tristique senectus et netus et malesuada. Eget nullam non nisi
            est sit amet facilisis magna etiam. Et tortor at risus viverra
            adipiscing at in tellus integer. Mi sit amet mauris commodo quis
            imperdiet massa.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
