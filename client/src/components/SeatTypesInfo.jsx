import React from "react";
import { BookOpen, Users, Shield, Award, Info, CheckCircle } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto font-['Inter',_system-ui,_-apple-system,_'Segoe_UI',_sans-serif]">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
          <BookOpen className="w-4 h-4" />
          Official Guide
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-3" style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
          MHT CET Seat Types Guide
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Complete reference for understanding seat category codes and eligibility criteria
        </p>
      </div>

      {/* Understanding Seat Codes */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center flex-shrink-0">
            <Info className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-2" style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
              How Seat Codes Work
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Every seat code follows a structured format to indicate candidate eligibility and reservation category.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <h3 className="font-medium text-gray-900">Category</h3>
            </div>
            <p className="text-gray-600 text-xs">
              OPEN, OBC, SC, ST, NT1, NT2, NT3, VJ, SBC, SEBC, EWS
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-green-600" />
              <h3 className="font-medium text-gray-900">Prefix</h3>
            </div>
            <p className="text-gray-600 text-xs">
              G (General), L (Ladies), DEF (Defence), PWD, MI (Minority)
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-purple-600" />
              <h3 className="font-medium text-gray-900">Level</h3>
            </div>
            <p className="text-gray-600 text-xs">
              H (Home), O (Other), S (State Level)
            </p>
          </div>
        </div>
      </div>

      {/* Seat Types Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900" style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
            Common Seat Types
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Reference table for the most frequently used seat category codes
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Code</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Description</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {seatTypes.map((type, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                      {type.code}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {type.meaning}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {type.eligible}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4" style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
          Code Reference
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
          {[
            { key: "H", value: "Home University" },
            { key: "O", value: "Other Than Home" },
            { key: "S", value: "State Level" },
            { key: "G", value: "General" },
            { key: "L", value: "Ladies" },
            { key: "DEF", value: "Defence Reserved" },
            { key: "PWD", value: "Person with Disability" },
            { key: "MI", value: "Minority Quota" },
            { key: "TFWS", value: "Fee Waiver Scheme" },
            { key: "ORPHAN", value: "Orphan Quota" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-gray-800 flex-shrink-0">
                {item.key}
              </code>
              <span className="text-gray-600 text-xs leading-relaxed">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Additional Categories</h3>
            <p className="text-blue-800 text-sm mb-3">
              Other social group categories you might encounter:
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {["VJ", "NT1 (NT-B)", "NT2 (NT-C)", "NT3 (NT-D)", "SBC", "SEBC", "EWS"].map((category) => (
                <code key={category} className="bg-blue-100 px-2 py-1 rounded text-xs font-mono text-blue-800">
                  {category}
                </code>
              ))}
            </div>
            <p className="text-blue-700 text-sm">
              Example codes: <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">GVJH</code>, 
              <code className="bg-blue-100 px-1 py-0.5 rounded font-mono ml-1">LNT1S</code>, 
              <code className="bg-blue-100 px-1 py-0.5 rounded font-mono ml-1">GNT2O</code>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 border-t border-gray-200">
        <p className="text-sm text-gray-500" style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
          Based on official MHT CET CAP documentation • Updated 2025
        </p>
      </div>
    </div>
  );
}