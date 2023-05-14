import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: theme.colors.gray100
  },
  glass: {
    width: '100%',
    height: 500,
    backgroundColor: theme.colors.blue90
  },
  button: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: 50,
    top: 43
  },
  footer: {
    width: 120,
    height: 120,
    position: 'absolute',
    bottom: 35,
  },
  header: {
    position: 'absolute',
    zIndex: 1,
    top: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  ml: {
    color: theme.colors.blue90,
    fontSize: 40,
    textAlign: 'center',
    fontFamily: 'RobotoCondensed_400Regular'
  },
  label: {
    color: '#7dc7fa',
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'RobotoCondensed_700Bold'
  },
  percentage: {
    fontSize: 112,
    color: '#e66202',
    opacity: 0.8,
    marginTop: 50,
    fontFamily: 'RobotoCondensed_400Regular'
  },
  cups: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20
  }
});