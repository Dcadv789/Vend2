import React, { useEffect, useState } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Simulation {
  id: string;
  type: string;
  financing_amount: number;
  down_payment: number;
  operation_date: string;
  first_payment_date: string;
  months: number;
  monthly_rate: number;
  yearly_rate: number;
  bank: string;
  totals: {
    payment: number;
    amortization: number;
    interest: number;
  };
  created_at: string;
}

function SimulationHistory() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);

  useEffect(() => {
    loadSimulations();
  }, []);

  const loadSimulations = async () => {
    const { data, error } = await supabase
      .from('simulations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading simulations:', error);
      return;
    }

    setSimulations(data || []);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('simulations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting simulation:', error);
      return;
    }

    await loadSimulations();
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (simulations.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Simulações Salvas</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            <Save size={48} className="mx-auto text-gray-400 mb-4" />
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
                <h3 className="text-lg font-semibold text-gray-800">
                  Simulação {simulation.type}
                </h3>
                <p className="text-sm text-gray-500">
                  Salva em {formatDate(simulation.created_at)}
                </p>
              </div>
              <button
                onClick={() => handleDelete(simulation.id)}
                className="text-red-600 hover:text-red-700 transition-colors"
                title="Excluir simulação"
              >
                <Trash2 size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Valor Financiado</p>
                <p className="font-medium">{formatCurrency(simulation.financing_amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Entrada</p>
                <p className="font-medium">{formatCurrency(simulation.down_payment)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Prazo</p>
                <p className="font-medium">{simulation.months} meses</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Taxa Mensal</p>
                <p className="font-medium">{simulation.monthly_rate}%</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-medium">{formatCurrency(simulation.totals.payment)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Juros Total</p>
                <p className="font-medium">{formatCurrency(simulation.totals.interest)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amortização Total</p>
                <p className="font-medium">{formatCurrency(simulation.totals.amortization)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SimulationHistory;