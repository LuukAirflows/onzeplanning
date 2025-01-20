import React from 'react';
import { BarChart2, Users, Calendar, AlertTriangle } from 'lucide-react';

function Dashboard() {
  const stats = [
    {
      label: 'Totaal Werknemers',
      value: '24',
      icon: Users,
      change: '+2 deze maand',
      changeType: 'positive'
    },
    {
      label: 'Geplande Diensten',
      value: '156',
      icon: Calendar,
      change: 'Komende 7 dagen',
      changeType: 'neutral'
    },
    {
      label: 'Ziekmeldingen',
      value: '3',
      icon: AlertTriangle,
      change: 'Deze week',
      changeType: 'negative'
    },
    {
      label: 'Geplande Uren',
      value: '1.248',
      icon: BarChart2,
      change: 'Deze maand',
      changeType: 'positive'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white overflow-hidden rounded-lg shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.label}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm ${
                        stat.changeType === 'positive' ? 'text-green-600' :
                        stat.changeType === 'negative' ? 'text-red-600' :
                        'text-gray-500'
                      }`}>
                        {stat.change}
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
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recente Activiteit</h2>
          <div className="space-y-4">
            <p className="text-gray-500">Activiteit laden...</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Aankomende Diensten</h2>
          <div className="space-y-4">
            <p className="text-gray-500">Diensten laden...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;