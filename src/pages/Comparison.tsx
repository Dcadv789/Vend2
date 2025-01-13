import React, { useEffect, useState } from 'react';
import { GitCompare } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Simulation {
  id: string;
  type: string;
  financing_amount: number;
  down_payment: number;
  months: number;
  monthly_rate: number;
  totals: {
    payment: number;
    amortization: number;
    interest: number;
  };
  installments: Array<{
    number: number;
    payment: number;
    amortization: number;
    interest: number;
  }>;
}

function Comparison() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [selectedSimulations, setSelectedSimulations] = useState<string[]>([]);

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

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleSimulationSelect = (id: string) => {
    if (selectedSimulations.includes(id)) {
      setSelectedSimulations(selectedSimulations.filter(simId => simId !== id));
    } else if (selectedSimulations.length < 2) {
      setSelectedSimulations([...selectedSimulations, id]);
    }
  };

  const getSelectedSimulationsData = () => {
    return simulations.filter(sim => selectedSimulations.includes(sim.id));
  };

  if (simulations.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Comparação de Simulações</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            <GitCompare size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              Salve algumas simulações primeiro para poder compará-las.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Comparação de Simulações</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Selecione até duas simulações para comparar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {simulations.map((simulation) => (
            <button
              key={simulation.id}
              onClick={() => handleSimulationSelect(simulation.id)}
              className={`p-4 rounded-lg border-2 transition-colors text-left ${
                selectedSimulations.includes(simulation.id)
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="font-medium text-gray-800 mb-1">
                Simulação {simulation.type}
              </div>
              <div className="text-sm text-gray-600">
                Valor: {formatCurrency(simulation.financing_amount)}
                <br />
                Prazo: {simulation.months} meses
                <br />
                Taxa: {simulation.monthly_rate}% a.m.
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedSimulations.length === 2 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Análise Comparativa</h3>
          
          <div className="grid grid-cols-2 gap-8">
            {getSelectedSimulationsData().map((simulation) => (
              <div key={simulation.id}>
                <h4 className="font-medium text-gray-800 mb-4">
                  Sistema {simulation.type}
                </h4>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Valor Total</p>
                    <p className="font-medium">{formatCurrency(simulation.totals.payment)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Total de Juros</p>
                    <p className="font-medium">{formatCurrency(simulation.totals.interest)}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Primeira Parcela</p>
                    <p className="font-medium">
                      {formatCurrency(simulation.installments[0].payment)}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Última Parcela</p>
                    <p className="font-medium">
                      {formatCurrency(simulation.installments[simulation.installments.length - 1].payment)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {getSelectedSimulationsData().length === 2 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-800 mb-4">Diferenças</h4>
              <div className="grid grid-cols-3 gap-4">
                {(() => {
                  const [sim1, sim2] = getSelectedSimulationsData();
                  const diffTotal = sim1.totals.payment - sim2.totals.payment;
                  const diffJuros = sim1.totals.interest - sim2.totals.interest;
                  const diffPrimeira = sim1.installments[0].payment - sim2.installments[0].payment;
                  
                  return (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Diferença no Valor Total</p>
                        <p className={`font-medium ${diffTotal > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(Math.abs(diffTotal))}
                          {diffTotal > 0 ? ' a mais' : ' a menos'}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Diferença nos Juros</p>
                        <p className={`font-medium ${diffJuros > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(Math.abs(diffJuros))}
                          {diffJuros > 0 ? ' a mais' : ' a menos'}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Diferença na Primeira Parcela</p>
                        <p className={`font-medium ${diffPrimeira > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(Math.abs(diffPrimeira))}
                          {diffPrimeira > 0 ? ' a mais' : ' a menos'}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Comparison;