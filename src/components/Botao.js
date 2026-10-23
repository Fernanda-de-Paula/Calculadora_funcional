import { TouchableOpacity, Text, StyleSheet } from 'react-native';

// Um único componente para todos os tipos de botão.
export default function Botao({ label, onPress, tipo = 'numero' }) {
  return (
    <TouchableOpacity style={[styles.botao, styles[tipo]]} onPress={() => onPress(label)}>
      <Text style={[styles.texto, tipo === 'operacao' && styles.textoBranco,
        tipo === 'igual' && styles.textoBranco,
        tipo === 'especial' && styles.textoRoxo,
        tipo === 'memoria' && styles.textoMemoria]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: { flex: 1, borderRadius: 18, height: 62, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  numero: { backgroundColor: '#FFFFFF' },
  operacao: { backgroundColor: '#C86B98' },
  igual: { backgroundColor: '#8E5A9F' },
  especial: { backgroundColor: '#DCC8E5' },
  memoria: { backgroundColor: '#E8DCEE', borderRadius: 12, height: 45 },
  texto: { fontSize: 24, fontWeight: 'bold', color: '#3A3040' },
  textoBranco: { color: '#FFFFFF' },
  textoRoxo: { color: '#6D4C7D', fontSize: 21 },
  textoMemoria: { color: '#6D4C7D', fontSize: 13 },
});
