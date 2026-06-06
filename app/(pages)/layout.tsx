"use client";

import Pages from "@/components/global/pages";
import Navbar from "@/components/navbar/navbar";
import PageInit from "@/components/global/page-init";
import { TransitionProvider } from "@/transition/TransitionProvider";

const SlugLayout = () => {
  return (
    <TransitionProvider>
      <PageInit>
        <Navbar />
        <Pages />
      </PageInit>
    </TransitionProvider>
  );
};

export default SlugLayout;
