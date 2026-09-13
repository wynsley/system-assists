import { MyTemplate } from "../../templates/myTemplate"
import { Banner } from "../../organims/dashboardStudent/banner"
import { CardStats } from "../../organims/dashboardStudent/cardStats"
import { Overview } from "../../organims/dashboardStudent/homeOverview"

function DashboardStudentPage({ userData }) {

  const stats = [
    { label:'Asistió el día de hoy' , attended : true },
    { label: 'Tradanzas', value: '2' },
    { label: 'Comportamiento', value: 'AD' },
    { label: 'Días presentes', value: '25/30' },
  ]

  return (
    <MyTemplate>
      <Banner />
      <CardStats
        stats={stats}
      />
      <Overview
      />
    </MyTemplate>
  )
}

export { DashboardStudentPage }