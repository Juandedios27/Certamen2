import React, { Fragment, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import Carta from './components/Carta';
import Evaluar from './components/Evaluar';
import Resultados from './components/Resultados';
import './css/bootstrap.min.css';

function App() {
  const [cards, setCards] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [result, setResult] = useState('');
  const [cardValue, setCardValue] = useState('');
  const [selectedSuit, setSelectedSuit] = useState('♠');
  const [isDealingNew, setIsDealingNew] = useState(false);

  const suits = ['♠', '♣', '♥', '♦'];
  const validValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  // Agregar carta manualmente
  const handleAddCard = () => {
    if (!cardValue.trim()) {
      alert('Por favor ingresa un valor de carta');
      return;
    }

    const upperValue = cardValue.toUpperCase().trim();
    if (!validValues.includes(upperValue)) {
      alert('Valor inválido. Usa: A, 2-10, J, Q, K');
      return;
    }

    const newCard = {
      id: nextId,
      value: upperValue,
      suit: selectedSuit
    };

    setCards([...cards, newCard]);
    setNextId(nextId + 1);
    setCardValue('');
    setResult('');
  };

  // Eliminar carta
  const handleRemoveCard = (id) => {
    setCards(cards.filter(card => card.id !== id));
    setResult('');
  };

  // Ordenar cartas por valor
  const handleSortCards = () => {
    const valueOrder = { 'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13 };
    
    setIsDealingNew(true);
    
    setTimeout(() => {
      const sorted = [...cards].sort((a, b) => {
        return valueOrder[a.value] - valueOrder[b.value];
      });
      setCards(sorted);
      setTimeout(() => setIsDealingNew(false), 100);
    }, 350);
  };

  // Convertir valor a número para validación
  const getCardNumericValue = (value) => {
    const valueMap = { 'A': 1, 'J': 11, 'Q': 12, 'K': 13 };
    return valueMap[value] || parseInt(value);
  };

  // Validar una escalera (4 cartas consecutivas de la misma pinta)
  const isValidEscalera = (cards) => {
    if (cards.length !== 4) return false;
    
    const suit = cards[0].suit;
    if (!cards.every(card => card.suit === suit)) return false;

    const values = cards.map(card => getCardNumericValue(card.value)).sort((a, b) => a - b);
    
    for (let i = 1; i < values.length; i++) {
      if (values[i] !== values[i - 1] + 1) return false;
    }
    
    return true;
  };

  // Validar 2 escaleras (exactamente 8 cartas formando 2 escaleras de 4 cartas cada una)
  const checkDosEscaleras = (cards) => {
    if (cards.length !== 8) return false;

    // Función recursiva para encontrar combinaciones de escaleras
    const findTwoEscaleras = (cardsArray, usedIndices = [], escaleras = []) => {
      // Si ya encontramos 2 escaleras válidas
      if (escaleras.length === 2) {
        return true;
      }

      // Si ya usamos todas las cartas y no tenemos 2 escaleras
      if (usedIndices.length === 8 && escaleras.length < 2) {
        return false;
      }

      // Intentar formar una escalera con 4 cartas no usadas
      for (let i = 0; i < cardsArray.length - 3; i++) {
        if (usedIndices.includes(i)) continue;

        for (let j = i + 1; j < cardsArray.length - 2; j++) {
          if (usedIndices.includes(j)) continue;

          for (let k = j + 1; k < cardsArray.length - 1; k++) {
            if (usedIndices.includes(k)) continue;

            for (let l = k + 1; l < cardsArray.length; l++) {
              if (usedIndices.includes(l)) continue;

              const potentialEscalera = [
                cardsArray[i],
                cardsArray[j],
                cardsArray[k],
                cardsArray[l]
              ];

              if (isValidEscalera(potentialEscalera)) {
                const newUsedIndices = [...usedIndices, i, j, k, l];
                const newEscaleras = [...escaleras, potentialEscalera];

                if (findTwoEscaleras(cardsArray, newUsedIndices, newEscaleras)) {
                  return true;
                }
              }
            }
          }
        }
      }

      return false;
    };

    return findTwoEscaleras(cards);
  };

  // Validar juego (solo 2 escaleras)
  const handleValidateGame = async () => {
    if (cards.length === 0) {
      setResult('NO HAY CARTAS EN LA MESA');
      return;
    }

    if (cards.length !== 8) {
      setResult('SE NECESITAN EXACTAMENTE 8 CARTAS PARA 2 ESCALERAS');
      return;
    }

    const isValid = checkDosEscaleras(cards);

    if (isValid) {
      // Verificar si el juego ya existe en Firebase
      const jugadasRef = collection(db, 'jugadascarioca');
      const snapshot = await getDocs(jugadasRef);
      
      const currentGame = cards.map(c => `${c.value}${c.suit}`).sort().join(',');
      
      let isDuplicate = false;
      snapshot.forEach(doc => {
        const savedCards = doc.data().cartas;
        const savedGame = savedCards.map(c => `${c.value}${c.suit}`).sort().join(',');
        if (savedGame === currentGame) {
          isDuplicate = true;
        }
      });

      if (isDuplicate) {
        setResult('JUEGO REPETIDO - NO VÁLIDO');
      } else {
        // Guardar en Firebase
        await addDoc(jugadasRef, {
          cartas: cards.map(c => ({ value: c.value, suit: c.suit })),
          tipo: 'DOS ESCALERAS',
          fecha: new Date().toISOString()
        });
        
        setResult('¡DOS ESCALERAS VÁLIDAS!');
      }
    } else {
      setResult('NO FORMA JUEGO :C');
    }
  };

  return (
    <Fragment>
      <div className="container-fluid min-vh-100 bg-dark text-white py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <h1 className="text-center mb-4">Carioca</h1>
            
            {/* Panel de agregar cartas */}
            <div className="card bg-secondary text-white mb-4 p-3">
              <h4 className="mb-3">Agregar Carta</h4>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Valor (A, 2-10, J, Q, K)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cardValue}
                    onChange={(e) => setCardValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCard()}
                    placeholder="Ej: A, 7, K"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Pinta</label>
                  <select
                    className="form-select"
                    value={selectedSuit}
                    onChange={(e) => setSelectedSuit(e.target.value)}
                  >
                    {suits.map(suit => (
                      <option key={suit} value={suit}>{suit}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button
                    onClick={handleAddCard}
                    className="btn btn-primary w-100"
                    style={{ transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Agregar
                  </button>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="d-flex gap-3 justify-content-center mb-4">
              <Evaluar onEvaluate={handleValidateGame} disabled={cards.length === 0} />
              <button
                onClick={handleSortCards}
                disabled={cards.length === 0}
                className="btn btn-warning btn-lg px-4 py-2"
              >
                <i className="bi bi-sort-numeric-down me-2"></i>
                Ordenar
              </button>
            </div>

            {/* Cartas en mesa */}
            <div className="card bg-success bg-opacity-25 p-4 mb-4" style={{ minHeight: '250px' }}>
              <h4 className="text-center mb-3">Cartas en Mesa ({cards.length})</h4>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <AnimatePresence mode="popLayout">
                  {cards.map((card, index) => (
                    <Carta
                      key={card.id}
                      card={card}
                      onRemove={handleRemoveCard}
                      index={index}
                      isDealingNew={isDealingNew}
                    />
                  ))}
                </AnimatePresence>
              </div>
              {cards.length === 0 && (
                <p className="text-center text-muted mt-4">Agrega cartas para comenzar</p>
              )}
            </div>

            {/* Resultados */}
            {result && <Resultados result={result} />}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
