import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Display from '../components/Display';
import Teclado from '../components/Teclado';
import { carregar, salvar } from '../storage/historico';

export default function HomeScreen({ navigation, route }) {

  // Estados da calculadora
  const [valor, setValor] = useState('0');
  const [expressao, setExpressao] = useState('');
  const [memoria, setMemoria] = useState(0);
  const [novoNumero, setNovoNumero] = useState(false);
  const [resultadoCalculado, setResultadoCalculado] = useState(false);
  const [historico, setHistorico] = useState([]);


  // Atualiza o histórico quando volta para a calculadora
  // Isso evita que uma conta excluída apareça novamente
  useEffect(() => {
    const removerListener = navigation.addListener('focus', () => {
      carregar().then(setHistorico).catch(() => {
        Alert.alert('Erro', 'Não foi possível carregar o histórico.');
      });
    });

    return removerListener;
  }, [navigation]);


  // Recebe o resultado escolhido na tela de histórico
  // O toque permite selecionar novamente um resultado igual
  useEffect(() => {
    const recebido = route.params?.valor;

    if (recebido === undefined) return;

    setValor(String(recebido));
    setExpressao(mostrarNumero(String(recebido)));
    setNovoNumero(false);
    setResultadoCalculado(true);
  }, [route.params?.valor, route.params?.toque]);


  // FUNÇÕES AUXILIARES

  const ehOperador = (caractere) => ['+', '-', '*', '/'].includes(caractere);

  const formatarResultado = (numero) => {
    if (!Number.isFinite(numero)) return 'Erro';
    return String(Number(numero.toPrecision(10)));
  };

  function mostrarNumero(numero) {
    if (numero.startsWith('-')) return `(${numero})`;
    return numero;
  }

  const obterUltimoNumero = (texto) => {
    const resultado = texto.match(/(\(-\d+(?:\.\d*)?\)|\d+(?:\.\d*)?)$/);

    if (!resultado) return null;

    const numeroExibido = resultado[0];

    return {
      texto: numeroExibido,
      numero: numeroExibido.replace(/[()]/g, ''),
      inicio: texto.length - numeroExibido.length,
    };
  };

  const substituirUltimoNumero = (numero) => {
    const ultimo = obterUltimoNumero(expressao);

    if (!ultimo) {
      setExpressao(mostrarNumero(numero));
      return;
    }

    setExpressao(expressao.slice(0, ultimo.inicio) + mostrarNumero(numero));
  };


  // ADICIONAR NÚMEROS

  const adicionarNumero = (numero) => {

    if (resultadoCalculado || valor === 'Erro') {
      setValor(numero);
      setExpressao(numero);
      setNovoNumero(false);
      setResultadoCalculado(false);
      return;
    }

    if (novoNumero) {
      setValor(numero);
      setExpressao(expressao + numero);
      setNovoNumero(false);
      return;
    }

    const novoValor = valor === '0' ? numero : valor + numero;

    if (novoValor.length > 10) return;

    setValor(novoValor);
    substituirUltimoNumero(novoValor);
  };


  // ADICIONAR PONTO DECIMAL

  const adicionaPonto = () => {

    if (resultadoCalculado || valor === 'Erro') {
      setValor('0.');
      setExpressao('0.');
      setNovoNumero(false);
      setResultadoCalculado(false);
      return;
    }

    if (novoNumero) {
      setValor('0.');
      setExpressao(expressao + '0.');
      setNovoNumero(false);
      return;
    }

    if (valor.includes('.') || valor.length >= 10) return;

    const novoValor = valor + '.';

    setValor(novoValor);
    substituirUltimoNumero(novoValor);
  };


  // APAGAR O ÚLTIMO DÍGITO

  const apagarValoresDel = () => {

    if (valor === 'Erro') {
      setValor('0');
      setExpressao('');
      setNovoNumero(false);
      setResultadoCalculado(false);
      return;
    }

    if (resultadoCalculado) setResultadoCalculado(false);

    if (novoNumero) {
      const novaExpressao = expressao.slice(0, -1);
      setExpressao(novaExpressao);

      const ultimo = obterUltimoNumero(novaExpressao);

      setValor(ultimo ? ultimo.numero : '0');
      setNovoNumero(false);
      return;
    }

    const ultimo = obterUltimoNumero(expressao);

    if (!ultimo) {
      setValor('0');
      setExpressao('');
      return;
    }

    let novoValor = ultimo.numero.slice(0, -1);

    if (novoValor === '' || novoValor === '-') novoValor = '0';

    const parteAnterior = expressao.slice(0, ultimo.inicio);

    if (novoValor === '0' && parteAnterior.length > 0 && ehOperador(parteAnterior.slice(-1))) {
      setExpressao(parteAnterior);
      setValor('0');
      setNovoNumero(true);
      return;
    }

    setValor(novoValor);
    setExpressao(parteAnterior + mostrarNumero(novoValor));
  };


  // LIMPAR A CALCULADORA

  const limparTotal = () => {
    setValor('0');
    setExpressao('');
    setMemoria(0);
    setNovoNumero(false);
    setResultadoCalculado(false);
  };


  // TROCAR O SINAL DO NÚMERO

  const trocarSinal = () => {

    if (valor === 'Erro' || novoNumero || Number(valor) === 0) return;

    const novoValor = valor.startsWith('-') ? valor.slice(1) : '-' + valor;

    setValor(novoValor);
    substituirUltimoNumero(novoValor);
    setResultadoCalculado(false);
  };


  // CALCULAR PORCENTAGEM

  const calcularPorcentagem = () => {

    if (valor === 'Erro' || novoNumero) return;

    const resultado = formatarResultado(Number(valor) / 100);

    setValor(resultado);
    substituirUltimoNumero(resultado);
    setResultadoCalculado(false);
  };


  // CALCULAR RAIZ QUADRADA

  const calcularRaiz = () => {

    if (valor === 'Erro' || novoNumero) return;

    const numero = Number(valor);

    if (numero < 0) {
      setValor('Erro');
      setExpressao('Erro');
      setResultadoCalculado(true);
      return;
    }

    const resultado = formatarResultado(Math.sqrt(numero));

    setValor(resultado);
    substituirUltimoNumero(resultado);
    setResultadoCalculado(false);
  };


  // FUNÇÕES DE MEMÓRIA

  const adicionarMemoria = () => {
    if (valor !== 'Erro') setMemoria((anterior) => anterior + Number(valor));
  };

  const subtrairMemoria = () => {
    if (valor !== 'Erro') setMemoria((anterior) => anterior - Number(valor));
  };

  const recuperarMemoria = () => {

    const numero = formatarResultado(memoria);

    if (resultadoCalculado || valor === 'Erro') {
      setValor(numero);
      setExpressao(mostrarNumero(numero));
      setResultadoCalculado(false);
      setNovoNumero(false);
      return;
    }

    if (novoNumero) {
      setValor(numero);
      setExpressao(expressao + mostrarNumero(numero));
      setNovoNumero(false);
      return;
    }

    setValor(numero);
    substituirUltimoNumero(numero);
  };


  // SELECIONAR OPERAÇÃO

  const selecionarOperacao = (tipoOperacao) => {

    if (valor === 'Erro') return;

    if (resultadoCalculado) {
      setExpressao(mostrarNumero(valor) + tipoOperacao);
      setNovoNumero(true);
      setResultadoCalculado(false);
      return;
    }

    if (novoNumero) {
      setExpressao(expressao.slice(0, -1) + tipoOperacao);
      return;
    }

    setExpressao((expressao || valor) + tipoOperacao);
    setNovoNumero(true);
  };


  // CALCULAR EXPRESSÃO
  // Primeiro resolve multiplicação e divisão, depois soma e subtração

  const interpretarExpressao = (texto) => {

    const entrada = texto.replace(/\s/g, '');

    const partes = entrada.match(/\(-\d+(?:\.\d*)?\)|\d+(?:\.\d*)?|[+\-*/]/g);

    if (!partes || partes.join('') !== entrada) return 'Erro';

    const numeros = [];
    const operadores = [];

    for (let i = 0; i < partes.length; i++) {
      const parte = partes[i];

      if (ehOperador(parte)) {
        operadores.push(parte);
      } else {
        const numero = Number(parte.replace(/[()]/g, ''));

        if (!Number.isFinite(numero)) return 'Erro';

        numeros.push(numero);
      }
    }

    if (numeros.length !== operadores.length + 1) return 'Erro';

    let i = 0;

    // Resolve multiplicação e divisão primeiro
    while (i < operadores.length) {
      const operador = operadores[i];

      if (operador === '*' || operador === '/') {
        const numero1 = numeros[i];
        const numero2 = numeros[i + 1];

        if (operador === '/' && numero2 === 0) return 'Erro';

        const resultado = operador === '*' ? numero1 * numero2 : numero1 / numero2;

        numeros.splice(i, 2, resultado);
        operadores.splice(i, 1);

      } else {
        i++;
      }
    }

    // Resolve soma e subtração
    while (operadores.length > 0) {
      const operador = operadores.shift();
      const numero1 = numeros.shift();
      const numero2 = numeros.shift();

      numeros.unshift(operador === '+' ? numero1 + numero2 : numero1 - numero2);
    }

    return formatarResultado(numeros[0]);
  };


  // BOTÃO = E HISTÓRICO

  const calcularResultado = async () => {

    if (novoNumero || resultadoCalculado || expressao === '' || expressao === 'Erro') return;

    const resultado = interpretarExpressao(expressao);

    if (resultado !== 'Erro') {
      const item = {
        id: `${Date.now()}-${Math.random()}`,
        conta: expressao,
        resultado
      };

      // Busca as contas salvas antes de adicionar a nova
      try {
        const anterior = await carregar();
        const novaLista = [item, ...anterior];

        await salvar(novaLista);
        setHistorico(novaLista);

      } catch (erro) {
        Alert.alert('Erro', 'A conta foi calculada, mas não foi salva no histórico.');
      }
    }

    setValor(resultado);
    setExpressao(resultado === 'Erro' ? 'Erro' : mostrarNumero(resultado));
    setNovoNumero(false);
    setResultadoCalculado(true);
  };


  // IDENTIFICAR A TECLA PRESSIONADA

  const aoTocar = (tecla) => {

    if (/^\d$/.test(tecla)) adicionarNumero(tecla);
    else if (tecla === ',') adicionaPonto();
    else if (tecla === 'AC') limparTotal();
    else if (tecla === 'DEL') apagarValoresDel();
    else if (tecla === '+/-') trocarSinal();
    else if (tecla === '%') calcularPorcentagem();
    else if (tecla === 'RAIZ') calcularRaiz();
    else if (tecla === 'M+') adicionarMemoria();
    else if (tecla === 'M-') subtrairMemoria();
    else if (tecla === 'MRC') recuperarMemoria();
    else if (tecla === '=') calcularResultado();
    else if (tecla === '÷') selecionarOperacao('/');
    else if (tecla === '×') selecionarOperacao('*');
    else if (tecla === '−') selecionarOperacao('-');
    else if (tecla === '+') selecionarOperacao('+');

    // O botão OFF ainda não tem ação
  };


  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.titulo}>Calculadora ♡</Text>

      <Display expressao={expressao} valor={valor} />

      <Teclado onPress={aoTocar} />

      <View style={styles.historicoBotao}>
        <Button
          title="Ver histórico"
          color="#8E5A9F"
          onPress={() => navigation.navigate('Historico', { historico })}
        />
      </View>

      <View style={styles.rodape}>
        <Text style={styles.rodapeNome}>Maria, Fer, Gaby ♡</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3FA',
    alignItems: 'center',
    paddingTop: 10
  },

  titulo: {
    textAlign: 'center',
    backgroundColor: '#6D4C7D',
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    paddingVertical: 12,
    width: '100%'
  },

  historicoBotao: {
    width: '90%',
    marginTop: 18
  },

  rodape: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  rodapeNome: {
    color: '#8E5A9F',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2
  },
});