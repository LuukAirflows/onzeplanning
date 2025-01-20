import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

function EmployeeAvailability() {
  const days = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mijn Beschikbaarheid</h1>
        <Button className="flex items-center">
          <Save className="w-4 h-4 mr-2" />
          Wijzigingen Opslaan
        </Button>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            {days.map((day) => (
              <div key={day} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {day}
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={`${day}-start`} className="block text-sm font-medium text-gray-700">
                    Starttijd
                  </label>
                  <select
                    id={`${day}-start`}
                    name={`${day}-start`}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  >
                    <option>Niet Beschikbaar</option>
                    <option>00:00</option>
                    <option>06:00</option>
                    <option>07:00</option>
                    <option>08:00</option>
                    <option>09:00</option>
                    <option>10:00</option>
                    <option>11:00</option>
                    <option>12:00</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={`${day}-end`} className="block text-sm font-medium text-gray-700">
                    Eindtijd
                  </label>
                  <select
                    id={`${day}-end`}
                    name={`${day}-end`}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  >
                    <option>Niet Beschikbaar</option>
                    <option>14:00</option>
                    <option>15:00</option>
                    <option>16:00</option>
                    <option>17:00</option>
                    <option>18:00</option>
                    <option>19:00</option>
                    <option>20:00</option>
                    <option>21:00</option>
                    <option>22:00</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Verlofaanvragen</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                  Startdatum
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="start-date"
                    id="start-date"
                    className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                  Einddatum
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="end-date"
                    id="end-date"
                    className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                  Reden
                </label>
                <div className="mt-1">
                  <textarea
                    id="reason"
                    name="reason"
                    rows={3}
                    className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button>
                Aanvraag Indienen
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeAvailability;