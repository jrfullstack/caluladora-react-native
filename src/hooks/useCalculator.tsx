/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable curly */
import {useEffect, useRef, useState} from 'react';

enum Operator {
  add = '+',
  subtract = '-',
  multiply = 'x',
  divide = '÷',
}

export const useCalculator = () => {
  const [formula, setFormula] = useState('');
  const [number, setNumber] = useState('0');
  const [prevNumber, setPrevNumber] = useState('0');

  const lastOperation = useRef<Operator>();

  useEffect(() => {
    if (lastOperation.current) {
      const firstFormulaPart = formula.split(' ').at(0);
      setFormula(`${firstFormulaPart} ${lastOperation.current} ${number}`);
    } else {
      setFormula(number);
    }

    // setFormula(number);
  }, [number]);

  useEffect(() => {
    const subResult = calculateSubResult();
    setPrevNumber(`${subResult}`);
  }, [formula]);

  // Limpiar la calculadora
  const clean = () => {
    setNumber('0');
    setPrevNumber('0');
    lastOperation.current = undefined;
    setFormula('');
  };

  // borrar el ultimo numero agregado
  const deleteOperation = () => {
    let currentSign = '';
    let temporalNumber = number;

    // mantener el simbolo negativo
    if (number.includes('-')) {
      currentSign = '-';
      temporalNumber = number.substring(1);
    }

    // si tiene mas de 1 digito que elimine el de atras
    if (temporalNumber.length > 1) {
      return setNumber(currentSign + temporalNumber.slice(0, -1));
    }

    // si es un digito q se iguale a 0
    setNumber('0');
  };

  const toggleSign = () => {
    if (number.includes('-')) {
      return setNumber(number.replace('-', ''));
    }

    setNumber('-' + number);
  };

  const buildNumber = (numberString: string) => {
    // si ya existe un punto que no agregre otro
    if (number.includes('.') && numberString === '.') return;

    // maneja como empiezan los numeros, si existe o no . o 0
    if (number.startsWith('0') || number.startsWith('-0')) {
      // si iniciamos en 0 y se agrega un punto
      if (numberString === '.') {
        return setNumber(number + numberString);
      }

      // si hay otro 0 y no ha punto
      if (numberString === '0' && number.includes('.')) {
        return setNumber(number + numberString);
      }

      // evaluar si es diferente de cero, no hay punto y es el primer numero
      if (numberString !== '0' && !number.includes('.')) {
        return setNumber(numberString);
      }

      // evitar 00000 al inicio
      if (numberString === '0' && !number.includes('.')) {
        return;
      }

      return setNumber(number + numberString);
    }

    setNumber(number + numberString);
  };

  const setLastNumber = () => {
    calculateSubResult();
    // si el numero termina en un . y se le agrega un operador kitamos el .
    if (number.endsWith('.')) {
      setPrevNumber(number.slice(0, -1));
    } else {
      setPrevNumber(number);
    }

    setNumber('0');
  };

  const divideOperation = () => {
    // si tiene un punto lo eliminamos
    setLastNumber();

    // marcamos la operacion como una division
    lastOperation.current = Operator.divide;
  };

  const multiplyOperation = () => {
    // si tiene un punto lo eliminamos
    setLastNumber();

    // marcamos la operacion como una multiplicacion
    lastOperation.current = Operator.multiply;
  };
  const substractOperation = () => {
    // si tiene un punto lo eliminamos
    setLastNumber();

    // marcamos la operacion como una resta
    lastOperation.current = Operator.subtract;
  };

  const addOperation = () => {
    // si tiene un punto lo eliminamos
    setLastNumber();

    // marcamos la operacion como una suma
    lastOperation.current = Operator.add;
  };

  const calculatorResult = () => {
    const result = calculateSubResult();
    setFormula(`${result}`);

    lastOperation.current = undefined;
    setPrevNumber('0');
  };

  const calculateSubResult = (): number => {
    const [firstValue, operation, secondValue] = formula.split(' ');

    const num1 = Number(firstValue);
    const num2 = Number(secondValue);

    if (isNaN(num2)) {
      return num1;
    }

    switch (operation) {
      case Operator.add:
        return num1 + num2;

      case Operator.subtract:
        return num1 - num2;

      case Operator.multiply:
        return num1 * num2;

      case Operator.divide:
        return num1 / num2;

      default:
        throw new Error('Operation not implemented');
    }
  };

  return {
    // Properties
    formula,
    number,
    prevNumber,

    // Methods
    addOperation,
    buildNumber,
    calculatorResult,
    clean,
    deleteOperation,
    divideOperation,
    multiplyOperation,
    substractOperation,
    toggleSign,
  };
};
