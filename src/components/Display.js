import { Text, StyleSheet } from 'react-native';

// Recebe a expressão atual da Home e apenas a exibe.
export default function Display({ expressao, valor }) {
  const texto = (expressao || valor)
    .replace(/\./g, ',')
    .replace(/\*/g, '×')
    .replace(/\//g, '÷');

  return (
    <Text style={styles.painel} numberOfLines={1} adjustsFontSizeToFit>
      {texto}
    </Text>
  );
}

const styles = StyleSheet.create({
  painel: { width: '92%', textAlign: 'right', fontSize: 40, fontWeight: 'bold',
    color: '#FFFFFF', backgroundColor: '#29222E', borderRadius: 16,
    padding: 18, marginTop: 20, marginBottom: 8 },
});
