"use client";

import { useState } from "react";
import { SquarePen, Trash2, X } from "lucide-react";

const subjects = [
  {
    id: 1,
    name: "Mathematics",
    section: "Grade 7 - A",
    teacher: "Juan Dela Cruz",
  },
  {
    id: 2,
    name: "Science",
    section: "Grade 8 - B",
    teacher: "Maria Santos",
  },
  {
    id: 3,
    name: "English",
    section: "Grade 9 - C",
    teacher: "Jose Reyes",
  },
  {
    id: 4,
    name: "Filipino",
    section: "Grade 10 - D",
    teacher: "Ana Garcia",
  },
];

export default function SubjectsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="gs-main-page">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Subjects</h1>

          <p className="gs-secondary-text text-sm">
            Manage subjects by section and assign teachers
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex cursor-pointer items-center rounded-lg bg-indigo-500 px-6 py-2 text-sm text-white hover:bg-indigo-600"
        >
          Add Subject
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex justify-evenly gap-4">
        <input
          type="text"
          placeholder="Search subject..."
          className="w-full rounded-lg border border-[#545878] bg-[#13162A] px-4 py-2 text-white outline-none"
        />

        <select className="w-full rounded-lg border border-[#545878] bg-[#13162A] px-4 py-2 text-white outline-none">
          <option>Grade 7</option>
          <option>Grade 8</option>
          <option>Grade 9</option>
          <option>Grade 10</option>
        </select>

        <select className="w-full rounded-lg border border-[#545878] bg-[#13162A] px-4 py-2 text-white outline-none">
          <option>Section A</option>
          <option>Section B</option>
          <option>Section C</option>
          <option>Section D</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="gs-card space-y-4 rounded-lg py-4">
        <div className="flex items-center justify-between px-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-300">
              Subject List
            </h1>

            <p className="gs-secondary-text mt-1 text-xs">
              All subjects in the system
            </p>
          </div>

          <div className="rounded-lg bg-[#1E1F44] px-3 py-1 text-[#8B84FF]">
            <h1 className="text-xs">{subjects.length} Subjects</h1>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto border-[#545878]">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-t border-[#545878] bg-[#1C2035]">
              <tr className="gs-secondary-text text-xs uppercase tracking-wider">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Subject Name</th>
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3">Teacher</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#2E3350]">
              {subjects.map((subject, index) => (
                <tr
                  key={subject.id}
                  className="transition hover:bg-[#22273D]"
                >
                  <td className="px-4 py-3 text-white">{index + 1}</td>

                  <td className="px-4 py-3 font-medium text-white">
                    {subject.name}
                  </td>

                  <td className="px-4 py-3">
                    <span className="w-fit rounded-lg border-[0.5px] border-[#31326E] bg-[#23264A] px-2 py-1 text-[#8B84FF]">
                      {subject.section}
                    </span>
                  </td>

                  <td className="gs-secondary-text px-4 py-3">
                    {subject.teacher}
                  </td>

                  <td className="space-x-2 px-4 py-3 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button className="gs-primary-border-color gs-secondary-text flex cursor-pointer items-center gap-1 rounded-lg border bg-[#22273D] px-2 py-1 hover:bg-[#2B304A]">
                        <SquarePen className="h-4 w-4" />
                        Edit
                      </button>

                      <button className="gs-primary-border-color gs-secondary-text flex h-full cursor-pointer items-center gap-1 rounded-lg border bg-[#22273D] px-2 py-1 hover:bg-[#2B304A]">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="gs-card max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[#545878] bg-[#13162A] shadow-xl">
            
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4 border-b border-[#545878] px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Add subject
                </h2>

                <p className="gs-secondary-text mt-1 text-xs">
                  Fill in the details to add a new subject.
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-[#545878] transition hover:bg-[#22273D] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* FORM */}
            <form className="space-y-4 px-5 py-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">
                  Subject name
                </label>

                <input
                  type="text"
                  placeholder="Enter subject name"
                  className="w-full rounded-lg border border-[#545878] bg-[#0D0F1A] px-3 py-2 text-sm text-white placeholder-[#545878] outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">
                  Section
                </label>

                <select className="w-full rounded-lg border border-[#545878] bg-[#0D0F1A] px-3 py-2 text-sm text-white outline-none">
                  <option>Grade 7 - A</option>
                  <option>Grade 8 - B</option>
                  <option>Grade 9 - C</option>
                  <option>Grade 10 - D</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">
                  Teacher
                </label>

                <select className="w-full rounded-lg border border-[#545878] bg-[#0D0F1A] px-3 py-2 text-sm text-white outline-none">
                  <option>Juan Dela Cruz</option>
                  <option>Maria Santos</option>
                  <option>Jose Reyes</option>
                  <option>Ana Garcia</option>
                </select>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-wrap justify-end gap-2 border-t border-[#545878] pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="gs-secondary-btn inline-flex items-center justify-center px-4 py-2 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-[#6366F1] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5558e8]"
                >
                  Create subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}