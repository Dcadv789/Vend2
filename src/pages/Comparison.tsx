import React, { useState, useEffect } from 'react';
import { FileDown, ChevronDown, ChevronUp, CheckCircle, XCircle, AlertCircle, History } from 'lucide-react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Svg, Path, Defs, ClipPath, G } from '@react-pdf/renderer';
import { Notification } from '../components/Notification';

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
  installments: Installment[];
}

interface Installment {
  number: number;
  date: string;
  payment: number;
  amortization: number;
  interest: number;
  balance: number;
}

interface ComparisonMetrics {
  totalInterestDiff: number;
  totalAmountDiff: number;
  monthlyPaymentDiff: number;
  lastPaymentDiff: number;
  averagePaymentDiff: number;
}

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: 'Helvetica'
  },
  header: {
    backgroundColor: '#1E40AF',
    padding: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    position: 'relative'
  },
  headerContent: {
    flex: 1,
    marginRight: 100
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    marginBottom: 12
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
    gap: 20,
    position: 'relative',
    top: 15
  },
  headerColumn: {
    flex: 1
  },
  headerLabel: {
    color: '#93C5FD',
    fontSize: 10,
    marginBottom: 2
  },
  headerValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold'
  },
  headerDateLabel: {
    color: '#93C5FD',
    fontSize: 8,
    marginBottom: 2
  },
  headerDateValue: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold'
  },
  headerDivider: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 36,
    borderBottomWidth: 1,
    borderBottomColor: '#93C5FD',
    opacity: 0.3,
    marginBottom: 12
  },
  headerLogo: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 80,
    height: 80,
    zIndex: 1
  },
  content: {
    padding: 30
  },
  section: {
    marginBottom: 5,
    backgroundColor: '#FFFFFF',
    padding: 3,
    borderRadius: 4
  },
  sectionTitle: {
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#93c5fd',
    paddingBottom: 8
  },
  row: {
    marginBottom: 8
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 2
  },
  label: {
    fontSize: 12,
    color: '#64748B'
  },
  value: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: 'bold'
  },
  analysis: {
    padding: 12,
    marginBottom: 15,
    borderRadius: 4
  },
  analysisGreen: {
    backgroundColor: '#DCFCE7',
  },
  analysisYellow: {
    backgroundColor: '#FEF9C3',
  },
  analysisRed: {
    backgroundColor: '#FEE2E2',
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  analysisIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  analysisTitle: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold'
  },
  analysisTitleGreen: {
    color: '#166534',
  },
  analysisTitleYellow: {
    color: '#854D0E',
  },
  analysisTitleRed: {
    color: '#991B1B',
  },
  analysisText: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 1.4
  },
  analysisTextGreen: {
    color: '#166534',
  },
  analysisTextYellow: {
    color: '#854D0E',
  },
  analysisTextRed: {
    color: '#991B1B',
  },
  valuesGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  valueBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 4,
  },
  valueLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  valueAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0'
  }
});

const ComparisonPDF = ({ selectedSimA, selectedSimB, metrics, getBetterOption, formatCurrency }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Análise Comparativa de Financiamentos</Text>
          
          <View style={styles.headerRow}>
            <View style={styles.headerColumn}>
              <Text style={styles.headerLabel}>Simulação A</Text>
              <Text style={styles.headerValue}>{selectedSimA.type}</Text>
            </View>
            <View style={styles.headerColumn}>
              <Text style={styles.headerLabel}>Simulação B</Text>
              <Text style={styles.headerValue}>{selectedSimB.type}</Text>
            </View>
          </View>

          <View style={styles.headerRow}>
            <View style={styles.headerColumn}>
              <Text style={styles.headerDateLabel}>Data</Text>
              <Text style={styles.headerDateValue}>
                {new Date().toLocaleDateString('pt-BR')}
              </Text>
            </View>
            <View style={styles.headerColumn}>
              <Text style={styles.headerDateLabel}>Horário</Text>
              <Text style={styles.headerDateValue}>
                {new Date().toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                })}
              </Text>
            </View>
          </View>
        </View>
        <Svg style={styles.headerLogo} viewBox="0 0 60 60">
          <Defs>
            <ClipPath id="9dbc95d808">
              <Path d="M 1.207031 7.21875 L 58.957031 7.21875 L 58.957031 52.96875 L 1.207031 52.96875 Z M 1.207031 7.21875" />
            </ClipPath>
          </Defs>
          <G clipPath="url(#9dbc95d808)">
            <Path fill="#ffffff" d="M 58.625 15.542969 C 57.542969 13.085938 55.605469 9.53125 54.019531 7.21875 C 52.308594 9.972656 49.816406 13.933594 48.246094 16.449219 C 44.011719 23.226562 39.804688 30.019531 35.550781 36.777344 C 33.320312 40.324219 30.179688 42.554688 25.960938 43.203125 C 19.546875 44.1875 13.242188 40.433594 11.1875 34.339844 C 9.050781 28.007812 11.71875 21.121094 17.507812 18.023438 C 23.902344 14.601562 31.660156 16.738281 35.539062 22.996094 C 35.96875 23.691406 36.390625 23.703125 36.808594 23.039062 C 38.042969 21.066406 39.277344 19.09375 40.519531 17.121094 C 41.394531 15.734375 41.417969 15.695312 40.222656 14.488281 C 34.941406 9.164062 28.554688 6.792969 21.101562 7.675781 C 8.878906 9.117188 0.0625 20.542969 1.683594 32.769531 C 3.238281 44.453125 13.320312 52.46875 23.871094 52.246094 C 31.03125 52.175781 36.945312 49.433594 41.453125 43.84375 C 43.527344 41.273438 45.066406 38.332031 46.820312 35.542969 C 50.667969 29.417969 54.488281 23.269531 58.335938 17.136719 C 58.652344 16.632812 58.898438 16.167969 58.625 15.546875 Z M 58.625 15.542969" />
          </G>
          <Path fill="#f47400" d="M 23.9375 21.996094 C 19.980469 21.707031 15.953125 25.128906 15.894531 29.914062 C 15.84375 34.269531 19.585938 37.960938 23.925781 37.960938 C 28.273438 37.960938 32.035156 34.273438 31.96875 29.921875 C 31.898438 25.113281 27.917969 21.722656 23.9375 21.996094 Z M 23.9375 21.996094" />
        </Svg>
        <View style={styles.headerDivider} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Simulação A - {selectedSimA.type}</Text>
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Banco:</Text>
              <Text style={styles.value}>{selectedSimA.bank || 'Não informado'}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Valor Total do Bem:</Text>
              <Text style={styles.value}>{formatCurrency(selectedSimA.financingAmount)}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Valor da Entrada:</Text>
              <Text style={styles.value}>{formatCurrency(selectedSimA.downPayment)}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Valor Financiado:</Text>
              <Text style={styles.value}>{formatCurrency(selectedSimA.financingAmount - selectedSimA.downPayment)}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Taxa Mensal:</Text>
              <Text style={styles.value}>{selectedSimA.monthlyRate}%</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Prazo:</Text>
              <Text style={styles.value}>{selectedSimA.months} meses</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Simulação B - {selectedSimB.type}</Text>
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Banco:</Text>
              <Text style={styles.value}>{selectedSimB.bank || 'Não informado'}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Valor Total do Bem:</Text>
              <Text style={styles.value}>{formatCurrency(selectedSimB.financingAmount)}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Valor da Entrada:</Text>
              <Text style={styles.value}>{formatCurrency(selectedSimB.downPayment)}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Valor Financiado:</Text>
              <Text style={styles.value}>{formatCurrency(selectedSimB.financingAmount - selectedSimB.downPayment)}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Taxa Mensal:</Text>
              <Text style={styles.value}>{selectedSimB.monthlyRate}%</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Prazo:</Text>
              <Text style={styles.value}>{selectedSimB.months} meses</Text>
            </View>
          </View>
        </View>

        <View style={styles.highlight}>
          <Text style={styles.highlightTitle}>Análise Comparativa</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Diferença no Total de Juros:</Text>
            <Text style={styles.value}>{formatCurrency(Math.abs(metrics.totalInterestDiff))}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Diferença no Valor Total:</Text>
            <Text style={styles.value}>{formatCurrency(Math.abs(metrics.totalAmountDiff))}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Diferença na Primeira Parcela:</Text>
            <Text style={styles.value}>{formatCurrency(Math.abs(metrics.monthlyPaymentDiff))}</Text>
          </View>
        </View>

        <View style={styles.recommendation}>
          <Text style={styles.recommendationTitle}>Recomendação</Text>
          {getBetterOption() === 'empate' ? (
            <Text style={styles.recommendationText}>
              As simulações são equivalentes. Considere outros fatores como sua disponibilidade financeira mensal 
              e preferência pelo sistema de amortização.
            </Text>
          ) : (
            <Text style={styles.recommendationText}>
              A Simulação {getBetterOption()} apresenta condições mais vantajosas, oferecendo uma melhor relação 
              custo-benefício considerando juros totais, valor das parcelas e custo total do financiamento.
            </Text>
          )}
        </View>

        <Text style={styles.footer}>
          Copyright ® 2025 DC ADVISORS - Todos os direitos reservados
        </Text>
      </View>
    </Page>

    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Evolução das Parcelas</Text>
        <Text style={styles.headerSubtitle}>Comparativo mensal entre as simulações</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Nº</Text>
          <Text style={styles.tableHeaderText}>Simulação A</Text>
          <Text style={styles.tableHeaderText}>Simulação B</Text>
          <Text style={styles.tableHeaderText}>Diferença</Text>
        </View>
        {selectedSimA.installments.map((installment: Installment, index: number) => {
          const diff = installment.payment - selectedSimB.installments[index].payment;
          return (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{installment.number}</Text>
              <Text style={styles.tableCell}>{formatCurrency(installment.payment)}</Text>
              <Text style={styles.tableCell}>{formatCurrency(selectedSimB.installments[index].payment)}</Text>
              <Text style={styles.tableCell}>
                {formatCurrency(Math.abs(diff))} - Opção {diff > 0 ? 'B' : 'A'} mais econômica
              </Text>
            </View>
          );
        })}
      </View>
    </Page>
  </Document>
);

function Comparison() {
  const [simulations, setSimulations] = useState<SavedSimulation[]>([]);
  const [selectedSimA, setSelectedSimA] = useState<SavedSimulation | null>(null);
  const [selectedSimB, setSelectedSimB] = useState<SavedSimulation | null>(null);
  const [metrics, setMetrics] = useState<ComparisonMetrics | null>(null);
  const [showInstallments, setShowInstallments] = useState(true);

  useEffect(() => {
    const savedSimulations = localStorage.getItem('simulations');
    if (savedSimulations) {
      setSimulations(JSON.parse(savedSimulations));
    }
  }, []);

  useEffect(() => {
    if (selectedSimA && selectedSimB) {
      calculateMetrics();
    }
  }, [selectedSimA, selectedSimB]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const calculateMetrics = () => {
    if (!selectedSimA || !selectedSimB) return;

    const totalInterestDiff = selectedSimA.totalInterest - selectedSimB.totalInterest;
    const totalAmountDiff = selectedSimA.totalAmount - selectedSimB.totalAmount;
    const monthlyPaymentDiff = selectedSimA.firstPayment - selectedSimB.firstPayment;
    const lastPaymentDiff = selectedSimA.lastPayment - selectedSimB.lastPayment;

    const avgPaymentA = selectedSimA.totalAmount / selectedSimA.months;
    const avgPaymentB = selectedSimB.totalAmount / selectedSimB.months;
    const averagePaymentDiff = avgPaymentA - avgPaymentB;

    setMetrics({
      totalInterestDiff,
      totalAmountDiff,
      monthlyPaymentDiff,
      lastPaymentDiff,
      averagePaymentDiff
    });
  };

  const getBetterOption = () => {
    if (!metrics) return null;

    const points = {
      simA: 0,
      simB: 0
    };

    if (metrics.totalInterestDiff > 0) points.simB++;
    else if (metrics.totalInterestDiff < 0) points.simA++;

    if (metrics.totalAmountDiff > 0) points.simB++;
    else if (metrics.totalAmountDiff < 0) points.simA++;

    if (metrics.averagePaymentDiff > 0) points.simB++;
    else if (metrics.averagePaymentDiff < 0) points.simA++;

    if (points.simA > points.simB) return 'A';
    if (points.simB > points.simA) return 'B';
    return 'empate';
  };

  const getRecommendationColor = () => {
    const option = getBetterOption();
    if (option === 'empate') return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  const getRecommendationIcon = () => {
    const option = getBetterOption();
    if (option === 'empate') return <AlertCircle className="w-12 h-12 text-yellow-500" />;
    return <CheckCircle className="w-12 h-12 text-green-500" />;
  };

  if (simulations.length < 2) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Comparação entre Sistemas
          </h1>
          <p className="text-blue-100">
            Compare diferentes simulações para encontrar a melhor opção para você
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            <History size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              É necessário ter pelo menos duas simulações salvas para fazer comparações.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Comparação entre Sistemas
        </h1>
        <p className="text-blue-100">
          Compare diferentes simulações para encontrar a melhor opção para você
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <label className="block text-lg font-semibold text-gray-800 mb-4">
            Simulação A
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            value={selectedSimA?.id || ''}
            onChange={(e) => {
              const sim = simulations.find(s => s.id === e.target.value);
              setSelectedSimA(sim || null);
            }}
          >
            <option value="">Selecione uma simulação</option>
            {simulations.map((sim) => (
              <option key={sim.id} value={sim.id}>
                {sim.type} - {sim.bank || 'Banco não informado'} - {formatCurrency(sim.financingAmount)}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <label className="block text-lg font-semibold text-gray-800 mb-4">
            Simulação B
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            value={selectedSimB?.id || ''}
            onChange={(e) => {
              const sim = simulations.find(s => s.id === e.target.value);
              setSelectedSimB(sim || null);
            }}
          >
            <option value="">Selecione uma simulação</option>
            {simulations.map((sim) => (
              <option key={sim.id} value={sim.id}>
                {sim.type} - {sim.bank || 'Banco não informado'} - {formatCurrency(sim.financingAmount)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedSimA && selectedSimB && metrics && (
        <>
          <div className="bg-white rounded-2xl shadow-md border border-gray-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Análise Comparativa
                  </h3>
                  <p className="text-gray-600">
                    Detalhamento das diferenças entre as simulações
                  </p>
                </div>
                <PDFDownloadLink
                  document={
                    <ComparisonPDF
                      selectedSimA={selectedSimA}
                      selectedSimB={selectedSimB}
                      metrics={metrics}
                      getBetterOption={getBetterOption}
                      formatCurrency={formatCurrency}
                    />
                  }
                  fileName="comparacao-financiamentos.pdf"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  {({ loading }) => (
                    <>
                      <FileDown size={20} className="mr-2" />
                      {loading ? 'Gerando PDF...' : 'Exportar Análise em PDF'}
                    </>
                  )}
                </PDFDownloadLink>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-semibold text-gray-800">Simulação A - {selectedSimA.type}</h4>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {selectedSimA.bank || 'Banco não informado'}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Valor Total do Bem:</span>
                      <span className="font-semibold text-gray-800">
                        {formatCurrency(selectedSimA.financingAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Valor da Entrada:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(selectedSimA.downPayment)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Valor Financiado:</span>
                      <span className="font-semibold text-gray-800">
                        {formatCurrency(selectedSimA.financingAmount - selectedSimA.downPayment)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Taxa de Juros:</span>
                      <span className="font-semibold text-gray-800">{selectedSimA.monthlyRate}% a.m.</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Primeira Parcela:</span>
                      <span className="font-semibold text-gray-800">{formatCurrency(selectedSimA.firstPayment)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Última Parcela:</span>
                      <span className="font-semibold text-gray-800">{formatCurrency(selectedSimA.lastPayment)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total de Juros:</span>
                      <span className="font-semibold text-red-600">{formatCurrency(selectedSimA.totalInterest)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-semibold text-gray-800">Simulação B - {selectedSimB.type}</h4>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {selectedSimB.bank || 'Banco não informado'}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Valor Total do Bem:</span>
                      <span className="font-semibold text-gray-800">
                        {formatCurrency(selectedSimB.financingAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Valor da Entrada:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(selectedSimB.downPayment)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Valor Financiado:</span>
                      <span className="font-semibold text-gray-800">
                        {formatCurrency(selectedSimB.financingAmount - selectedSimB .downPayment)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Taxa de Juros:</span>
                      <span className="font-semibold text-gray-800">{selectedSimB.monthlyRate}% a.m.</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Primeira Parcela:</span>
                      <span className="font-semibold text-gray-800">{formatCurrency(selectedSimB.firstPayment)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Última Parcela:</span>
                      <span className="font-semibold text-gray-800">{formatCurrency(selectedSimB.lastPayment)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total de Juros:</span>
                      <span className="font-semibold text-red-600">{formatCurrency(selectedSimB.totalInterest)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h5 className="text-lg font-semibold text-blue-900 mb-4">Diferença nos Juros</h5>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800">{formatCurrency(Math.abs(metrics.totalInterestDiff))}</span>
                    <span className="text-sm font-medium text-green-600">
                      Opção {metrics.totalInterestDiff > 0 ? 'B' : 'A'} mais econômica
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h5 className="text-lg font-semibold text-blue-900 mb-4">Diferença no Valor Total</h5>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800">{formatCurrency(Math.abs(metrics.totalAmountDiff))}</span>
                    <span className="text-sm font-medium text-green-600">
                      Opção {metrics.totalAmountDiff > 0 ? 'B' : 'A'} mais econômica
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h5 className="text-lg font-semibold text-blue-900 mb-4">Diferença na Primeira Parcela</h5>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800">{formatCurrency(Math.abs(metrics.monthlyPaymentDiff))}</span>
                    <span className="text-sm font-medium text-green-600">
                      Opção {metrics.monthlyPaymentDiff > 0 ? 'B' : 'A'} mais econômica
                    </span>
                  </div>
                </div>
              </div>

              <div className={`p-8 rounded-xl border ${getRecommendationColor()} mb-8`}>
                <div className="flex items-start space-x-6">
                  {getRecommendationIcon()}
                  <div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">Recomendação</h4>
                    {getBetterOption() === 'empate' ? (
                      <>
                        <p className="text-gray-700 mb-4">
                          As simulações são equivalentes em termos financeiros. 
                          Considere os seguintes aspectos para sua decisão:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                          <li>Sua disponibilidade financeira mensal</li>
                          <li>Preferência pelo sistema de amortização</li>
                          <li>Condições específicas oferecidas por cada banco</li>
                          <li>Possibilidade de pagamentos antecipados</li>
                        </ul>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-700 mb-4">
                          A Simulação {getBetterOption()} apresenta condições mais vantajosas:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                          <li>Menor custo total de financiamento</li>
                          <li>Melhor distribuição das parcelas</li>
                          <li>Menor incidência de juros</li>
                          <li>Melhor relação custo-benefício</li>
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xl font-semibold text-gray-800">Evolução das Parcelas</h4>
                  <button
                    onClick={() => setShowInstallments(!showInstallments)}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {showInstallments ? (
                      <>
                        <ChevronUp size={20} className="mr-2" />
                        Ocultar Parcelas
                      </>
                    ) : (
                      <>
                        <ChevronDown size={20} className="mr-2" />
                        Mostrar Parcelas
                      </>
                    )}
                  </button>
                </div>

                {showInstallments && (
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nº
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Simulação A
                           </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Simulação B
                 </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Diferença
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Array.from({ length: Math.max(selectedSimA.installments.length, selectedSimB.installments.length) }).map((_, index) => {
                          const installmentA = selectedSimA.installments[index] || { number: index + 1 , date: '-', payment: 0 };
                          const installmentB = selectedSimB.installments[index] || { number: index + 1, date: '-', payment: 0 };
                          const diff = installmentA.payment - installmentB.payment;
                          return (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {index + 1}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {installmentA.date !== '-' ? installmentA.date : installmentB.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(installmentA.payment)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(installmentB.payment)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-green-600">
                                  {formatCurrency(Math.abs(diff))} - Opção {diff > 0 ? 'B' : 'A'} mais econômica
                                </span>
                              </td>
                            </tr>
                          ); })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Comparison;