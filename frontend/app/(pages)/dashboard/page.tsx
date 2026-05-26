import {
    Hand,
    UsersRound,
    Activity,
    ChartNoAxesColumn,
    PanelsTopLeft,
  } from "lucide-react";
  
  export default function DashboardPage() {
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
              <h1 className="text-3xl font-semibold text-gray-300">248</h1>
  
              <p className="gs-secondary-text">Total Students</p>
  
              <p className="gs-success-bg gs-success-text rounded-md px-1 text-xs">
                +12 this month
              </p>
            </div>
          </div>
  
          {/* GRADE LEVELS */}
          <div className="gs-card w-full rounded-lg p-4">
            <div className="mb-2 w-fit rounded-md bg-[#2F2626] p-2">
              <ChartNoAxesColumn className="h-6 w-6 text-[#F59E0B]" />
            </div>
  
            <div className="flex w-fit flex-col gap-1">
              <h1 className="text-3xl font-semibold text-gray-300">4</h1>
  
              <p className="gs-secondary-text">Grade Levels</p>
  
              <p className="gs-success-bg gs-success-text rounded-md px-1 text-xs">
                Grades 7 - 10
              </p>
            </div>
          </div>
  
          {/* SECTIONS */}
          <div className="gs-card w-full rounded-lg p-4">
            <div className="mb-2 w-fit rounded-md bg-[#182343] p-2">
              <PanelsTopLeft className="h-6 w-6 text-[#60A5FA]" />
            </div>
  
            <div className="flex w-fit flex-col gap-1">
              <h1 className="text-3xl font-semibold text-gray-300">4</h1>
  
              <p className="gs-secondary-text">Sections</p>
  
              <p className="gs-success-bg gs-success-text rounded-md px-1 text-xs">
                A, B, C, D
              </p>
            </div>
          </div>
        </div>
  
        {/* RECENT ACTIVITY */}
        <div>
          <h1 className="text-gray-300">Recent Activity</h1>
  
          <div className="gs-card gs-secondary-text mt-4 flex flex-col gap-2 rounded-lg p-4 text-sm">
            <h1 className="border-b-[0.5px] border-[#545878] pb-2">
              Lebron James grade record updated
            </h1>
  
            <h1 className="border-b-[0.5px] border-[#545878] pb-2">
              New student added: John Casagan
            </h1>
          </div>
        </div>
      </div>
    );
  }