import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Instellingen</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Bedrijfsinstellingen</h3>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                Bedrijfsnaam
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="company_name"
                  id="company_name"
                  className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                Tijdzone
              </label>
              <div className="mt-1">
                <select
                  id="timezone"
                  name="timezone"
                  className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option>Amsterdam (CET)</option>
                  <option>Rotterdam (CET)</option>
                  <option>Den Haag (CET)</option>
                  <option>Utrecht (CET)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Roosterinstellingen</h3>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="work_week_start" className="block text-sm font-medium text-gray-700">
                Start Werkweek
              </label>
              <div className="mt-1">
                <select
                  id="work_week_start"
                  name="work_week_start"
                  className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option>Zondag</option>
                  <option>Maandag</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="default_shift_length" className="block text-sm font-medium text-gray-700">
                Standaard Dienst Lengte (uren)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="default_shift_length"
                  id="default_shift_length"
                  className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  defaultValue={8}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Notificatie-instellingen</h3>
          <div className="mt-6 space-y-4">
            <div className="flex items-center">
              <input
                id="email_notifications"
                name="email_notifications"
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="email_notifications" className="ml-3 text-sm text-gray-700">
                E-mailnotificaties inschakelen
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="sms_notifications"
                name="sms_notifications"
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="sms_notifications" className="ml-3 text-sm text-gray-700">
                SMS-notificaties inschakelen
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="flex items-center">
          <Save className="w-4 h-4 mr-2" />
          Instellingen Opslaan
        </Button>
      </div>
    </div>
  );
}

export default Settings;