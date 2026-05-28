// Types
import { ExhibitionCardProps } from "../global/types";

// Images
import Eve from "@/public/images/eve.png";
import Mike from "@/public/images/mike.png";
import Tyler from "@/public/images/tyler.png";
import Tobias from "@/public/images/tobias.png";
import Huseyin from "@/public/images/huseyin.png";
import Hernandez from "@/public/images/hernandez.png";

// Constants
export const EXHIBITIONS: ExhibitionCardProps[] = [
  {
    image: Eve,
    title: "Independent Beauty",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
    date: { month: "Jun", day: 16 },
  },
  {
    image: Huseyin,
    title: "In Humanity We Trust",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod.",
    date: { month: "Mar", day: 2 },
  },
  {
    image: Tyler,
    title: "Berlin AT Night",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.",
    date: { month: "Feb", day: 1 },
  },
  {
    image: Tobias,
    title: "The World We Live In",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
    date: { month: "Jan", day: 15 },
  },
  {
    image: Hernandez,
    title: "Colors of The City",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod.",
    date: { month: "Dec", day: 5 },
  },
  {
    image: Mike,
    title: "Nature's Embrace",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.",
    date: { month: "Nov", day: 20 },
  },
];
