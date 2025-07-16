// Seleciona o formulário e o input
const form = document.querySelector('form');
const input = document.querySelector('input');

// Seleciona a div que contém os itens
const itensDiv = document.querySelector('.itens');

// Adiciona um evento de submit ao formulário
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Evita que o formulário seja submetido

  // Pega o valor do input
  const inputValue = input.value.trim();

  // Cria um novo item
  const newItem = document.createElement('div');
  newItem.classList.add('item');

  // Cria uma nova div para o radio e o label
  const radioDiv = document.createElement('div');

  // Cria um novo radio button
  const radio = document.createElement('input');
  radio.type = 'radio';
  radio.id = inputValue.replace(' ', '-'); // Substitui espaços por hífens
  radio.name = 'item';

  // Cria uma nova label
  const label = document.createElement('label');
  label.textContent = inputValue;
  label.htmlFor = radio.id;

  // Adiciona o radio e o label à div
  radioDiv.appendChild(radio);
  radioDiv.appendChild(label);

  // Cria um novo SVG da lixeira
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('color', '#000000');
  svg.setAttribute('fill', 'none');
  svg.innerHTML = `
    <path
      d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5"
      stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
    <path
      d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5"
      stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
    <path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
    <path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    </path>
  `;

  // Adiciona a div do radio, o SVG e o novo item à div de itens
  newItem.appendChild(radioDiv);
  newItem.appendChild(svg);
  itensDiv.appendChild(newItem);

  // Limpa o input
  input.value = '';
});

