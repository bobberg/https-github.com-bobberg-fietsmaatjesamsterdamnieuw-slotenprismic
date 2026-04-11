import {
  SliceSimulator,
  getSlices,
} from "@slicemachine/adapter-next/simulator";
import { SliceZone } from "@prismicio/react";

import { components } from "../../slices";

export default async function SliceSimulatorPage({ searchParams }) {
  const { state } = await searchParams;
  const slices = getSlices(state);

  return (
    <SliceSimulator>
      <SliceZone
        slices={slices}
        components={components}
        context={{ pageDate: page.data.date }} // Pass the date into context
      />
    </SliceSimulator>
  );
}
