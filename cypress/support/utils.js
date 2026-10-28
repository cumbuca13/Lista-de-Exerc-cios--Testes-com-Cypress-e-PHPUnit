// Formata um número como o Blade faz: number_format($valor, 2, ',', '.')
export function formatarPreco(valor) {
  const [inteiro, centavos] = Number(valor).toFixed(2).split('.');
  return `R$ ${inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${centavos}`;
}

// Sufixo único para nomes de teste (evita colisões entre execuções)
export function unico(prefixo) {
  return `${prefixo} ${Date.now().toString().slice(-7)}${Math.floor(Math.random() * 90 + 10)}`;
}
