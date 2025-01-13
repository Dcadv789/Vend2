import React from 'react';
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

function SimulationHistory() {
  const [simulations, setSimulations] = React.useState<SavedSimulation[]>([]);

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

  if (simulations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Simulações Salvas</h2>
      <div className="grid gap-6">
        {simulations.map((simulation) => (
          <div key={simulation.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Simulação {simulation.type}
                </h3>
                <p className="text-sm text-gray-500">{simulation.date}</p>
              </div>
              <button
                onClick={() => handleDelete(simulation.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Valor Financiado</p>
                <p className="font-semibold">{formatCurrency(simulation.financingAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Entrada</p>
                <p className="font-semibold">{formatCurrency(simulation.downPayment)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Prazo</p>
                <p className="font-semibold">{simulation.months} meses</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Taxa Mensal</p>
                <p className="font-semibold">{simulation.monthlyRate}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Primeira Parcela</p>
                <p className="font-semibold">{formatCurrency(simulation.firstPayment)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Última Parcela</p>
                <p className="font-semibold">{formatCurrency(simulation.lastPayment)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-semibold">{formatCurrency(simulation.totalAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Juros</p>
                <p className="font-semibold">{formatCurrency(simulation.totalInterest)}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">Banco</p>
              <p className="font-semibold">{simulation.bank || 'Não informado'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SimulationHistory;