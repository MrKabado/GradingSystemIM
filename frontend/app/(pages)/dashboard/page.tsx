"use client"

import { useData } from "@/context/DataContext"
import {
  Hand,
  UsersRound,
  Activity,
  ChartNoAxesColumn,
  PanelsTopLeft,
} from "lucide-react"

export default function DashboardPage() {
  const { dashboard } = useData()

  return (
    <div className="gs-main-page">
      {/* GREETINGS HOLDER */}
      <div className="gs-card rounded-lg p-4">
        <div className="mb-3 flex items-center gap-2">
          <h1 className="text-3xl font-bold text-gray-300">
            Welcome back, Admin
          </h1>

          <Hand className="h-8 w-8 text-gray-300" />
        </div>

        <p className="gs-secondary-text">
          Here’s what’s happening in your school system today.
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-4">
        {/* TOTAL STUDENTS */}
        <div className="gs-card w-full rounded-lg p-4">
          <div className="mb-2 w-fit rounded-md bg-[#20224A] p-2">
            <UsersRound className="h-6 w-6 text-[#8B84FF]" />
          </div>

          <div className="flex w-fit flex-col gap-1">
            <h1 className="text-3xl font-semibold text-gray-300">
              {dashboard?.totalStudents}
            </h1>

            <p className="gs-secondary-text">Total Students</p>

            <p className="gs-success-bg gs-success-text rounded-md px-1 text-xs">
              + {dashboard?.newStudentsThisMonth}
            </p>
          </div>
        </div>

        {/* GRADE LEVELS */}
        <div className="gs-card w-full rounded-lg p-4">
          <div className="mb-2 w-fit rounded-md bg-[#2F2626] p-2">
            <ChartNoAxesColumn className="h-6 w-6 text-[#F59E0B]" />
          </div>

          <div className="flex w-fit flex-col gap-1">
            <h1 className="text-3xl font-semibold text-gray-300">
              {dashboard?.totalGradeLevels}
            </h1>

            <p className="gs-secondary-text">Grade Levels</p>

            <p className="gs-success-bg gs-success-text rounded-md px-1 text-xs">
              {dashboard?.gradeLevelsRange}
            </p>
          </div>
        </div>

        {/* SECTIONS */}
        <div className="gs-card w-full rounded-lg p-4">
          <div className="mb-2 w-fit rounded-md bg-[#182343] p-2">
            <PanelsTopLeft className="h-6 w-6 text-[#60A5FA]" />
          </div>

          <div className="flex w-fit flex-col gap-1">
            <h1 className="text-3xl font-semibold text-gray-300">
              {dashboard?.totalSections}
            </h1>

            <p className="gs-secondary-text">Sections</p>

            <p className="gs-success-bg gs-success-text rounded-md px-1 text-xs">
              {dashboard?.sectionNamesList}
            </p>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="gs-card rounded-lg p-4">
        <h2 className="mb-4 text-lg font-semibold text-gray-300">
          Recent Activity
        </h2>

        <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
          {dashboard?.recentActivities?.length ? (
            dashboard.recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="border-b border-[#545878] pb-3 last:border-b-0 last:pb-0"
              >
                <p className="gs-primary-text text-sm">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {activity.event} • {activity.module}
                </p>
              </div>
            ))
          ) : (
            <p className="gs-secondary-text text-sm">No recent activity yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
