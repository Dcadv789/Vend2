import React, { useState } from 'react';
import { History, Trash2 } from 'lucide-react';

interface SavedSimulation {
  id: string;
  type: 'SAC' | 'PRICE';
  date: string;
  financingAmount: number;
  downPayment: number;
  months: number;
  monthlyRate: number;
  bank: string;
  firstPayment: number;
  lastPayment: number;
  totalAmount: number;
  totalInterest: number;
}

type FilterType = 'ALL' | 'SAC' | 'PRICE';

function SimulationHistory() {
  const [simulations, setSimulations] = React.useState<SavedSimulation[]>([]);
  const [filter, setFilter] = useState<FilterType>('ALL');

  React.useEffect(() => {
    const savedSimulations = localStorage.getItem('simulations');
    if (savedSimulations) {
      setSimulations(JSON.parse(savedSimulations));
    }
  }, []);

  const handleDelete = (id: string) => {
    const updatedSimulations = simulations.filter(sim => sim.id !== id);
    setSimulations(updatedSimulations);
    localStorage.setItem('simulations', JSON.stringify(updatedSimulations));
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const filteredSimulations = simulations.filter(sim => {
    if (filter === 'ALL') return true;
    return sim.type === filter;
  });

  if (simulations.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Simulações Salvas</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            <History size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              Nenhuma simulação salva ainda.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Simulações Salvas</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('SAC')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'SAC'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            SAC
          </button>
          <button
            onClick={() => setFilter('PRICE')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'PRICE'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            PRICE
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Banco
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Financiado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prazo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa Mensal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSimulations.map((simulation) => (
                <tr key={simulation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {simulation.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      simulation.type === 'SAC' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {simulation.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {simulation.bank || 'Não informado'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(simulation.financingAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {simulation.months} meses
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {simulation.monthlyRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(simulation.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDelete(simulation.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SimulationHistory;