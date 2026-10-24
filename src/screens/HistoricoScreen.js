import { useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { limpar, salvar } from '../storage/historico';

export default function HistoricoScreen({ route, navigation }) {

  // Armazena as contas do histórico para atualizar a lista quando necessário
  const [lista, setLista] = useState(route.params?.historico || []);

  // Limpa o histórico salvo e atualiza a lista na tela
  async function limparHistorico() {
    try {
      await limpar();
      setLista([]);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível limpar o histórico.');
    }
  }

  // Remove apenas a conta selecionada e salva a lista atualizada
  async function excluir(id) {
    const nova = lista.filter((item) => item.id !== id);
    try {
      await salvar(nova);
      setLista(nova);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível excluir a conta.');
    }
  }

  // Volta para a calculadora com o resultado da conta selecionada
  function reutilizar(item) {
    navigation.popTo('Home', { valor: item.resultado, toque: Date.now() });
  }

  return (
    <View style={styles.container}>
      <View style={styles.barra}>
        <Button title="Limpar histórico" color="#8E5A9F" onPress={limparHistorico} />
      </View>

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.linha}>
            <TouchableOpacity style={styles.conta} onPress={() => reutilizar(item)}>
              <Text style={styles.texto}>{item.conta} = {item.resultado}</Text>
              <Text style={styles.dica}>Toque para reutilizar o resultado</Text>
            </TouchableOpacity>

            <Button title="Excluir" color="#C86B98" onPress={() => excluir(item.id)} />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma conta ainda</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F3FA', padding: 16 },
  barra: { marginBottom: 14 },
  linha: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#DCC8E5' },
  conta: { flex: 1, paddingRight: 8 },
  texto: { fontSize: 19, color: '#3A3040' },
  dica: { fontSize: 11, color: '#6D4C7D', marginTop: 4 },
  vazio: { marginTop: 20, textAlign: 'center', fontSize: 18, color: '#6D4C7D' },
});