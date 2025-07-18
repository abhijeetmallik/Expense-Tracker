import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { use } from 'react'
import Button from '@/components/Button'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { signOut } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useAuth } from '@/contexts/authContext'
import ScreenWrapper from '@/components/ScreenWrapper'
import { verticalScale } from '@/utils/styling'
import { MaterialIcons } from '@expo/vector-icons';
import HomeCard from '@/components/HomeCard'
import TransactionList from '@/components/TransactionList'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'
import { limit, orderBy, where } from 'firebase/firestore'
import useFetchData from '@/hooks/useFetchData'
import { TransactionType } from '@/types'


const Home = () => {

  const {user} = useAuth();
  const router = useRouter();

  const constraints = [
    where('uid', '==', user?.uid),
    orderBy('date', 'desc'),
    limit(30)
  ]

    const {data: recentTransactions, error, loading: transactionLoading} = useFetchData<TransactionType>('transactions', constraints);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{gap: 4}}>
            <Typo size={16} color={colors.neutral400}>Hello,</Typo>
            <Typo size={20} fontWeight={'500'}>{user?.name}</Typo>
          </View>
          <TouchableOpacity style={styles.searchIcon}>
            <MaterialIcons
              name="search"
              size={verticalScale(22)}
              color={colors.neutral200}
              weight='bold'
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          {/* card */}
          <View>
            <HomeCard />
          </View>

          <TransactionList 
          data={recentTransactions} 
          loading={transactionLoading} 
          title='Recent Transaction' 
          emptyListMessage='No Transactions added yet'
          />
        </ScrollView>

        <Button style={styles.floatingButton} onPress={() => router.push('/(modals)/transactionModal')}>
          <MaterialCommunityIcons name="plus-thick" size={verticalScale(24)} color={colors.black} weight='bold' />
        </Button>
      </View>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY._10
  },

  searchIcon: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: 50,
  },

  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: 'absolute',
    bottom: verticalScale(30),
    right: verticalScale(30),
  },

  scrollViewStyle: {
    marginTop: spacingX._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25
  }
})