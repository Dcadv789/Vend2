import React, { useState } from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Installment {
  number: number;
  date: string;
  payment: number;
  amortization: number;
  interest: number;
  balance: number;
}

function SACSimulation() {
  // ... resto do código existente ...

  const handleSaveSimulation = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert('Você precisa estar logado para salvar simulações.');
      return;
    }

    const simulationData = {
      type: 'SAC',
      financing_amount: Number(financingAmount),
      down_payment: Number(downPayment),
      operation_date,
      first_payment_date,
      months: Number(months),
      monthly_rate: Number(monthlyRate),
      yearly_rate: Number(yearlyRate),
      bank,
      installments,
      totals,
      user_id: user.id
    };

    const { error } = await supabase
      .from('simulations')
      .insert(simulationData);

    if (error) {
      console.error('Error saving simulation:', error);
      alert('Erro ao salvar a simulação. Tente novamente.');
      return;
    }

    alert('Simulação salva com sucesso!');
  };

  // ... resto do código existente ...
}

export default SACSimulation;