const form = document.getElementById('registro-rutina-form');

//Map Highlight
$(document).ready(function() {
  $('img[usemap]').maphilight({
      fillColor: '000080',
      fillOpacity: 0.3,
      strokeColor: '000080',
      strokeWidth: 1,
      alwaysOn: true //activar siempre
  });
  $('area').mouseover(function() {
    $(this).data('maphilight', {fillColor: 'FF0000', fillOpacity: 0.5, strokeColor: 'FF0000', strokeWidth: 2}).trigger('alwaysOn.maphilight');
  }).mouseout(function() {
    $(this).data('maphilight', {fillColor: '000080', fillOpacity: 0.3, strokeColor: '000080', strokeWidth: 1}).trigger('alwaysOn.maphilight');
  }).click(function() {
    var value = $(this).attr('value');
    listexercises(value);
  });
});


//llama a la api de listado de ejercicios
function listexercises(grupo) {
  fetch(`api-ejercicios.php?grupo=${grupo}`, {
    method: 'GET',
  })
  .then(response => {
    if (response.ok) {
      console.log('Ejercicios traidos de la API');
      return response.json();
    } else {
      console.error('Error');
    }
  })
  .then(data => {
    const exerciseList = document.getElementById('exercise-list');

    // Limpiar la lista de ejercicios antes de agregar los nuevos
    exerciseList.innerHTML = '';

    // Agregar un contenedor para el carrusel
    const carousel = document.createElement('div');
    carousel.classList.add('exercise-carousel');
    exerciseList.appendChild(carousel);

    // Agregar una tarjeta para cada ejercicio dentro del carrusel
    data.forEach(exercise => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.classList.add('clickable');

      // Agregar el nombre del ejercicio como un botón
      const name = document.createElement('button');
      name.classList.add('exercise-name');
      name.textContent = exercise.name;
      card.appendChild(name);

      // Agregar un div para mostrar las instrucciones y el equipamiento
      const details = document.createElement('div');
      details.classList.add('details');
      //details.classList.add('hidden');

      const searchButton = document.getElementById('search-button');
      const video = document.createElement('iframe');
      const apiKey = 'AIzaSyC97S3wAbCeVFBUlmfb1xbMFoYT4kOcfdI';
      const query = exercise.name;
      const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${apiKey}`;

      fetch(apiUrl)
        .then(response => {
          if (response.ok) {
            console.log('Videos obtenidos de la API');
            return response.json();
          } else {
            console.error('Error');
            video.setAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ');
            details.appendChild(video);
          }
        })
        .then(data => {
          if (data.items.length > 0) {
            const videoId = data.items[0].id.videoId;
            const videoUrl = `https://www.youtube.com/embed/${videoId}`;
            video.setAttribute('src', videoUrl);
            video.setAttribute('allowfullscreen', '');
            details.appendChild(video);
          } else {
            console.error('No se encontraron videos para la búsqueda');
          }
        })
        .catch(error => {
          console.error('Error', error);
        });

      const instructions = document.createElement('p');
      instructions.textContent = `Instrucciones: ${exercise.instructions}`;
      if (exercise.instructions.length > 100) {
        // Si las instrucciones tienen más de 100 caracteres, truncar el texto y agregar "..."
        instructions.textContent ="Instrucciones: " + exercise.instructions.substring(0, 100) + '...';

        // Agregar un enlace "Leer más" para mostrar el texto completo
        const readMore = document.createElement('button');
        readMore.textContent = '+';
        readMore.classList.add('read-more-button');
        readMore.addEventListener('click', () => {
          // Mostrar el texto completo al hacer clic en el enlace "Leer más"
          instructions.textContent = `Instrucciones: ${exercise.instructions}`;
        });
        instructions.appendChild(readMore);
      }



      details.appendChild(instructions);

      card.appendChild(details);

      // Agregar la tarjeta al carrusel
      carousel.appendChild(card);

      // Agregar un evento click al botón de nombre del ejercicio
      //name.addEventListener('click', () => {
        
        
      //});
    });

    // Agregar botones de flecha para navegar por el carrusel
    const prevButton = document.createElement('button');
    prevButton.textContent = '<';
    prevButton.classList.add('carousel-button');
    prevButton.classList.add('prev-button');
    carousel.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.textContent = '>';
    nextButton.classList.add('carousel-button');
    nextButton.classList.add('next-button');
    carousel.appendChild(nextButton);

    let currentIndex = 0;
    const cards = carousel.querySelectorAll('.card');

    // Ocultar todas las tarjetas excepto la primera
    cards.forEach((card, index) => {
      if (index > 0) {
        card.classList.add('hidden');
      }
    });

    // Agregar eventos click a los botones de flecha para cambiar de ejercicio
    prevButton.addEventListener('click', () => {
      cards[currentIndex].classList.add('hidden');
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      cards[currentIndex].classList.remove('hidden');
    });

    nextButton.addEventListener('click', () => {
      cards[currentIndex].classList.add('hidden');
      currentIndex = (currentIndex + 1) % cards.length;
      cards[currentIndex].classList.remove('hidden');
    });


  })
  .catch(error => {
    console.error('Error', error);
  });
}


//Guarda la rutina en el SQL server
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const ejercicio = document.getElementById('ejercicio').value;
  const repeticiones = document.getElementById('repeticiones').value;
  const peso = document.getElementById('peso').value;
  const fecha = document.getElementById('fecha').value;

  const rutina = {
    ejercicio: ejercicio,
    repeticiones: repeticiones,
    peso: peso,
    fecha: fecha
  };

  fetch('guardar-rutina.php', {
    method: 'POST',
    body: JSON.stringify(rutina),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      console.log('Rutina guardada exitosamente');
    } else {
      console.error('Error al guardar la rutina');
    }
  })
  .catch(error => {
    console.error('Error al guardar la rutina', error);
  });

form.reset();

  
});