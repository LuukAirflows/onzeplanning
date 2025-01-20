import React from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

function EmployeeDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mijn Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white overflow-hidden rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Uren Deze Week
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">32</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Aankomende Diensten
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">4</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Openstaande Acties
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">1</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Volgende Diensten</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Maandag 11 maart</p>
                <p className="text-sm text-gray-500">09:00 - 17:00</p>
              </div>
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Bevestigd
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Dinsdag 12 maart</p>
                <p className="text-sm text-gray-500">10:00 - 18:00</p>
              </div>
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Bevestigd
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recente Activiteit</h2>
          <div className="space-y-4">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-red-600" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-500">
                  Nieuw rooster gepubliceerd voor volgende week
                </p>
                <p className="text-xs text-gray-400">2 uur geleden</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-500">
                  Dienst afgerond: 10 maart 2024
                </p>
                <p className="text-xs text-gray-400">1 dag geleden</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;