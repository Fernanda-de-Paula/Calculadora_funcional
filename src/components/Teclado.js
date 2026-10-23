import { View, StyleSheet } from 'react-native';
import Botao from './Botao';

const LINHAS = [
  ['MRC', 'M-', 'M+', 'RAIZ', 'OFF'],
  ['AC', 'DEL', '+/-', '%'],
  ['7', '8', '9', '÷'],
  ['4', '5', '6', '×'],
  ['1', '2', '3', '−'],
  ['0', ',', '=', '+'],
];

export default function Teclado({ onPress }) {
  function tipoDaTecla(tecla, indiceLinha) {
    if (indiceLinha === 0) return 'memoria';
    if (indiceLinha === 1) return 'especial';
    if (tecla === '=') return 'igual';
    if (['+', '−', '×', '÷'].includes(tecla)) return 'operacao';
    return 'numero';
  }

  return (
    <View style={styles.teclado}>
      {LINHAS.map((linha, indiceLinha) => (
        <View key={indiceLinha} style={styles.linha}>
          {linha.map((tecla) => (
            <Botao key={tecla} label={tecla} tipo={tipoDaTecla(tecla, indiceLinha)} onPress={onPress} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  teclado: { width: '100%', paddingHorizontal: 12 },
  linha: { flexDirection: 'row', gap: 10, marginTop: 12 },
});
