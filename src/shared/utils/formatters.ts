// Utility functions for formatting data
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR');
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
