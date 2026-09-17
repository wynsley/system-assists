import { LeftOverview } from "./leftOverview";
import { RightOverview } from "./rightOverview";

function Overview({averageAttendances}) {

  return (
    <section className="
      w-[96%] 
      md:w-[90%]
      md:max-w-7xl 
      mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* COLUMN LEFT*/}
        <LeftOverview
        />

      {/*COLUMN RIGHT */}
        <RightOverview
          averageAttendances={averageAttendances}
        />
      </div>
    </section>
  );
}

export { Overview };