import React from 'react';
import { Document, Page, Text, View, StyleSheet, Svg, Path, Defs, ClipPath, G } from '@react-pdf/renderer';

interface PDFExportFinanceProps {
  selectedSimA: any;
  selectedSimB: any;
  metrics: any;
  getBetterOption: () => string;
  formatCurrency: (value: number) => string;
}

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF'
  },
  header: {
    backgroundColor: '#1E40AF',
    padding: 20,
    paddingBottom: 10,
    flexDirection: 'column',
    height: 120
  },
  headerContent: {
    flex: 1,
    marginRight: 100,
    marginTop: 0,
    position: 'relative',
    top: 10
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    marginBottom: 10
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 140,
    position: 'absolute',
    bottom: 17
  },
  headerColumn: {
    flex: 1
  },
  headerLabel: {
    color: '#93C5FD',
    fontSize: 11,
    marginBottom: 2
  },
  headerValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold'
  },
  headerDateLabel: {
    color: '#93C5FD',
    fontSize: 9,
    marginBottom: 2
  },
  headerDateValue: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold'
  },
  headerLogo: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 80,
    height: 80
  },
  content: {
    padding: 20
  },
  simulationsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15
  },
  simulationCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  simulationHeader: {
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  simulationType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B'
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingVertical: 2,
    paddingHorizontal: 6
  },
  label: {
    fontSize: 10,
    color: '#64748B'
  },
  value: {
    fontSize: 10,
    color: '#1E293B',
    fontWeight: 'bold'
  },
  comparisonSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  comparisonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  comparisonGrid: {
    flexDirection: 'row',
    gap: 8
  },
  comparisonCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  comparisonCardTitle: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 3
  },
  comparisonCardValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 3
  },
  comparisonCardLabel: {
    fontSize: 9,
    color: '#059669',
    fontWeight: 'medium'
  },
  recommendationSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 40
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 8
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B'
  },
  recommendationText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 1.4
  },
  recommendationHighlight: {
    backgroundColor: '#F0FDF4',
    borderRadius: 6,
    padding: 10,
    marginTop: 8
  },
  recommendationColumns: {
    flexDirection: 'row',
    gap: 10
  },
  recommendationColumn: {
    flex: 1
  },
  recommendationHighlightText: {
    fontSize: 10,
    color: '#166534',
    lineHeight: 1.4
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 9,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0'
  }
});

const PDFExportFinance: React.FC<PDFExportFinanceProps> = ({ 
  selectedSimA, 
  selectedSimB, 
  metrics, 
  getBetterOption,
  formatCurrency 
}) => {
  const renderHeader = (title: string) => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{title}</Text>
        
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
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderHeader('Análise Comparativa de Financiamentos')}
        <View style={styles.content}>
          <View style={styles.simulationsContainer}>
            <View style={styles.simulationCard}>
              <View style={styles.simulationHeader}>
                <Text style={styles.simulationType}>Simulação A - {selectedSimA.type}</Text>
              </View>
              
              <View style={styles.dataRow}>
                <Text style={styles.label}>Banco</Text>
                <Text style={styles.value}>{selectedSimA.bank || 'Não informado'}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Valor Total do Bem</Text>
                <Text style={styles.value}>{formatCurrency(selectedSimA.financingAmount)}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Valor da Entrada</Text>
                <Text style={styles.value}>{formatCurrency(selectedSimA.downPayment)}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Valor Financiado</Text>
                <Text style={styles.value}>
                  {formatCurrency(selectedSimA.financingAmount - selectedSimA.downPayment)}
                </Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Taxa Mensal</Text>
                <Text style={styles.value}>{selectedSimA.monthlyRate}%</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Primeira Parcela</Text>
                <Text style={styles.value}>{formatCurrency(selectedSimA.firstPayment)}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Última Parcela</Text>
                <Text style={styles.value}>{formatCurrency(selectedSimA.lastPayment)}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Total de Juros</Text>
                <Text style={styles.value}>{formatCurrency(selectedSimA.totalInterest)}</Text>
              </View>
            </View>

            <View style={styles.simulationCard}>
              <View style={styles.simulationHeader}>
                <Text style={styles.simulationType}>Simulação B - {selectedSimB.type}</Text>
              </View>
              
              <View style={styles.dataRow}>
                <Text style={styles.label}>Banco</Text>
                <Text style={styles.value}>{selectedSimB.bank || 'Não informado'}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Valor Total do Bem</Text>
                <Text style={styles.value}>{formatCurrency(selectedSimB.financingAmount)}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Valor da Entrada</Text>
                <Text style={styles.value}>{formatCurrency(selectedSimB.downPayment)}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Valor Financiado</Text>
                <Text style={styles.value}>
                  {formatCurrency(selectedSimB.financingAmount - selectedSimB.downPayment)}
                </Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Taxa Mensal</Text>
                <Text style={styles.value}>{selectedSimB.monthlyRate}%</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Primeira Parcela</Text>
                <Text style={styles.value}>{formatCurrency(selectedSimB.firstPayment)}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Última Parcela</Text>
                <Text style={styles.value}>{formatCurrency(selectedSimB.lastPayment)}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Total de Juros</Text>
                <Text style={styles.value}>{formatCurrency(selectedSimB.totalInterest)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.comparisonSection}>
            <Text style={styles.comparisonTitle}>Análise Comparativa</Text>
            <View style={styles.comparisonGrid}>
              <View style={styles.comparisonCard}>
                <Text style={styles.comparisonCardTitle}>Diferença no Total de Juros</Text>
                <Text style={styles.comparisonCardValue}>
                  {formatCurrency(Math.abs(metrics.totalInterestDiff))}
                </Text>
                <Text style={styles.comparisonCardLabel}>
                  Opção {metrics.totalInterestDiff > 0 ? 'B' : 'A'} mais econômica
                </Text>
              </View>
              <View style={styles.comparisonCard}>
                <Text style={styles.comparisonCardTitle}>Diferença no Valor Total</Text>
                <Text style={styles.comparisonCardValue}>
                  {formatCurrency(Math.abs(metrics.totalAmountDiff))}
                </Text>
                <Text style={styles.comparisonCardLabel}>
                  Opção {metrics.totalAmountDiff > 0 ? 'B' : 'A'} mais econômica
                </Text>
              </View>
              <View style={styles.comparisonCard}>
                <Text style={styles.comparisonCardTitle}>Diferença na parcela 1</Text>
                <Text style={styles.comparisonCardValue}>
                  {formatCurrency(Math.abs(metrics.monthlyPaymentDiff))}
                </Text>
                <Text style={styles.comparisonCardLabel}>
                  Opção {metrics.monthlyPaymentDiff > 0 ? 'B' : 'A'} mais econômica
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.recommendationSection}>
            <View style={styles.recommendationHeader}>
              <Text style={styles.recommendationTitle}>Recomendação</Text>
            </View>
            {getBetterOption() === 'empate' ? (
              <>
                <Text style={styles.recommendationText}>
                  As simulações são equivalentes em termos financeiros. 
                  Considere os seguintes aspectos para sua decisão:
                </Text>
                <View style={styles.recommendationHighlight}>
                  <View style={styles.recommendationColumns}>
                    <View style={styles.recommendationColumn}>
                      <Text style={styles.recommendationHighlightText}>
                        1. Sua disponibilidade financeira mensal{'\n'}
                        2. Preferência pelo sistema de amortização
                      </Text>
                    </View>
                    <View style={styles.recommendationColumn}>
                      <Text style={styles.recommendationHighlightText}>
                        3. Condições oferecidas por cada banco{'\n'}
                        4. Possibilidade de pagamentos antecipados
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.recommendationText}>
                  A Simulação {getBetterOption()} apresenta condições mais vantajosas:
                </Text>
                <View style={styles.recommendationHighlight}>
                  <View style={styles.recommendationColumns}>
                    <View style={styles.recommendationColumn}>
                      <Text style={styles.recommendationHighlightText}>
                        1. Menor custo total de financiamento{'\n'}
                        2. Melhor distribuição das parcelas
                      </Text>
                    </View>
                    <View style={styles.recommendationColumn}>
                      <Text style={styles.recommendationHighlightText}>
                        3. Menor incidência de juros{'\n'}
                        4. Melhor relação custo-benefício
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
        <Text style={styles.footer}>
          Copyright ® 2025 DC ADVISORS - Todos os direitos reservados
        </Text>
      </Page>
    </Document>
  );
};

export default PDFExportFinance;