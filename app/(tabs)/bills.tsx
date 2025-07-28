import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { CreditCard, Calendar, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Clock, DollarSign, Shield } from 'lucide-react-native';
import { RootState } from '@/store';
import { setBills } from '@/store/slices/billSlice';
import { AppHeader } from '@/components/AppHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockBills } from '@/data/mockData';

export default function BillsScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { bills } = useSelector((state: RootState) => state.bills);
  const dispatch = useDispatch();
  const { t, language, isRTL } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');

  useEffect(() => {
    if (user) {
      loadBills();
    }
  }, [user]);

  const loadBills = () => {
    if (user) {
      const userBills = mockBills.filter(bill => bill.patientId === user.id);
      dispatch(setBills(userBills));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'overdue': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#10B981';
      case 'overdue': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  const handlePayBill = (billId: string) => {
    Alert.alert(
      'Payment Options',
      'Select payment method',
      [
        { text: 'Credit Card', onPress: () => processCreditCardPayment(billId) },
        // { text: 'Insurance', onPress: () => processInsurancePayment(billId) },
        { text: 'Cash', onPress: () => processCashPayment(billId) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const processCreditCardPayment = (billId: string) => {
    Alert.alert('Success', 'Payment processed successfully via credit card!');
  };

  const processInsurancePayment = (billId: string) => {
    Alert.alert('Insurance Claim', 'Insurance claim submitted for processing');
  };

  const processCashPayment = (billId: string) => {
    Alert.alert('Cash Payment', 'Please pay at the hospital reception desk');
  };

  const filteredBills = bills.filter(bill => {
    if (filter === 'all') return true;
    return bill.status === filter;
  });

  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const pendingAmount = bills.filter(b => b.status === 'pending').reduce((sum, bill) => sum + bill.amount, 0);
  const overdue = bills.filter(b => b.status === 'overdue').length;

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title={t('bills')} />
      
      {/* Summary Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.summaryContainer}
        contentContainerStyle={styles.summaryContent}
      >
        <View style={[styles.summaryCard, { backgroundColor: '#2E86AB' }]}>
          <DollarSign size={24} color="#fff" />
          <Text style={styles.summaryAmount}>${totalAmount}</Text>
          <Text style={styles.summaryLabel}>Total Amount</Text>
        </View>
        
        <View style={[styles.summaryCard, { backgroundColor: '#F59E0B' }]}>
          <Clock size={24} color="#fff" />
          <Text style={styles.summaryAmount}>${pendingAmount}</Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
        
        <View style={[styles.summaryCard, { backgroundColor: '#EF4444' }]}>
          <AlertCircle size={24} color="#fff" />
          <Text style={styles.summaryAmount}>{overdue}</Text>
          <Text style={styles.summaryLabel}>Overdue Bills</Text>
        </View>
        
        {/* <View style={[styles.summaryCard, { backgroundColor: '#10B981' }]}>
          <Shield size={24} color="#fff" />
          <Text style={styles.summaryAmount}>{user?.insurance.provider}</Text>
          <Text style={styles.summaryLabel}>Insurance</Text>
        </View> */}
      </ScrollView>

      {/* Filter Buttons */}
      <View style={[styles.filterContainer, isRTL && styles.filterContainerRTL]}>
        {['all', 'pending', 'paid', 'overdue'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterButton, filter === status && styles.activeFilter]}
            onPress={() => setFilter(status as any)}
          >
            <Text style={[styles.filterText, filter === status && styles.activeFilterText]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bills List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredBills.length > 0 ? (
          filteredBills.map((bill) => {
            const StatusIcon = getStatusIcon(bill.status);
            const statusColor = getStatusColor(bill.status);
            
            return (
              <TouchableOpacity
                key={bill.id}
                style={styles.billCard}
                onPress={() => Alert.alert('Bill Details', `Bill ID: ${bill.id}\nAmount: $${bill.amount}\nDue Date: ${bill.dueDate}`)}
              >
                <View style={[styles.billHeader, isRTL && styles.billHeaderRTL]}>
                  <View style={[styles.statusIconContainer, { backgroundColor: statusColor + '20' }]}>
                    <StatusIcon size={24} color={statusColor} />
                  </View>
                  
                  <View style={styles.billInfo}>
                    <Text style={[styles.billAmount, isRTL && styles.textRTL]}>
                      ${bill.amount}
                    </Text>
                    <View style={[styles.billMeta, isRTL && styles.billMetaRTL]}>
                      <Calendar size={14} color="#6B7280" />
                      <Text style={styles.billDate}>Due: {bill.dueDate}</Text>
                    </View>
                    <View style={[styles.billStatus, { backgroundColor: statusColor }]}>
                      <Text style={styles.billStatusText}>{bill.status}</Text>
                    </View>
                  </View>
                  
                  {bill.status === 'pending' && (
                    <TouchableOpacity
                      style={styles.payButton}
                      onPress={() => handlePayBill(bill.id)}
                    >
                      <Text style={styles.payButtonText}>Pay Now</Text>
                    </TouchableOpacity>
                  )}
                </View>
                
                {/* Bill Items */}
                <View style={styles.billItems}>
                  {bill.items.map((item, index) => (
                    <View key={index} style={[styles.billItem, isRTL && styles.billItemRTL]}>
                      <View style={styles.itemInfo}>
                        <Text style={[styles.itemDescription, isRTL && styles.textRTL]}>
                          {item.description}
                        </Text>
                        {/* <View style={styles.itemDetails}>
                          <Text style={styles.itemAmount}>${item.amount}</Text>
                          {item.insuranceCovered && (
                            <View style={styles.insuranceBadge}>
                              <Shield size={12} color="#10B981" />
                              <Text style={styles.insuranceText}>Covered</Text>
                            </View>
                          )}
                        </View> */}
                      </View>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <CreditCard size={64} color="#6B7280" />
            <Text style={[styles.emptyStateTitle, isRTL && styles.textRTL]}>
              No bills found
            </Text>
            <Text style={[styles.emptyStateText, isRTL && styles.textRTL]}>
              Your bills will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
     maxHeight: 200,
  },
  summaryContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  summaryCard: {
    width: 120,
    height: 100,
    borderRadius: 12,
    padding: 16,
    paddingTop:10,
    marginRight: 12,
    justifyContent: 'space-between',
  },
  summaryAmount: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  summaryLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterContainerRTL: {
    flexDirection: 'row-reverse',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeFilter: {
    backgroundColor: '#2E86AB',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  billCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  billHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  billInfo: {
    flex: 1,
  },
  billAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  textRTL: {
    textAlign: 'right',
  },
  billMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  billMetaRTL: {
    flexDirection: 'row-reverse',
  },
  billDate: {
    marginLeft: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  billStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  billStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  payButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  billItems: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  billItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  billItemRTL: {
    flexDirection: 'row-reverse',
  },
  itemInfo: {
    flex: 1,
  },
  itemDescription: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 4,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E86AB',
    marginRight: 12,
  },
  insuranceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981' + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  insuranceText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});