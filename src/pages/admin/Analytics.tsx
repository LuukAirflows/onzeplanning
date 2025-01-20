import React from 'react';
import { BarChart2, TrendingUp, Clock, Users } from 'lucide-react';

function Analytics() {
  const metrics = [
    {
      label: 'Totaal Gewerkte Uren',
      value: '2.456',
      change: '+12,5%',
      changeType: 'positive',
      icon: Clock
    },
    {
      label: 'Werknemers Bezetting',
      value: '87%',
      change: '+2,3%',
      changeType: 'positive',
      icon: Users
    },
    {
      label: 'Overuren',
      value: '124',
      change: '-8,1%',
      changeType: 'negative',
      icon: TrendingUp
    },
    {
      label: 'Rooster Naleving',
      value: '94%',
      change: '+1,2%',
      changeType: 'positive',
      icon: BarChart2
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-white overflow-hidden rounded-lg shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <metric.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {metric.label}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {metric.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm ${
                        metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Uren per Afdeling</h2>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Grafiek komt binnenkort...</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Aanwezigheid Werknemers</h2>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Grafiek komt binnenkort...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;