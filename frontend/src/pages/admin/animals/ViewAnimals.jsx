import React from "react";

const mockAnimals = [
  {
    id: 1,
    name: "Tiger",
    title: "Panthera tigris",
    description: "Majestic big cat known for iconic stripes.",
  },
  {
    id: 2,
    name: "Elephant",
    title: "Elephas maximus",
    description: "Gentle giant with strong social bonds.",
  },
  {
    id: 3,
    name: "Hippo",
    title: "Hippopotamus amphibius",
    description: "Semi-aquatic herbivore, loves water.",
  },
];

const ViewAnimals = () => {
  return (
    <section aria-label="View Animals">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-slate-900">Animals</h1>
        <p className="text-sm text-slate-600">Manage animal records</p>
      </header>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="w-40 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Name
                </th>
                <th className="w-48 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Description
                </th>
                <th className="w-28 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockAnimals.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="truncate px-4 py-3 text-sm font-medium text-slate-900">
                    {a.name}
                  </td>
                  <td className="truncate px-4 py-3 text-sm text-slate-700">
                    {a.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {a.description}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <button className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 hover:bg-slate-50">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ViewAnimals;
