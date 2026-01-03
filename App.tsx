import React from 'react';
import { GameView } from './components/GameView';
import { Shop } from './components/Shop';
import { AuthorSelect } from './components/AuthorSelect';
import { DifficultySelect } from './components/DifficultySelect';
import { ResultScreen } from './components/ResultScreen';
import { useGameState } from './hooks/useGameState';
import { useScreenNavigation } from './hooks/useScreenNavigation';
import { usePurchaseHandlers } from './hooks/usePurchaseHandlers';
import { useGameFinish } from './hooks/useGameFinish';
import { useOrientationLock } from './hooks/useOrientationLock';

const App: React.FC = () => {
  const { gameState, setGameState } = useGameState();
  const {
    screen,
    selectedAuthor,
    selectedDifficulty,
    navigateToAuthorSelect,
    navigateToDifficultySelect,
    navigateToGame,
    navigateToShop,
    navigateToResult,
  } = useScreenNavigation();
  const {
    handlePurchase,
    handleAuthorPurchase,
    handleDifficultyPurchase,
  } = usePurchaseHandlers({ gameState, setGameState });
  const {
    lastScore,
    coinsGained,
    handleGameFinish,
  } = useGameFinish({
    gameState,
    setGameState,
    selectedAuthor,
    selectedDifficulty,
    onNavigateToResult: navigateToResult,
  });

  useOrientationLock();

  if (screen === 'author-select') {
    return (
      <AuthorSelect
        state={gameState}
        onSelectAuthor={navigateToDifficultySelect}
        onPurchaseAuthor={handleAuthorPurchase}
        onOpenShop={navigateToShop}
      />
    );
  }

  if (screen === 'difficulty-select' && selectedAuthor) {
    return (
      <DifficultySelect
        author={selectedAuthor}
        state={gameState}
        onSelectDifficulty={navigateToGame}
        onPurchaseDifficulty={handleDifficultyPurchase}
        onBack={navigateToAuthorSelect}
      />
    );
  }

  if (screen === 'game' && selectedAuthor) {
    return (
      <GameView
        author={selectedAuthor}
        difficulty={selectedDifficulty}
        gameState={gameState}
        onFinish={handleGameFinish}
        onQuit={navigateToAuthorSelect}
      />
    );
  }

  if (screen === 'shop') {
    return (
      <Shop
        state={gameState}
        onPurchase={handlePurchase}
        onBack={navigateToAuthorSelect}
      />
    );
  }

  if (screen === 'result') {
    const handleRetry = () => {
      if (selectedAuthor && selectedDifficulty) {
        navigateToGame(selectedDifficulty);
      }
    };

    return (
      <ResultScreen
        score={lastScore}
        coinsGained={coinsGained}
        onBack={navigateToAuthorSelect}
        onRetry={selectedAuthor && selectedDifficulty ? handleRetry : undefined}
      />
    );
  }

  return null;
};

export default App;
