import { LeftContent } from "./leftContent"
import { RightContent } from "./rightContent"

function MainContentAdmin({ loading, summaryByGrade = [] }) {
  return (
    <main className="mt-6 w-[96%] md:w-[90%] md:max-w-7xl mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <LeftContent />
        <RightContent
          loading={loading}
          summaryByGrade={summaryByGrade}
        />
      </div>
    </main>
  );
}

export { MainContentAdmin }