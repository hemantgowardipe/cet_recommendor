import React from "react";

const seatTypes = [
  { code: "GOPENH", meaning: "General Open, Home University", eligible: "All Maharashtra, Home Univ. area" },
  { code: "GOPENO", meaning: "General Open, Other Than Home University", eligible: "All Maharashtra, Not Home Univ. area" },
  { code: "GOPENS", meaning: "General Open, State Level", eligible: "All Maharashtra State candidates" },
  { code: "LOPENH", meaning: "Ladies Open, Home University", eligible: "Female, Home Univ. area" },
  { code: "LOPENO", meaning: "Ladies Open, Other Than Home University", eligible: "Female, not Home Univ. area" },
  { code: "LOPENS", meaning: "Ladies Open, State Level", eligible: "Female, all Maharashtra" },
  { code: "DEFOPENS", meaning: "Defence Open, State Level", eligible: "Defence candidate, State Level" },
  { code: "GOBCH", meaning: "OBC, Home University", eligible: "OBC, Home Univ. area" },
  { code: "GOBCO", meaning: "OBC, Other Than Home University", eligible: "OBC, Not Home Univ. area" },
  { code: "GOBCS", meaning: "OBC, State Level", eligible: "OBC, all Maharashtra" },
  { code: "MI", meaning: "Minority", eligible: "Minority community candidates" },
  { code: "PWDR", meaning: "PWD Reserved", eligible: "Person with Disability" },
  { code: "DEFR", meaning: "Defence Reserved", eligible: "Defence category candidates" },
  { code: "TFWS", meaning: "Tuition Fee Waiver Scheme", eligible: "EWS/TWF qualifying candidates" },
  { code: "ORPHAN", meaning: "Orphan", eligible: "Orphans only" },
];

export default function SeatTypesInfo() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-800">MHT CET Seat Types Guide</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Seat Code Construction Logic</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li><strong>Candidate Category:</strong> OPEN, OBC, SC, ST, NT1, NT2, NT3, VJ, SBC, SEBC, EWS, etc.</li>
          <li><strong>Seat Type Prefix:</strong> G (General), L (Ladies), DEF (Defence), PWD (Disability), MI (Minority), AI (All India), TFWS, ORPHAN</li>
          <li><strong>Level Suffix:</strong> H (Home), O (Other), S (State level)</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Seat Code Examples</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-200 text-gray-800">
              <tr>
                <th className="border px-4 py-2 text-left">Code</th>
                <th className="border px-4 py-2 text-left">Meaning</th>
                <th className="border px-4 py-2 text-left">Who Is Eligible</th>
              </tr>
            </thead>
            <tbody>
              {seatTypes.map((type, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 font-mono">{type.code}</td>
                  <td className="border px-4 py-2">{type.meaning}</td>
                  <td className="border px-4 py-2">{type.eligible}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Official Code Prefix/Suffix Legend</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-600 text-sm">
          <div><strong>H:</strong> Home University</div>
          <div><strong>O:</strong> Other Than Home University</div>
          <div><strong>S:</strong> State Level</div>
          <div><strong>G:</strong> General</div>
          <div><strong>L:</strong> Ladies</div>
          <div><strong>DEF:</strong> Defence Reserved</div>
          <div><strong>PWD:</strong> Person with Disability</div>
          <div><strong>MI:</strong> Minority Quota</div>
          <div><strong>TFWS:</strong> Tuition Fee Waiver Scheme</div>
          <div><strong>ORPHAN:</strong> Orphan Quota</div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Additional Categories</h2>
        <p className="text-gray-600">
          Other social group categories include: <br />
          <span className="font-mono">VJ, NT1 (NT-B), NT2 (NT-C), NT3 (NT-D), SBC, SEBC, EWS</span>
          <br />
          Example codes: <span className="font-mono">GVJH, LNT1S, GNT2O</span>
        </p>
      </section>

      <footer className="text-center text-sm text-gray-500 mt-8 border-t pt-4">
        © 2025 CET College Recommender. Based on official MHT CET CAP data.
      </footer>
    </div>
  );
}
