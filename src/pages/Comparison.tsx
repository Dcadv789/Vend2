import React, { useState, useEffect } from 'react';
import { FileDown, ChevronDown, ChevronUp, CheckCircle, XCircle, AlertCircle, History } from 'lucide-react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

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
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: '#1E40AF',
    padding: 20,
    marginBottom: 30,
    borderRadius: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#E2E8F0',
    fontSize: 14,
  },
  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 15,
    borderBottom: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: '#64748B',
  },
  value: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: 'bold',
  },
  highlight: {
    backgroundColor: '#EFF6FF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  highlightTitle: {
    fontSize: 16,
    color: '#1E40AF',
    marginBottom: 10,
  },
  highlightText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 1.5,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 10,
    marginBottom: 1,
  },
  tableHeaderText: {
    fontSize: 10,
    color: '#475569',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
    padding: 10,
  },
  tableCell: {
    fontSize: 10,
    color: '#334155',
    flex: 1,
  },
  recommendation: {
    backgroundColor: '#F0FDF4',
    padding: 20,
    borderRadius: 8,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  recommendationTitle: {
    fontSize: 18,
    color: '#166534',
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 1.5,
  },
  metric: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  footerText: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
  },
});

const ComparisonPDF = ({ selectedSimA, selectedSimB, metrics, getBetterOption, formatCurrency }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Análise Comparativa de Financiamentos</Text>
        <Text style={styles.headerSubtitle}>
          Comparação detalhada entre {selectedSimA.type} e {selectedSimB.type}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Simulação A - {selectedSimA.type}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Banco:</Text>
          <Text style={styles.value}>{selectedSimA.bank || 'Não informado'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Valor Total do Bem:</Text>
          <Text style={styles.value}>{formatCurrency(selectedSimA.financingAmount)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Valor da Entrada:</Text>
          <Text style={styles.value}>{formatCurrency(selectedSimA.downPayment)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Valor Financiado:</Text>
          <Text style={styles.value}>{formatCurrency(selectedSimA.financingAmount - selectedSimA.downPayment)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Taxa Mensal:</Text>
          <Text style={styles.value}>{selectedSimA.monthlyRate}%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Prazo:</Text>
          <Text style={styles.value}>{selectedSimA.months} meses</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Simulação B - {selectedSimB.type}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Banco:</Text>
          <Text style={styles.value}>{selectedSimB.bank || 'Não informado'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Valor Total do Bem:</Text>
          <Text style={styles.value}>{formatCurrency(selectedSimB.financingAmount)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Valor da Entrada:</Text>
          <Text style={styles.value}>{formatCurrency(selectedSimB.downPayment)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Valor Financiado:</Text>
          <Text style={styles.value}>{formatCurrency(selectedSimB.financingAmount - selectedSimB.downPayment)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Taxa Mensal:</Text>
          <Text style={styles.value}>{selectedSimB.monthlyRate}%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Prazo:</Text>
          <Text style={styles.value}>{selectedSimB.months} meses</Text>
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

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Análise gerada em {new Date().toLocaleDateString('pt-BR')}
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
                {formatCurrency(Math.abs(diff))} {diff > 0 ? 'mais cara' : 'mais barata'}
              </Text>
            </View>
          );
        })}
      </View>
    </Page>
  </Document>
);

// ... (resto do código permanece igual)